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

const HERO_TICKETS = [
  { label: 'Quiz ready', value: 'Live URL', className: 'border-[var(--lr-blue-dark)] bg-[var(--lr-blue)] text-[var(--lr-blue-dark)]' },
  { label: 'Practice set', value: '5 questions', className: 'border-[var(--lr-line)] bg-[var(--lr-yolk)] text-[var(--lr-ink)]' },
  { label: 'Team score', value: '+20%', className: 'border-[var(--lr-line)] bg-[var(--lr-tomato)] text-[var(--lr-ink)]' },
]

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
    <div className="min-h-screen bg-[var(--lr-notebook)] text-[var(--lr-ink)]" style={pageStyle}>

      <LandingNav stars={stars} />

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:px-10 md:grid-cols-2 md:items-center lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-6">
          <HeroBadge label="CLI tool for AI agents" />

          <h1 className="text-5xl font-black leading-none tracking-normal sm:text-6xl">
            Generate a quiz.
            <br />
            Share it with
            <br />
            <span className="relative inline-block">
              your team.
              <span className="absolute -bottom-1 left-0 h-[5px] w-full bg-[var(--lr-yolk)]" />
            </span>
          </h1>

          <p className="text-base leading-relaxed text-[var(--lr-muted)]">
            One command from your agent or terminal. A live link your whole team can take.
            See who scores highest.
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            {HERO_TICKETS.map((ticket) => (
              <div
                key={ticket.label}
                className={`${ticket.className} border-[3px] px-3 py-2 shadow-[2px_2px_0_var(--lr-line)]`}
              >
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] opacity-75">{ticket.label}</p>
                <p className="mt-1 text-sm font-black">{ticket.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <InstallCommand command={INSTALL_CMD} />
          </div>

          <AgentBadgeStrip agents={AGENTS} />
        </div>

        <div className="flex flex-col gap-4">
          <TerminalWindow sequence={SEQUENCE} />
          <QuizPreviewCard
            title="React Hooks: State, Effects, and Closures"
            meta="5 questions · medium · 0 attempts"
          />
        </div>
      </section>

      <OnboardingQuiz questions={QUESTIONS} />

      <HowItWorks />

      <footer className="flex flex-col gap-3 border-t-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="font-mono text-[11px] font-bold text-[var(--lr-muted)]">LearnRep · Open source · MIT</p>
        <div className="flex gap-5">
          <Link href="/docs" className="py-1 font-mono text-[11px] font-bold text-[var(--lr-muted)] hover:text-[var(--lr-ink)]">Docs</Link>
          <Link href="/brand" className="py-1 font-mono text-[11px] font-bold text-[var(--lr-muted)] hover:text-[var(--lr-ink)]">Brand</Link>
          <Link href="https://github.com/ThoBustos/learnrep" target="_blank" rel="noopener noreferrer" className="py-1 font-mono text-[11px] font-bold text-[var(--lr-muted)] hover:text-[var(--lr-ink)]">GitHub</Link>
        </div>
      </footer>

    </div>
  )
}
