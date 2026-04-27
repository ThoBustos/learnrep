'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-2 text-4xl font-black tracking-[-0.04em]">{children}</h1>
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-8 text-xl font-black tracking-[-0.02em]">{children}</h2>
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mb-8 text-lg font-bold text-[#67606a]">{children}</p>
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-relaxed">{children}</p>
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[0.3rem] border-[2px] border-[#151515] bg-[#f5f4f0] px-1.5 py-0.5 font-mono text-[12px] font-bold">
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
      <pre className="overflow-x-auto rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] p-4 pr-12 font-mono text-xs leading-relaxed text-[#ffd426] shadow-[4px_4px_0_rgba(21,21,21,0.2)]">
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-[0.5rem] border-[2px] border-[#ffd426]/30 bg-white/10 text-[#ffd426] opacity-0 transition-all group-hover:opacity-100 hover:border-[#ffd426]/60 hover:bg-white/20"
        aria-label="Copy code"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 overflow-x-auto rounded-[1rem] border-[3px] border-[#151515] shadow-[3px_3px_0_rgba(21,21,21,0.15)]">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b-[3px] border-[#151515] bg-[#f5f4f0] px-4 py-2.5 text-left font-mono text-[10px] font-black uppercase tracking-widest">
      {children}
    </th>
  )
}

export function Td({ children }: { children: React.ReactNode }) {
  return <td className="border-b border-[#151515]/10 px-4 py-2.5 font-mono text-xs">{children}</td>
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="mb-4 flex flex-col gap-1.5 pl-4">{children}</ul>
}

export function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#151515]" />
      <span>{children}</span>
    </li>
  )
}
