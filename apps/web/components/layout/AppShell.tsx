'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Library, BarChart2, Users, Bell, X, Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockNotifications } from '@/lib/mock-data'
import type { MockNotification } from '@/lib/mock-data'
import { NotifContext } from './NotifContext'

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
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications)
  const unreadCount = notifications.length

  function dismissAll(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

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
                  T
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">Thomas B.</p>
                  <p className="truncate font-mono text-[10px] font-bold text-[#67606a]">@thomas · 🔥 12</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b-[3px] border-[#151515] bg-[#ffd426] px-5 py-4">
              <div>
                <h1 className="text-xl font-black leading-tight tracking-[-0.04em]">Good morning, Thomas</h1>
              </div>
              <div className="flex items-center gap-3">
                {/* Streak */}
                <div className="hidden items-center gap-2 rounded-[0.9rem] border-[3px] border-[#151515] bg-[#151515] px-4 py-2 text-[#ffd426] sm:flex">
                  <span className="text-lg">🔥</span>
                  <span className="font-black">12 day streak</span>
                </div>

                {/* Docs */}
                <Link
                  href="/docs"
                  className="hidden items-center gap-1.5 rounded-[0.9rem] border-[3px] border-[#151515] bg-white px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5 sm:flex"
                >
                  Docs
                </Link>

                {/* GitHub stars */}
                {githubStars !== undefined && (
                  <a
                    href="https://github.com/ThoBustos/learnrep"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden items-center gap-1.5 rounded-[0.9rem] border-[3px] border-[#151515] bg-white px-3 py-2 font-mono text-[10px] font-black shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5 sm:flex"
                  >
                    <Star className="size-3 fill-[#151515]" />
                    {githubStars}
                  </a>
                )}

                {/* Bell */}
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
                {notifications.map((notif) => (
                  <NotifCard
                    key={notif.id}
                    notif={notif}
                    onDismiss={() => dismissAll(notif.id)}
                  />
                ))}
                {notifications.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#67606a]">All caught up</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </NotifContext.Provider>
  )
}

function NotifCard({ notif, onDismiss }: { notif: MockNotification; onDismiss: () => void }) {
  const [actioned, setActioned] = useState<'accepted' | 'declined' | 'approved' | 'rejected' | null>(null)

  function action(type: 'accepted' | 'declined' | 'approved' | 'rejected') {
    setActioned(type)
  }

  return (
    <div className="rounded-[1rem] border-[3px] border-[#151515] bg-white p-4 shadow-[3px_3px_0_#151515]">
      {notif.type === 'invite' && (
        <>
          <p className="text-sm font-black leading-snug">
            <span className="text-[#5735a7]">{notif.from}</span> invited you to{' '}
            <span className="underline decoration-2">{notif.quizTitle}</span>
          </p>
          <p className="mt-1 font-mono text-[10px] font-bold text-[#67606a]">{formatTime(notif.createdAt)}</p>
          {actioned ? (
            <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-widest text-[#1e6f38]">
              {actioned === 'accepted' ? 'Accepted' : 'Declined'}
            </p>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => action('accepted')}
                className="flex items-center gap-1 rounded-[0.6rem] border-[3px] border-[#1e6f38] bg-[#d9ff69] px-3 py-1.5 font-mono text-[10px] font-black uppercase text-[#1e6f38] shadow-[2px_2px_0_#1e6f38] transition-transform hover:-translate-y-0.5"
              >
                <Check className="size-3" /> Accept
              </button>
              <button
                type="button"
                onClick={() => action('declined')}
                className="flex items-center gap-1 rounded-[0.6rem] border-[3px] border-[#9c231d] bg-[#ff6b62] px-3 py-1.5 font-mono text-[10px] font-black uppercase text-[#9c231d] shadow-[2px_2px_0_#9c231d] transition-transform hover:-translate-y-0.5"
              >
                <X className="size-3" /> Decline
              </button>
            </div>
          )}
        </>
      )}

      {notif.type === 'access_request' && (
        <>
          <p className="text-sm font-black leading-snug">
            <span className="text-[#0d5c75]">{notif.from}</span> requested access to{' '}
            <span className="underline decoration-2">{notif.quizTitle}</span>
          </p>
          <p className="mt-1 font-mono text-[10px] font-bold text-[#67606a]">{formatTime(notif.createdAt)}</p>
          {actioned ? (
            <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-widest text-[#1e6f38]">
              {actioned === 'approved' ? 'Approved' : 'Rejected'}
            </p>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => action('approved')}
                className="flex items-center gap-1 rounded-[0.6rem] border-[3px] border-[#1e6f38] bg-[#d9ff69] px-3 py-1.5 font-mono text-[10px] font-black uppercase text-[#1e6f38] shadow-[2px_2px_0_#1e6f38] transition-transform hover:-translate-y-0.5"
              >
                <Check className="size-3" /> Approve
              </button>
              <button
                type="button"
                onClick={() => action('rejected')}
                className="flex items-center gap-1 rounded-[0.6rem] border-[3px] border-[#9c231d] bg-[#ff6b62] px-3 py-1.5 font-mono text-[10px] font-black uppercase text-[#9c231d] shadow-[2px_2px_0_#9c231d] transition-transform hover:-translate-y-0.5"
              >
                <X className="size-3" /> Reject
              </button>
            </div>
          )}
        </>
      )}

      {notif.type === 'approved' && (
        <>
          <p className="text-sm font-black leading-snug">
            Your request to access{' '}
            <span className="underline decoration-2">{notif.quizTitle}</span> was{' '}
            <span className="text-[#1e6f38]">approved</span>
          </p>
          <p className="mt-1 font-mono text-[10px] font-bold text-[#67606a]">{formatTime(notif.createdAt)}</p>
          <button
            type="button"
            onClick={onDismiss}
            className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#67606a] underline"
          >
            Dismiss
          </button>
        </>
      )}
    </div>
  )
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date('2026-04-27T12:00:00Z')
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / 3600000)
  if (diffH < 1) return 'Just now'
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'Yesterday'
  return `${diffD}d ago`
}
