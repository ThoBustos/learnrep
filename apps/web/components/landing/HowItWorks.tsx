const STEPS = [
  {
    number: '01',
    title: 'Install the CLI',
    body: 'Add LearnRep once, then call it from your terminal or AI agent whenever a session creates something worth keeping.',
    sample: 'npm install -g learnrep',
  },
  {
    number: '02',
    title: 'Generate from context',
    body: 'Point it at a topic, transcript, docs, or code. LearnRep writes a focused quiz with the same shape as the app quiz flow.',
    sample: 'lr generate "react hooks"',
  },
  {
    number: '03',
    title: 'Share the quiz',
    body: 'Send the live URL to your team and track attempts, scores, and progress from the dashboard.',
    sample: 'Quiz ready: /quiz/abc123',
  },
]

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-y-[3px] border-[var(--lr-line)] bg-[var(--lr-blue)] px-6 py-12 text-[var(--lr-blue-dark)] sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-25" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-7">
          <div>
            <p className="font-mono text-[11px] font-black uppercase tracking-normal opacity-75">How it works</p>
            <h2 className="mt-2 text-3xl font-black leading-none tracking-normal sm:text-4xl">
              Three steps.
            </h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map((step) => (
            <article
              key={step.number}
              className="flex min-h-52 flex-col border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] p-5 text-[var(--lr-ink)] shadow-[4px_4px_0_var(--lr-line)]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="border-[2px] border-[var(--lr-line)] bg-[var(--lr-yolk)] px-2 py-1 font-mono text-[10px] font-black">
                  {step.number}
                </span>
                <code className="min-w-0 truncate border-[2px] border-[var(--lr-line)] bg-white px-2 py-1 font-mono text-[10px] font-black text-[var(--lr-blue-dark)]">
                  {step.sample}
                </code>
              </div>
              <h3 className="text-xl font-black leading-tight tracking-normal">{step.title}</h3>
              <p className="mt-3 text-sm font-bold leading-6 text-[var(--lr-muted)]">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
