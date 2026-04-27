import type { Difficulty } from '@learnrep/core'

const COUNT: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3, expert: 4 }
const COLOR: Record<Difficulty, string> = {
  easy: 'text-difficulty-easy',
  medium: 'text-difficulty-medium',
  hard: 'text-difficulty-hard',
  expert: 'text-difficulty-expert',
}

export function DifficultyStars({ difficulty }: { difficulty: Difficulty }) {
  const filled = COUNT[difficulty]
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < filled ? COLOR[difficulty] : 'text-muted-foreground/30'}`}>
          ★
        </span>
      ))}
    </div>
  )
}
