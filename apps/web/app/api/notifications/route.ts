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
    .select('id, title, is_public')
    .eq('user_id', user.id)

  if (quizzesError) {
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }

  if (!quizzes || quizzes.length === 0) {
    return NextResponse.json([])
  }

  const quizMap = new Map(quizzes.map((q) => [q.id, q]))
  const ownedIds = quizzes.map((q) => q.id)
  const privateOwnedIds = quizzes.filter((q) => !q.is_public).map((q) => q.id)

  const { data: attempts, error: attemptsError } = await db
    .from('quiz_attempts')
    .select('id, quiz_id, user_id, score, completed_at')
    .in('quiz_id', ownedIds)
    .neq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(30)

  let accessRequests: {
    id: string
    quiz_id: string
    requester_id: string
    created_at: string
  }[] = []
  let accessRequestsError: unknown = null

  if (privateOwnedIds.length > 0) {
    const result = await db
      .from('quiz_access_requests')
      .select('id, quiz_id, requester_id, created_at')
      .in('quiz_id', privateOwnedIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(30)

    accessRequests = result.data ?? []
    accessRequestsError = result.error
  }

  if (attemptsError || accessRequestsError) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }

  const profileIds = [
    ...(attempts ?? []).map((a) => a.user_id),
    ...accessRequests.map((request) => request.requester_id),
  ]
  const uniqueProfileIds = [...new Set(profileIds)]

  if (uniqueProfileIds.length === 0) {
    return NextResponse.json([])
  }

  const { data: profiles, error: profilesError } = await db
    .from('profiles')
    .select('id, display_name')
    .in('id', uniqueProfileIds)

  if (profilesError) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const attemptNotifications: AppNotification[] = (attempts ?? []).map((a) => ({
    id: a.id,
    type: 'quiz_attempt' as const,
    takerName: profileMap.get(a.user_id)?.display_name ?? 'Someone',
    quizTitle: quizMap.get(a.quiz_id)!.title,
    quizId: a.quiz_id,
    score: a.score,
    createdAt: a.completed_at,
  }))

  const accessRequestNotifications: AppNotification[] = accessRequests.map((request) => ({
    id: `access-request:${request.id}`,
    type: 'access_request' as const,
    requestId: request.id,
    requesterName: profileMap.get(request.requester_id)?.display_name ?? 'Someone',
    quizTitle: quizMap.get(request.quiz_id)!.title,
    quizId: request.quiz_id,
    createdAt: request.created_at,
  }))

  const notifications = [...attemptNotifications, ...accessRequestNotifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 30)

  return NextResponse.json(notifications)
}
