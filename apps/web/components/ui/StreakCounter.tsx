import { FlameIcon } from '@/components/icons/FlameIcon'

interface StreakCounterProps {
  count: number
  size?: 'sm' | 'md' | 'lg'
}

export function StreakCounter({ count, size = 'md' }: StreakCounterProps) {
  const sizeMap = {
    sm: { wrap: 'px-3 py-2 gap-1.5', flameSize: 18, num: 'text-xl', label: 'text-[9px]' },
    md: { wrap: 'px-5 py-3 gap-2', flameSize: 24, num: 'text-3xl', label: 'text-[10px]' },
    lg: { wrap: 'px-7 py-4 gap-3', flameSize: 36, num: 'text-5xl', label: 'text-xs' },
  }
  const s = sizeMap[size]
  return (
    <div className={`inline-flex items-center rounded-2xl border-2 border-foreground bg-streak shadow-hard ${s.wrap}`}>
      <FlameIcon size={s.flameSize} />
      <div className="flex flex-col">
        <span className={`font-black tabular-nums leading-none text-foreground ${s.num}`}>{count}</span>
        <span className={`uppercase tracking-widest font-bold text-foreground/70 ${s.label}`}>day streak</span>
      </div>
    </div>
  )
}
