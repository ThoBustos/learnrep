'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginContent() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/callback?next=${encodeURIComponent(next)}`,
      },
    })
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-[#ffd426]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#151515_1.2px,transparent_1.2px)] [background-size:18px_18px]" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] font-black text-xl text-[#ffd426]">
            L
          </div>
          <span className="text-2xl font-black tracking-[-0.04em]">LearnRep</span>
        </div>

        {/* Card */}
        <div className="flex flex-col items-center gap-6 rounded-[1.5rem] border-[3px] border-[#151515] bg-white px-10 py-10 shadow-[8px_8px_0_#151515]">
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-[-0.04em]">Sign in to continue</h1>
            <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#67606a]">
              Generate quizzes. Track progress. Compete.
            </p>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex min-h-[44px] items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white px-6 py-3 text-sm font-black shadow-[4px_4px_0_#151515] transition-transform hover:-translate-y-0.5"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="max-w-[240px] text-center font-mono text-[10px] font-bold leading-relaxed text-[#67606a]">
            By signing in you agree to our terms. No spam, ever.
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
