type Props = { agents: string[] }

export function AgentBadgeStrip({ agents }: Props) {
  return (
    <div className="flex flex-col gap-2 pt-1">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#151515]/40">Works inside</p>
      <div className="flex flex-wrap gap-1.5">
        {agents.map((name) => (
          <span
            key={name}
            className="rounded-full border-[2px] border-[#151515]/20 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#151515]/60"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
