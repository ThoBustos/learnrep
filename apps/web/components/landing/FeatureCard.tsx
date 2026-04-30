import { cn } from '@/lib/utils'

type Props = {
  icon: React.ReactNode
  title: string
  body: string
  bg: string
}

export function FeatureCard({ icon, title, body, bg }: Props) {
  return (
    <div className={cn('rounded-[1.3rem] border-[3px] border-[#151515] p-6 shadow-[5px_5px_0_#151515]', bg)}>
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-relaxed text-[#151515]/60">{body}</p>
    </div>
  )
}
