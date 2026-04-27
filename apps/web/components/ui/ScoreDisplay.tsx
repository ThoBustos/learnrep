interface ScoreDisplayProps {
  score: number
  label?: string
  maxScore?: number
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-difficulty-easy'
  if (score >= 70) return 'text-difficulty-medium'
  if (score >= 50) return 'text-streak'
  return 'text-difficulty-hard'
}

export function ScoreDisplay({ score, label = 'Score', maxScore = 100 }: ScoreDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2 border-2 border-foreground rounded-2xl bg-card px-8 py-6 shadow-hard">
      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</span>
      <span className={`font-black tabular-nums leading-none ${getScoreColor(score)}`} style={{ fontSize: 'clamp(3rem, 12vw, 6rem)' }}>
        {score}
      </span>
      {maxScore !== 100 && (
        <span className="text-xs text-muted-foreground font-medium">out of {maxScore}</span>
      )}
      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">points</span>
    </div>
  )
}
