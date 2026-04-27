interface TopicTagProps {
  label: string
  color?: string // tailwind bg class e.g. 'bg-difficulty-easy/20'
}

export function TopicTag({ label, color = 'bg-muted' }: TopicTagProps) {
  return (
    <span className={`inline-flex items-center rounded-full border-2 border-foreground px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-foreground ${color}`}>
      {label}
    </span>
  )
}
