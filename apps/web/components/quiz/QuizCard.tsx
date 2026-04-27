'use client'

import type { Difficulty } from '@learnrep/core'
import { DifficultyStars } from './DifficultyStars'
import { TopicTag } from '../ui/TopicTag'

const difficultyAccent: Record<Difficulty, string> = {
  easy: 'bg-difficulty-easy',
  medium: 'bg-difficulty-medium',
  hard: 'bg-difficulty-hard',
  expert: 'bg-difficulty-expert',
}

const difficultyTagColor: Record<Difficulty, string> = {
  easy: 'bg-difficulty-easy/15',
  medium: 'bg-difficulty-medium/15',
  hard: 'bg-difficulty-hard/15',
  expert: 'bg-difficulty-expert/15',
}

export interface QuizCardProps {
  title: string
  topic: string
  difficulty: Difficulty
  questionCount?: number
  attemptCount: number
  bestScore?: number
  cardNo?: string
  onClick?: () => void
}

const baseClass = 'relative flex flex-col border-2 border-foreground rounded-2xl bg-card overflow-hidden shadow-hard transition-all text-left'
const interactiveClass = 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:shadow-hard-sm'

export function QuizCard({ title, topic, difficulty, questionCount = 10, attemptCount, bestScore, cardNo, onClick }: QuizCardProps) {
  const content = (
    <>
      <div className={`h-2 w-full ${difficultyAccent[difficulty]}`} />

      <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-1">
        <h3 className="font-bold text-sm leading-tight text-foreground uppercase tracking-tight flex-1">
          {title}
        </h3>
        {cardNo && (
          <span className="font-mono text-[10px] text-muted-foreground shrink-0 pt-0.5 tracking-wider">
            NO.{cardNo}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 pb-3">
        <DifficultyStars difficulty={difficulty} />
        <TopicTag label={topic} color={difficultyTagColor[difficulty]} />
      </div>

      <div className="border-t-2 border-foreground grid grid-cols-3">
        <StatCell label="Questions" value={String(questionCount)} />
        <StatCell label="Attempts" value={String(attemptCount)} border />
        <StatCell label="Best" value={bestScore != null ? `${bestScore}%` : '-'} border />
      </div>
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${baseClass} ${interactiveClass}`}>
        {content}
      </button>
    )
  }

  return <article className={baseClass}>{content}</article>
}

function StatCell({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div className={`flex flex-col items-center py-2.5 ${border ? 'border-l-2 border-foreground' : ''}`}>
      <span className="font-bold text-sm tabular-nums text-foreground leading-none">{value}</span>
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</span>
    </div>
  )
}
