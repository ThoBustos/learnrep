-- Allow anyone to read attempts for public quizzes (leaderboards)
create policy "quiz_attempts: read for public quizzes" on public.quiz_attempts
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.is_public = true)
  );

-- Allow quiz owner to read all attempts on their quiz
create policy "quiz_attempts: read own quiz attempts" on public.quiz_attempts
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.user_id = auth.uid())
  );

-- Allow reading any profile (for leaderboard display names)
create policy "profiles: public read" on public.profiles
  for select using (true);
