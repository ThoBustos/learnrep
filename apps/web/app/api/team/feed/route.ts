import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export type FeedEvent =
  | {
      type: 'generated'
      id: string
      quizId: string
      title: string
      topic: string
      difficulty: string
      questionCount: number
      is_public: boolean
      timestamp: string
      actorName: string | null
      isOwn: boolean
      attemptCount: number
    }
  | {
      type: 'taken'
      id: string
      quizId: string
      title: string
      topic: string
      difficulty: string
      score: number
      timestamp: string
      actorName: string | null
      isOwn: boolean
    }

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

  const [profilesResult, quizzesResult] = await Promise.all([
    db.from('profiles').select('id, display_name').in('id', memberIds),
    db
      .from('quizzes')
      .select('id, title, topic, difficulty, questions, is_public, user_id, created_at')
      .in('user_id', memberIds)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  if (quizzesResult.error) {
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }

  const quizzes = quizzesResult.data ?? []
  const profileMap = new Map((profilesResult.data ?? []).map((p) => [p.id, p]))
  const quizIds = quizzes.map((q) => q.id)

  const [attemptsOnTeamQuizzesResult, attemptsByMembersResult] = await Promise.all([
    quizIds.length > 0
      ? db.from('quiz_attempts').select('quiz_id').in('quiz_id', quizIds)
      : Promise.resolve({ data: [], error: null }),
    db
      .from('quiz_attempts')
      .select('id, quiz_id, user_id, score, completed_at')
      .in('user_id', memberIds)
      .order('completed_at', { ascending: false })
      .limit(50),
  ])

  const attemptCountMap = new Map<string, number>()
  for (const a of attemptsOnTeamQuizzesResult.data ?? []) {
    attemptCountMap.set(a.quiz_id, (attemptCountMap.get(a.quiz_id) ?? 0) + 1)
  }

  // For taken events we need quiz metadata — build a map from quizzes we already have,
  // plus fetch any quizzes taken by members that weren't authored by a team member.
  const quizMetaMap = new Map(quizzes.map((q) => [q.id, q]))

  const attemptsByMembers = attemptsByMembersResult.data ?? []
  const missingQuizIds = [...new Set(
    attemptsByMembers.map((a) => a.quiz_id).filter((qid) => !quizMetaMap.has(qid))
  )]

  if (missingQuizIds.length > 0) {
    const { data: extraQuizzes } = await db
      .from('quizzes')
      .select('id, title, topic, difficulty, questions, is_public, user_id, created_at')
      .in('id', missingQuizIds)
    for (const q of extraQuizzes ?? []) quizMetaMap.set(q.id, q)
  }

  const generatedEvents: FeedEvent[] = quizzes.map((q) => ({
    type: 'generated',
    id: q.id,
    quizId: q.id,
    title: q.title,
    topic: q.topic,
    difficulty: q.difficulty,
    questionCount: Array.isArray(q.questions) ? q.questions.length : 0,
    is_public: q.is_public,
    timestamp: q.created_at,
    actorName: profileMap.get(q.user_id)?.display_name ?? null,
    isOwn: q.user_id === user.id,
    attemptCount: attemptCountMap.get(q.id) ?? 0,
  }))

  const takenEvents: FeedEvent[] = attemptsByMembers.flatMap((a) => {
    const quiz = quizMetaMap.get(a.quiz_id)
    if (!quiz) return []
    return [{
      type: 'taken',
      id: a.id,
      quizId: a.quiz_id,
      title: quiz.title,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      score: a.score,
      timestamp: a.completed_at,
      actorName: profileMap.get(a.user_id)?.display_name ?? null,
      isOwn: a.user_id === user.id,
    }]
  })

  const events = [...generatedEvents, ...takenEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return NextResponse.json(events.slice(0, 100))
}
