import { ExternalLink } from 'lucide-react'

type Props = { title: string; meta: string }

export function QuizPreviewCard({ title, meta }: Props) {
  return (
    <div className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-blue)] p-4 text-[var(--lr-blue-dark)] shadow-[5px_5px_0_var(--lr-line)]">
      <p className="inline-flex border-[2px] border-[var(--lr-line)] bg-[var(--lr-yolk)] px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-ink)]">
        Then in your browser
      </p>
      <p className="mt-2 text-lg font-black leading-snug">{title}</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 border-[2px] border-[var(--lr-blue-dark)] bg-white px-3 py-2">
          <p className="font-mono text-xs font-bold">{meta}</p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center border-[2.5px] border-[var(--lr-line)] bg-[var(--lr-ink)] shadow-[2px_2px_0_var(--lr-tomato)]">
          <ExternalLink className="size-4 text-[var(--lr-blue)]" />
        </div>
      </div>
    </div>
  )
}
