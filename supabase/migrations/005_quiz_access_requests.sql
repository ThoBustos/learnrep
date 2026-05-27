create table public.quiz_access_requests (
  id           uuid primary key default gen_random_uuid(),
  quiz_id      uuid not null references public.quizzes(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending','approved','rejected')),
  resolved_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz,
  unique (quiz_id, requester_id)
);

alter table public.quiz_access_requests enable row level security;

create or replace function public.can_request_quiz_access(p_quiz_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.quizzes q
    where q.id = p_quiz_id
      and q.user_id <> auth.uid()
      and q.is_public = false
  );
$$;

create policy "quiz_access_requests: requester read own" on public.quiz_access_requests
  for select using (auth.uid() = requester_id);

create policy "quiz_access_requests: owner read own quiz requests" on public.quiz_access_requests
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
  );

create policy "quiz_access_requests: requester insert pending" on public.quiz_access_requests
  for insert with check (
    auth.uid() = requester_id
    and status = 'pending'
    and public.can_request_quiz_access(quiz_id)
  );

create policy "quiz_access_requests: owner update own quiz requests" on public.quiz_access_requests
  for update using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
    and status in ('approved','rejected')
  );

create policy "quiz_access_requests: requester reopen rejected" on public.quiz_access_requests
  for update using (
    auth.uid() = requester_id
    and status = 'rejected'
    and public.can_request_quiz_access(quiz_id)
  )
  with check (
    auth.uid() = requester_id
    and status = 'pending'
    and resolved_by is null
    and resolved_at is null
    and public.can_request_quiz_access(quiz_id)
  );

create policy "quizzes: approved access request read" on public.quizzes
  for select using (
    exists (
      select 1
      from public.quiz_access_requests qar
      where qar.quiz_id = quizzes.id
        and qar.requester_id = auth.uid()
        and qar.status = 'approved'
    )
  );
