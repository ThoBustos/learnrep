'use client'

import { useState } from 'react'

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

const difficultyTone: Record<Difficulty, { bg: string; text: string; border: string; label: string }> = {
  easy:   { bg: 'bg-[#d9ff69]', text: 'text-[#1e6f38]', border: 'border-[#1e6f38]', label: 'Easy' },
  medium: { bg: 'bg-[#7bd8ef]', text: 'text-[#0d5c75]', border: 'border-[#0d5c75]', label: 'Medium' },
  hard:   { bg: 'bg-[#ff6b62]', text: 'text-[#9c231d]', border: 'border-[#9c231d]', label: 'Hard' },
  expert: { bg: 'bg-[#b995ff]', text: 'text-[#5735a7]', border: 'border-[#5735a7]', label: 'Expert' },
}

const mockQuizzes = [
  { id: '1', title: 'React Server Components', topic: 'React', difficulty: 'medium' as Difficulty, questions: 8, attempts: 3, best: 75, author: 'Thomas B.', time: '2h ago' },
  { id: '2', title: 'TypeScript Generics', topic: 'TypeScript', difficulty: 'hard' as Difficulty, questions: 10, attempts: 1, best: 60, author: 'Angel C.', time: '4h ago' },
  { id: '3', title: 'Closures & Scope', topic: 'JavaScript', difficulty: 'easy' as Difficulty, questions: 6, attempts: 5, best: 90, author: 'Thomas B.', time: 'Yesterday' },
  { id: '4', title: 'SQL Indexes Deep Dive', topic: 'Database', difficulty: 'expert' as Difficulty, questions: 12, attempts: 2, best: 45, author: 'John M.', time: 'Yesterday' },
  { id: '5', title: 'Async Patterns in Go', topic: 'Go', difficulty: 'hard' as Difficulty, questions: 9, attempts: 0, best: 0, author: 'Angel C.', time: '2d ago' },
]

const mockLeaderboard = [
  { rank: 1, name: 'Thomas B.', handle: '@thomas', score: 3240, streak: 12 },
  { rank: 2, name: 'Angel C.', handle: '@angel', score: 2870, streak: 8 },
  { rank: 3, name: 'John M.', handle: '@john', score: 2510, streak: 5 },
  { rank: 4, name: 'Sara K.', handle: '@sara', score: 1980, streak: 3 },
]

