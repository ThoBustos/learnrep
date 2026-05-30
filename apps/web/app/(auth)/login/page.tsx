'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
      className="relative flex min-h-screen items-center justify-center bg-[var(--lr-notebook)]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-70" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logos/robot.svg" alt="" width={44} height={44} className="size-11" />
          <span className="text-2xl font-black tracking-[-0.04em]">LearnRep</span>
        </Link>

        <div className="w-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] p-8 shadow-[6px_6px_0_var(--lr-line)]">
          <h1 className="mb-6 text-xl font-black">Log in to continue</h1>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex min-h-[52px] w-full items-center justify-center gap-3 border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] px-5 py-3 text-sm font-black shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 font-mono text-[10px] font-bold leading-5 text-[var(--lr-muted)]">
            No spam, ever.
          </p>
        </div>
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
