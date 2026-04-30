'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BookOpen, Check, Copy, ExternalLink } from 'lucide-react'
import { GitHubStarButton } from '@/components/ui/GitHubStarButton'
import { cn } from '@/lib/utils'

const INSTALL_CMD = 'npm install -g learnrep'

const AGENTS = ['Claude Code', 'Codex CLI', 'Amp', 'Gemini CLI', 'Copilot CLI', 'Aider', 'Goose', 'Cline']

type TerminalLine =
  | { type: 'prompt'; text: string }
  | { type: 'agent'; text: string }
  | { type: 'info'; text: string }
  | { type: 'success'; text: string }
  | { type: 'url'; text: string }
  | { type: 'gap' }

const SEQUENCE: { delay: number; line: TerminalLine }[] = [
  { delay: 400,  line: { type: 'prompt',  text: '$ claude "quiz my team on react hooks"' } },
  { delay: 1000, line: { type: 'info',    text: 'Running learnrep...' } },
  { delay: 1600, line: { type: 'agent',   text: '> lr generate "react hooks" --questions 5' } },
  { delay: 2400, line: { type: 'gap' } },
  { delay: 2500, line: { type: 'success', text: '✓ React Hooks: State, Effects, and Closures' } },
  { delay: 3000, line: { type: 'url',     text: 'https://learnrep.ai/quiz/abc123/take' } },
  { delay: 3600, line: { type: 'gap' } },
  { delay: 3700, line: { type: 'info',    text: 'Share with your team -> they\'ll see who scored highest' } },
]

type QuestionDef = {
  id: number
  prompt: string
  options: string[]
  correctIndex: number
  feedback: string
}

const QUESTIONS: QuestionDef[] = [
  {
    id: 1,
    prompt: 'In React, what does the `key` prop on list items primarily help with?',
    options: [
      'Styling list items independently',
      'Reconciling which items changed between renders',
      'Creating unique IDs for form inputs',
      'Registering event handlers on each item',
    ],
    correctIndex: 1,
    feedback: 'React uses `key` to track list items across re-renders. Without it, React can\'t tell which items were added, removed, or reordered, leading to subtle bugs and performance issues.',
  },
  {
    id: 2,
    prompt: 'Which Git command shows who last modified each line of a file?',
    options: [
      'git log --lines',
      'git diff --author',
      'git blame',
      'git show --per-line',
    ],
    correctIndex: 2,
    feedback: '`git blame <file>` annotates each line with the commit hash, author, and timestamp of the last change. Essential for tracking down when a bug was introduced.',
  },
  {
    id: 3,
    prompt: 'What does `npm ci` do differently from `npm install`?',
    options: [
      'Only installs devDependencies',
      'Installs from package-lock.json without modifying it',
      'Clears the npm cache before installing',
      'Runs install in a temporary directory',
    ],
    correctIndex: 1,
    feedback: '`npm ci` reads exactly from package-lock.json and errors if it doesn\'t match package.json. Reproducible, strict, and faster. The right command for CI/CD.',
  },
]

const LETTERS = ['A', 'B', 'C', 'D']

