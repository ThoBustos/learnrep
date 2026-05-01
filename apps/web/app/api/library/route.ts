import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: attempts, error: attemptsError } = await db
    .from('quiz_attempts')
    .select('quiz_id, score, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (attemptsError) {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
  }

  if (!attempts || attempts.length === 0) {
    return NextResponse.json([])
  }

  const attemptedIds = [...new Set(attempts.map((a) => a.quiz_id))]

  // Public quizzes not owned by user (RLS blocks private quizzes from others)
  const { data: quizzes, error: quizzesError } = await db
    .from('quizzes')
    .select('id, title, topic, difficulty, questions, is_public, user_id')
    .in('id', attemptedIds)
    .neq('user_id', user.id)
    .eq('is_public', true)

  if (quizzesError) {
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }

  if (!quizzes || quizzes.length === 0) {
    return NextResponse.json([])
  }

  const bestByQuiz = new Map<string, number>()
  for (const a of attempts) {
    const current = bestByQuiz.get(a.quiz_id) ?? 0
    if (a.score > current) bestByQuiz.set(a.quiz_id, a.score)
  }

  const lastAttemptByQuiz = new Map<string, string>()
  for (const a of attempts) {
    if (!lastAttemptByQuiz.has(a.quiz_id)) {
      lastAttemptByQuiz.set(a.quiz_id, a.completed_at)
    }
  }

  const result = quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
    bestScore: bestByQuiz.get(quiz.id) ?? null,
    lastAttemptAt: lastAttemptByQuiz.get(quiz.id) ?? null,
  }))

  result.sort((a, b) => {
    if (!a.lastAttemptAt) return 1
    if (!b.lastAttemptAt) return -1
    return new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime()
  })

  return NextResponse.json(result)
}
