import Link from 'next/link'
import { Star } from 'lucide-react'

const REPO_URL = 'https://github.com/ThoBustos/learnrep'

export function GitHubStarButton({ stars }: { stars?: number | null }) {
  return (
    <Link
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={stars == null ? 'Star LearnRep on GitHub' : `Star LearnRep on GitHub. ${stars.toLocaleString()} stars`}
      className="flex items-center gap-1.5 rounded-[0.9rem] border-[3px] border-[var(--lr-ink,#151515)] bg-[var(--lr-white,#fff)] px-3 py-2 font-mono text-[10px] font-black shadow-[2px_2px_0_var(--lr-ink,#151515)] transition-transform hover:-translate-y-0.5"
    >
      <Star className="size-3 fill-[var(--lr-ink,#151515)]" />
      {stars != null && (
        <span className="tabular-nums">{stars.toLocaleString()}</span>
      )}
    </Link>
  )
}
