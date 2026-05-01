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
    <div className="flex w-full min-w-0 overflow-hidden rounded-[0.9rem] bg-[#151515] shadow-[0_8px_24px_rgba(21,21,21,0.18)] sm:w-auto">
      <div className="flex-1 min-w-0 px-4 py-3">
        <code className="font-mono text-sm font-bold text-[#ffd426]">{command}</code>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy install command"
        className="flex shrink-0 min-h-[44px] min-w-[44px] items-center justify-center border-l border-white/10 bg-white/5 text-[#ffd426] transition-colors hover:bg-white/10"
      >
        {copied ? <Check className="size-3.5 text-[#d9ff69]" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}
