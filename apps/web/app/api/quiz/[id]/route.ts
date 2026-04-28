import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Public — no auth required. Anyone with the share link can load the quiz.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  )

  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, topic, difficulty, questions, is_public, share_code')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
