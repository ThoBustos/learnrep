type Props = { label: string }

export function HeroBadge({ label }: Props) {
  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-full border-[2px] border-[#151515] bg-[#ffd426] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest">
      {label}
    </div>
  )
}
