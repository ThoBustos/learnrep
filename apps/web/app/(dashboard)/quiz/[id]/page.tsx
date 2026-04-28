'use client'

import { useContext, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Copy, Lock, Unlock, Check, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { difficultyStyles } from '@/lib/mock-data'
import { NotifContext } from '@/components/layout/NotifContext'
import { createClient } from '@/lib/supabase/client'

type Quiz = {
  id: string
  user_id: string
  title: string
  topic: string
  difficulty: string
  questions: unknown[]
  is_public: boolean
  share_code: string | null
}

type LeaderboardEntry = {
  id: string
  score: number
  completed_at: string
  display_name: string | null
  avatar_url: string | null
  rank: number
}

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { openNotif, unreadCount } = useContext(NotifContext)
  const queryClient = useQueryClient()

  const [copied, setCopied] = useState(false)
  const [isPublicOverride, setIsPublicOverride] = useState<boolean | null>(null)

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => createClient().auth.getUser().then(({ data }) => data.user ?? null),
  })

  const { data: quiz, isLoading: quizLoading } = useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: ({ signal }) =>
      fetch(`/api/quiz/${id}`, { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Quiz not found'))
      ),
  })

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', id],
    queryFn: ({ signal }) =>
      fetch(`/api/quiz/${id}/leaderboard`, { signal }).then((r) =>
        r.ok ? r.json() : []
      ),
    enabled: !!quiz?.is_public,
  })

  const isOwner = !!(currentUser && quiz?.user_id && currentUser.id === quiz.user_id)
  const effectiveIsPublic = isPublicOverride ?? quiz?.is_public ?? false

  async function toggleVisibility() {
    if (!quiz) return
    const newValue = !effectiveIsPublic
    setIsPublicOverride(newValue) // optimistic
    try {
      const res = await fetch(`/api/quiz/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_public: newValue }),
      })
      if (!res.ok) {
        setIsPublicOverride(!newValue) // revert
      } else {
        queryClient.invalidateQueries({ queryKey: ['quiz', id] })
        if (newValue) {
          queryClient.invalidateQueries({ queryKey: ['leaderboard', id] })
        }
      }
    } catch {
      setIsPublicOverride(!newValue) // revert
    }
  }

  function copyLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}`).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (quizLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#67606a]">Loading...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#67606a]">Quiz not found.</p>
      </div>
    )
  }

  const tone = difficultyStyles[quiz.difficulty as keyof typeof difficultyStyles] ?? difficultyStyles.medium
  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0
  const estMinutes = Math.round(questionCount * 1.5)
  const attemptCount = leaderboard.length

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-8">
      {/* Back nav */}
      <Link
        href="/quizzes"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-[#67606a] hover:text-[#151515]"
      >
        <ChevronLeft className="size-3.5" />
        My Quizzes
      </Link>

      {/* Header card */}
      <div className="rounded-[1.5rem] border-[3px] border-[#151515] bg-white/80 p-6 shadow-[6px_6px_0_#151515]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border-[2px] border-[#151515] bg-[#ffd426] px-3 py-0.5 font-mono text-[10px] font-black uppercase">
            {quiz.topic}
          </span>
          <span className={cn('rounded-full border-[2px] px-3 py-0.5 font-mono text-[10px] font-black uppercase', tone.border, tone.bg, tone.text)}>
            {tone.label}
          </span>
        </div>

        <h1 className="text-3xl font-black leading-tight tracking-[-0.04em]">{quiz.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="h-8 w-[3px] rounded bg-[#151515]/20" />

          <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#67606a]">
            <span className="font-black text-[#151515]">{questionCount}</span> questions
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#67606a]">
            <span className="font-black text-[#151515]">~{estMinutes} min</span> to complete
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#67606a]">
            <span className="font-black text-[#151515]">{attemptCount}</span> attempts
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/quiz/${id}/take`}
          className="rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] px-8 py-3 text-lg font-black text-[#ffd426] shadow-[5px_5px_0_#ff5858] transition-transform hover:-translate-y-0.5"
        >
          Start Quiz
        </Link>

        {isOwner && (
          <>
            <button
              type="button"
              onClick={toggleVisibility}
              className={cn(
                'flex items-center gap-2 rounded-[1rem] border-[3px] border-[#151515] px-5 py-3 font-black shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5',
                effectiveIsPublic ? 'bg-[#7bd8ef] text-[#0d5c75]' : 'bg-white text-[#151515]'
              )}
            >
              {effectiveIsPublic ? <Unlock className="size-4" /> : <Lock className="size-4" />}
              {effectiveIsPublic ? 'Public' : 'Private'}
            </button>

            <button
              type="button"
              onClick={copyLink}
              className={cn(
                'flex items-center gap-2 rounded-[1rem] border-[3px] border-[#151515] px-5 py-3 font-black shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5',
                copied ? 'bg-[#d9ff69] text-[#1e6f38]' : 'bg-white text-[#151515]'
              )}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>

            <button
              type="button"
              onClick={openNotif}
              className="relative flex items-center gap-2 rounded-[1rem] border-[3px] border-[#9c231d] bg-[#ff6b62]/20 px-5 py-3 font-black text-[#9c231d] shadow-[3px_3px_0_#9c231d] transition-transform hover:-translate-y-0.5"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-[#ff6b62] font-mono text-[10px] font-black text-white">
                  {unreadCount}
                </span>
              )}
              {unreadCount === 1 ? '1 notification' : unreadCount > 1 ? `${unreadCount} notifications` : 'Notifications'}
            </button>
          </>
        )}
      </div>

      {/* Leaderboard */}
      <div className="rounded-[1.3rem] border-[3px] border-[#151515] bg-white/70 p-5 shadow-[5px_5px_0_#151515]">
        <h2 className="mb-4 text-lg font-black">Attempts</h2>
        {leaderboard.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#67606a]">
              No attempts yet. Be the first.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry) => {
              const displayName = entry.display_name ?? 'Anonymous'
              return (
                <div
                  key={entry.id}
                  className={cn(
                    'flex items-center gap-3 rounded-[0.9rem] border-[3px] border-[#151515] p-3 shadow-[2px_2px_0_#151515]',
                    entry.rank === 1 ? 'bg-[#ffd426]' : 'bg-white'
                  )}
                >
                  <div className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#151515] font-black text-sm',
                    entry.rank === 1 ? 'bg-[#151515] text-[#ffd426]' : 'bg-[#f5f4f0]'
                  )}>
                    {entry.rank}
                  </div>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-[2px] border-[#151515] bg-[#151515] font-mono text-[10px] font-black text-[#ffd426]">
                    {displayName[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black">{displayName}</p>
                    <p className="font-mono text-[10px] font-bold text-[#67606a]">
                      {new Date(entry.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <p className="text-lg font-black">{entry.score}%</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
