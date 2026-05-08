import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export type LeaderboardEntry = {
  userId: string
  displayName: string | null
  quizzesGenerated: number
  quizzesTaken: number
  engagementScore: number
  rank: number
}

export async function GET() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: membership } = await db
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) return NextResponse.json([])

  const { data: teamMembers, error: teamMembersError } = await db
    .from('team_members')
    .select('user_id')
    .eq('team_id', membership.team_id)

  if (teamMembersError) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }

  const memberIds = (teamMembers ?? []).map((m) => m.user_id)

  const [profilesResult, quizzesResult, attemptsResult] = await Promise.all([
    db.from('profiles').select('id, display_name').in('id', memberIds),
    db.from('quizzes').select('user_id').in('user_id', memberIds),
    db.from('quiz_attempts').select('user_id').in('user_id', memberIds),
  ])

  if (profilesResult.error || quizzesResult.error || attemptsResult.error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 })
  }

  const profileMap = new Map(
    (profilesResult.data ?? []).map((p) => [p.id, p])
  )

  const generatedCounts = new Map<string, number>()
  for (const q of quizzesResult.data ?? []) {
    generatedCounts.set(q.user_id, (generatedCounts.get(q.user_id) ?? 0) + 1)
  }

  const takenCounts = new Map<string, number>()
  for (const a of attemptsResult.data ?? []) {
    takenCounts.set(a.user_id, (takenCounts.get(a.user_id) ?? 0) + 1)
  }

  const entries = memberIds.map((uid) => {
    const generated = generatedCounts.get(uid) ?? 0
    const taken = takenCounts.get(uid) ?? 0
    return {
      userId: uid,
      displayName: profileMap.get(uid)?.display_name ?? null,
      quizzesGenerated: generated,
      quizzesTaken: taken,
      engagementScore: generated * 2 + taken,
    }
  })

  entries.sort(
    (a, b) =>
      b.engagementScore - a.engagementScore ||
      (a.displayName ?? '').localeCompare(b.displayName ?? '')
  )

  return NextResponse.json(
    entries.map((e, i) => ({ ...e, rank: i + 1 }))
  )
}
