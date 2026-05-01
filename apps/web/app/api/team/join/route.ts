import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: existing } = await db
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'You are already in a team' }, { status: 409 })
  }

  let body: unknown
  try { body = await request.json() } catch { body = {} }
  const { inviteCode } = body as { inviteCode?: string }

  if (!inviteCode || typeof inviteCode !== 'string' || !inviteCode.trim()) {
    return NextResponse.json({ error: 'inviteCode is required' }, { status: 400 })
  }

  // SECURITY DEFINER bypasses RLS so unauthenticated-to-team users can look up the invite code
  const { data: teams, error: lookupError } = await db
    .rpc('get_team_by_invite_code', { p_invite_code: inviteCode.trim().toLowerCase() })

  if (lookupError || !teams || teams.length === 0) {
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
  }

  const team = teams[0] as { id: string; name: string }

  const { error: joinError } = await db
    .from('team_members')
    .insert({ team_id: team.id, user_id: user.id, role: 'member' })

  if (joinError) {
    console.error('Team join error:', joinError)
    return NextResponse.json({ error: 'Failed to join team' }, { status: 500 })
  }

  return NextResponse.json({ id: team.id, name: team.name })
}
