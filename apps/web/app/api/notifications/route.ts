import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { AppNotification } from '@/lib/types'

export type { AppNotification }

export async function GET() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Anchor on owned quizzes first so the 30-item limit applies after ownership filtering.
  const { data: quizzes, error: quizzesError } = await db
    .from('quizzes')
    .select('id, title')
    .eq('user_id', user.id)

  if (quizzesError) {
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }

  if (!quizzes || quizzes.length === 0) {
    return NextResponse.json([])
  }

  const quizMap = new Map(quizzes.map((q) => [q.id, q]))
  const ownedIds = quizzes.map((q) => q.id)

  const { data: attempts, error: attemptsError } = await db
    .from('quiz_attempts')
    .select('id, quiz_id, user_id, score, completed_at')
    .in('quiz_id', ownedIds)
    .neq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(30)

  if (attemptsError) {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
  }

  if (!attempts || attempts.length === 0) {
    return NextResponse.json([])
  }

  const takerIds = [...new Set(attempts.map((a) => a.user_id))]

  const { data: profiles, error: profilesError } = await db
    .from('profiles')
    .select('id, display_name')
    .in('id', takerIds)

  if (profilesError) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const notifications: AppNotification[] = attempts.map((a) => ({
    id: a.id,
    type: 'quiz_attempt' as const,
    takerName: profileMap.get(a.user_id)?.display_name ?? 'Someone',
    quizTitle: quizMap.get(a.quiz_id)!.title,
    quizId: a.quiz_id,
    score: a.score,
    createdAt: a.completed_at,
  }))

  return NextResponse.json(notifications)
}
