import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function makeSupabaseClient(cookieStore?: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore?.getAll() ?? [], setAll: () => {} } }
  )
}

function makeTokenClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}

async function getAuthContext(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (bearerToken) {
    const { data: { user } } = await makeSupabaseClient().auth.getUser(bearerToken)
    return { user, db: makeTokenClient(bearerToken) }
  }
  const cookieStore = await cookies()
  const db = makeSupabaseClient(cookieStore)
  const { data: { user } } = await db.auth.getUser()
  return { user, db }
}

export async function GET(request: Request) {
  const { user, db } = await getAuthContext(request)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch user's quizzes
  const { data: quizzes, error: quizzesError } = await db
    .from('quizzes')
    .select('id, title, topic, difficulty, questions, is_public, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (quizzesError) {
    console.error('Quizzes fetch error:', quizzesError)
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }

  if (!quizzes || quizzes.length === 0) {
    return NextResponse.json([])
  }

  const quizIds = quizzes.map((q) => q.id)

  // Fetch attempts for those quiz ids by this user
  const { data: attempts } = await db
    .from('quiz_attempts')
    .select('id, quiz_id, score')
    .eq('user_id', user.id)
    .in('quiz_id', quizIds)

  // Also fetch all attempts for these quizzes (for total count) — we need a service-level view
  // We reuse the same db (RLS allows quiz owner to see all attempts on their quizzes via migration 002)
  const { data: allAttempts } = await db
    .from('quiz_attempts')
    .select('id, quiz_id, score')
    .in('quiz_id', quizIds)

  const myAttemptsByQuiz = new Map<string, number[]>()
  for (const a of attempts ?? []) {
    const arr = myAttemptsByQuiz.get(a.quiz_id) ?? []
    arr.push(a.score)
    myAttemptsByQuiz.set(a.quiz_id, arr)
  }

  const allAttemptCountByQuiz = new Map<string, number>()
  for (const a of allAttempts ?? []) {
    allAttemptCountByQuiz.set(a.quiz_id, (allAttemptCountByQuiz.get(a.quiz_id) ?? 0) + 1)
  }

  const result = quizzes.map((quiz) => {
    const myScores = myAttemptsByQuiz.get(quiz.id) ?? []
    const myBestScore = myScores.length > 0 ? Math.max(...myScores) : null
    const attemptCount = allAttemptCountByQuiz.get(quiz.id) ?? 0
    const questions = Array.isArray(quiz.questions) ? quiz.questions : []

    return {
      id: quiz.id,
      title: quiz.title,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      questionCount: questions.length,
      is_public: quiz.is_public,
      created_at: quiz.created_at,
      attemptCount,
      myBestScore,
    }
  })

  return NextResponse.json(result)
}
