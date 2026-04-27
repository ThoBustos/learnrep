import { UserAvatar } from './UserAvatar'

interface ActivityItemProps {
  name: string
  action: string
  target: string
  time: string
  avatarUrl?: string
  onMore?: () => void
}

export function ActivityItem({ name, action, target, time, avatarUrl, onMore }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3 border-2 border-foreground rounded-2xl px-3 py-2.5 bg-card shadow-hard-sm">
      <UserAvatar name={name} avatarUrl={avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-bold truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground truncate">
          {action} <span className="text-foreground font-medium">{target}</span>
        </p>
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0">{time}</span>
      {onMore && (
        <button
          onClick={onMore}
          className="shrink-0 rounded-lg border-2 border-foreground bg-foreground text-background text-[10px] font-bold uppercase tracking-wider px-2 py-1 shadow-hard-sm hover:bg-primary transition-colors"
        >
          More
        </button>
      )}
    </div>
  )
}
