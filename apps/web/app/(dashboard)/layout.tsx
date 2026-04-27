import AppShell from '@/components/layout/AppShell'

const supabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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

  return <AppShell>{children}</AppShell>
}
