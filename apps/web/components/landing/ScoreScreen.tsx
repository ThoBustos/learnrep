'use client'

import Link from 'next/link'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InstallCommand } from './InstallCommand'

type Props = { pct: number; correct: number; total: number; onRetry: () => void }

export function ScoreScreen({ pct, correct, total, onRetry }: Props) {
  const isHigh = pct >= 67

  return (
    <div className="flex flex-col items-center gap-6" aria-live="polite">
      <div className={cn(
        'flex w-full flex-col items-center gap-3 border-[3px] border-[var(--lr-line)] py-10 shadow-[7px_7px_0_var(--lr-line)]',
        isHigh ? 'bg-[var(--lr-green)]' : 'bg-white/90',
      )}>
        {isHigh && (
          <span className="rounded-full border-[2.5px] border-[var(--lr-green-dark)] bg-[var(--lr-ink)] px-4 py-1 font-mono text-[11px] font-black uppercase tracking-widest text-[var(--lr-green)]">
            Nice work!
          </span>
        )}
        <p className={cn('text-6xl font-black leading-none tracking-normal sm:text-7xl', isHigh ? 'text-[var(--lr-green-dark)]' : 'text-[var(--lr-ink)]')}>
          {pct}%
        </p>
        <p className={cn('text-base font-black', isHigh ? 'text-[var(--lr-green-dark)]' : 'text-[var(--lr-muted)]')}>
          {correct} of {total} correct
        </p>
      </div>

      <div className="w-full border-[3px] border-[var(--lr-line)] bg-white/90 p-6 shadow-[5px_5px_0_var(--lr-line)]">
        <p className="text-lg font-black">You just took a LearnRep quiz.</p>
        <p className="mt-1 font-mono text-sm font-bold text-[var(--lr-muted)]">
          Generate your own on any topic in one command.
        </p>
        <div className="mt-4">
          <InstallCommand command="npm install -g learnrep" />
        </div>
        <p className="mt-3 font-mono text-[10px] font-bold text-[var(--lr-muted)]">
          Then: ask your agent to build any quiz with the CLI
        </p>
      </div>

      <Link
        href="/login"
        className="w-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] py-4 text-center text-lg font-black text-[var(--lr-yolk)] shadow-[4px_4px_0_var(--lr-tomato)] transition-transform hover:-translate-y-0.5"
      >
        Create account <ArrowRight className="inline size-5" />
      </Link>
      <div className="flex gap-6">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--lr-muted)] hover:text-[var(--lr-ink)]"
        >
          <RotateCcw className="size-3" />
          Try again
        </button>
        <Link href="/docs" className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--lr-muted)] hover:text-[var(--lr-ink)]">
          Read the docs
        </Link>
      </div>
    </div>
  )
}
