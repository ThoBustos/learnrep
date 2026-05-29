'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-2 text-4xl font-black tracking-normal">{children}</h1>
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-8 text-xl font-black tracking-normal">{children}</h2>
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mb-8 text-lg font-bold text-[var(--lr-muted)]">{children}</p>
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-relaxed">{children}</p>
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="border-[2px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-1.5 py-0.5 font-mono text-[12px] font-bold">
      {children}
    </code>
  )
}

export function Pre({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(children).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative mb-4">
      <pre className="overflow-x-auto border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] p-4 pr-12 font-mono text-xs leading-relaxed text-[var(--lr-yolk)] shadow-[var(--lr-shadow-md)]">
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 flex size-7 items-center justify-center border-[2px] border-[color:color-mix(in_srgb,var(--lr-yolk)_30%,transparent)] bg-white/10 text-[var(--lr-yolk)] opacity-0 transition-all group-hover:opacity-100 hover:border-[color:color-mix(in_srgb,var(--lr-yolk)_60%,transparent)] hover:bg-white/20"
        aria-label="Copy code"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 overflow-x-auto border-[3px] border-[var(--lr-line)] shadow-[var(--lr-shadow-sm)]">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-4 py-2.5 text-left font-mono text-[10px] font-black uppercase tracking-widest">
      {children}
    </th>
  )
}

export function Td({ children }: { children: React.ReactNode }) {
  return <td className="border-b border-[color:color-mix(in_srgb,var(--lr-line)_10%,transparent)] px-4 py-2.5 font-mono text-xs">{children}</td>
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="mb-4 flex flex-col gap-1.5 pl-4">{children}</ul>
}

export function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--lr-ink)]" />
      <span>{children}</span>
    </li>
  )
}
