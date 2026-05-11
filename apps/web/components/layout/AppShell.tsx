'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Library, BarChart2, Users, Bell, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { FlameIcon } from '@/components/icons/FlameIcon'
import { GitHubStarButton } from '@/components/ui/GitHubStarButton'
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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem('sidebar-collapsed', String(next)) } catch {}
      return next
    })
  }

  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = localStorage.getItem('dismissed-notifications')
      return new Set(stored ? (JSON.parse(stored) as string[]) : [])
    } catch {
      return new Set()
    }
  })

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

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'You'
  const initials = displayName[0]?.toUpperCase() ?? '?'
  const streak = stats?.streak ?? 0

  return (
    <NotifContext.Provider value={{ openNotif: () => setNotifOpen(true), unreadCount }}>
      <div
        className="relative min-h-screen overflow-hidden bg-[var(--lr-cream)] text-[var(--lr-ink)]"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-30" />

        <div className="relative flex min-h-screen">
          {/* Sidebar */}
          <aside className={cn(
            'hidden shrink-0 flex-col gap-2 border-r-[3px] border-[var(--lr-ink)] bg-[var(--lr-ink)] py-6 transition-[width] duration-200 lg:flex overflow-hidden',
            collapsed ? 'w-[72px] items-center px-2' : 'w-64 px-4'
          )}>
            {/* Logo row */}
            <div className={cn('mb-6 flex items-center', collapsed ? 'justify-center' : 'justify-between gap-3')}>
              <div className="flex shrink-0 items-center gap-3">
                {collapsed ? (
                  <button
                    type="button"
                    onClick={toggleCollapsed}
                    aria-label="Expand sidebar"
                    className="group/logo relative flex size-10 shrink-0 items-center justify-center"
                  >
                    <Image src="/logos/robot.svg" alt="LearnRep" width={40} height={40} className="size-10 rounded-[0.65rem] transition-opacity group-hover/logo:opacity-0" />
                    <ChevronRight className="absolute size-5 text-white opacity-0 transition-opacity group-hover/logo:opacity-100" />
                  </button>
                ) : (
                  <Image src="/logos/robot.svg" alt="LearnRep" width={40} height={40} className="size-10 shrink-0 rounded-[0.65rem]" />
                )}
                {!collapsed && (
                  <span className="text-lg font-black tracking-[-0.04em] text-white">LearnRep</span>
                )}
              </div>
              {!collapsed && (
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  className="flex size-7 shrink-0 items-center justify-center rounded-[0.5rem] border-[2px] border-white/20 text-white/40 transition-colors hover:border-white/40 hover:text-white/70"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
              )}
            </div>

            <nav className="flex w-full flex-col gap-1">
              {navItems.map(({ label, href, Icon }) => {
                const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      'flex items-center rounded-[0.9rem] border-[3px] py-3 text-sm font-black transition-all',
                      collapsed ? 'justify-center px-3' : 'gap-3 px-4',
                      active
                        ? 'border-[var(--lr-yellow)] bg-[var(--lr-yellow)] text-[var(--lr-ink)]'
                        : 'border-transparent text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
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
                <div className="flex justify-center rounded-[0.9rem] border-[3px] border-white/20 bg-white/10 p-3">
                  <div className="flex size-8 items-center justify-center rounded-full border-[3px] border-[var(--lr-yellow)] bg-[var(--lr-yellow)] font-mono text-xs font-black text-[var(--lr-ink)]">
                    {initials}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-[0.9rem] border-[3px] border-white/20 bg-white/10 px-4 py-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[var(--lr-yellow)] bg-[var(--lr-yellow)] font-mono text-xs font-black text-[var(--lr-ink)]">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-white">{displayName}</p>
                    <p className="inline-flex items-center gap-1 truncate font-mono text-[10px] font-bold text-white/50">
                      <FlameIcon size={12} /> {streak} day streak
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b-[3px] border-[var(--lr-ink)] bg-[var(--lr-cream)] px-5 py-4">
              <div>
                <h1 className="text-xl font-black leading-tight tracking-[-0.04em]">
                  Good {getTimeOfDay()}, {displayName.split(' ')[0]}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                {streak > 0 && (
                  <div className="hidden items-center gap-2 rounded-[0.9rem] border-[3px] border-[var(--lr-ink)] bg-[var(--lr-ink)] px-4 py-2 text-[var(--lr-yellow)] sm:flex">
                    <FlameIcon size={20} />
                    <span className="font-black">{streak} day streak</span>
                  </div>
                )}

                <Link
                  href="/docs"
                  className="hidden items-center gap-1.5 rounded-[0.9rem] border-[3px] border-[var(--lr-ink)] bg-[var(--lr-white)] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_var(--lr-ink)] transition-transform hover:-translate-y-0.5 sm:flex"
                >
                  Docs
                </Link>

                <div className="hidden sm:flex">
                  <GitHubStarButton stars={githubStars} />
                </div>

                <button
                  type="button"
                  onClick={() => setNotifOpen(true)}
                  className="relative flex size-10 items-center justify-center rounded-[0.9rem] border-[3px] border-[var(--lr-ink)] bg-[var(--lr-white)] font-black shadow-[2px_2px_0_var(--lr-ink)] transition-transform hover:-translate-y-0.5"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-[2px] border-[var(--lr-ink)] bg-[var(--lr-red)] font-mono text-[9px] font-black text-white">
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
        <nav className="fixed bottom-0 left-0 right-0 flex border-t-[3px] border-[var(--lr-ink)] bg-[var(--lr-ink)] lg:hidden">
          {navItems.map(({ label, href, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-colors',
                  active ? 'bg-[var(--lr-yellow)] text-[var(--lr-ink)]' : 'text-white/60'
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
              className="relative z-10 flex w-full max-w-sm flex-col border-l-[3px] border-[var(--lr-ink)] bg-[var(--lr-cream)] shadow-[-6px_0_0_var(--lr-ink)]"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              <div className="flex items-center justify-between border-b-[3px] border-[var(--lr-ink)] px-5 py-4">
                <h2 className="text-lg font-black">Notifications</h2>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="flex size-9 items-center justify-center rounded-[0.9rem] border-[3px] border-[var(--lr-ink)] bg-[var(--lr-white)] shadow-[2px_2px_0_var(--lr-ink)] transition-transform hover:-translate-y-0.5"
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
  return (
    <div className="rounded-[1rem] border-[3px] border-[#151515] bg-white p-4 shadow-[3px_3px_0_#151515]">
      <p className="text-sm font-black leading-snug">
        <span className="text-[#5735a7]">{notif.takerName}</span> scored{' '}
        <span className="text-[#1e6f38]">{notif.score}%</span> on{' '}
        <Link
          href={`/quiz/${notif.quizId}`}
          className="underline decoration-2"
          onClick={onDismiss}
        >
          {notif.quizTitle}
        </Link>
      </p>
      <p className="mt-1 font-mono text-[10px] font-bold text-[#67606a]">{formatTime(notif.createdAt)}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#67606a] underline"
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
