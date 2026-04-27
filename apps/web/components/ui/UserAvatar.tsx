import Image from 'next/image'

interface UserAvatarProps {
  name: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function UserAvatar({ name, avatarUrl, size = 'md' }: UserAvatarProps) {
  return (
    <div className={`relative shrink-0 rounded-full border-2 border-foreground overflow-hidden bg-muted shadow-hard-sm ${sizes[size]}`}>
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} width={56} height={56} unoptimized className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-foreground text-background font-black">
          {initials(name)}
        </div>
      )}
    </div>
  )
}
