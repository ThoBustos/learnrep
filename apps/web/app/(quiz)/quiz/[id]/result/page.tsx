'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Share2, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

type StoredAnswer = {
  questionId: string
  prompt: string
  type: string
  correct: boolean
  score: number
  feedback: string
}

type QuizAttempt = {
  id: string
  quiz_id: string
  score: number
  answers: StoredAnswer[]
  completed_at: string
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const attemptId = searchParams.get('attempt')
  const scoreParam = searchParams.get('score')

  const [copied, setCopied] = useState(false)

  const { data: attempt, isLoading } = useQuery<QuizAttempt | null>({
    queryKey: ['attempt', attemptId],
    enabled: !!attemptId,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('id, quiz_id, score, answers, completed_at')
        .eq('id', attemptId!)
        .single()
      if (error || !data) return null
      return data as QuizAttempt
    },
  })

  // Determine display values
  const answers: StoredAnswer[] = attempt?.answers ?? []
  const totalCount = answers.length
  const correctCount = answers.filter((a) => a.correct).length

  const avgScore: number = attempt
    ? attempt.score
    : scoreParam
    ? parseInt(scoreParam, 10)
    : 0

  const isHigh = avgScore > 80

  function shareResult() {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/quiz/${id}` : ''
    const text = `I scored ${avgScore}% on this quiz — try it: ${url}`
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading state when fetching attempt
  if (attemptId && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--lr-notebook)]">
        <div className="font-mono text-sm font-bold text-[var(--lr-muted)]">Loading results...</div>
      </div>
    )
  }

  const hasReview = answers.length > 0

  return (
    <div
      className="relative min-h-screen bg-[var(--lr-notebook)] text-[var(--lr-ink)]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-70" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-5 p-5 lg:p-8">
        {/* Score hero */}
        <div className={cn(
          'flex flex-col items-center gap-3 border-[3px] border-[var(--lr-line)] py-10 shadow-[var(--lr-shadow-lg)]',
          isHigh ? 'bg-[var(--lr-green)]' : 'bg-white/85'
        )}>
          {isHigh && (
            <div className="rounded-full border-[3px] border-[var(--lr-green-dark)] bg-[var(--lr-ink)] px-5 py-1.5">
              <p className="font-mono text-xs font-black text-[var(--lr-green)]">Nice work!</p>
            </div>
          )}
          <p className={cn(
            'text-8xl font-black leading-none tracking-normal',
            isHigh ? 'text-[var(--lr-green-dark)]' : 'text-[var(--lr-ink)]'
          )}>
            {avgScore}%
          </p>
          {hasReview && (
            <p className={cn('text-lg font-black', isHigh ? 'text-[var(--lr-green-dark)]' : 'text-[var(--lr-muted)]')}>
              {correctCount} of {totalCount} correct
            </p>
          )}

          {/* Share button */}
          <button
            type="button"
            onClick={shareResult}
            className={cn(
              'mt-2 flex items-center gap-2 border-[3px] border-[var(--lr-line)] px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-widest shadow-[var(--lr-shadow-sm)] transition-transform hover:-translate-y-0.5',
              copied ? 'bg-[var(--lr-ink)] text-[var(--lr-yolk)]' : 'bg-white text-[var(--lr-ink)]'
            )}
          >
            {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
            {copied ? 'Copied to clipboard!' : 'Share result'}
          </button>
        </div>

        {/* Per-question review — only when we have real answer data */}
        {hasReview && (
          <div className="flex flex-col gap-3 border-[3px] border-[var(--lr-line)] bg-white/75 p-5 shadow-[5px_5px_0_var(--lr-line)]">
            <h2 className="text-lg font-black">Question Review</h2>
            <div className="flex flex-col gap-3">
              {answers.map((a, i) => (
                <div
                  key={a.questionId}
                  className={cn(
                    'border-[3px] p-4 shadow-[var(--lr-shadow-sm)]',
                    a.correct
                      ? 'border-[var(--lr-green-dark)] bg-[color:color-mix(in_srgb,var(--lr-green)_40%,white)]'
                      : 'border-[var(--lr-red-dark)] bg-[color:color-mix(in_srgb,var(--lr-red)_20%,white)]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-[2px] font-mono text-[10px] font-black',
                      a.correct
                        ? 'border-[var(--lr-green-dark)] bg-[var(--lr-green)] text-[var(--lr-green-dark)]'
                        : 'border-[var(--lr-red-dark)] bg-[var(--lr-red)] text-[var(--lr-ink)]'
                    )}>
                      {a.correct ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black">Q{i + 1}: {a.prompt}</p>
                        {a.type !== 'multiple-choice' && (
                          <span className="font-mono text-[10px] font-black text-[var(--lr-muted)]">{a.score}%</span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--lr-muted)]">
                        {a.type === 'multiple-choice' ? 'Single choice' :
                         a.type === 'multi-select' ? 'Multi-select' :
                         a.type === 'open-ended' ? 'Open ended' : 'Code'}
                      </p>
                      {a.feedback && !a.correct && (
                        <p className="mt-1 text-xs text-[var(--lr-muted)]">{a.feedback}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href={`/quiz/${id}/take`}
            className="flex-1 border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] py-4 text-center text-base font-black text-[var(--lr-yolk)] shadow-[4px_4px_0_var(--lr-tomato)] transition-transform hover:-translate-y-0.5"
          >
            Retry
          </Link>
          <Link
            href={`/quiz/${id}`}
            className="flex-1 border-[3px] border-[var(--lr-line)] bg-white py-4 text-center text-base font-black shadow-[var(--lr-shadow-md)] transition-transform hover:-translate-y-0.5"
          >
            Back to quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
