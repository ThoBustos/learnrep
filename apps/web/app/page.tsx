import type { CSSProperties } from 'react'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroBadge } from '@/components/landing/HeroBadge'
import { TerminalWindow } from '@/components/landing/TerminalWindow'
import { QuizPreviewCard } from '@/components/landing/QuizPreviewCard'
import { AgentBadgeStrip } from '@/components/landing/AgentBadgeStrip'
import { InstallCommand } from '@/components/landing/InstallCommand'
import { OnboardingQuiz } from '@/components/landing/OnboardingQuiz'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { AGENTS } from '@/lib/landing/agents'
import { SEQUENCE } from '@/lib/landing/terminalSequence'
import { QUESTIONS } from '@/lib/landing/quizQuestions'
import { landingColorVars } from '@/lib/tokens'

const INSTALL_CMD = 'npm install -g learnrep'

type GitHubRepoResponse = {
  stargazers_count?: unknown
}

async function getGitHubStars() {
  try {
    const res = await fetch('https://api.github.com/repos/ThoBustos/learnrep', {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 60 * 60 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as GitHubRepoResponse
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null
  } catch {
    return null
  }
}

export default async function HomePage() {
  const stars = await getGitHubStars()
  const pageStyle = {
    ...landingColorVars,
    fontFamily: 'var(--font-space-grotesk)',
  } as CSSProperties

  return (
    <div className="min-h-screen bg-[var(--lr-cream)] text-[var(--lr-ink)]" style={pageStyle}>

      <LandingNav stars={stars} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:px-10 md:grid-cols-2 md:items-center lg:gap-16 lg:py-24">
        <div className="flex flex-col gap-6">
          <HeroBadge label="CLI tool for AI agents" />

          <h1 className="text-[clamp(2.6rem,5.5vw,4rem)] font-black leading-[1.0] tracking-[-0.05em]">
            Generate a quiz.
            <br />
            Share it with
            <br />
            <span className="relative inline-block">
              your team.
              <span className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[var(--lr-yellow)]" />
            </span>
          </h1>

          <p className="text-base leading-relaxed text-[#151515]/60">
            One command from your agent or terminal. A live link your whole team can take.
            See who scores highest.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <InstallCommand command={INSTALL_CMD} />
            <Link href="/login" className="font-mono text-sm font-bold text-[#151515]/50 hover:text-[#151515]">
              or sign in
            </Link>
          </div>

          <AgentBadgeStrip agents={AGENTS} />
        </div>

        {/* Right — terminal + quiz preview */}
        <div className="flex flex-col gap-4">
          <TerminalWindow sequence={SEQUENCE} />
          <QuizPreviewCard
            title="React Hooks: State, Effects, and Closures"
            meta="5 questions · medium · 0 attempts"
          />
        </div>
      </section>

      {/* ── ONBOARDING QUIZ ──────────────────────────────────────────────────── */}
      <OnboardingQuiz questions={QUESTIONS} />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="flex flex-col gap-3 border-t-[3px] border-[color:color-mix(in_srgb,var(--lr-ink)_10%,transparent)] bg-[var(--lr-cream)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="font-mono text-[11px] font-bold text-[#151515]/40">LearnRep · Open source · MIT</p>
        <div className="flex gap-5">
          <Link href="/docs" className="py-1 font-mono text-[11px] font-bold text-[#151515]/40 hover:text-[#151515]">Docs</Link>
          <Link href="/brand" className="py-1 font-mono text-[11px] font-bold text-[#151515]/40 hover:text-[#151515]">Brand</Link>
          <Link href="https://github.com/ThoBustos/learnrep" target="_blank" rel="noopener noreferrer" className="py-1 font-mono text-[11px] font-bold text-[#151515]/40 hover:text-[#151515]">GitHub</Link>
        </div>
      </footer>

    </div>
  )
}
