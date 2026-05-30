import type { CSSProperties } from 'react'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroBadge } from '@/components/landing/HeroBadge'
import { TerminalWindow } from '@/components/landing/TerminalWindow'
import { InstallCommand } from '@/components/landing/InstallCommand'
import { OnboardingQuiz } from '@/components/landing/OnboardingQuiz'
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
    <div className="min-h-screen bg-[var(--lr-paper)] text-[var(--lr-ink)]" style={pageStyle}>
      <LandingNav stars={stars} />

      <main className="relative overflow-hidden bg-[var(--lr-notebook)]">
        <div className="pointer-events-none absolute inset-0 z-0 bg-ruled-paper opacity-70" />
        <div className="relative z-10">
          <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:px-10 md:grid-cols-[0.86fr_1.14fr] md:items-center lg:gap-16 lg:py-20">
            <div className="flex flex-col gap-6">
              <HeroBadge label="CLI tool for AI agents" />

              <h1 className="max-w-xl text-4xl font-black leading-none tracking-normal sm:text-5xl lg:text-6xl">
                Turn any
                <br />
                <span className="relative inline-block">
                  session into
                  <span className="absolute -bottom-1 left-0 h-[5px] w-full bg-[var(--lr-yolk)]" />
                </span>
                <br />
                a real quiz.
              </h1>

              <p className="max-w-lg text-base font-medium leading-relaxed text-[var(--lr-muted)]">
                Run one command from your terminal or agent. LearnRep turns the work into a shareable quiz your team can take in the app.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <InstallCommand command={INSTALL_CMD} />
              </div>
            </div>

            <div className="min-w-0">
              <TerminalWindow sequence={SEQUENCE} />
            </div>
          </section>

          <OnboardingQuiz questions={QUESTIONS} />
        </div>
      </main>

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