const navItems = [
  { label: 'Feed', icon: HomeIcon },
  { label: 'My Quizzes', icon: BookIcon },
  { label: 'Stats', icon: ChartIcon },
  { label: 'Team', icon: TeamIcon },
]

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('Feed')
  const [activeTab, setActiveTab] = useState('Feed')

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#ffd426] text-[#151515]"
      style={{ fontFamily: 'var(--font-space-grotesk, system-ui, sans-serif)' }}
    >
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#151515_1.2px,transparent_1.2px)] [background-size:18px_18px]" />

      <div className="relative flex min-h-screen">
        {/* Sidebar — desktop */}
        <aside className="hidden w-64 shrink-0 flex-col gap-2 border-r-[3px] border-[#151515] bg-[#ffd426] px-4 py-6 lg:flex">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] font-black text-[#ffd426]">L</div>
            <span className="text-lg font-black tracking-[-0.04em]">LearnRep</span>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={cx(
                  'flex items-center gap-3 rounded-[0.9rem] border-[3px] px-4 py-3 text-sm font-black transition-all',
                  activeNav === label
                    ? 'border-[#151515] bg-[#151515] text-[#ffd426] shadow-[3px_3px_0_#ff5858]'
                    : 'border-transparent hover:border-[#151515] hover:bg-white/50'
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="flex items-center gap-3 rounded-[0.9rem] border-[3px] border-[#151515] bg-white/60 px-4 py-3">
              <div className="flex size-8 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] font-mono text-xs font-black text-[#ffd426]">T</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black">Thomas B.</p>
                <p className="truncate font-mono text-[10px] font-bold text-[#67606a]">@thomas · 🔥 12</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between border-b-[3px] border-[#151515] bg-[#ffd426] px-5 py-4">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">Team · Supernal</p>
              <h1 className="text-xl font-black leading-tight tracking-[-0.04em]">Good morning, Thomas 👋</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-[0.9rem] border-[3px] border-[#151515] bg-[#151515] px-4 py-2 text-[#ffd426] sm:flex">
                <span className="text-lg">🔥</span>
                <span className="font-black">12 day streak</span>
              </div>
              <button className="flex size-10 items-center justify-center rounded-full border-[3px] border-[#151515] bg-white font-black shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5">
                +
              </button>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-5 lg:flex-row lg:p-8">
            {/* Left column */}
            <div className="flex flex-1 flex-col gap-5">
              {/* Stat strip */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard value="24" label="Quizzes taken" tone="dark" />
                <StatCard value="8" label="Topics explored" tone="paper" />
                <StatCard value="+14%" label="Avg improvement" tone="lime" />
              </div>

              {/* Tabs + feed */}
              <div className="flex flex-col gap-3 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 p-4 shadow-[6px_6px_0_#151515]">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">Team Feed</h2>
                  <Tabs tabs={['Feed', 'Trending', 'New']} active={activeTab} onChange={setActiveTab} />
                </div>
                <div className="flex flex-col gap-2">
                  {mockQuizzes.map((quiz) => (
                    <FeedRow key={quiz.id} quiz={quiz} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex w-full flex-col gap-5 lg:w-72 lg:shrink-0">
              {/* Generate CTA */}
              <button className="w-full rounded-[1.3rem] border-[3px] border-[#151515] bg-[#151515] px-5 py-4 text-left text-[#ffd426] shadow-[5px_5px_0_#ff5858] transition-transform hover:-translate-y-0.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd426]/60">New quiz</p>
                <p className="text-xl font-black leading-tight">Generate from topic or paste content</p>
                <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd426]/60">⌘ + G to generate</p>
              </button>

              {/* Leaderboard */}
              <div className="rounded-[1.3rem] border-[3px] border-[#151515] bg-white/70 p-4 shadow-[5px_5px_0_#151515]">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-black">Leaderboard</h2>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#67606a]">This week</span>
                </div>
                <div className="flex flex-col gap-2">
                  {mockLeaderboard.map((entry) => (
                    <LeaderRow key={entry.handle} {...entry} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex border-t-[3px] border-[#151515] bg-[#ffd426] lg:hidden">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveNav(label)}
            className={cx(
              'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-colors',
              activeNav === label ? 'bg-[#151515] text-[#ffd426]' : 'text-[#151515]'
            )}
          >
            <Icon className="size-5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

function FeedRow({ quiz }: { quiz: typeof mockQuizzes[number] }) {
  const tone = difficultyTone[quiz.difficulty]
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white p-3 shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5">
      <div className={cx('flex size-10 shrink-0 items-center justify-center rounded-[0.7rem] border-[3px]', tone.border, tone.bg)}>
        <span className={cx('font-mono text-[9px] font-black uppercase', tone.text)}>{quiz.topic.slice(0, 2)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{quiz.title}</p>
        <p className="font-mono text-[10px] font-bold text-[#67606a]">{quiz.author} · {quiz.time}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={cx('rounded-full border-[2px] px-2 py-0.5 font-mono text-[9px] font-bold uppercase', tone.border, tone.bg, tone.text)}>
          {tone.label}
        </span>
        <button className="rounded-[0.7rem] border-[3px] border-[#151515] bg-[#ffd426] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5">
          Go →
        </button>
      </div>
    </div>
  )
}

function StatCard({ value, label, tone }: { value: string; label: string; tone: 'dark' | 'paper' | 'lime' }) {
  const tones = {
    dark:  'bg-[#151515] text-[#ffd426]',
    paper: 'bg-white text-[#151515]',
    lime:  'bg-[#d9ff69] text-[#1e6f38]',
  }
  return (
    <div className={cx('rounded-[1.1rem] border-[3px] border-[#151515] p-4 shadow-[4px_4px_0_#151515]', tones[tone])}>
      <p className="text-3xl font-black leading-none tracking-[-0.06em]">{value}</p>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">{label}</p>
    </div>
  )
}

function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 rounded-[0.9rem] border-[3px] border-[#151515] bg-[#ffd426] p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cx(
            'rounded-[0.6rem] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-all',
            active === tab ? 'bg-[#151515] text-[#ffd426]' : 'text-[#151515] hover:bg-white/50'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function LeaderRow({ rank, name, handle, score, streak }: { rank: number; name: string; handle: string; score: number; streak: number }) {
  return (
    <div className={cx(
      'flex items-center gap-3 rounded-[0.9rem] border-[3px] border-[#151515] p-2.5 shadow-[3px_3px_0_#151515]',
      rank === 1 ? 'bg-[#ffd426]' : 'bg-white'
    )}>
      <div className={cx('flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#151515] font-black text-sm', rank === 1 ? 'bg-[#151515] text-[#ffd426]' : 'bg-[#f5f4f0]')}>
        {rank}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{name}</p>
        <p className="font-mono text-[10px] font-bold text-[#67606a]">{handle} · 🔥{streak}</p>
      </div>
      <p className="font-black">{score.toLocaleString()}</p>
    </div>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" /></svg>
}

function BookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 17V4a1 1 0 011-1h14a1 1 0 011 1v13" /></svg>
}

function ChartIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M7 16l4-4 4 4 4-4" /></svg>
}

function TeamIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
}
