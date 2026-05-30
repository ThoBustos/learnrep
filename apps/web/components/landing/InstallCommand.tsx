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
    <div className="flex w-full min-w-0 overflow-hidden border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] sm:w-auto">
      <div className="min-w-0 flex-1 px-4 py-3">
        <code className="break-all font-mono text-sm font-bold text-[var(--lr-yolk)]">{command}</code>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy install command"
        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center border-l-[3px] border-[var(--lr-line)] text-[var(--lr-yolk)]"
      >
        {copied ? <Check className="size-3.5 text-[var(--lr-green)]" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}
