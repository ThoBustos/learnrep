'use client'

import Link from 'next/link'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InstallCommand } from './InstallCommand'

type Props = { pct: number; correct: number; total: number; onRetry: () => void }

export function ScoreScreen({ pct, correct, total, onRetry }: Props) {
  const isHigh = pct >= 67

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={cn(
        'flex w-full flex-col items-center gap-3 rounded-[1.5rem] border-[3px] border-[#151515] py-10 shadow-[7px_7px_0_#151515]',
        isHigh ? 'bg-[#d9ff69]' : 'bg-white/90',
      )}>
        {isHigh && (
          <span className="rounded-full border-[2.5px] border-[#1e6f38] bg-[#151515] px-4 py-1 font-mono text-[11px] font-black uppercase tracking-widest text-[#d9ff69]">
            Nice work!
          </span>
        )}
        <p className={cn('text-[4rem] font-black leading-none tracking-[-0.06em] sm:text-[5rem]', isHigh ? 'text-[#1e6f38]' : 'text-[#151515]')}>
          {pct}%
        </p>
        <p className={cn('text-base font-black', isHigh ? 'text-[#1e6f38]' : 'text-[#67606a]')}>
          {correct} of {total} correct
        </p>
      </div>

      <div className="w-full rounded-[1.3rem] border-[3px] border-[#151515] bg-white/90 p-6 shadow-[5px_5px_0_#151515]">
        <p className="text-lg font-black">You just took a LearnRep quiz.</p>
        <p className="mt-1 font-mono text-sm font-bold text-[#151515]/60">
          Generate your own on any topic in one command.
        </p>
        <div className="mt-4">
          <InstallCommand command="npm install -g learnrep" />
        </div>
        <p className="mt-3 font-mono text-[10px] font-bold text-[#151515]/40">
          Then: ask your agent to build any quiz with the CLI
        </p>
      </div>

      <Link
        href="/login"
        className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-4 text-center text-lg font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5"
      >
        Create account <ArrowRight className="inline size-5" />
      </Link>
      <div className="flex gap-6">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#151515]/50 hover:text-[#151515]"
        >
          <RotateCcw className="size-3" />
          Try again
        </button>
        <Link href="/docs" className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#151515]/50 hover:text-[#151515]">
          Read the docs
        </Link>
      </div>
    </div>
  )
}
