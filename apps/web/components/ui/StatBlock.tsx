interface StatBlockProps {
  value: string | number
  label: string
  variant?: 'dark' | 'streak' | 'stats' | 'easy' | 'medium' | 'hard' | 'expert'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  dark:   'bg-foreground text-background',
  streak: 'bg-streak text-foreground',
  stats:  'bg-stats text-white',
  easy:   'bg-difficulty-easy text-white',
  medium: 'bg-difficulty-medium text-white',
  hard:   'bg-difficulty-hard text-white',
  expert: 'bg-difficulty-expert text-white',
}

const sizes = {
  sm: { box: 'px-3 py-2 rounded-xl', num: 'text-xl', label: 'text-[9px]' },
  md: { box: 'px-4 py-3 rounded-2xl', num: 'text-3xl', label: 'text-[10px]' },
  lg: { box: 'px-6 py-4 rounded-2xl', num: 'text-5xl', label: 'text-xs' },
}

export function StatBlock({ value, label, variant = 'dark', size = 'md' }: StatBlockProps) {
  const s = sizes[size]
  return (
    <div className={`flex flex-col items-center border-2 border-foreground shadow-hard ${variants[variant]} ${s.box}`}>
      <span className={`font-black tabular-nums leading-none ${s.num}`}>{value}</span>
      <span className={`uppercase tracking-widest font-bold opacity-70 mt-1 ${s.label}`}>{label}</span>
    </div>
  )
}
