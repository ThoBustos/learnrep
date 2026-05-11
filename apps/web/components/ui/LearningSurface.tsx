import type { ReactNode } from 'react'
import Link from 'next/link'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

type MetricTone = 'ink' | 'paper' | 'yolk' | 'teal' | 'tomato'

const metricTones: Record<MetricTone, string> = {
  ink:    'bg-[var(--lr-ink)] text-[var(--lr-paper)]',
  paper:  'bg-[var(--lr-paper)] text-[var(--lr-ink)]',
  yolk:   'bg-[var(--lr-yolk)] text-[var(--lr-ink)]',
  teal:   'bg-[var(--lr-teal)] text-white',
  tomato: 'bg-[var(--lr-tomato)] text-white',
}

const difficultyTones: Record<string, string> = {
  easy:   'border-[var(--lr-green-dark)] bg-[var(--lr-green)] text-[var(--lr-green-dark)]',
  medium: 'border-[var(--lr-blue-dark)] bg-[var(--lr-blue)] text-[var(--lr-blue-dark)]',
  hard:   'border-[var(--lr-red-dark)] bg-[var(--lr-red)] text-[var(--lr-red-dark)]',
  expert: 'border-[var(--lr-purple-dark)] bg-[var(--lr-purple)] text-[var(--lr-purple-dark)]',
}

export function DashboardCanvas({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex w-full flex-1 flex-col gap-5 p-4 sm:p-5 lg:p-8">
      {children}
    </div>
  )
}

export function MetricTicketGrid({
  children,
}: {
  children: ReactNode
}) {
  return <div className="grid gap-3 md:grid-cols-3">{children}</div>
}

export function WorkbookPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('min-w-0 border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] shadow-[6px_6px_0_var(--lr-line)]', className)}>
      {children}
    </section>
  )
}

export function WorkbookPanelHeader({
  kicker,
  title,
}: {
  kicker: string
  title: string
}) {
  return (
    <div className="border-b-[3px] border-[var(--lr-line)] px-4 py-3">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[var(--lr-tomato)]">{kicker}</p>
      <h2 className="text-xl font-black tracking-[-0.03em]">{title}</h2>
    </div>
  )
}

export function WorkbookList({
  children,
}: {
  children: ReactNode
}) {
  return <div className="grid gap-3 p-3">{children}</div>
}

export function WorkbookEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="grid min-h-44 place-items-center px-4 py-10 text-center">
      <div>
        <p className="text-xl font-black">{title}</p>
        <p className="mt-2 font-mono text-xs font-bold text-[var(--lr-muted)]">{description}</p>
      </div>
    </div>
  )
}

export function MetricTicket({
  value,
  label,
  tone = 'paper',
  meta,
  className,
}: {
  value: string
  label: string
  tone?: MetricTone
  meta?: string
  className?: string
}) {
  return (
    <div className={cn('relative min-h-32 overflow-hidden border-[3px] border-[var(--lr-line)] p-4 shadow-[4px_4px_0_var(--lr-line)]', metricTones[tone], className)}>
      <span className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-notebook)]" />
      <span className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-notebook)]" />
      <p className="text-4xl font-black leading-none tracking-[-0.04em]">{value}</p>
      <p className="mt-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] opacity-75">{label}</p>
      {meta && <p className="mt-4 font-mono text-[10px] font-bold opacity-60">{meta}</p>}
    </div>
  )
}

export function PromptCard({
  kicker,
  prompt,
  copied,
  onCopy,
  className,
}: {
  kicker: string
  prompt: string
  copied: boolean
  onCopy: () => void
  className?: string
}) {
  return (
    <div className={cn('relative border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)] p-5 shadow-[6px_6px_0_var(--lr-line)]', className)}>
      <div className="absolute -top-3 left-5 border-[3px] border-[var(--lr-line)] bg-[var(--lr-tomato)] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white">
        {kicker}
      </div>
      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <p className="min-w-0 break-words font-mono text-sm font-black leading-6 text-[var(--lr-ink)]">
          &ldquo;{prompt}&rdquo;
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="flex w-full items-center justify-center gap-2 border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-4 py-3 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[var(--lr-ink)] shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5 lg:w-auto"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export function WorkbookActionLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn('border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)] px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[var(--lr-ink)] shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5', className)}
    >
      {children}
    </Link>
  )
}

export function QuizFeedRow({
  href,
  title,
  topic,
  difficulty,
  questionCount,
  attemptCount,
  bestScore,
}: {
  href: string
  title: string
  topic: string
  difficulty: string
  questionCount: number
  attemptCount: number
  bestScore: number | null
}) {
  return (
    <div className="grid gap-3 border-[3px] border-[var(--lr-line)] bg-white p-3 transition-transform hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="min-w-0 truncate text-base font-black">{title}</p>
          <DifficultyStamp difficulty={difficulty} />
        </div>
        <p className="mt-1 font-mono text-[11px] font-bold text-[var(--lr-muted)]">
          {topic} · {questionCount}q · {attemptCount} attempts
        </p>
      </div>

      <div className="grid gap-2 sm:w-44">
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[var(--lr-muted)]">
          <span>Best score</span>
          <span>{bestScore != null ? `${bestScore}%` : '--'}</span>
        </div>
        {bestScore != null && (
          <ProgressMeter value={bestScore} tone={bestScore >= 80 ? 'mint' : bestScore >= 60 ? 'teal' : 'tomato'} />
        )}
      </div>

      <div className="flex justify-end sm:col-span-2">
        <WorkbookActionLink href={href}>Open slip</WorkbookActionLink>
      </div>
    </div>
  )
}

export function DifficultyStamp({
  difficulty,
  className,
}: {
  difficulty: string
  className?: string
}) {
  const tone = difficultyTones[difficulty] ?? difficultyTones.medium

  return (
    <span className={cn('inline-flex rotate-[-1deg] border-[2px] px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-[0.12em]', tone, className)}>
      {difficulty}
    </span>
  )
}

export function ProgressMeter({
  value,
  tone = 'teal',
  className,
}: {
  value: number
  tone?: 'teal' | 'tomato' | 'cobalt' | 'mint'
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const fills = {
    teal: 'bg-[var(--lr-teal)]',
    tomato: 'bg-[var(--lr-tomato)]',
    cobalt: 'bg-[var(--lr-cobalt)]',
    mint: 'bg-[var(--lr-mint)]',
  }

  return (
    <div className={cn('h-3 border-[2px] border-[var(--lr-line)] bg-white', className)}>
      <div className={cn('h-full', fills[tone])} style={{ width: `${clamped}%` }} />
    </div>
  )
}
