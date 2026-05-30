import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { GitHubStarButton } from '@/components/ui/GitHubStarButton'

type Props = { stars?: number | null }

export function LandingNav({ stars }: Props) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-6 py-4 text-[var(--lr-ink)] sm:px-10">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logos/robot.svg" alt="" width={44} height={44} className="shrink-0" />
        <span
          className="text-xl leading-none tracking-normal text-[var(--lr-ink)]"
          style={{ fontFamily: 'var(--font-bowlby)' }}
        >
          Learn<span className="text-[var(--lr-blue-dark)]">Rep</span>
        </span>
      </Link>
      <nav className="flex items-center gap-5">
        <Link
          href="/docs"
          className="hidden items-center gap-1.5 border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] px-3 py-2 font-mono text-[10px] font-black shadow-[var(--lr-shadow-sm)] transition-transform hover:-translate-y-0.5 sm:flex"
        >
          <BookOpen className="size-3" />
          Docs
        </Link>
        <div className="hidden sm:flex">
          <GitHubStarButton stars={stars} />
        </div>
        <Link
          href="/login"
          className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)] px-4 py-2 font-mono text-[11px] font-black uppercase tracking-widest text-[var(--lr-ink)] shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5"
        >
          Log In
        </Link>
      </nav>
    </header>
  )
}
