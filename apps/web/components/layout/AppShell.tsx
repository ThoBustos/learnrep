'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Library, BarChart2, Users, Bell, X } from 'lucide-react'
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
        className="relative min-h-screen overflow-hidden bg-[#ffd426] text-[#151515]"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#151515_1.2px,transparent_1.2px)] [background-size:18px_18px]" />

        <div className="relative flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden w-64 shrink-0 flex-col gap-2 border-r-[3px] border-[#151515] bg-[#ffd426] px-4 py-6 lg:flex">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] font-black text-[#ffd426]">
                L
              </div>
              <span className="text-lg font-black tracking-[-0.04em]">LearnRep</span>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map(({ label, href, Icon }) => {
                const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 rounded-[0.9rem] border-[3px] px-4 py-3 text-sm font-black transition-all',
                      active
                        ? 'border-[#151515] bg-[#151515] text-[#ffd426] shadow-[3px_3px_0_#ff5858]'
                        : 'border-transparent hover:border-[#151515] hover:bg-white/50'
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto">
              <div className="flex items-center gap-3 rounded-[0.9rem] border-[3px] border-[#151515] bg-white/60 px-4 py-3">
                <div className="flex size-8 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] font-mono text-xs font-black text-[#ffd426]">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{displayName}</p>
                  <p className="inline-flex items-center gap-1 truncate font-mono text-[10px] font-bold text-[#67606a]">
                    <FlameIcon size={12} /> {streak} day streak
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b-[3px] border-[#151515] bg-[#ffd426] px-5 py-4">
              <div>
                <h1 className="text-xl font-black leading-tight tracking-[-0.04em]">
                  Good {getTimeOfDay()}, {displayName.split(' ')[0]}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                {streak > 0 && (
                  <div className="hidden items-center gap-2 rounded-[0.9rem] border-[3px] border-[#151515] bg-[#151515] px-4 py-2 text-[#ffd426] sm:flex">
                    <FlameIcon size={20} />
                    <span className="font-black">{streak} day streak</span>
                  </div>
                )}

                <Link
                  href="/docs"
                  className="hidden items-center gap-1.5 rounded-[0.9rem] border-[3px] border-[#151515] bg-white px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5 sm:flex"
                >
                  Docs
                </Link>

                <div className="hidden sm:flex">
                  <GitHubStarButton stars={githubStars} />
                </div>

                <button
                  type="button"
                  onClick={() => setNotifOpen(true)}
                  className="relative flex size-10 items-center justify-center rounded-full border-[3px] border-[#151515] bg-white font-black shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-[2px] border-[#151515] bg-[#ff6b62] font-mono text-[9px] font-black text-white">
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
        <nav className="fixed bottom-0 left-0 right-0 flex border-t-[3px] border-[#151515] bg-[#ffd426] lg:hidden">
          {navItems.map(({ label, href, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-colors',
                  active ? 'bg-[#151515] text-[#ffd426]' : 'text-[#151515]'
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
              className="relative z-10 flex w-full max-w-sm flex-col border-l-[3px] border-[#151515] bg-[#fff7ec] shadow-[-6px_0_0_#151515]"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              <div className="flex items-center justify-between border-b-[3px] border-[#151515] px-5 py-4">
                <h2 className="text-lg font-black">Notifications</h2>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full border-[3px] border-[#151515] bg-white shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5"
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
