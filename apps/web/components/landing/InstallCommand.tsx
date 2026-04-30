'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Props = { command: string }

export function InstallCommand({ command }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(command).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative w-full min-w-0 overflow-hidden rounded-[0.9rem] bg-[#151515] shadow-[0_8px_24px_rgba(21,21,21,0.18)] sm:w-auto">
      <div className="min-w-0 overflow-hidden px-4 py-3 pr-12">
        <code className="font-mono text-sm font-bold text-[#ffd426]">{command}</code>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy install command"
        className="absolute right-2 top-1/2 -translate-y-1/2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[0.5rem] border-[2px] border-[#ffd426]/40 bg-white/10 text-[#ffd426] transition-all hover:border-[#ffd426]/70 hover:bg-white/20"
      >
        {copied ? <Check className="size-3.5 text-[#d9ff69]" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}
