import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await db
    .from('quiz_access_requests')
    .select('id, status, created_at, resolved_at')
    .eq('quiz_id', id)
    .eq('requester_id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch access request' }, { status: 500 })
  }

  return NextResponse.json({
    requestId: data?.id ?? null,
    status: data?.status ?? null,
    createdAt: data?.created_at ?? null,
    resolvedAt: data?.resolved_at ?? null,
  })
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await db
    .from('quiz_access_requests')
    .insert({ quiz_id: id, requester_id: user.id, status: 'pending' })
    .select('id, status, created_at')
    .single()

  if (error || !data) {
    const { data: existing } = await db
      .from('quiz_access_requests')
      .select('id, status, created_at')
      .eq('quiz_id', id)
      .eq('requester_id', user.id)
      .maybeSingle()

    if (existing) {
      if (existing.status === 'rejected') {
        const { data: reopened, error: reopenError } = await db
          .from('quiz_access_requests')
          .update({
            status: 'pending',
            resolved_by: null,
            resolved_at: null,
            created_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .eq('status', 'rejected')
          .select('id, status, created_at')
          .single()

        if (reopenError || !reopened) {
          console.error('Access request reopen error:', reopenError)
          return NextResponse.json({ error: 'Unable to request access' }, { status: 500 })
        }

        return NextResponse.json({
          requestId: reopened.id,
          status: reopened.status,
          createdAt: reopened.created_at,
        })
      }

      return NextResponse.json({
        requestId: existing.id,
        status: existing.status,
        createdAt: existing.created_at,
      })
    }

    console.error('Access request insert error:', error)
    return NextResponse.json({ error: 'Unable to request access' }, { status: 404 })
  }

  return NextResponse.json({
    requestId: data.id,
    status: data.status,
    createdAt: data.created_at,
  })
}
