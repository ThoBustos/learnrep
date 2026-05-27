import { cn } from '@/lib/utils'

type Step = {
  number: string
  headline: string
  body: string
  visual: React.ReactNode
}

const leaderboardRows = [
  { rank: '01', name: 'sarah_k',   score: '100%', delta: '+40%',     dot: 'bg-[var(--lr-green)]' },
  { rank: '02', name: 'tom.b',     score: '80%',  delta: '+20%',     dot: 'bg-[var(--lr-yolk)]' },
  { rank: '03', name: 'alex_dev',  score: '60%',  delta: 'first try', dot: 'bg-[var(--lr-blue)]' },
]

const STEPS: Step[] = [
  {
    number: '01',
    headline: 'Your agents ship. Does your team learn?',
    body: 'AI agents finish tasks in seconds. The knowledge stays with the model, not your team. LearnRep closes that loop.',
    visual: (
      <div className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] p-5 shadow-[var(--lr-shadow-md)]">
        <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-muted)]">
          Agent output
        </p>
        <p className="font-mono text-sm text-[var(--lr-muted)]">Auth middleware refactored</p>
        <p className="font-mono text-sm text-[var(--lr-muted)]">3 tests passing</p>
        <p className="font-mono text-sm text-[var(--lr-muted)]">PR opened</p>
        <div className="my-3 border-t border-[color:color-mix(in_srgb,var(--lr-line)_10%,transparent)]" />
        <p className="font-mono text-sm text-[var(--lr-red-dark)]">Nobody reviewed the pattern</p>
        <p className="font-mono text-sm text-[var(--lr-red-dark)]">Nobody learned from it</p>
      </div>
    ),
  },
  {
    number: '02',
    headline: 'One command. Any topic. Live URL.',
    body: 'lr generate "Auth middleware patterns". A shareable quiz appears in your terminal in seconds. Works from your agent or the CLI.',
    visual: (
      <div className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] p-5 font-mono text-sm shadow-[4px_4px_0_var(--lr-yolk)]">
        <p>
          <span className="text-white/30">$ </span>
          <span className="text-[var(--lr-yolk)]">lr generate</span>
          <span className="text-white"> &quot;Auth middleware&quot;</span>
        </p>
        <p className="mt-1 text-white/40">Fetching context…</p>
        <p className="text-white/40">Generating 5 questions…</p>
        <p className="mt-3 text-[var(--lr-green)]">Quiz ready</p>
        <p className="text-white/50">→ learnrep.ideabench.ai/quiz/x7k2p/take</p>
      </div>
    ),
  },
  {
    number: '03',
    headline: "See who's sharpening.",
    body: 'Every attempt is ranked. See who scored highest, who improved most. Real accountability, zero meetings.',
    visual: (
      <div className="border-[3px] border-[var(--lr-line)] bg-white p-5 shadow-[var(--lr-shadow-md)]">
        <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-muted)]">
          Auth middleware · 5 attempts
        </p>
        {leaderboardRows.map((row) => (
          <div
            key={row.rank}
            className="flex items-center gap-3 border-b border-[color:color-mix(in_srgb,var(--lr-line)_10%,transparent)] py-2.5 last:border-0"
          >
            <span className="w-5 font-mono text-xs font-black text-[var(--lr-muted)]">{row.rank}</span>
            <span className={cn('size-2 shrink-0 rounded-full border border-[color:color-mix(in_srgb,var(--lr-line)_20%,transparent)]', row.dot)} />
            <span className="flex-1 font-mono text-sm font-bold">{row.name}</span>
            <span className="font-mono text-sm font-black">{row.score}</span>
            <span className="font-mono text-[10px] text-[var(--lr-muted)]">{row.delta}</span>
          </div>
        ))}
      </div>
    ),
  },
]

export function HowItWorks() {
  return (
    <section className="border-t-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[var(--lr-muted)]">
          How it works
        </p>
        <h2 className="mb-16 text-4xl font-black tracking-normal sm:text-5xl">
          Three steps.
          <br />
          Zero friction.
        </h2>

        <div className="flex flex-col gap-20">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center"
            >
              <div className={cn(i % 2 === 1 && 'md:order-last')}>
                <span className="block font-mono text-7xl font-black leading-none text-[var(--lr-line)]/10">
                  {step.number}
                </span>
                <h3 className="mt-1 text-2xl font-black tracking-normal sm:text-3xl">
                  {step.headline}
                </h3>
                <p className="mt-3 text-base font-medium leading-relaxed text-[var(--lr-muted)]">
                  {step.body}
                </p>
              </div>
              <div>{step.visual}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
