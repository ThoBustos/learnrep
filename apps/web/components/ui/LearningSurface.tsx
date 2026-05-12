import type { ComponentType, ReactNode } from 'react'
import Link from 'next/link'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

type MetricTone = 'ink' | 'paper' | 'yolk' | 'teal' | 'tomato'
type ButtonTone = 'paper' | 'yolk' | 'ink' | 'teal' | 'green' | 'red'
type StampTone = 'paper' | 'yolk' | 'teal' | 'green' | 'red' | 'ink'
type IconSize = 'xs' | 'sm' | 'md' | 'lg'
type LearningIconComponent = ComponentType<{ className?: string; size?: number }>

const iconPixelSizes: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 30,
}

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

const buttonTones: Record<ButtonTone, string> = {
  paper: 'bg-[var(--lr-paper)] text-[var(--lr-ink)] shadow-[3px_3px_0_var(--lr-line)]',
  yolk:  'bg-[var(--lr-yolk)] text-[var(--lr-ink)] shadow-[3px_3px_0_var(--lr-line)]',
  ink:   'bg-[var(--lr-ink)] text-[var(--lr-yolk)] shadow-[4px_4px_0_var(--lr-tomato)]',
  teal:  'bg-[var(--lr-blue)] text-[var(--lr-blue-dark)] shadow-[3px_3px_0_var(--lr-line)]',
  green: 'bg-[var(--lr-green)] text-[var(--lr-green-dark)] shadow-[3px_3px_0_var(--lr-line)]',
  red:   'border-[var(--lr-red-dark)] bg-[var(--lr-red)]/20 text-[var(--lr-red-dark)] shadow-[3px_3px_0_var(--lr-red-dark)]',
}

const stampTones: Record<StampTone, string> = {
  paper: 'border-[var(--lr-line)] bg-[var(--lr-paper)] text-[var(--lr-ink)]',
  yolk:  'border-[var(--lr-line)] bg-[var(--lr-yolk)] text-[var(--lr-ink)]',
  teal:  'border-[var(--lr-blue-dark)] bg-[var(--lr-blue)] text-[var(--lr-blue-dark)]',
  green: 'border-[var(--lr-green-dark)] bg-[var(--lr-green)] text-[var(--lr-green-dark)]',
  red:   'border-[var(--lr-red-dark)] bg-[var(--lr-red)] text-[var(--lr-red-dark)]',
  ink:   'border-[var(--lr-line)] bg-[var(--lr-ink)] text-[var(--lr-yolk)]',
}

function SurfaceIcon({
  icon: Icon,
  size = 'sm',
  className,
}: {
  icon: LearningIconComponent
  size?: IconSize
  className?: string
}) {
  return <Icon size={iconPixelSizes[size]} className={cn('shrink-0', className)} />
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

export function PageTitle({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-4xl font-black tracking-[-0.05em]">{title}</h1>
    </div>
  )
}

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <p className="font-mono text-xs font-bold text-[var(--lr-muted)]">{label}</p>
}

export function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--lr-muted)]">{label}</p>
    </div>
  )
}

export function BackLink({
  href,
  children,
  icon,
  iconSize = 'xs',
}: {
  href: string
  children: ReactNode
  icon?: LearningIconComponent
  iconSize?: IconSize
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-muted)] hover:text-[var(--lr-ink)]"
    >
      {icon && <SurfaceIcon icon={icon} size={iconSize} />}
      {children}
    </Link>
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
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="grid min-h-44 place-items-center px-4 py-10 text-center">
      <div>
        <p className="text-xl font-black">{title}</p>
        <p className="mt-2 font-mono text-xs font-bold text-[var(--lr-muted)]">{description}</p>
        {action && <div className="mt-5 flex justify-center">{action}</div>}
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
          <SurfaceIcon icon={copied ? Check : Copy} size="xs" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export function WorkbookActionLink({
  href,
  children,
  tone = 'yolk',
  icon,
  iconSize = 'xs',
  className,
}: {
  href: string
  children: ReactNode
  tone?: ButtonTone
  icon?: LearningIconComponent
  iconSize?: IconSize
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn('inline-flex items-center justify-center gap-1.5 border-[3px] border-[var(--lr-line)] px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5', buttonTones[tone], className)}
    >
      {icon && <SurfaceIcon icon={icon} size={iconSize} />}
      {children}
    </Link>
  )
}