export default function HomePage() {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [installCopied, setInstallCopied] = useState(false)

  const { data: stars } = useQuery<number | null>({
    queryKey: ['github-stars'],
    queryFn: () =>
      fetch('https://api.github.com/repos/ThoBustos/learnrep')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => (d ? (d.stargazers_count as number) : null))
        .catch(() => null),
    staleTime: 1000 * 60 * 60,
  })

  useMountEffect(() => {
    SEQUENCE.forEach(({ delay, line }) => {
      setTimeout(() => setTerminalLines((prev) => [...prev, line]), delay)
    })
  })

  function copyInstall() {
    navigator.clipboard.writeText(INSTALL_CMD).catch(() => {})
    setInstallCopied(true)
    setTimeout(() => setInstallCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#151515]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#151515]/10 bg-[#fafaf8]/90 px-6 py-4 backdrop-blur-sm sm:px-10">
        <div className="flex items-center gap-2.5">
          <Image src="/logos/logo.svg" alt="LearnRep" width={44} height={44} className="size-11" />
          <span className="text-lg font-black tracking-[-0.03em]">LearnRep</span>
        </div>
        <nav className="flex items-center gap-5">
          <Link
            href="/docs"
            className="hidden items-center gap-1.5 rounded-[0.9rem] border-[3px] border-[#151515] bg-white px-3 py-2 font-mono text-[10px] font-black shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5 sm:flex"
          >
            <BookOpen className="size-3" />
            Docs
          </Link>
          <div className="hidden sm:flex">
            <GitHubStarButton stars={stars} />
          </div>
          <Link
            href="/login"
            className="rounded-[0.6rem] border-[2.5px] border-[#151515] bg-[#ffd426] px-4 py-1.5 font-mono text-[11px] font-black uppercase tracking-widest text-[#151515] shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5"
          >
            Sign in
          </Link>
        </nav>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border-[2px] border-[#151515] bg-[#ffd426] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest">
            CLI tool for AI agents
          </div>

          <h1 className="text-[clamp(2.6rem,5.5vw,4rem)] font-black leading-[1.0] tracking-[-0.05em]">
            Generate a quiz.
            <br />
            Share it with
            <br />
            <span className="relative inline-block">
              your team.
              <span className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#ffd426]" />
            </span>
          </h1>

          <p className="max-w-sm text-base leading-relaxed text-[#151515]/60">
            One command from your agent or terminal. A live link your whole team can take.
            See who scores highest.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="group relative overflow-hidden rounded-[0.9rem] bg-[#151515] shadow-[0_8px_24px_rgba(21,21,21,0.18)]">
              <div className="px-4 py-3 pr-12">
                <code className="font-mono text-sm font-bold text-[#ffd426]">{INSTALL_CMD}</code>
              </div>
              <button
                type="button"
                onClick={copyInstall}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-[0.5rem] border-[2px] border-[#ffd426]/40 bg-white/10 text-[#ffd426] transition-all hover:border-[#ffd426]/70 hover:bg-white/20"
              >
                {installCopied ? <Check className="size-3.5 text-[#d9ff69]" /> : <Copy className="size-3.5" />}
              </button>
            </div>
            <Link href="/login" className="font-mono text-sm font-bold text-[#151515]/50 hover:text-[#151515]">
              or sign in
            </Link>
          </div>

          {/* Agent badge strip */}
          <div className="flex flex-col gap-2 pt-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#151515]/40">Works inside</p>
            <div className="flex flex-wrap gap-1.5">
              {AGENTS.map((name) => (
                <span
                  key={name}
                  className="rounded-full border-[2px] border-[#151515]/20 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#151515]/60"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — terminal + quiz preview */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-[1.3rem] bg-[#151515] shadow-[8px_8px_0_#ffd426]">
            <div className="flex items-center gap-2 border-b-[3px] border-[#151515] bg-[#151515] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-[#ff6b62]" />
                <div className="size-3 rounded-full bg-[#ffd426]" />
                <div className="size-3 rounded-full bg-[#d9ff69]" />
              </div>
              <span className="ml-2 font-mono text-[11px] font-bold text-white/40">zsh · 80×24</span>
            </div>
            <div className="min-h-[160px] bg-[#151515] px-5 py-4">
              {terminalLines.map((line, i) => {
                if (line.type === 'gap') return <div key={i} className="h-3" />
                return (
                  <div key={i} className="mb-1">
                    <span className={cn(
                      'font-mono text-sm leading-relaxed',
                      line.type === 'prompt' && 'font-bold text-[#ffd426]',
                      line.type === 'agent' && 'font-bold text-white/70',
                      line.type === 'info' && 'text-white/50',
                      line.type === 'success' && 'font-bold text-[#d9ff69]',
                      line.type === 'url' && 'font-bold text-[#7bd8ef] underline',
                    )}>
                      {line.text}
                    </span>
                  </div>
                )
              })}
              <span className="inline-block h-4 w-2 animate-pulse bg-[#ffd426] align-middle" />
            </div>
          </div>

          <div className="rounded-[1.3rem] border-[3px] border-[#151515] bg-[#ffd426] p-4 shadow-[5px_5px_0_#151515]">
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#151515]/60">
              Then in your browser
            </p>
            <p className="mt-2 text-lg font-black leading-snug">React Hooks: State, Effects, and Closures</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 rounded-[0.6rem] border-[2px] border-[#151515] bg-white px-3 py-2">
                <p className="font-mono text-xs font-bold text-[#151515]/60">5 questions · medium · 0 attempts</p>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-[0.6rem] border-[2.5px] border-[#151515] bg-[#151515]">
                <ExternalLink className="size-4 text-[#ffd426]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section className="border-t-[3px] border-[#151515]/10 bg-white px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: '⚡', title: 'One command to generate', body: 'lr generate "topic". A live quiz URL in your terminal in seconds.', bg: 'bg-[#ffd426]' },
              { icon: '🔗', title: 'Share with anyone', body: 'Send the link to your team, a friend, or make it public. No account required to take it.', bg: 'bg-[#d9ff69]' },
              { icon: '🏆', title: 'Compete on the leaderboard', body: 'Every attempt is ranked. See who scored highest and who improved the most.', bg: 'bg-[#7bd8ef]' },
            ].map((f) => (
              <div key={f.title} className={cn('rounded-[1.3rem] border-[3px] border-[#151515] p-6 shadow-[5px_5px_0_#151515]', f.bg)}>
                <div className="mb-4 text-4xl">{f.icon}</div>
                <h3 className="text-xl font-black">{f.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#151515]/60">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ONBOARDING QUIZ ──────────────────────────────────────────────────── */}
      <OnboardingSection />

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between border-t-[3px] border-[#151515]/10 bg-[#fafaf8] px-6 py-5 sm:px-10">
        <p className="font-mono text-[11px] font-bold text-[#151515]/40">LearnRep · Open source · MIT</p>
        <div className="flex gap-5">
          <Link href="/docs" className="font-mono text-[11px] font-bold text-[#151515]/40 hover:text-[#151515]">Docs</Link>
          <Link href="/brand" className="font-mono text-[11px] font-bold text-[#151515]/40 hover:text-[#151515]">Brand</Link>
          <Link href="https://github.com/ThoBustos/learnrep" target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] font-bold text-[#151515]/40 hover:text-[#151515]">GitHub</Link>
        </div>
      </footer>

    </div>
  )
}

// ─── Onboarding quiz section ──────────────────────────────────────────────────

type QuizPhase = 'question' | 'feedback'

function OnboardingSection() {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase] = useState<QuizPhase>('question')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const question = QUESTIONS[questionIndex]
  const isLast = questionIndex === QUESTIONS.length - 1
  const total = QUESTIONS.length

  function handleSubmit() {
    if (selectedOption === null) return
    setAnswers((a) => [...a, { correct: selectedOption === question.correctIndex }])
    setPhase('feedback')
  }

  function handleNext() {
    if (isLast) {
      setDone(true)
    } else {
      setQuestionIndex((i) => i + 1)
      setSelectedOption(null)
      setPhase('question')
    }
  }

  function copyCLI() {
    navigator.clipboard.writeText(INSTALL_CMD).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const correctCount = answers.filter((a) => a.correct).length
  const pct = Math.round((correctCount / total) * 100)
  const isHigh = pct >= 67
  const progress = ((questionIndex + (phase === 'feedback' ? 1 : 0)) / total) * 100

  return (
    <section className="relative overflow-hidden bg-[#ffd426] px-6 py-16 sm:px-10">
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(#151515_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {!done ? (
          <>
            {/* Section header */}
            <div className="mb-8 text-center">
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#151515]/50">
                No account needed
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                See what your
                <br />
                team will take.
              </h2>
              <p className="mt-3 font-mono text-sm font-bold text-[#151515]/60">
                Three questions. This is what lr generate produces.
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#151515]/20">
                <div
                  className="h-full rounded-full bg-[#151515] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#151515]/50">
                Q{questionIndex + 1} of {total}
              </p>
            </div>

            {/* Question card */}
            <div className="rounded-[1.5rem] border-[3px] border-[#151515] bg-white/90 p-6 shadow-[6px_6px_0_#151515]">
              <p className="text-xl font-black leading-snug sm:text-2xl">{question.prompt}</p>
            </div>

            {/* Feedback */}
            {phase === 'feedback' && (
              <div className={cn(
                'mt-4 rounded-[1rem] border-[3px] border-[#151515] p-4 shadow-[4px_4px_0_#151515]',
                selectedOption === question.correctIndex ? 'bg-[#d9ff69]' : 'bg-[#ff6b62]'
              )}>
                <p className={cn('text-sm font-black', selectedOption === question.correctIndex ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
                  {selectedOption === question.correctIndex ? 'Correct!' : 'Not quite.'}
                </p>
                <p className={cn('mt-1 text-sm leading-relaxed', selectedOption === question.correctIndex ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
                  {question.feedback}
                </p>
              </div>
            )}

            {/* Options */}
            <div className="mt-4 flex flex-col gap-2.5">
              {question.options.map((option, i) => {
                const isSelected = selectedOption === i
                const isCorrect = i === question.correctIndex
                let cardStyle = 'bg-white/85 border-[#151515]'
                let letterStyle = 'bg-[#f5f4f0] text-[#151515]'
                if (phase === 'question' && isSelected) {
                  cardStyle = 'bg-[#ffd426] border-[#151515] shadow-[4px_4px_0_#151515]'
                  letterStyle = 'bg-[#151515] text-[#ffd426]'
                } else if (phase === 'feedback' && isCorrect) {
                  cardStyle = 'bg-[#d9ff69] border-[#1e6f38]'
                  letterStyle = 'bg-[#1e6f38] text-[#d9ff69]'
                } else if (phase === 'feedback' && isSelected && !isCorrect) {
                  cardStyle = 'bg-[#ff6b62] border-[#9c231d]'
                  letterStyle = 'bg-[#9c231d] text-[#ff6b62]'
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={phase !== 'question'}
                    onClick={() => setSelectedOption(i)}
                    className={cn(
                      'flex items-center gap-4 rounded-[1rem] border-[3px] p-4 text-left shadow-[3px_3px_0_#151515] transition-all',
                      cardStyle,
                      phase === 'question' && 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#151515]',
                      phase !== 'question' && 'cursor-default',
                    )}
                  >
                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#151515] font-mono text-xs font-black', letterStyle)}>
                      {LETTERS[i]}
                    </span>
                    <span className="text-sm font-black">{option}</span>
                  </button>
                )
              })}
            </div>

            {/* Action button */}
            <div className="mt-4">
              {phase === 'question' ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className={cn(
                    'w-full rounded-[1rem] border-[3px] border-[#151515] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-all',
                    selectedOption !== null ? 'bg-[#151515] text-[#ffd426] hover:-translate-y-0.5' : 'cursor-not-allowed bg-[#151515]/20 text-[#151515]/40',
                  )}
                >
                  Submit Answer
                </button>
              ) : isLast ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-4 text-lg font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5"
                >
                  See Results
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#ffd426] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-transform hover:-translate-y-0.5"
                >
                  Next Question <ArrowRight className="inline size-5" />
                </button>
              )}
            </div>
          </>
        ) : (
          /* ── Score + CTA ──────────────────────────────────────────────────── */
          <div className="flex flex-col items-center gap-6">
            {/* Score hero */}
            <div className={cn(
              'flex w-full flex-col items-center gap-3 rounded-[1.5rem] border-[3px] border-[#151515] py-10 shadow-[7px_7px_0_#151515]',
              isHigh ? 'bg-[#d9ff69]' : 'bg-white/90',
            )}>
              {isHigh && (
                <span className="rounded-full border-[2.5px] border-[#1e6f38] bg-[#151515] px-4 py-1 font-mono text-[11px] font-black uppercase tracking-widest text-[#d9ff69]">
                  Nice work!
                </span>
              )}
              <p className={cn('text-[5rem] font-black leading-none tracking-[-0.06em]', isHigh ? 'text-[#1e6f38]' : 'text-[#151515]')}>
                {pct}%
              </p>
              <p className={cn('text-base font-black', isHigh ? 'text-[#1e6f38]' : 'text-[#67606a]')}>
                {correctCount} of {total} correct
              </p>
            </div>

            {/* Bridge copy + install */}
            <div className="w-full rounded-[1.3rem] border-[3px] border-[#151515] bg-white/90 p-6 shadow-[5px_5px_0_#151515]">
              <p className="text-lg font-black">You just took a LearnRep quiz.</p>
              <p className="mt-1 font-mono text-sm font-bold text-[#151515]/60">
                Generate your own on any topic in one command.
              </p>
              <div className="mt-4 flex overflow-hidden rounded-[0.9rem] border-[3px] border-[#151515] shadow-[3px_3px_0_#151515]">
                <div className="flex-1 bg-[#151515] px-4 py-3">
                  <code className="font-mono text-sm font-bold text-[#ffd426]">{INSTALL_CMD}</code>
                </div>
                <button
                  type="button"
                  onClick={copyCLI}
                  className="flex items-center gap-1.5 border-l-[3px] border-[#151515] bg-white px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-[#ffd426]"
                >
                  {copied ? <Check className="size-3.5 text-[#1e6f38]" /> : <Copy className="size-3.5" />}
                </button>
              </div>
              <p className="mt-3 font-mono text-[10px] font-bold text-[#151515]/40">
                Then: <code>lr generate &quot;your topic&quot;</code>
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/login"
              className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-4 text-center text-lg font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5"
            >
              Create account <ArrowRight className="inline size-5" />
            </Link>
            <Link href="/docs" className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#151515]/50 hover:text-[#151515]">
              Read the docs
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
