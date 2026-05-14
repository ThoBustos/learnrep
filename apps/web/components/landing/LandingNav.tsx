import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { GitHubStarButton } from '@/components/ui/GitHubStarButton'

type Props = { stars?: number | null }

export function LandingNav({ stars }: Props) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--lr-ink)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--lr-cream)_90%,transparent)] px-6 py-4 backdrop-blur-sm sm:px-10">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logos/robot.svg" alt="" width={44} height={44} className="size-11 rounded-xl" />
        <span className="text-xl font-black tracking-[-0.04em] text-[var(--lr-ink)]">LearnRep</span>
      </Link>
      <nav className="flex items-center gap-5">
        <Link
          href="/docs"
          className="hidden items-center gap-1.5 rounded-[0.9rem] border-[3px] border-[var(--lr-ink)] bg-[var(--lr-white)] px-3 py-2 font-mono text-[10px] font-black shadow-[2px_2px_0_var(--lr-ink)] transition-transform hover:-translate-y-0.5 sm:flex"
        >
          <BookOpen className="size-3" />
          Docs
        </Link>
        <div className="hidden sm:flex">
          <GitHubStarButton stars={stars} />
        </div>
        <Link
          href="/login"
          className="rounded-[0.6rem] border-[3px] border-[var(--lr-ink)] bg-[var(--lr-yellow)] px-4 py-2 font-mono text-[11px] font-black uppercase tracking-widest text-[var(--lr-ink)] shadow-[3px_3px_0_var(--lr-ink)] transition-transform hover:-translate-y-0.5"
        >
          Log In
        </Link>
      </nav>
    </header>
  )
}