export function WorkbookButton({
  children,
  onClick,
  disabled,
  tone = 'paper',
  icon,
  iconSize = 'sm',
  title,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  tone?: ButtonTone
  icon?: LearningIconComponent
  iconSize?: IconSize
  title?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn('inline-flex items-center justify-center gap-2 border-[3px] border-[var(--lr-line)] px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 disabled:opacity-50', buttonTones[tone], className)}
    >
      {icon && <SurfaceIcon icon={icon} size={iconSize} />}
      {children}
    </button>
  )
}

export function IconButton({
  icon,
  iconSize = 'sm',
  onClick,
  title,
}: {
  icon: LearningIconComponent
  iconSize?: IconSize
  onClick: () => void
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex size-9 items-center justify-center border-[3px] border-[var(--lr-line)] bg-white transition-transform hover:-translate-y-0.5"
    >
      <SurfaceIcon icon={icon} size={iconSize} />
    </button>
  )
}

export function StatusStamp({
  children,
  tone = 'paper',
}: {
  children: ReactNode
  tone?: StampTone
}) {
  return (
    <span className={cn('inline-flex border-[2px] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest', stampTones[tone])}>
      {children}
    </span>
  )
}

export function TopicAvatar({
  topic,
  difficulty,
}: {
  topic: string
  difficulty?: string
}) {
  const tone = difficulty ? difficultyTones[difficulty] ?? difficultyTones.medium : stampTones.yolk

  return (
    <div className={cn('flex size-12 shrink-0 items-center justify-center border-[3px]', tone)}>
      <span className="font-mono text-xs font-black uppercase">{topic.slice(0, 2)}</span>
    </div>
  )
}

export function QuizCollectionRow({
  title,
  topic,
  difficulty,
  questionCount,
  attemptCount,
  bestScore,
  dateLabel,
  status,
  actions,
}: {
  title: string
  topic: string
  difficulty: string
  questionCount: number
  attemptCount?: number
  bestScore?: number | null
  dateLabel?: string
  status?: { label: string; tone: StampTone }
  actions?: ReactNode
}) {
  return (
    <div className="border-[3px] border-[var(--lr-line)] bg-white/80 p-4 shadow-[4px_4px_0_var(--lr-line)]">
      <div className="flex flex-wrap items-start gap-3">
        <TopicAvatar topic={topic} difficulty={difficulty} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black">{title}</h3>
            {status && <StatusStamp tone={status.tone}>{status.label}</StatusStamp>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold text-[var(--lr-muted)]">
            <DifficultyStamp difficulty={difficulty} />
            <span>{questionCount} questions</span>
            {attemptCount != null && <span>{attemptCount} attempts</span>}
            {bestScore != null ? <StatusStamp tone="green">Best: {bestScore}%</StatusStamp> : null}
            {dateLabel && <span>{dateLabel}</span>}
          </div>
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
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

export function IconMetricCard({
  icon,
  label,
  value,
}: {
  icon: LearningIconComponent
  label: string
  value: string
}) {
  return (
    <div className="border-[3px] border-[var(--lr-line)] bg-white/70 p-5 shadow-[4px_4px_0_var(--lr-line)]">
      <div className="flex items-center gap-3">
        <span className="flex items-center text-3xl">
          <SurfaceIcon icon={icon} size="lg" />
        </span>
        <div>
          <p className="text-3xl font-black leading-none tracking-[-0.06em] text-[var(--lr-ink)]">{value}</p>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--lr-muted)]">{label}</p>
        </div>
      </div>
    </div>
  )
}

export function MiniMetricGrid({
  children,
}: {
  children: ReactNode
}) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{children}</div>
}

