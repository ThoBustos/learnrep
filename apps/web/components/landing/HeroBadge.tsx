type Props = { label: string }

export function HeroBadge({ label }: Props) {
  return (
    <div className="inline-flex w-fit items-center gap-2 border-[2px] border-[var(--lr-line)] bg-[var(--lr-yolk)] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest">
      {label}
    </div>
  )
}
