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

// GET — public quizzes are readable by anyone; owners can also read their own private quizzes
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Try to get auth context so owners can see their own private quizzes
  const { user, db } = await getAuthContext(request)

  // First try: fetch as authenticated user (covers public + own private)
  if (user) {
    const { data, error } = await db
      .from('quizzes')
      .select('id, user_id, title, topic, difficulty, questions, is_public, share_code')
      .eq('id', id)
      .single()

    if (!error && data) {
      if (data.user_id !== user.id) {
        return NextResponse.json({ ...data, pendingAccessRequestCount: 0 })
      }

      const { count } = await db
        .from('quiz_access_requests')
        .select('id', { count: 'exact', head: true })
        .eq('quiz_id', id)
        .eq('status', 'pending')

      return NextResponse.json({ ...data, pendingAccessRequestCount: count ?? 0 })
    }
  }

  // Fallback: unauthenticated — only public quizzes
  const anonDb = makeSupabaseClient()
  const { data, error } = await anonDb
    .from('quizzes')
    .select('id, user_id, title, topic, difficulty, questions, is_public, share_code')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  return NextResponse.json({ ...data, pendingAccessRequestCount: 0 })
}

// PATCH — owner only, update is_public
export async function PATCH(
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

  const { is_public } = body as { is_public?: boolean }

  if (typeof is_public !== 'boolean') {
    return NextResponse.json({ error: 'is_public (boolean) is required' }, { status: 400 })
  }

  const { data, error } = await db
    .from('quizzes')
    .update({ is_public })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, is_public')
    .single()

  if (error || !data) {
    console.error('Quiz update error:', error)
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
