'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { mockQuizzes, difficultyStyles } from '@/lib/mock-data'
import type { MockQuiz } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-5 lg:p-8">
      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard value="24" label="Quizzes taken" tone="dark" />
        <StatCard value="8" label="Topics explored" tone="paper" />
        <StatCard value="+14%" label="Avg improvement" tone="lime" />
      </div>

      {/* CLI callout */}
      <div className="rounded-[1.3rem] border-[3px] border-[#151515] bg-[#151515] px-5 py-4 shadow-[5px_5px_0_#ff5858]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd426]/60">
          Generate quizzes via CLI
        </p>
        <p className="mt-1 font-mono text-base font-black text-[#d9ff69]">
          learnrep generate &quot;react hooks&quot;
        </p>
        <p className="mt-1 font-mono text-[10px] font-bold text-[#ffd426]/50">
          → opens your quiz at this URL
        </p>
      </div>

      {/* Feed list */}
      <div className="flex flex-col gap-3 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 p-4 shadow-[6px_6px_0_#151515]">
        <h2 className="text-lg font-black">Your Feed</h2>
        <div className="flex flex-col gap-2">
          {mockQuizzes.map((quiz) => (
            <FeedRow key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeedRow({ quiz }: { quiz: MockQuiz }) {
  const tone = difficultyStyles[quiz.difficulty]
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white p-3 shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5">
      <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-[0.7rem] border-[3px]', tone.border, tone.bg)}>
        <span className={cn('font-mono text-[9px] font-black uppercase', tone.text)}>
          {quiz.topic.slice(0, 2)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{quiz.title}</p>
        <p className="font-mono text-[10px] font-bold text-[#67606a]">
          {quiz.author} · {quiz.questionCount}q · {quiz.attempts} attempts
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={cn('rounded-full border-[2px] px-2 py-0.5 font-mono text-[9px] font-bold uppercase', tone.border, tone.bg, tone.text)}>
          {tone.label}
        </span>
        <Link
          href={`/quiz/${quiz.id}`}
          className="rounded-[0.7rem] border-[3px] border-[#151515] bg-[#ffd426] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5"
        >
          Go
        </Link>
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
    <div className={cn('rounded-[1.1rem] border-[3px] border-[#151515] p-4 shadow-[4px_4px_0_#151515]', tones[tone])}>
      <p className="text-3xl font-black leading-none tracking-[-0.06em]">{value}</p>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">{label}</p>
    </div>
  )
}
