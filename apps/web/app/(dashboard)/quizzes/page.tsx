'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Unlock, Share2, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockQuizzes, difficultyStyles } from '@/lib/mock-data'
import type { MockQuiz } from '@/lib/mock-data'

const myQuizzes = mockQuizzes.filter((q) => q.isOwner)

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState(myQuizzes)
  const [copied, setCopied] = useState<string | null>(null)

  function toggleVisibility(id: string) {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, visibility: q.visibility === 'public' ? 'private' : 'public' } : q
      )
    )
  }

  function copyLink(id: string) {
    const url = `${window.location.origin}/quiz/${id}`
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-8">
      {/* Heading */}
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">Your library</p>
        <h1 className="text-3xl font-black tracking-[-0.04em]">My Quizzes</h1>
      </div>

      {/* Quiz list */}
      {quizzes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {quizzes.map((quiz) => (
            <QuizRow
              key={quiz.id}
              quiz={quiz}
              copied={copied === quiz.id}
              onCopy={() => copyLink(quiz.id)}
              onToggle={() => toggleVisibility(quiz.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function QuizRow({
  quiz,
  copied,
  onCopy,
  onToggle,
}: {
  quiz: MockQuiz
  copied: boolean
  onCopy: () => void
  onToggle: () => void
}) {
  const tone = difficultyStyles[quiz.difficulty]
  const isPublic = quiz.visibility === 'public'

  return (
    <div className="rounded-[1.3rem] border-[3px] border-[#151515] bg-white/80 p-4 shadow-[4px_4px_0_#151515]">
      <div className="flex flex-wrap items-start gap-3">
        {/* Topic icon */}
        <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-[0.8rem] border-[3px]', tone.border, tone.bg)}>
          <span className={cn('font-mono text-xs font-black uppercase', tone.text)}>
            {quiz.topic.slice(0, 2)}
          </span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black">{quiz.title}</h3>
            {/* Visibility badge */}
            <span className={cn(
              'rounded-full border-[2px] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest',
              isPublic
                ? 'border-[#0d5c75] bg-[#7bd8ef] text-[#0d5c75]'
                : 'border-[#151515] bg-[#f5f4f0] text-[#151515]'
            )}>
              {isPublic ? 'Public' : 'Private'}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold text-[#67606a]">
            <span className={cn('rounded-full border-[2px] px-2 py-0.5 font-bold uppercase', tone.border, tone.bg, tone.text)}>
              {tone.label}
            </span>
            <span>{quiz.questionCount} questions</span>
            <span>{quiz.attempts} attempts</span>
            <span>Created {new Date(quiz.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Toggle visibility */}
          <button
            type="button"
            onClick={onToggle}
            title={isPublic ? 'Make private' : 'Make public'}
            className="flex size-9 items-center justify-center rounded-[0.7rem] border-[3px] border-[#151515] bg-white shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5"
          >
            {isPublic ? <Unlock className="size-4" /> : <Lock className="size-4" />}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={onCopy}
            className={cn(
              'flex items-center gap-1.5 rounded-[0.7rem] border-[3px] border-[#151515] px-3 py-1.5 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5',
              copied ? 'bg-[#d9ff69] text-[#1e6f38]' : 'bg-white text-[#151515]'
            )}
          >
            <Share2 className="size-3" />
            {copied ? 'Copied!' : 'Share'}
          </button>

          {/* View */}
          <Link
            href={`/quiz/${quiz.id}`}
            className="flex items-center gap-1.5 rounded-[0.7rem] border-[3px] border-[#151515] bg-[#ffd426] px-3 py-1.5 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5"
          >
            <Eye className="size-3" />
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 py-16 shadow-[6px_6px_0_#151515]">
      <div className="flex size-16 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515] text-3xl text-[#ffd426]">
        📝
      </div>
      <div className="text-center">
        <p className="text-xl font-black">No quizzes yet</p>
        <p className="mt-1 font-mono text-xs text-[#67606a]">Generate your first quiz with the CLI</p>
      </div>
      <div className="rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] px-5 py-3 shadow-[4px_4px_0_#ff5858]">
        <p className="font-mono text-sm font-black text-[#d9ff69]">
          learnrep generate &quot;your topic&quot;
        </p>
      </div>
    </div>
  )
}
