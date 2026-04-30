import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { GitHubStarButton } from '@/components/ui/GitHubStarButton'

type Props = { stars?: number | null }

export function LandingNav({ stars }: Props) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#151515]/10 bg-[#fafaf8]/90 px-6 py-4 backdrop-blur-sm sm:px-10">
      <div className="flex items-center gap-2.5">
        <Image src="/logos/logo.svg" alt="LearnRep" width={44} height={44} className="size-11" />
        <span className="text-lg font-black tracking-[-0.03em]">LearnRep</span>
      </div>
      <nav className="flex items-center gap-5">
        <Link
          href="/docs"
          className="hidden items-center gap-1.5 rounded-[0.9rem] border-[3px] border-[#151515] bg-white px-3 py-2 font-mono text-[10px] font-black shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5 sm:flex"
        >
          <BookOpen className="size-3" />
          Docs
        </Link>
        <div className="hidden sm:flex">
          <GitHubStarButton stars={stars} />
        </div>
        <Link
          href="/login"
          className="rounded-[0.6rem] border-[3px] border-[#151515] bg-[#ffd426] px-4 py-2 font-mono text-[11px] font-black uppercase tracking-widest text-[#151515] shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5"
        >
          Sign in
        </Link>
      </nav>
    </header>
  )
}
