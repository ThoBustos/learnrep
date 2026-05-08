-- Lookup a team by invite code (SECURITY DEFINER bypasses RLS so strangers can join)
create or replace function public.get_team_by_invite_code(p_invite_code text)
returns table (id uuid, name text, invite_code text)
language sql
security definer
set search_path = public
as $$
  select id, name, invite_code from teams where invite_code = lower(p_invite_code) limit 1;
$$;

-- Team members can read each other's public quizzes (for team feed)
create policy "quizzes: team member read" on public.quizzes
  for select using (
    exists (
      select 1 from public.team_members tm1
      join public.team_members tm2 on tm1.team_id = tm2.team_id
      where tm1.user_id = auth.uid()
        and tm2.user_id = quizzes.user_id
        and tm1.user_id != tm2.user_id
    )
  );

-- Team members can see each other's attempts on team quizzes (for team leaderboard)
create policy "quiz_attempts: team member read" on public.quiz_attempts
  for select using (
    exists (
      select 1 from public.team_members tm1
      join public.team_members tm2 on tm1.team_id = tm2.team_id
      where tm1.user_id = auth.uid()
        and tm2.user_id = quiz_attempts.user_id
        and tm1.user_id != tm2.user_id
    )
  );
