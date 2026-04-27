import { notFound } from 'next/navigation'
import Link from 'next/link'

const versions = [
  {
    href: '/dev/v1',
    label: 'V1',
    title: 'Baseline Brutalist Cards',
    description: 'The current first pass kept intact for comparison.',
    bg: 'bg-[#f5f4f0]',
    accent: 'bg-[#1c1c2e]',
  },
  {
    href: '/dev/v2',
    label: 'V2',
    title: 'Challenge Doodle App',
    description: 'Mobile-first challenge UI with ink outlines, warm surfaces, and custom SVG-style symbols.',
    bg: 'bg-[#ffd426]',
    accent: 'bg-[#ff4f52]',
  },
  {
    href: '/dev/v3',
    label: 'V3',
    title: 'Collectible Quiz Deck',
    description: 'Trading-card direction with bold frames, rarity panels, and quiz deck compositions.',
    bg: 'bg-[#111111]',
    accent: 'bg-[#ffcf3f]',
  },
]

export default function DevIndexPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main className="min-h-screen bg-[#f8efe7] px-6 py-12 text-[#15151f]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="max-w-3xl">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#67606a]">LearnRep design explorations</p>
          <h1 className="text-5xl font-black tracking-[-0.05em] sm:text-7xl">Compare the system directions.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-[#67606a]">
            V1 remains unchanged. V2 and V3 are opinionated forks that test product screens, not just isolated atoms.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {versions.map((version) => (
            <Link
              key={version.href}
              href={version.href}
              className={`group relative overflow-hidden rounded-[2rem] border-[3px] border-[#15151f] ${version.bg} p-6 shadow-[8px_8px_0_#15151f] transition-transform hover:-translate-y-1`}
            >
              <div className={`mb-10 inline-flex size-16 items-center justify-center rounded-2xl border-[3px] border-[#15151f] ${version.accent} font-mono text-xl font-black text-white shadow-[4px_4px_0_#15151f]`}>
                {version.label}
              </div>
              <h2 className="text-2xl font-black tracking-[-0.04em]">{version.title}</h2>
              <p className="mt-3 min-h-20 text-sm font-medium leading-6 text-[#403b43]">{version.description}</p>
              <span className="mt-8 inline-flex rounded-full border-[3px] border-[#15151f] bg-white px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_#15151f]">
                Open {version.label}
              </span>
            </Link>
          ))}
        </section>

        <section className="rounded-[2rem] border-[3px] border-[#15151f] bg-white p-6 shadow-[8px_8px_0_#15151f]">
          <h2 className="text-xl font-black tracking-[-0.03em]">What to review</h2>
          <div className="mt-4 grid gap-3 text-sm font-medium leading-6 text-[#403b43] sm:grid-cols-3">
            <p>Does the direction feel ownable for LearnRep, or generic?</p>
            <p>Do the components survive real screens like challenge detail, level rows, leaderboard, and results?</p>
            <p>Which SVG assets are worth commissioning after the direction is selected?</p>
          </div>
        </section>
      </div>
    </main>
  )
}
