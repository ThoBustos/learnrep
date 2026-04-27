'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MOCK_QUESTIONS, mockQuizzes } from '@/lib/mock-data'

type Phase = 'question' | 'feedback'

export default function TakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const quiz = mockQuizzes.find((q) => q.id === id) ?? mockQuizzes[0]

  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const question = MOCK_QUESTIONS[questionIndex]
  const total = MOCK_QUESTIONS.length
  const progress = ((questionIndex + (phase === 'feedback' ? 1 : 0)) / total) * 100
  const isLast = questionIndex === total - 1
  const isCorrect = selectedOption === question.correctIndex

  function handleSubmit() {
    if (selectedOption === null) return
    setAnswers((prev) => ({ ...prev, [question.id]: selectedOption }))
    setPhase('feedback')
  }

  function handleNext() {
    if (isLast) return
    setSelectedOption(null)
    setPhase('question')
    setQuestionIndex((i) => i + 1)
  }

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#ffd426] text-[#151515]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#151515_1.2px,transparent_1.2px)] [background-size:18px_18px]" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-4 border-b-[3px] border-[#151515] bg-[#ffd426] px-5 py-4">
        <Link
          href={`/quiz/${id}`}
          className="rounded-[0.7rem] border-[3px] border-[#151515] bg-white px-3 py-1.5 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5"
        >
          ← Quit
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate font-mono text-[10px] font-bold text-[#67606a]">{quiz.title}</p>
            <p className="shrink-0 font-mono text-[10px] font-black uppercase tracking-widest">
              Q{questionIndex + 1} of {total}
            </p>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full border-[2px] border-[#151515] bg-white">
            <div
              className="h-full rounded-full bg-[#151515] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-5 lg:p-8">
        {/* Question card */}
        <div className="rounded-[1.5rem] border-[3px] border-[#151515] bg-white/80 p-6 shadow-[6px_6px_0_#151515]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">
            Question {questionIndex + 1}
          </p>
          <p className="mt-2 text-xl font-black leading-snug">{question.prompt}</p>
        </div>

        {/* Feedback banner */}
        {phase === 'feedback' && (
          <div className={cn(
            'rounded-[1rem] border-[3px] border-[#151515] p-4 shadow-[4px_4px_0_#151515]',
            isCorrect ? 'bg-[#d9ff69]' : 'bg-[#ff6b62]'
          )}>
            <p className={cn('text-sm font-black', isCorrect ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
              {isCorrect ? 'Correct!' : 'Not quite.'}
            </p>
            <p className={cn('mt-1 text-sm leading-relaxed', isCorrect ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Answer options */}
        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => {
            const letter = ['A', 'B', 'C', 'D'][i]
            const isSelected = selectedOption === i
            const isCorrectOption = i === question.correctIndex

            let cardStyle = 'bg-white border-[#151515]'
            let letterStyle = 'bg-[#f5f4f0] text-[#151515]'

            if (phase === 'question' && isSelected) {
              cardStyle = 'bg-[#151515] border-[#151515]'
              letterStyle = 'bg-[#ffd426] text-[#151515]'
            } else if (phase === 'feedback' && isCorrectOption) {
              cardStyle = 'bg-[#d9ff69] border-[#1e6f38]'
              letterStyle = 'bg-[#1e6f38] text-[#d9ff69]'
            } else if (phase === 'feedback' && isSelected && !isCorrectOption) {
              cardStyle = 'bg-[#ff6b62] border-[#9c231d]'
              letterStyle = 'bg-[#9c231d] text-[#ff6b62]'
            }

            return (
              <button
                key={i}
                type="button"
                disabled={phase === 'feedback'}
                onClick={() => setSelectedOption(i)}
                className={cn(
                  'flex items-center gap-4 rounded-[1rem] border-[3px] p-4 text-left shadow-[3px_3px_0_#151515] transition-all',
                  cardStyle,
                  phase === 'question' && 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#151515]',
                  phase === 'feedback' && 'cursor-default'
                )}
              >
                <span className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#151515] font-mono text-xs font-black',
                  letterStyle
                )}>
                  {letter}
                </span>
                <span className={cn(
                  'text-sm font-black',
                  phase === 'question' && isSelected ? 'text-[#ffd426]' : 'text-[#151515]',
                  phase === 'feedback' && isCorrectOption ? 'text-[#1e6f38]' : '',
                  phase === 'feedback' && isSelected && !isCorrectOption ? 'text-[#9c231d]' : '',
                )}>
                  {option}
                </span>
              </button>
            )
          })}
        </div>

        {/* Action button */}
        <div className="mt-2">
          {phase === 'question' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={cn(
                'w-full rounded-[1rem] border-[3px] border-[#151515] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-all',
                selectedOption !== null
                  ? 'bg-[#151515] text-[#ffd426] hover:-translate-y-0.5'
                  : 'cursor-not-allowed bg-[#151515]/30 text-[#151515]/40'
              )}
            >
              Submit Answer
            </button>
          ) : isLast ? (
            <Link
              href={`/quiz/${id}/result`}
              className="block w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-4 text-center text-lg font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5"
            >
              See Results →
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#ffd426] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-transform hover:-translate-y-0.5"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
