'use client'

import { useState, useRef } from 'react'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cn } from '@/lib/utils'
import type { TerminalLine } from '@/lib/landing/terminalSequence'
import { SEQUENCE_DURATION } from '@/lib/landing/terminalSequence'

type Props = { sequence: { delay: number; line: TerminalLine }[] }

const SEP_CHAR = '─'.repeat(54)

export function TerminalWindow({ sequence }: Props) {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useMountEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let active = true

    function scrollToBottom() {
      const el = containerRef.current
      if (el) el.scrollTop = el.scrollHeight
    }

    function play() {
      if (!active) return
      setTerminalLines([])
      if (containerRef.current) containerRef.current.scrollTop = 0
      sequence.forEach(({ delay, line }) => {
        const t = setTimeout(() => {
          if (!active) return
          setTerminalLines((prev) => [...prev, line])
          scrollToBottom()
        }, delay)
        timers.push(t)
      })
      const t = setTimeout(() => play(), SEQUENCE_DURATION + 8000)
      timers.push(t)
    }

    play()
    return () => {
      active = false
      timers.forEach(clearTimeout)
    }
  })

  return (
    <div className="overflow-hidden rounded-[1.3rem] bg-[#151515] shadow-[8px_8px_0_#ffd426]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#1c1c1c] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-[#ff6b62]" />
          <div className="size-3 rounded-full bg-[#ffd426]" />
          <div className="size-3 rounded-full bg-[#d9ff69]" />
        </div>
        <span className="ml-2 font-mono text-[11px] font-bold text-white/25">zsh · ~/projects/openyoko</span>
      </div>

      {/* Content — overflow-hidden, scrolled programmatically only */}
      <div
        ref={containerRef}
        className="h-[280px] overflow-hidden bg-[#151515] px-4 py-3 sm:h-[340px]"
      >
        {terminalLines.map((line, i) => <Line key={i} line={line} />)}
        <span className="inline-block h-[13px] w-[6px] animate-pulse bg-[#ffd426] align-middle" />
        <div className="h-5" />
      </div>
    </div>
  )
}

function Line({ line }: { line: TerminalLine }) {
  switch (line.type) {
    case 'gap':
      return <div className="h-2" />

    case 'shell':
      return (
        <div className="mb-0.5 flex items-baseline gap-2">
          <span className="shrink-0 font-mono text-[11px] text-white/30">~/openyoko %</span>
          <span className="font-mono text-[11px] font-bold text-[#ffd426]">{line.text}</span>
        </div>
      )

    case 'output':
      return (
        <div className="mb-0.5">
          <span className="font-mono text-[11px] text-white/40">{line.text}</span>
        </div>
      )

    case 'logo':
      return (
        <div className="leading-[1.7]">
          <span className={cn(
            'font-mono text-[11px]',
            line.text.startsWith('◆') ? 'font-bold text-white/90' : 'text-white/50',
          )}>
            {line.text}
          </span>
        </div>
      )

    case 'meta':
      return (
        <div className="leading-snug">
          <span className="font-mono text-[10px] text-white/30">{line.text}</span>
        </div>
      )

    case 'separator':
      return (
        <div className="my-0.5">
          <span className="font-mono text-[10px] text-white/[0.12]">{SEP_CHAR}</span>
        </div>
      )

    case 'prompt':
      return (
        <div className="mb-0.5 flex items-baseline gap-1.5">
          <span className="shrink-0 font-mono text-[11px] font-bold text-[#ffd426]">❯</span>
          <span className="font-mono text-[11px] text-white/90">{line.text}</span>
        </div>
      )

    case 'step':
      return (
        <div className="mb-0.5 pl-3">
          <span className="font-mono text-[11px] text-white/45">{line.text}</span>
        </div>
      )

    case 'success':
      return (
        <div className="mb-0.5">
          <span className="font-mono text-[11px] font-bold text-[#d9ff69]">{line.text}</span>
        </div>
      )

    case 'url':
      return (
        <div className="mb-0.5">
          <span className="font-mono text-[11px] text-[#7bd8ef]">{line.text}</span>
        </div>
      )
  }
}
