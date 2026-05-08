import { LockIcon } from '@/components/icons/LockIcon'

interface LevelRowProps {
  number: number
  title: string
  description?: string
  state: 'completed' | 'active' | 'locked'
}

export function LevelRow({ number, title, description, state }: LevelRowProps) {
  const isLocked = state === 'locked'
  const isCompleted = state === 'completed'
  return (
    <div className={`flex items-center gap-3 border-2 border-foreground rounded-2xl px-4 py-3 bg-card shadow-hard-sm transition-all ${isLocked ? 'opacity-50' : ''}`}>
      <div className={`flex items-center justify-center w-9 h-9 rounded-xl border-2 border-foreground font-black text-sm shrink-0 ${isCompleted ? 'bg-difficulty-easy text-white' : isLocked ? 'bg-muted text-muted-foreground' : 'bg-foreground text-background'}`}>
        {isCompleted ? '✓' : isLocked ? <LockIcon size={18} /> : number}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm text-foreground leading-tight ${isCompleted ? 'line-through opacity-60' : ''}`}>{title}</p>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {state === 'active' && (
        <div className="flex items-center justify-center w-9 h-9 rounded-xl border-2 border-foreground bg-difficulty-medium text-white font-black shrink-0">
          ▶
        </div>
      )}
      {isCompleted && (
        <span className="text-[10px] uppercase tracking-widest text-difficulty-easy font-bold">Done</span>
      )}
    </div>
  )
}
