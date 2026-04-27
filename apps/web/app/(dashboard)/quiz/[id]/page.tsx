'use client'

import { useState, use, useContext } from 'react'
import Link from 'next/link'
import { Copy, Lock, Unlock, Check, Bell, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockQuizzes, mockLeaderboard, difficultyStyles } from '@/lib/mock-data'
import { NotifContext } from '@/components/layout/NotifContext'

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const quiz = mockQuizzes.find((q) => q.id === id) ?? mockQuizzes[0]
  const isOwner = quiz.isOwner
  const tone = difficultyStyles[quiz.difficulty]
  const { openNotif } = useContext(NotifContext)

  const [isPublic, setIsPublic] = useState(quiz.visibility === 'public')
  const [copied, setCopied] = useState(false)

  function copyLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}`).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const attempts = id === '1' ? mockLeaderboard : []
  const estMinutes = Math.round(quiz.questionCount * 1.5)
  const pendingRequests = id === '1' ? 1 : 0

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
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] font-mono text-xs font-black text-[#ffd426]">
              {quiz.author[0]}
            </div>
            <div>
              <p className="text-sm font-black">{quiz.author}</p>
              <p className="font-mono text-[10px] font-bold text-[#67606a]">
                {id === '1' ? '2 days ago' : '4 days ago'}
              </p>
            </div>
          </div>

          <div className="h-8 w-[3px] rounded bg-[#151515]/20" />

          <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#67606a]">
            <span className="font-black text-[#151515]">{quiz.questionCount}</span> questions
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#67606a]">
            <span className="font-black text-[#151515]">~{estMinutes} min</span> to complete
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#67606a]">
            <span className="font-black text-[#151515]">{quiz.attempts}</span> attempts
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
              onClick={() => setIsPublic(!isPublic)}
              className={cn(
                'flex items-center gap-2 rounded-[1rem] border-[3px] border-[#151515] px-5 py-3 font-black shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5',
                isPublic ? 'bg-[#7bd8ef] text-[#0d5c75]' : 'bg-white text-[#151515]'
              )}
            >
              {isPublic ? <Unlock className="size-4" /> : <Lock className="size-4" />}
              {isPublic ? 'Public' : 'Private'}
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

            {pendingRequests > 0 && (
              <button
                type="button"
                onClick={openNotif}
                className="flex items-center gap-2 rounded-[1rem] border-[3px] border-[#9c231d] bg-[#ff6b62]/20 px-5 py-3 font-black text-[#9c231d] shadow-[3px_3px_0_#9c231d] transition-transform hover:-translate-y-0.5"
              >
                <Bell className="size-4" />
                <span className="flex size-5 items-center justify-center rounded-full bg-[#ff6b62] font-mono text-[10px] font-black text-white">
                  {pendingRequests}
                </span>
                pending request{pendingRequests > 1 ? 's' : ''}
              </button>
            )}
          </>
        )}
      </div>

      {/* Leaderboard */}
      <div className="rounded-[1.3rem] border-[3px] border-[#151515] bg-white/70 p-5 shadow-[5px_5px_0_#151515]">
        <h2 className="mb-4 text-lg font-black">Attempts</h2>
        {attempts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#67606a]">
              No attempts yet. Be the first.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {attempts.map((entry) => (
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
                  {entry.user[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{entry.user}</p>
                  <p className="font-mono text-[10px] font-bold text-[#67606a]">
                    {new Date(entry.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <p className="text-lg font-black">{entry.score}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
