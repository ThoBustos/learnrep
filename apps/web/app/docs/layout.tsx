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
      className="relative min-h-screen bg-[#ffd426] text-[#151515]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#151515_1.2px,transparent_1.2px)] [background-size:18px_18px]" />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r-[3px] border-[#151515] bg-[#ffd426] px-5 py-6 lg:flex">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] font-black text-[#ffd426]">
              L
            </div>
            <span className="text-base font-black tracking-[-0.04em]">LearnRep</span>
          </Link>

          {/* Nav */}
          <nav className="flex flex-col gap-5">
            {nav.map(({ group, items }) => (
              <div key={group}>
                <p className="mb-1.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#67606a]">
                  {group}
                </p>
                <div className="flex flex-col gap-0.5">
                  {items.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="rounded-[0.6rem] px-2.5 py-1.5 text-sm font-bold hover:bg-[#151515]/10"
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
            className="mt-auto flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#67606a] hover:text-[#151515]"
          >
            GitHub
            <ExternalLink className="size-3" />
          </a>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b-[3px] border-[#151515] px-6 py-4">
            <Link
              href="/dashboard"
              className="font-mono text-[10px] font-black uppercase tracking-widest text-[#67606a] hover:text-[#151515]"
            >
              App
            </Link>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#67606a]">Docs</p>
          </div>

          <div className="mx-auto max-w-2xl px-6 py-10">
            <div className="rounded-[1.5rem] border-[3px] border-[#151515] bg-white p-8 shadow-[6px_6px_0_#151515]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
