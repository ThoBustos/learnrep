'use client'

import { DifficultyStars } from '../quiz/DifficultyStars'
import { CountdownTimer } from './CountdownTimer'
import { UserAvatar } from './UserAvatar'
import type { Difficulty } from '@learnrep/core'

interface ChallengeCardProps {
  title: string
  difficulty: Difficulty
  creatorName: string
  participants: number
  maxParticipants?: number
  daysLeft: number
  hoursLeft: number
  minsLeft: number
  onStart?: () => void
  onShare?: () => void
}

export function ChallengeCard({ title, difficulty, creatorName, participants, maxParticipants, daysLeft, hoursLeft, minsLeft, onStart, onShare }: ChallengeCardProps) {
  return (
    <div className="flex flex-col gap-4 border-2 border-foreground rounded-2xl bg-card p-4 shadow-hard">
      {/* header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-black text-base text-foreground uppercase tracking-tight leading-tight">{title}</h3>
          <DifficultyStars difficulty={difficulty} />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <UserAvatar name={creatorName} size="sm" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-foreground">{creatorName}</span>
            <span className="text-[10px] text-muted-foreground">{participants}{maxParticipants ? `/${maxParticipants}` : ''} joined</span>
          </div>
        </div>
      </div>

      {/* countdown */}
      <CountdownTimer days={daysLeft} hours={hoursLeft} minutes={minsLeft} label="Ends in" />

      {/* actions */}
      <div className="flex gap-2">
        {onStart && (
          <button
            onClick={onStart}
            className="flex-1 rounded-xl border-2 border-foreground bg-foreground text-background font-black uppercase tracking-wide py-2.5 text-sm shadow-hard hover:-translate-y-0.5 transition-transform active:translate-y-0"
          >
            I&apos;m Done!
          </button>
        )}
        {onShare && (
          <button
            onClick={onShare}
            className="flex-1 rounded-xl border-2 border-foreground bg-streak text-foreground font-black uppercase tracking-wide py-2.5 text-sm shadow-hard hover:-translate-y-0.5 transition-transform active:translate-y-0"
          >
            Share
          </button>
        )}
      </div>
    </div>
  )
}
