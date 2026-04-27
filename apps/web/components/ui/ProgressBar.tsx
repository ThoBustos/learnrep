interface ProgressBarProps {
  value: number // 0–100
  label?: string
  showPercent?: boolean
  color?: 'easy' | 'medium' | 'hard' | 'expert' | 'streak' | 'stats'
}

const colors = {
  easy:   'bg-difficulty-easy',
  medium: 'bg-difficulty-medium',
  hard:   'bg-difficulty-hard',
  expert: 'bg-difficulty-expert',
  streak: 'bg-streak',
  stats:  'bg-stats',
}

export function ProgressBar({ value, label, showPercent = true, color = 'stats' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="flex flex-col gap-1.5">
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</span>}
          {showPercent && <span className="text-xs font-black tabular-nums text-foreground">{clamped}%</span>}
        </div>
      )}
      <div className="h-4 rounded-full border-2 border-foreground bg-muted overflow-hidden shadow-hard-sm">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
