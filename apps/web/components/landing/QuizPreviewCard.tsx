import { ExternalLink } from 'lucide-react'

type Props = { title: string; meta: string }

export function QuizPreviewCard({ title, meta }: Props) {
  return (
    <div className="rounded-[1.3rem] border-[3px] border-[#151515] bg-[#ffd426] p-4 shadow-[5px_5px_0_#151515]">
      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#151515]/60">
        Then in your browser
      </p>
      <p className="mt-2 text-lg font-black leading-snug">{title}</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 rounded-[0.6rem] border-[2px] border-[#151515] bg-white px-3 py-2">
          <p className="font-mono text-xs font-bold text-[#151515]/60">{meta}</p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[0.6rem] border-[2.5px] border-[#151515] bg-[#151515]">
          <ExternalLink className="size-4 text-[#ffd426]" />
        </div>
      </div>
    </div>
  )
}
