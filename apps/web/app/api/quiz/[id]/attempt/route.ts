import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

type StoredAnswer = {
  questionId: string
  prompt: string
  type: string
  correct: boolean
  score: number
  feedback: string
}

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { user, db } = await getAuthContext(request)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { score, answers } = body as { score?: number; answers?: StoredAnswer[] }

  if (typeof score !== 'number') {
    return NextResponse.json({ error: 'score is required' }, { status: 400 })
  }

  const { data, error } = await db
    .from('quiz_attempts')
    .insert({
      quiz_id: id,
      user_id: user.id,
      score,
      answers: answers ?? [],
    })
    .select('id, score')
    .single()

  if (error || !data) {
    console.error('Attempt insert error:', error)
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, score: data.score })
}
