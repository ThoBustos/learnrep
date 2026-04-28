import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function makeSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = makeSupabaseClient()

  // Verify the quiz exists and is public
  const { data: quiz, error: quizError } = await db
    .from('quizzes')
    .select('id, is_public')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (quizError || !quiz) {
    return NextResponse.json({ error: 'Quiz not found or not public' }, { status: 404 })
  }

  // Fetch attempts for the quiz
  const { data: attempts, error: attemptsError } = await db
    .from('quiz_attempts')
    .select('id, score, completed_at, user_id')
    .eq('quiz_id', id)
    .order('score', { ascending: false })

  if (attemptsError) {
    console.error('Leaderboard attempts error:', attemptsError)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }

  if (!attempts || attempts.length === 0) {
    return NextResponse.json([])
  }

  // Fetch profiles for the user ids in the attempts
  const userIds = [...new Set(attempts.map((a) => a.user_id))]
  const { data: profiles } = await db
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', userIds)

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const leaderboard = attempts.map((attempt, index) => {
    const profile = profileMap.get(attempt.user_id)
    return {
      id: attempt.id,
      score: attempt.score,
      completed_at: attempt.completed_at,
      display_name: profile?.display_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      rank: index + 1,
    }
  })

  return NextResponse.json(leaderboard)
}