export function MiniMetric({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="border-[3px] border-[var(--lr-line)] bg-white/80 px-4 py-3 shadow-[3px_3px_0_var(--lr-line)]">
      <p className="text-xl font-black leading-none">{value}</p>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--lr-muted)]">{label}</p>
    </div>
  )
}

export function DeltaStamp({ value }: { value: number }) {
  return (
    <StatusStamp tone={value >= 0 ? 'green' : 'red'}>
      {value >= 0 ? '+' : ''}{value}%
    </StatusStamp>
  )
}

export function ScoreStamp({ value }: { value: number }) {
  return (
    <StatusStamp tone={value >= 80 ? 'green' : value >= 60 ? 'teal' : 'red'}>
      {value}%
    </StatusStamp>
  )
}

export function TopicScoreRow({
  topic,
  attempts,
  bestScore,
  improvement,
  maxScore,
}: {
  topic: string
  attempts: number
  bestScore: number
  improvement: number | null
  maxScore: number
}) {
  const pct = maxScore > 0 ? (bestScore / maxScore) * 100 : 0

  return (
    <div className="border-[3px] border-[var(--lr-line)] bg-white p-4 shadow-[3px_3px_0_var(--lr-line)]">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-black">{topic}</p>
            <span className="font-mono text-[10px] font-bold text-[var(--lr-muted)]">
              {attempts} attempt{attempts !== 1 ? 's' : ''}
            </span>
            {improvement !== null && <DeltaStamp value={improvement} />}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <ProgressMeter value={pct} tone={bestScore >= 80 ? 'mint' : bestScore >= 60 ? 'teal' : 'tomato'} className="flex-1" />
            <span className="shrink-0 font-mono text-xs font-black">{bestScore}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>
}

export function TextInput({
  value,
  onChange,
  onEnter,
  placeholder,
  mono,
}: {
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
  placeholder: string
  mono?: boolean
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && onEnter?.()}
      className={cn('border-[3px] border-[var(--lr-line)] bg-white px-4 py-3 text-sm font-black placeholder:font-mono placeholder:text-[11px] placeholder:font-bold placeholder:text-[var(--lr-muted)] focus:outline-none', mono && 'font-mono font-bold')}
    />
  )
}

export function SetupCard({
  icon,
  iconLabel,
  title,
  description,
  children,
}: {
  icon?: LearningIconComponent
  iconLabel?: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <WorkbookPanel className="p-6">
      <div className="flex size-12 items-center justify-center rounded-full bg-[var(--lr-ink)] text-[var(--lr-yolk)]">
        {icon ? <SurfaceIcon icon={icon} size="md" /> : <span className="font-black">{iconLabel}</span>}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-black">{title}</h2>
        <p className="mt-1 font-mono text-[11px] font-bold text-[var(--lr-muted)]">{description}</p>
      </div>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </WorkbookPanel>
  )
}

export function AlertPanel({ children }: { children: ReactNode }) {
  return (
    <div className="border-[3px] border-[var(--lr-red-dark)] bg-[var(--lr-red)]/20 px-4 py-3 sm:col-span-2">
      <p className="font-mono text-sm font-bold text-[var(--lr-red-dark)]">{children}</p>
    </div>
  )
}

export function MemberPill({
  name,
  role,
}: {
  name: string
  role: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)]/30 px-3 py-1.5">
      <div className="flex size-6 items-center justify-center rounded-full bg-[var(--lr-ink)] font-mono text-[9px] font-black text-[var(--lr-yolk)]">
        {name[0]?.toUpperCase() ?? '?'}
      </div>
      <span className="font-mono text-[10px] font-black">{name}</span>
      {role === 'owner' && <span className="font-mono text-[9px] font-bold text-[var(--lr-muted)]">owner</span>}
    </div>
  )
}

