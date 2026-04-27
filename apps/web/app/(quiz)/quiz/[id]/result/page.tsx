'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_QUESTIONS, mockQuizzes } from '@/lib/mock-data'

const MOCK_RESULTS = [
  { questionId: 'q1', correct: true, score: 100 },
  { questionId: 'q2', correct: true, score: 100 },
  { questionId: 'q3', correct: false, score: 50 },
  { questionId: 'q4', correct: false, score: 0 },
  { questionId: 'q5', correct: false, score: 40 },
  { questionId: 'q6', correct: false, score: 30 },
]

export default function ResultPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const quiz = mockQuizzes.find((q) => q.id === id) ?? mockQuizzes[0]

  const [copied, setCopied] = useState(false)

  const totalCount = MOCK_QUESTIONS.length
  const scoreParam = searchParams.get('score')
  const avgScore = scoreParam
    ? parseInt(scoreParam, 10)
    : Math.round(MOCK_RESULTS.reduce((sum, r) => sum + r.score, 0) / totalCount)
  const correctCount = MOCK_RESULTS.filter((r) => r.correct).length
  const isHigh = avgScore > 80

  function shareResult() {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/quiz/${id}` : ''
    const text = `I scored ${avgScore}% on "${quiz.title}" — try it: ${url}`
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="relative min-h-screen bg-[#ffd426] text-[#151515]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#151515_1.2px,transparent_1.2px)] [background-size:18px_18px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-5 p-5 lg:p-8">
        {/* Score hero */}
        <div className={cn(
          'flex flex-col items-center gap-3 rounded-[1.5rem] border-[3px] border-[#151515] py-10 shadow-[6px_6px_0_#151515]',
          isHigh ? 'bg-[#d9ff69]' : 'bg-white/80'
        )}>
          {isHigh && (
            <div className="rounded-full border-[3px] border-[#1e6f38] bg-[#151515] px-5 py-1.5">
              <p className="font-mono text-xs font-black text-[#d9ff69]">Nice work!</p>
            </div>
          )}
          <p className={cn(
            'text-8xl font-black leading-none tracking-[-0.06em]',
            isHigh ? 'text-[#1e6f38]' : 'text-[#151515]'
          )}>
            {avgScore}%
          </p>
          <p className={cn('text-lg font-black', isHigh ? 'text-[#1e6f38]' : 'text-[#67606a]')}>
            {correctCount} of {totalCount} correct
          </p>
          <p className="font-mono text-xs font-bold text-[#67606a]">{quiz.title}</p>

          {/* Share button */}
          <button
            type="button"
            onClick={shareResult}
            className={cn(
              'mt-2 flex items-center gap-2 rounded-[0.9rem] border-[3px] border-[#151515] px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5',
              copied ? 'bg-[#151515] text-[#ffd426]' : 'bg-white text-[#151515]'
            )}
          >
            {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
            {copied ? 'Copied to clipboard!' : 'Share result'}
          </button>
        </div>

        {/* Per-question review */}
        <div className="flex flex-col gap-3 rounded-[1.3rem] border-[3px] border-[#151515] bg-white/70 p-5 shadow-[5px_5px_0_#151515]">
          <h2 className="text-lg font-black">Question Review</h2>
          <div className="flex flex-col gap-3">
            {MOCK_QUESTIONS.map((q, i) => {
              const result = MOCK_RESULTS[i]
              return (
                <div
                  key={q.id}
                  className={cn(
                    'rounded-[1rem] border-[3px] border-[#151515] p-4 shadow-[2px_2px_0_#151515]',
                    result?.correct ? 'bg-[#d9ff69]/40' : 'bg-[#ff6b62]/20'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-[2px] font-mono text-[10px] font-black',
                      result?.correct
                        ? 'border-[#1e6f38] bg-[#d9ff69] text-[#1e6f38]'
                        : 'border-[#9c231d] bg-[#ff6b62] text-[#9c231d]'
                    )}>
                      {result?.correct ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black">Q{i + 1}: {q.prompt}</p>
                        {q.type !== 'multiple-choice' && result?.score !== undefined && (
                          <span className="font-mono text-[10px] font-black text-[#67606a]">{result.score}%</span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#67606a]">
                        {q.type === 'multiple-choice' ? 'Single choice' :
                         q.type === 'multi-select' ? 'Multi-select' :
                         q.type === 'open-ended' ? 'Open ended' : 'Code'}
                      </p>
                      {q.explanation && !result?.correct && (
                        <p className="mt-1 text-xs text-[#67606a]">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href={`/quiz/${id}/take`}
            className="flex-1 rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-4 text-center text-base font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5"
          >
            Retry
          </Link>
          <Link
            href={`/quiz/${id}`}
            className="flex-1 rounded-[1rem] border-[3px] border-[#151515] bg-white py-4 text-center text-base font-black shadow-[4px_4px_0_#151515] transition-transform hover:-translate-y-0.5"
          >
            Back to quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
