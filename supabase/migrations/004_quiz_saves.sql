create table public.quiz_saves (
  id         uuid primary key default gen_random_uuid(),
  quiz_id    uuid not null references public.quizzes(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (quiz_id, user_id)
);

alter table public.quiz_saves enable row level security;

create policy "quiz_saves: select own" on public.quiz_saves
  for select using (auth.uid() = user_id);

create policy "quiz_saves: insert own accessible quiz" on public.quiz_saves
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.quizzes q where q.id = quiz_id)
  );

create policy "quiz_saves: delete own" on public.quiz_saves
  for delete using (auth.uid() = user_id);
