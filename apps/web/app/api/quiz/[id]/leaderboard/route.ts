import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = await createClient()

  const { data: quiz, error: quizError } = await db
    .from('quizzes')
    .select('id, is_public')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (quizError || !quiz) {
    return NextResponse.json({ error: 'Quiz not found or not public' }, { status: 404 })
  }

  // Order oldest first so firstScore is the earliest attempt
  const { data: attempts, error: attemptsError } = await db
    .from('quiz_attempts')
    .select('id, score, completed_at, user_id')
    .eq('quiz_id', id)
    .order('completed_at', { ascending: true })

  if (attemptsError) {
    console.error('Leaderboard attempts error:', attemptsError)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }

  if (!attempts || attempts.length === 0) {
    return NextResponse.json([])
  }

  const byUser = new Map<string, { bestId: string; bestScore: number; firstScore: number; bestAt: string; attemptCount: number }>()
  for (const a of attempts) {
    const existing = byUser.get(a.user_id)
    if (!existing) {
      byUser.set(a.user_id, { bestId: a.id, bestScore: a.score, firstScore: a.score, bestAt: a.completed_at, attemptCount: 1 })
    } else {
      existing.attemptCount++
      if (a.score > existing.bestScore) {
        existing.bestScore = a.score
        existing.bestId = a.id
        existing.bestAt = a.completed_at
      }
    }
  }

  const sorted = Array.from(byUser.entries()).sort((a, b) => b[1].bestScore - a[1].bestScore)

  const userIds = sorted.map(([uid]) => uid)
  const { data: profiles } = await db
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', userIds)

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const leaderboard = sorted.map(([userId, entry], index) => {
    const profile = profileMap.get(userId)
    const delta = entry.attemptCount >= 2 ? entry.bestScore - entry.firstScore : null
    return {
      id: entry.bestId,
      score: entry.bestScore,
      firstScore: entry.firstScore,
      delta,
      attemptCount: entry.attemptCount,
      completed_at: entry.bestAt,
      display_name: profile?.display_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      rank: index + 1,
    }
  })

  return NextResponse.json(leaderboard)
}
