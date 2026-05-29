'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { BookOpen, Library, ShieldCheck, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const LOGIN_STATS = [
  { label: 'Saved quizzes', value: '31', icon: Library, tone: 'bg-[var(--lr-yolk)] text-[var(--lr-ink)]' },
  { label: 'Avg score', value: '84%', icon: Trophy, tone: 'bg-[var(--lr-teal)] text-white' },
  { label: 'Private by default', value: 'On', icon: ShieldCheck, tone: 'bg-[var(--lr-ink)] text-[var(--lr-yolk)]' },
]

function LoginContent() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  async function signInWithGoogle() {
    const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
    document.cookie = `lr_auth_next=${encodeURIComponent(safeNext)}; Path=/; Max-Age=600; SameSite=Lax`

    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/callback`,
      },
    })
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[var(--lr-notebook)] text-[var(--lr-ink)]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-70" />

      <Link
        href="/"
        className="absolute left-5 top-5 z-20 flex items-center gap-2 border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-3 py-2 shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5 sm:left-8 sm:top-8"
      >
        <Image src="/logos/robot.svg" alt="" width={36} height={36} className="size-9" />
        <span className="hidden text-sm font-black sm:inline">LearnRep</span>
      </Link>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl gap-8 px-5 py-28 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:py-20">
        <section className="hidden overflow-hidden border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] shadow-[8px_8px_0_var(--lr-line)] lg:block">
          <div className="grid min-h-[520px] grid-cols-[190px_1fr]">
            <aside className="border-r-[3px] border-[var(--lr-line)] bg-[var(--lr-teal)] p-4">
              <div className="mb-7 flex items-center gap-3">
                <Image src="/logos/robot.svg" alt="" width={42} height={42} className="size-10" />
                <p className="text-lg font-black text-white">LearnRep</p>
              </div>
              <div className="grid gap-2">
                {['Feed', 'My Quizzes', 'Library', 'Stats'].map((item, index) => (
                  <div
                    key={item}
                    className={[
                      'border-[3px] border-[var(--lr-line)] px-3 py-2 text-sm font-black',
                      index === 0
                        ? 'bg-[var(--lr-yolk)] shadow-[4px_4px_0_var(--lr-line)]'
                        : 'bg-[var(--lr-paper)] shadow-[2px_2px_0_var(--lr-line)]',
                    ].join(' ')}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="relative bg-[var(--lr-notebook)] p-5">
              <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-70" />
              <div className="relative grid gap-4">
                <div className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-4 py-3 shadow-[3px_3px_0_var(--lr-line)]">
                  <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-tomato)]">
                    Welcome back
                  </p>
                  <p className="text-xl font-black">Your practice workbook is ready.</p>
                </div>

                <div className="grid gap-3">
                  {LOGIN_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className={`${stat.tone} flex items-center gap-3 border-[3px] border-[var(--lr-line)] p-4 shadow-[3px_3px_0_var(--lr-line)]`}
                    >
                      <stat.icon className="size-5 shrink-0" />
                      <div>
                        <p className="text-3xl font-black leading-none">{stat.value}</p>
                        <p className="mt-1 font-mono text-[10px] font-black uppercase opacity-75">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-blue)] p-4 text-[var(--lr-blue-dark)] shadow-[4px_4px_0_var(--lr-line)]">
                  <div className="mb-3 inline-flex items-center gap-1.5 border-[2px] border-[var(--lr-blue-dark)] bg-white px-2.5 py-1 font-mono text-[10px] font-black uppercase">
                    <BookOpen className="size-3" />
                    Next review
                  </div>
                  <p className="text-lg font-black leading-snug">TypeScript generics and API route auth</p>
                  <p className="mt-2 font-mono text-[11px] font-bold">10 questions / hard / private</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] shadow-[8px_8px_0_var(--lr-line)]">
          <div className="border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-teal)] px-6 py-5 text-white">
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-white/70">
              Secure sign in
            </p>
            <h1 className="mt-1 text-3xl font-black">Log in</h1>
          </div>

          <div className="grid gap-6 p-6 sm:p-8">
            <div>
              <p className="text-lg font-black">Continue to your quizzes, library, and team stats.</p>
              <p className="mt-2 font-mono text-xs font-bold leading-5 text-[var(--lr-muted)]">
                Browser auth redirects back to this local app before sending you to your next page.
              </p>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="flex min-h-[52px] w-full items-center justify-center gap-3 border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] px-5 py-3 text-sm font-black shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)] px-4 py-3 shadow-[3px_3px_0_var(--lr-line)]">
              <p className="font-mono text-[10px] font-black uppercase tracking-widest">Redirect target</p>
              <p className="mt-1 break-all font-mono text-xs font-bold">{next}</p>
            </div>

            <p className="font-mono text-[10px] font-bold leading-5 text-[var(--lr-muted)]">
              By signing in you agree to use LearnRep responsibly. No spam, ever.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  )
}
