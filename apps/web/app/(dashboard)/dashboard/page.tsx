'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { difficultyStyles } from '@/lib/mock-data'

const HARNESS_PROMPT = 'run lr help, then generate a quiz about all the learnings from this session'

type UserStats = {
  quizzesTaken: number
  topicsExplored: number
  quizzesGenerated: number
  avgScore: number | null
  streak: number
  avgImprovement: number | null
}

type ApiQuiz = {
  id: string
  title: string
  topic: string
  difficulty: string
  questionCount: number
  is_public: boolean
  created_at: string
  attemptCount: number
  myBestScore: number | null
}

export default function DashboardPage() {
  const [copied, setCopied] = useState(false)

  const { data: stats } = useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: ({ signal }) =>
      fetch('/api/user/stats', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch stats'))
      ),
  })

  const { data: quizzes = [] } = useQuery<ApiQuiz[]>({
    queryKey: ['quizzes'],
    queryFn: ({ signal }) =>
      fetch('/api/quizzes', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch'))
      ),
  })

  function copyPrompt() {
    navigator.clipboard.writeText(HARNESS_PROMPT).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statCards = [
    {
      value: stats ? stats.quizzesTaken.toString() : '--',
      label: 'Quizzes taken',
      tone: 'dark' as const,
    },
    {
      value: stats ? stats.topicsExplored.toString() : '--',
      label: 'Topics explored',
      tone: 'paper' as const,
    },
    {
      value: stats?.avgScore != null ? `${stats.avgScore}%` : '--',
      label: 'Avg score',
      tone: 'lime' as const,
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 lg:p-8">
      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map((card) => (
          <StatCard key={card.label} value={card.value} label={card.label} tone={card.tone} />
        ))}
      </div>

      {/* CLI callout */}
      <div className="group relative rounded-[1.3rem] border-[3px] border-[#151515] bg-[#151515] px-5 py-4 shadow-[5px_5px_0_#d9ff69]">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
          Let your harness generate quizzes
        </p>
        <p className="mt-2 font-mono text-sm font-black text-[#d9ff69]">
          &ldquo;run lr help, then generate a quiz about all the learnings from this session&rdquo;
        </p>
        <p className="mt-2 font-mono text-[10px] font-bold text-white/30">
          → your assistant calls lr generate
        </p>
        <button
          type="button"
          onClick={copyPrompt}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-[0.6rem] border-[2px] border-[#d9ff69]/30 bg-white/10 px-2.5 py-1.5 font-mono text-[10px] font-black text-[#d9ff69] opacity-0 transition-all group-hover:opacity-100 hover:border-[#d9ff69]/60 hover:bg-white/20"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Feed list */}
      <div className="flex flex-col gap-3 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 p-4 shadow-[6px_6px_0_#151515]">
        <h2 className="text-lg font-black">Your Feed</h2>
        {quizzes.length === 0 ? (
          <p className="py-4 text-center font-mono text-xs font-bold text-[#67606a]">No quizzes yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {quizzes.map((quiz) => (
              <FeedRow key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FeedRow({ quiz }: { quiz: ApiQuiz }) {
  const tone = difficultyStyles[quiz.difficulty as keyof typeof difficultyStyles] ?? difficultyStyles.medium
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
          {quiz.questionCount}q · {quiz.attemptCount} attempts
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
