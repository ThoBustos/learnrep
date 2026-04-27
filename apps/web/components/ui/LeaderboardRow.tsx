import { UserAvatar } from './UserAvatar'

interface LeaderboardRowProps {
  rank: number
  name: string
  handle?: string
  score: number
  avatarUrl?: string
  isCurrentUser?: boolean
}

const rankColors: Record<number, string> = {
  1: 'bg-streak text-foreground',
  2: 'bg-muted-foreground/20 text-foreground',
  3: 'bg-difficulty-hard/20 text-difficulty-hard',
}

export function LeaderboardRow({ rank, name, handle, score, avatarUrl, isCurrentUser }: LeaderboardRowProps) {
  const rankStyle = rankColors[rank] ?? 'bg-muted text-foreground'
  return (
    <div className={`flex items-center gap-3 border-2 border-foreground rounded-2xl px-3 py-2.5 bg-card shadow-hard-sm ${isCurrentUser ? 'border-difficulty-medium bg-difficulty-medium/5' : ''}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-xl border-2 border-foreground font-black text-sm shrink-0 ${rankStyle}`}>
        {rank}
      </div>
      <UserAvatar name={name} avatarUrl={avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-foreground truncate">{name}</p>
        {handle && <p className="text-[10px] text-muted-foreground truncate">{handle}</p>}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <span className="font-black text-sm tabular-nums text-foreground">{score}</span>
        <span className="text-streak text-sm">★</span>
      </div>
    </div>
  )
}
