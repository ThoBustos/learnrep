'use client'

import { use } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MOCK_QUESTIONS, mockQuizzes } from '@/lib/mock-data'

// Mocked result: user got Q1, Q2, Q4 correct (3 of 5 = 60%)
const MOCK_RESULTS = [
  { questionId: 'q1', selectedIndex: 1, correct: true },
  { questionId: 'q2', selectedIndex: 2, correct: true },
  { questionId: 'q3', selectedIndex: 0, correct: false },
  { questionId: 'q4', selectedIndex: 1, correct: true },
  { questionId: 'q5', selectedIndex: 0, correct: false },
]

const correctCount = MOCK_RESULTS.filter((r) => r.correct).length
const totalCount = MOCK_RESULTS.length
const scorePct = Math.round((correctCount / totalCount) * 100)
const isHigh = scorePct > 80

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const quiz = mockQuizzes.find((q) => q.id === id) ?? mockQuizzes[0]

  return (
    <div
      className="relative min-h-screen bg-[#ffd426] text-[#151515]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      {/* Dot grid */}
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
            {scorePct}%
          </p>
          <p className={cn('text-lg font-black', isHigh ? 'text-[#1e6f38]' : 'text-[#67606a]')}>
            {correctCount} of {totalCount} correct
          </p>
          <p className="font-mono text-xs font-bold text-[#67606a]">{quiz.title}</p>
        </div>

        {/* Per-question review */}
        <div className="flex flex-col gap-3 rounded-[1.3rem] border-[3px] border-[#151515] bg-white/70 p-5 shadow-[5px_5px_0_#151515]">
          <h2 className="text-lg font-black">Question Review</h2>
          <div className="flex flex-col gap-3">
            {MOCK_RESULTS.map((result, i) => {
              const q = MOCK_QUESTIONS[i]
              const selectedAnswer = q.options[result.selectedIndex]
              const correctAnswer = q.options[q.correctIndex]
              return (
                <div
                  key={result.questionId}
                  className={cn(
                    'rounded-[1rem] border-[3px] border-[#151515] p-4 shadow-[2px_2px_0_#151515]',
                    result.correct ? 'bg-[#d9ff69]/40' : 'bg-[#ff6b62]/20'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn(
                      'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-[2px] font-mono text-[10px] font-black',
                      result.correct
                        ? 'border-[#1e6f38] bg-[#d9ff69] text-[#1e6f38]'
                        : 'border-[#9c231d] bg-[#ff6b62] text-[#9c231d]'
                    )}>
                      {result.correct ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black">Q{i + 1}: {q.prompt}</p>
                      <div className="mt-1 flex flex-col gap-0.5 font-mono text-[10px]">
                        <p className="text-[#67606a]">
                          Your answer:{' '}
                          <span className={cn('font-black', result.correct ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
                            {selectedAnswer}
                          </span>
                        </p>
                        {!result.correct && (
                          <p className="text-[#67606a]">
                            Correct:{' '}
                            <span className="font-black text-[#1e6f38]">{correctAnswer}</span>
                          </p>
                        )}
                      </div>
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
