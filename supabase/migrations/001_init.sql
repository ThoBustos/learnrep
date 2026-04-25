-- profiles: synced from auth.users on signup
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- quizzes
create table public.quizzes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  topic       text not null,
  difficulty  text not null check (difficulty in ('easy','medium','hard','expert')),
  questions   jsonb not null default '[]',
  source      text not null check (source in ('cli','mcp','web')),
  is_public   boolean not null default false,
  share_code  text unique,
  created_at  timestamptz not null default now()
);

-- quiz_attempts
create table public.quiz_attempts (
  id            uuid primary key default gen_random_uuid(),
  quiz_id       uuid not null references public.quizzes(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  score         integer not null,
  answers       jsonb not null default '{}',
  completed_at  timestamptz not null default now()
);

-- teams
create table public.teams (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  invite_code  text unique not null default encode(gen_random_bytes(6), 'hex'),
  created_by   uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now()
);

-- team_members
create table public.team_members (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'member' check (role in ('owner','member')),
  joined_at  timestamptz not null default now(),
  unique (team_id, user_id)
);

-- RLS
alter table public.profiles     enable row level security;
alter table public.quizzes      enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.teams        enable row level security;
alter table public.team_members enable row level security;

-- profiles: users see/edit their own
create policy "profiles: own" on public.profiles
  for all using (auth.uid() = id);

-- quizzes: own full access + public read
create policy "quizzes: own" on public.quizzes
  for all using (auth.uid() = user_id);
create policy "quizzes: public read" on public.quizzes
  for select using (is_public = true);

-- quiz_attempts: own only
create policy "quiz_attempts: own" on public.quiz_attempts
  for all using (auth.uid() = user_id);

-- teams: members can read, owner can write
create policy "teams: member read" on public.teams
  for select using (
    exists (select 1 from public.team_members where team_id = id and user_id = auth.uid())
  );
create policy "teams: owner write" on public.teams
  for all using (auth.uid() = created_by);

-- team_members: members can read
create policy "team_members: read" on public.team_members
  for select using (
    exists (select 1 from public.team_members tm where tm.team_id = team_id and tm.user_id = auth.uid())
  );
create policy "team_members: own" on public.team_members
  for all using (auth.uid() = user_id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
