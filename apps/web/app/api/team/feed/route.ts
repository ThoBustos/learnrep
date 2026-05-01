import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: membership, error: membershipError } = await db
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) {
    return NextResponse.json({ error: 'Failed to fetch membership' }, { status: 500 })
  }

  if (!membership) return NextResponse.json([])

  const { data: teamMembers, error: teamMembersError } = await db
    .from('team_members')
    .select('user_id')
    .eq('team_id', membership.team_id)

  if (teamMembersError) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }

  const memberIds = (teamMembers ?? []).map((m) => m.user_id)

  const { data: quizzes, error: quizzesError } = await db
    .from('quizzes')
    .select('id, title, topic, difficulty, questions, is_public, user_id, created_at')
    .in('user_id', memberIds)
    .order('created_at', { ascending: false })
    .limit(50)

  if (quizzesError) {
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }

  if (!quizzes || quizzes.length === 0) return NextResponse.json([])

  const quizIds = quizzes.map((q) => q.id)

  const { data: profiles } = await db
    .from('profiles')
    .select('id, display_name')
    .in('id', memberIds)

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const { data: attempts } = await db
    .from('quiz_attempts')
    .select('quiz_id')
    .in('quiz_id', quizIds)

  const attemptMap = new Map<string, number>()
  for (const a of attempts ?? []) {
    attemptMap.set(a.quiz_id, (attemptMap.get(a.quiz_id) ?? 0) + 1)
  }

  return NextResponse.json(
    quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      questionCount: Array.isArray(q.questions) ? q.questions.length : 0,
      is_public: q.is_public,
      createdAt: q.created_at,
      authorName: profileMap.get(q.user_id)?.display_name ?? null,
      isOwn: q.user_id === user.id,
      attemptCount: attemptMap.get(q.id) ?? 0,
    }))
  )
}
