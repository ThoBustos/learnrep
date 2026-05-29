import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const quizId = new URL(request.url).searchParams.get('quizId')
  if (quizId) {
    const { data, error } = await db
      .from('quiz_saves')
      .select('quiz_id')
      .eq('user_id', user.id)
      .eq('quiz_id', quizId)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch saved quiz' }, { status: 500 })
    }

    return NextResponse.json({ saved: !!data })
  }

  const { data: saves, error: savesError } = await db
    .from('quiz_saves')
    .select('quiz_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (savesError) {
    return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 })
  }

  if (!saves || saves.length === 0) {
    return NextResponse.json([])
  }

  const savedIds = saves.map((save) => save.quiz_id)

  const { data: attempts, error: attemptsError } = await db
    .from('quiz_attempts')
    .select('quiz_id, score, completed_at')
    .eq('user_id', user.id)
    .in('quiz_id', savedIds)
    .order('completed_at', { ascending: false })

  if (attemptsError) {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
  }

  const { data: quizzes, error: quizzesError } = await db
    .from('quizzes')
    .select('id, title, topic, difficulty, questions, is_public, user_id')
    .in('id', savedIds)

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

  const savedAtByQuiz = new Map(saves.map((save) => [save.quiz_id, save.created_at]))

  const result = quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
    bestScore: bestByQuiz.get(quiz.id) ?? null,
    lastAttemptAt: lastAttemptByQuiz.get(quiz.id) ?? null,
    savedAt: savedAtByQuiz.get(quiz.id) ?? null,
  }))

  result.sort((a, b) => savedIds.indexOf(a.id) - savedIds.indexOf(b.id))

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { quizId } = body as { quizId?: unknown }
  if (typeof quizId !== 'string' || !quizId.trim()) {
    return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
  }

  const normalizedQuizId = quizId.trim()
  const { data: quiz, error: quizError } = await db
    .from('quizzes')
    .select('id')
    .eq('id', normalizedQuizId)
    .single()

  if (quizError || !quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  const { data, error } = await db
    .from('quiz_saves')
    .insert({ quiz_id: normalizedQuizId, user_id: user.id })
    .select('quiz_id, created_at')
    .single()

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await db
      .from('quiz_saves')
      .select('quiz_id, created_at')
      .eq('quiz_id', normalizedQuizId)
      .eq('user_id', user.id)
      .single()

    if (existingError || !existing) {
      return NextResponse.json({ error: 'Failed to save quiz' }, { status: 500 })
    }

    return NextResponse.json({ quizId: existing.quiz_id, saved: true, savedAt: existing.created_at })
  }

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to save quiz' }, { status: 500 })
  }

  return NextResponse.json({ quizId: data.quiz_id, saved: true, savedAt: data.created_at })
}

export async function DELETE(request: Request) {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const quizId = new URL(request.url).searchParams.get('quizId')?.trim()
  if (!quizId) {
    return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
  }

  const { error } = await db
    .from('quiz_saves')
    .delete()
    .eq('user_id', user.id)
    .eq('quiz_id', quizId)

  if (error) {
    return NextResponse.json({ error: 'Failed to remove quiz' }, { status: 500 })
  }

  return NextResponse.json({ quizId, saved: false })
}