export function MemberPillList({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap gap-2">{children}</div>
}

export function TeamSummaryPanel({
  name,
  memberCount,
  children,
  action,
}: {
  name: string
  memberCount: number
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <WorkbookPanel className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--lr-muted)]">Your team</p>
          <h2 className="text-2xl font-black tracking-[-0.04em]">{name}</h2>
          <p className="mt-1 font-mono text-[10px] font-bold text-[var(--lr-muted)]">
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </p>
        </div>
        {action}
      </div>
      {children}
    </WorkbookPanel>
  )
}

export function TeamLeaderboardRow({
  rank,
  name,
  generated,
  taken,
  score,
}: {
  rank: number
  name: string
  generated: number
  taken: number
  score: number
}) {
  return (
    <div className="flex items-center gap-3 border-[3px] border-[var(--lr-line)] bg-white p-3 shadow-[3px_3px_0_var(--lr-line)]">
      <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[var(--lr-line)] font-mono text-xs font-black', rank === 1 ? 'bg-[var(--lr-yolk)]' : rank === 2 ? 'bg-[var(--lr-paper)]' : rank === 3 ? 'bg-[var(--lr-tomato)] text-white' : 'bg-white')}>
        {rank}
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--lr-ink)] font-mono text-[9px] font-black text-[var(--lr-yolk)]">
        {name[0]?.toUpperCase() ?? '?'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{name}</p>
        <p className="font-mono text-[10px] font-bold text-[var(--lr-muted)]">
          {generated} generated · {taken} taken
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-mono text-sm font-black">{score}</p>
        <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--lr-muted)]">pts</p>
      </div>
    </div>
  )
}

export function TeamEventRow({
  title,
  topic,
  difficulty,
  actor,
  description,
  href,
  score,
}: {
  title: string
  topic: string
  difficulty: string
  actor: string
  description: string
  href: string
  score?: number
}) {
  return (
    <div className="flex items-center gap-3 border-[3px] border-[var(--lr-line)] bg-white p-3 shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5">
      <TopicAvatar topic={topic} difficulty={difficulty} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{title}</p>
        <p className="font-mono text-[10px] font-bold text-[var(--lr-muted)]">
          {actor} {description}
        </p>
      </div>
      {score != null && <ScoreStamp value={score} />}
      <WorkbookActionLink href={href}>Go</WorkbookActionLink>
    </div>
  )
}

export function QuizHeroPanel({
  topic,
  difficulty,
  title,
  stats,
}: {
  topic: string
  difficulty: string
  title: string
  stats: { label: string; value: string | number }[]
}) {
  return (
    <WorkbookPanel className="p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusStamp tone="yolk">{topic}</StatusStamp>
        <DifficultyStamp difficulty={difficulty} />
      </div>
      <h1 className="text-3xl font-black leading-tight tracking-[-0.04em]">{title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--lr-muted)]">
            <span className="font-black text-[var(--lr-ink)]">{stat.value}</span> {stat.label}
          </div>
        ))}
      </div>
    </WorkbookPanel>
  )
}

export function ActionBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

export function AttemptRow({
  rank,
  displayName,
  attemptCount,
  dateLabel,
  delta,
  score,
}: {
  rank: number
  displayName: string
  attemptCount: number
  dateLabel: string
  delta: number | null
  score: number
}) {
  return (
    <div className={cn('flex items-center gap-3 border-[3px] border-[var(--lr-line)] p-3 shadow-[2px_2px_0_var(--lr-line)]', rank === 1 ? 'bg-[var(--lr-yolk)]' : 'bg-white')}>
      <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[var(--lr-line)] font-black text-sm', rank === 1 ? 'bg-[var(--lr-ink)] text-[var(--lr-yolk)]' : 'bg-[var(--lr-paper)]')}>
        {rank}
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--lr-ink)] font-mono text-[10px] font-black text-[var(--lr-yolk)]">
        {displayName[0]?.toUpperCase() ?? '?'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{displayName}</p>
        <p className="font-mono text-[10px] font-bold text-[var(--lr-muted)]">
          {attemptCount > 1 ? `${attemptCount} attempts · ` : ''}{dateLabel}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {delta !== null && <DeltaStamp value={delta} />}
        <p className="text-lg font-black">{score}%</p>
      </div>
    </div>
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
