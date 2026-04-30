'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

const INSTALL_CMD = 'npm install -g learnrep'

const TERMINAL_LINES = [
  { type: 'prompt',  text: '$ lr generate "react hooks"' },
  { type: 'info',    text: 'Generating 5 medium questions...' },
  { type: 'gap' },
  { type: 'success', text: '✓ React Hooks — State, Effects, and Closures' },
  { type: 'url',     text: 'https://learnrep.ai/quiz/abc123/take' },
]

const VARIANTS = [
  {
    id: 'a',
    label: 'A — Yellow shadow',
    desc: 'Hard neo-brutalist shadow in brand yellow. No black border.',
    installBox: 'rounded-[0.9rem] border-[3px] border-[#151515] bg-[#151515] shadow-[4px_4px_0_#ffd426]',
    terminal:   'overflow-hidden rounded-[1.3rem] border-[3px] border-[#151515] bg-[#151515] shadow-[8px_8px_0_#ffd426]',
  },
  {
    id: 'no-border',
    label: 'B — No border',
    desc: 'Border removed entirely. Block stands alone on the page.',
    installBox: 'rounded-[0.9rem] bg-[#151515] shadow-[0_8px_24px_rgba(21,21,21,0.18)]',
    terminal:   'overflow-hidden rounded-[1.3rem] bg-[#151515] shadow-[0_8px_24px_rgba(21,21,21,0.18)]',
  },
  {
    id: 'd',
    label: 'D — Yellow border, no shadow',
    desc: 'Brand yellow border frames the block. Clean, no shadow offset.',
    installBox: 'rounded-[0.9rem] border-[3px] border-[#ffd426] bg-[#151515]',
    terminal:   'overflow-hidden rounded-[1.3rem] border-[3px] border-[#ffd426] bg-[#151515]',
  },
]

function InstallBox({ boxCls }: { boxCls: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(INSTALL_CMD).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className={cn('group relative', boxCls)}>
      <div className="px-4 py-3 pr-12">
        <code className="font-mono text-sm font-bold text-[#ffd426]">{INSTALL_CMD}</code>
      </div>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-[0.5rem] border-[2px] border-[#ffd426]/40 bg-white/10 text-[#ffd426] transition-all hover:border-[#ffd426]/70 hover:bg-white/20"
      >
        {copied ? <Check className="size-3.5 text-[#d9ff69]" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}

function Terminal({ boxCls }: { boxCls: string }) {
  return (
    <div className={boxCls}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#1a1a1a] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-[#ff6b62]" />
          <div className="size-3 rounded-full bg-[#ffd426]" />
          <div className="size-3 rounded-full bg-[#d9ff69]" />
        </div>
        <span className="ml-2 font-mono text-[11px] font-bold text-white/40">zsh — 80×24</span>
      </div>
      <div className="min-h-[140px] px-5 py-4">
        {TERMINAL_LINES.map((line, i) => {
          if (line.type === 'gap') return <div key={i} className="h-3" />
          return (
            <div key={i} className="mb-1">
              <span className={cn(
                'font-mono text-sm leading-relaxed',
                line.type === 'prompt'  && 'font-bold text-[#ffd426]',
                line.type === 'info'    && 'text-white/50',
                line.type === 'success' && 'font-bold text-[#d9ff69]',
                line.type === 'url'     && 'font-bold text-[#7bd8ef] underline',
              )}>
                {line.text}
              </span>
            </div>
          )
        })}
        <span className="inline-block h-4 w-2 animate-pulse bg-[#ffd426] align-middle" />
      </div>
    </div>
  )
}

export default function ShadowVariantsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] px-8 py-14" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#67606a]">Dev · Shadow variants</p>
        <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] text-[#151515]">Terminal & install box shadows</h1>
        <p className="mt-1 font-mono text-sm text-[#67606a]">Pick one — nothing is shipped yet.</p>

        <div className="mt-12 grid gap-16">
          {VARIANTS.map((v) => (
            <section key={v.id}>
              <div className="mb-6 flex items-baseline gap-3">
                <span className="rounded-[0.5rem] border-[2.5px] border-[#151515] bg-[#ffd426] px-2.5 py-0.5 font-mono text-[11px] font-black">
                  {v.label}
                </span>
                <p className="font-mono text-xs text-[#67606a]">{v.desc}</p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-widest text-[#67606a]">Install command</p>
                  <InstallBox boxCls={v.installBox} />
                </div>
                <div>
                  <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-widest text-[#67606a]">Terminal window</p>
                  <Terminal boxCls={v.terminal} />
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
