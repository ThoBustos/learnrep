'use client'

import { useState, useRef } from 'react'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cn } from '@/lib/utils'
import type { TerminalLine } from '@/lib/landing/terminalSequence'

type Props = { sequence: { delay: number; line: TerminalLine }[] }

export function TerminalWindow({ sequence }: Props) {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const cursorRef = useRef<HTMLSpanElement>(null)

  useMountEffect(() => {
    sequence.forEach(({ delay, line }) => {
      setTimeout(() => {
        setTerminalLines((prev) => [...prev, line])
        requestAnimationFrame(() => cursorRef.current?.scrollIntoView({ block: 'nearest' }))
      }, delay)
    })
  })

  return (
    <div className="overflow-hidden rounded-[1.3rem] bg-[#151515] shadow-[8px_8px_0_#ffd426]">
      <div className="flex items-center gap-2 border-b-[3px] border-[#151515] bg-[#151515] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-[#ff6b62]" />
          <div className="size-3 rounded-full bg-[#ffd426]" />
          <div className="size-3 rounded-full bg-[#d9ff69]" />
        </div>
        <span className="ml-2 font-mono text-[11px] font-bold text-white/40">zsh · 80×24</span>
      </div>
      <div className="flex h-[180px] flex-col overflow-hidden bg-[#151515] px-5 py-4 sm:h-[220px]">
        {terminalLines.map((line, i) => {
          if (line.type === 'gap') return <div key={i} className="h-3" />
          return (
            <div key={i} className="mb-1">
              <span className={cn(
                'font-mono text-xs leading-relaxed sm:text-sm',
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
        <span ref={cursorRef} className="inline-block h-4 w-2 animate-pulse bg-[#ffd426] align-middle" />
      </div>
    </div>
  )
}
