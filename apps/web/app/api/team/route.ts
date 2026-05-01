import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: membership } = await db
    .from('team_members')
    .select('team_id, role, joined_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) return NextResponse.json(null)

  const { data: team } = await db
    .from('teams')
    .select('id, name, invite_code, created_by, created_at')
    .eq('id', membership.team_id)
    .single()

  if (!team) return NextResponse.json(null)

  const { data: members } = await db
    .from('team_members')
    .select('user_id, role, joined_at')
    .eq('team_id', team.id)

  const memberIds = (members ?? []).map((m) => m.user_id)
  const { data: profiles } = await db
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', memberIds)

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const enrichedMembers = (members ?? []).map((m) => ({
    userId: m.user_id,
    role: m.role,
    joinedAt: m.joined_at,
    displayName: profileMap.get(m.user_id)?.display_name ?? null,
    avatarUrl: profileMap.get(m.user_id)?.avatar_url ?? null,
  }))

  return NextResponse.json({
    id: team.id,
    name: team.name,
    inviteCode: team.invite_code,
    createdBy: team.created_by,
    createdAt: team.created_at,
    myRole: membership.role,
    members: enrichedMembers,
  })
}

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
  const { name } = body as { name?: string }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const { data: team, error: teamError } = await db
    .from('teams')
    .insert({ name: name.trim(), created_by: user.id })
    .select('id, name, invite_code')
    .single()

  if (teamError || !team) {
    console.error('Team create error:', teamError)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }

  await db.from('team_members').insert({ team_id: team.id, user_id: user.id, role: 'owner' })

  return NextResponse.json(team)
}
