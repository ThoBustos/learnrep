import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const nav = [
  {
    group: 'For Agents',
    items: [
      { label: 'Overview', href: '/docs' },
      { label: 'Agent quickstart', href: '/docs/agent-quickstart' },
      { label: 'When to generate', href: '/docs/when-to-generate' },
      { label: 'Copy-paste config', href: '/docs/llm/config' },
      { label: 'MCP integration', href: '/docs/mcp' },
    ],
  },
  {
    group: 'CLI Reference',
    items: [
      { label: 'lr generate', href: '/docs/cli/generate' },
      { label: 'lr share', href: '/docs/cli/share' },
      { label: 'lr stats', href: '/docs/cli/stats' },
      { label: 'lr login / logout', href: '/docs/cli/login' },
    ],
  },
  {
    group: 'Background',
    items: [
      { label: 'Why CLI-first', href: '/docs/why-cli-first' },
      { label: 'Human quickstart', href: '/docs/quickstart' },
      { label: 'Contributing', href: '/docs/contributing' },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen bg-[var(--lr-notebook)] text-[var(--lr-ink)]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-70" />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r-[3px] border-[var(--lr-line)] bg-[var(--lr-teal)] px-5 py-6 text-[var(--lr-ink)] lg:flex">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] font-black text-[var(--lr-yolk)]">
              L
            </div>
            <span className="text-base font-black tracking-normal">LearnRep</span>
          </Link>

          {/* Nav */}
          <nav className="flex flex-col gap-5">
            {nav.map(({ group, items }) => (
              <div key={group}>
                <p className="mb-1.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[var(--lr-ink)]">
                  {group}
                </p>
                <div className="flex flex-col gap-0.5">
                  {items.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="px-2.5 py-1.5 text-sm font-bold text-[var(--lr-ink)] hover:bg-white/20"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* GitHub */}
          <a
            href="https://github.com/ThoBustos/learnrep"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center gap-1.5 font-mono text-[10px] font-bold text-[var(--lr-ink)] hover:bg-white/20"
          >
            GitHub
            <ExternalLink className="size-3" />
          </a>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-6 py-4">
            <Link
              href="/dashboard"
              className="font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-muted)] hover:text-[var(--lr-ink)]"
            >
              App
            </Link>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[var(--lr-muted)]">Docs</p>
          </div>

          <div className="mx-auto max-w-2xl px-6 py-10">
            <div className="border-[3px] border-[var(--lr-line)] bg-white p-8 shadow-[var(--lr-shadow-lg)]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
