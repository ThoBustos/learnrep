import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type AccessRequestStatus = 'approved' | 'rejected'

function isAccessRequestStatus(value: unknown): value is AccessRequestStatus {
  return value === 'approved' || value === 'rejected'
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; requestId: string }> },
) {
  const { id, requestId } = await params
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

  const { status } = body as { status?: unknown }
  if (!isAccessRequestStatus(status)) {
    return NextResponse.json({ error: 'status must be approved or rejected' }, { status: 400 })
  }

  const { data, error } = await db
    .from('quiz_access_requests')
    .update({
      status,
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .eq('quiz_id', id)
    .eq('status', 'pending')
    .select('id, quiz_id, requester_id, status, resolved_at')
    .single()

  if (error || !data) {
    console.error('Access request update error:', error)
    return NextResponse.json({ error: 'Access request not found' }, { status: 404 })
  }

  return NextResponse.json({
    requestId: data.id,
    quizId: data.quiz_id,
    requesterId: data.requester_id,
    status: data.status,
    resolvedAt: data.resolved_at,
  })
}
