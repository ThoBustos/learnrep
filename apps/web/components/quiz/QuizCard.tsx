import type { Difficulty } from '@learnrep/core'
import { DifficultyBadge } from './DifficultyBadge'
import { AttemptCount } from './AttemptCount'

export interface QuizCardProps {
  title: string
  topic: string
  difficulty: Difficulty
  attemptCount: number
  createdBy?: string
  shareCode?: string
  onClick?: () => void
}

const baseClass = 'group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all text-left'
const interactiveClass = 'cursor-pointer hover:border-primary/30 hover:shadow-md'

export function QuizCard({
  title,
  topic,
  difficulty,
  attemptCount,
  createdBy,
  shareCode,
  onClick,
}: QuizCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-subhead text-foreground truncate">{title}</h3>
          <p className="text-caption text-muted-foreground truncate">{topic}</p>
        </div>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      <div className="flex items-center justify-between">
        <AttemptCount count={attemptCount} />
        {createdBy && (
          <span className="text-caption text-muted-foreground">by {createdBy}</span>
        )}
        {shareCode && (
          <span className="font-mono text-caption text-muted-foreground">{shareCode}</span>
        )}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} ${interactiveClass}`}
      >
        {content}
      </button>
    )
  }

  return (
    <article className={baseClass}>
      {content}
    </article>
  )
}
