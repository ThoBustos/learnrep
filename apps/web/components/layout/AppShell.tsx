'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Home, BookOpen, Library, BarChart2, Users, Bell, Check, X, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FlameIcon } from '@/components/icons/FlameIcon'
import { GitHubStarButton } from '@/components/ui/GitHubStarButton'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { NotifContext } from './NotifContext'
import type { AppNotification } from '@/lib/types'

const navItems = [
  { label: 'Feed', href: '/dashboard', Icon: Home },
  { label: 'My Quizzes', href: '/quizzes', Icon: BookOpen },
  { label: 'Library', href: '/library', Icon: Library },
  { label: 'Stats', href: '/stats', Icon: BarChart2 },
  { label: 'Team', href: '/team', Icon: Users },
]

export default function AppShell({
  children,
  githubStars,
}: {
  children: React.ReactNode
  githubStars?: number
}) {
  const pathname = usePathname()
  const [notifOpen, setNotifOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set())

  useMountEffect(() => {
    try {
      setCollapsed(localStorage.getItem('sidebar-collapsed') === 'true')

      const storedDismissed = localStorage.getItem('dismissed-notifications')
      setDismissed(new Set(storedDismissed ? (JSON.parse(storedDismissed) as string[]) : []))
    } catch {}
  })

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem('sidebar-collapsed', String(next)) } catch {}
      return next
    })
  }

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => createClient().auth.getUser().then(({ data }) => data.user ?? null),
  })

  const { data: stats } = useQuery<{ streak: number; avgScore: number | null }>({
    queryKey: ['user-stats'],
    queryFn: ({ signal }) =>
      fetch('/api/user/stats', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed'))
      ),
  })

  const { data: notifications = [] } = useQuery<AppNotification[]>({
    queryKey: ['notifications'],
    queryFn: ({ signal }) =>
      fetch('/api/notifications', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : []
      ),
    refetchInterval: 60_000,
  })

  const visibleNotifs = notifications.filter((n) => !dismissed.has(n.id))
  const unreadCount = visibleNotifs.length

  const router = useRouter()

  async function signOut() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'You'
  const streak = stats?.streak ?? 0

  return (
    <NotifContext.Provider value={{ openNotif: () => setNotifOpen(true), unreadCount }}>
      <div
        className="relative min-h-screen overflow-hidden bg-[var(--lr-notebook)] text-[var(--lr-ink)]"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-70" />

        <div className="relative flex min-h-screen">
          {/* Sidebar */}
          <aside className={cn(
            'hidden shrink-0 flex-col gap-2 overflow-hidden border-r-[3px] border-[var(--lr-line)] bg-[var(--lr-blue)] py-5 transition-[width] duration-200 lg:flex',
            collapsed ? 'w-20 items-center px-3' : 'w-64 px-4'
          )}>
            {/* Logo row */}
            {collapsed ? (
              <div className="mb-7 flex h-12 items-center justify-center">
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  aria-label="Expand sidebar"
                  className="group/logo relative flex size-11 shrink-0 items-center justify-center"
                >
                  <Image src="/logos/robot.svg" alt="" width={40} height={40} className="size-10 transition-opacity group-hover/logo:opacity-0" />
                  <ChevronRight className="absolute size-5 text-[var(--lr-ink)] opacity-0 transition-opacity group-hover/logo:opacity-100" />
                </button>
              </div>
            ) : (
              <div className="relative mb-6 flex flex-col items-center pt-1">
                <Image src="/logos/robot.svg" alt="" width={56} height={56} className="size-14 shrink-0" />
                <span
                  className="mt-1.5 text-[1.35rem] leading-none tracking-wide text-[var(--lr-ink)]"
                  style={{ fontFamily: 'var(--font-bowlby)' }}
                >
                  Learn<span className="text-[var(--lr-blue-dark)]">Rep</span>
                </span>
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  className="absolute right-0 top-0 flex size-7 items-center justify-center text-[var(--lr-ink)]/40 transition-colors hover:text-[var(--lr-ink)]"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
              </div>
            )}

            <nav className="flex w-full flex-col gap-1">
              {navItems.map(({ label, href, Icon }) => {
                const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    aria-label={collapsed ? label : undefined}
                    className={cn(
                      'flex items-center border-[3px] py-3 text-sm font-black transition-all',
                      collapsed ? 'justify-center px-3' : 'gap-3 px-4',
                      active
                        ? 'border-[var(--lr-line)] bg-[var(--lr-yolk)] text-[var(--lr-ink)] shadow-[4px_4px_0_var(--lr-line)]'
                        : 'border-[var(--lr-line)] bg-[var(--lr-paper)] text-[var(--lr-ink)] shadow-[2px_2px_0_var(--lr-line)] hover:-translate-y-0.5'
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    {!collapsed && label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto w-full">
              {collapsed ? (
                <button
                  type="button"
                  onClick={signOut}
                  title="Sign out"
                  className="flex size-9 items-center justify-center border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] text-[var(--lr-muted)] shadow-[2px_2px_0_var(--lr-line)] transition-colors hover:text-[var(--lr-ink)]"
                >
                  <LogOut className="size-4" />
                </button>
              ) : (
                <div className="flex items-center gap-3 border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-4 py-3 shadow-[4px_4px_0_var(--lr-line)]">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[var(--lr-ink)]">{displayName}</p>
                    <p className="inline-flex items-center gap-1 truncate font-mono text-[10px] font-bold text-[var(--lr-muted)]">
                      <FlameIcon size={12} /> {streak} day streak
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={signOut}
                    title="Sign out"
                    className="flex size-7 shrink-0 items-center justify-center text-[var(--lr-muted)] transition-colors hover:text-[var(--lr-ink)]"
                  >
                    <LogOut className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-4 py-4 sm:px-5">
              <div>
                <h1 className="text-xl font-black leading-tight tracking-[-0.04em]">
                  Good {getTimeOfDay()}, {displayName.split(' ')[0]}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/docs"
                  className="hidden items-center gap-1.5 border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5 sm:flex"
                >
                  Docs
                </Link>

                <div className="hidden sm:flex">
                  <GitHubStarButton stars={githubStars} />
                </div>

                <button
                  type="button"
                  onClick={() => setNotifOpen(true)}
                  aria-label="Open notifications"
                  className="relative flex size-10 items-center justify-center border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] font-black shadow-[2px_2px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center border-[2px] border-[var(--lr-line)] bg-[var(--lr-tomato)] font-mono text-[9px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </header>

            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t-[3px] border-[var(--lr-line)] bg-[var(--lr-blue)] lg:hidden">
          {navItems.map(({ label, href, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-colors',
                  active ? 'bg-[var(--lr-yolk)] text-[var(--lr-ink)]' : 'text-[var(--lr-ink)]'
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Notifications panel */}
        {notifOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <button
              type="button"
              className="absolute inset-0 bg-[#151515]/30"
              onClick={() => setNotifOpen(false)}
              aria-label="Close notifications"
            />
            <div
              className="relative z-10 flex w-full max-w-sm flex-col border-l-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] shadow-[-6px_0_0_var(--lr-line)]"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              <div className="flex items-center justify-between border-b-[3px] border-[var(--lr-line)] px-5 py-4">
                <h2 className="text-lg font-black">Notifications</h2>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  aria-label="Close notifications"
                  className="flex size-9 items-center justify-center border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] shadow-[2px_2px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto p-4">
                {visibleNotifs.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#67606a]">All caught up</p>
                  </div>
                ) : (
                  visibleNotifs.map((notif) => (
                    <NotifCard
                      key={notif.id}
                      notif={notif}
                      onDismiss={() => setDismissed((prev) => {
                      const next = new Set([...prev, notif.id])
                      try { localStorage.setItem('dismissed-notifications', JSON.stringify([...next])) } catch {}
                      return next
                    })}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </NotifContext.Provider>
  )
}

function NotifCard({ notif, onDismiss }: { notif: AppNotification; onDismiss: () => void }) {
  const queryClient = useQueryClient()
  const [resolving, setResolving] = useState<'approved' | 'rejected' | null>(null)

  async function resolveAccessRequest(status: 'approved' | 'rejected') {
    if (notif.type !== 'access_request') return

    setResolving(status)
    try {
      const res = await fetch(`/api/quiz/${notif.quizId}/access-requests/${notif.requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        onDismiss()
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
        queryClient.invalidateQueries({ queryKey: ['quiz', notif.quizId] })
      }
    } finally {
      setResolving(null)
    }
  }

  if (notif.type === 'access_request') {
    return (
      <div className="border-[3px] border-[var(--lr-line)] bg-white p-4 shadow-[3px_3px_0_var(--lr-line)]">
        <p className="text-sm font-black leading-snug">
          <span className="text-[var(--lr-purple-dark)]">{notif.requesterName}</span> requested access to{' '}
          <Link
            href={`/quiz/${notif.quizId}`}
            className="underline decoration-2"
          >
            {notif.quizTitle}
          </Link>
        </p>
        <p className="mt-1 font-mono text-[10px] font-bold text-[var(--lr-muted)]">{formatTime(notif.createdAt)}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => resolveAccessRequest('approved')}
            disabled={!!resolving}
            className="inline-flex items-center gap-1.5 border-[2px] border-[var(--lr-green-dark)] bg-[var(--lr-green)] px-2.5 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-green-dark)] disabled:opacity-50"
          >
            <Check className="size-3" />
            {resolving === 'approved' ? 'Approving' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={() => resolveAccessRequest('rejected')}
            disabled={!!resolving}
            className="inline-flex items-center gap-1.5 border-[2px] border-[var(--lr-red-dark)] bg-[var(--lr-red)]/20 px-2.5 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-red-dark)] disabled:opacity-50"
          >
            <X className="size-3" />
            {resolving === 'rejected' ? 'Rejecting' : 'Reject'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-[3px] border-[var(--lr-line)] bg-white p-4 shadow-[3px_3px_0_var(--lr-line)]">
      <p className="text-sm font-black leading-snug">
        <span className="text-[var(--lr-purple-dark)]">{notif.takerName}</span> scored{' '}
        <span className="text-[var(--lr-green-dark)]">{notif.score}%</span> on{' '}
        <Link
          href={`/quiz/${notif.quizId}`}
          className="underline decoration-2"
          onClick={onDismiss}
        >
          {notif.quizTitle}
        </Link>
      </p>
      <p className="mt-1 font-mono text-[10px] font-bold text-[var(--lr-muted)]">{formatTime(notif.createdAt)}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--lr-muted)] underline"
      >
        Dismiss
      </button>
    </div>
  )
}

function getTimeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / 3_600_000)
  if (diffH < 1) return 'Just now'
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'Yesterday'
  return `${diffD}d ago`
}
