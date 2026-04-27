import type { Difficulty } from '@learnrep/core'

const styles: Record<Difficulty, string> = {
  easy:   'bg-difficulty-easy/15 text-difficulty-easy',
  medium: 'bg-difficulty-medium/15 text-difficulty-medium',
  hard:   'bg-difficulty-hard/15 text-difficulty-hard',
  expert: 'bg-difficulty-expert/15 text-difficulty-expert',
}

const labels: Record<Difficulty, string> = {
  easy:   'Easy',
  medium: 'Medium',
  hard:   'Hard',
  expert: 'Expert',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium ${styles[difficulty]}`}
    >
      {labels[difficulty]}
    </span>
  )
}
