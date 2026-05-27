type Props = { agents: string[] }

const badgeStyles = [
  'border-[color:color-mix(in_srgb,var(--lr-line)_20%,transparent)] bg-white text-[var(--lr-muted)]',
  'border-[var(--lr-blue-dark)] bg-[var(--lr-blue)] text-[var(--lr-blue-dark)]',
  'border-[var(--lr-line)] bg-[var(--lr-yolk)] text-[var(--lr-ink)]',
  'border-[var(--lr-red-dark)] bg-[var(--lr-red)]/25 text-[var(--lr-red-dark)]',
]

export function AgentBadgeStrip({ agents }: Props) {
  return (
    <div className="flex flex-col gap-2 pt-1">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--lr-muted)]">Works inside</p>
      <div className="flex flex-wrap gap-1.5">
        {agents.map((name, i) => (
          <span
            key={name}
            className={`rounded-full border-[2px] px-2.5 py-0.5 font-mono text-[10px] font-bold ${badgeStyles[i % badgeStyles.length]}`}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
