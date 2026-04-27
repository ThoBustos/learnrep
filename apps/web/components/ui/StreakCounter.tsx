interface StreakCounterProps {
  count: number
  size?: 'sm' | 'md' | 'lg'
}

export function StreakCounter({ count, size = 'md' }: StreakCounterProps) {
  const sizeMap = {
    sm: { wrap: 'px-3 py-2 gap-1.5', flame: 'text-lg', num: 'text-xl', label: 'text-[9px]' },
    md: { wrap: 'px-5 py-3 gap-2', flame: 'text-2xl', num: 'text-3xl', label: 'text-[10px]' },
    lg: { wrap: 'px-7 py-4 gap-3', flame: 'text-4xl', num: 'text-5xl', label: 'text-xs' },
  }
  const s = sizeMap[size]
  return (
    <div className={`inline-flex items-center rounded-2xl border-2 border-foreground bg-streak shadow-hard ${s.wrap}`}>
      <span className={s.flame} role="img" aria-label="streak">🔥</span>
      <div className="flex flex-col">
        <span className={`font-black tabular-nums leading-none text-foreground ${s.num}`}>{count}</span>
        <span className={`uppercase tracking-widest font-bold text-foreground/70 ${s.label}`}>day streak</span>
      </div>
    </div>
  )
}
