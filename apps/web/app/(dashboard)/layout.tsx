import AppShell from '@/components/layout/AppShell'

const supabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function fetchGithubStars(): Promise<number | undefined> {
  try {
    const res = await fetch('https://api.github.com/repos/ThoBustos/learnrep', {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) return undefined
    const data = await res.json()
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : undefined
  } catch {
    return undefined
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (supabaseConfigured) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const { redirect } = await import('next/navigation')
      redirect('/login')
    }
  }

  const githubStars = await fetchGithubStars()

  return <AppShell githubStars={githubStars}>{children}</AppShell>
}
