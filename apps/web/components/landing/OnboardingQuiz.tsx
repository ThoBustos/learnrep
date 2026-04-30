'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScoreScreen } from './ScoreScreen'
import type { QuestionDef } from '@/lib/landing/quizQuestions'

type QuizPhase = 'question' | 'feedback'

const LETTERS = ['A', 'B', 'C', 'D']

type Props = { questions: QuestionDef[] }

export function OnboardingQuiz({ questions }: Props) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase] = useState<QuizPhase>('question')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])
  const [done, setDone] = useState(false)

  const question = questions[questionIndex]
  const isLast = questionIndex === questions.length - 1
  const total = questions.length
  const correctCount = answers.filter((a) => a.correct).length
  const pct = Math.round((correctCount / total) * 100)
  const progress = ((questionIndex + (phase === 'feedback' ? 1 : 0)) / total) * 100

  function handleSubmit() {
    if (selectedOption === null) return
    setAnswers((a) => [...a, { correct: selectedOption === question.correctIndex }])
    setPhase('feedback')
  }

  function handleNext() {
    if (isLast) {
      setDone(true)
    } else {
      setQuestionIndex((i) => i + 1)
      setSelectedOption(null)
      setPhase('question')
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#ffd426] px-6 py-12 sm:px-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(#151515_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {!done ? (
          <>
            <div className="mb-8 text-center">
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#151515]/50">
                No account needed
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                See what your
                <br />
                team will take.
              </h2>
              <p className="mt-3 font-mono text-sm font-bold text-[#151515]/60">
                Three questions. This is what lr generate produces.
              </p>
            </div>

            <div className="mb-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#151515]/20">
                <div
                  className="h-full rounded-full bg-[#151515] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#151515]/50">
                Q{questionIndex + 1} of {total}
              </p>
            </div>

            <div className="rounded-[1.5rem] border-[3px] border-[#151515] bg-white/90 p-6 shadow-[6px_6px_0_#151515]">
              <p className="text-xl font-black leading-snug sm:text-2xl">{question.prompt}</p>
            </div>

            {phase === 'feedback' && (
              <div className={cn(
                'mt-4 rounded-[1rem] border-[3px] border-[#151515] p-4 shadow-[4px_4px_0_#151515]',
                selectedOption === question.correctIndex ? 'bg-[#d9ff69]' : 'bg-[#ff6b62]',
              )}>
                <p className={cn('text-sm font-black', selectedOption === question.correctIndex ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
                  {selectedOption === question.correctIndex ? 'Correct!' : 'Not quite.'}
                </p>
                <p className={cn('mt-1 text-sm leading-relaxed', selectedOption === question.correctIndex ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
                  {question.feedback}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2.5">
              {question.options.map((option, i) => {
                const isSelected = selectedOption === i
                const isCorrect = i === question.correctIndex
                let cardStyle = 'bg-white/85 border-[#151515]'
                let letterStyle = 'bg-[#f5f4f0] text-[#151515]'
                if (phase === 'question' && isSelected) {
                  cardStyle = 'bg-[#ffd426] border-[#151515] shadow-[4px_4px_0_#151515]'
                  letterStyle = 'bg-[#151515] text-[#ffd426]'
                } else if (phase === 'feedback' && isCorrect) {
                  cardStyle = 'bg-[#d9ff69] border-[#1e6f38]'
                  letterStyle = 'bg-[#1e6f38] text-[#d9ff69]'
                } else if (phase === 'feedback' && isSelected && !isCorrect) {
                  cardStyle = 'bg-[#ff6b62] border-[#9c231d]'
                  letterStyle = 'bg-[#9c231d] text-[#ff6b62]'
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={phase !== 'question'}
                    onClick={() => setSelectedOption(i)}
                    className={cn(
                      'flex items-center gap-4 rounded-[1rem] border-[3px] p-4 text-left shadow-[3px_3px_0_#151515] transition-all',
                      cardStyle,
                      phase === 'question' && 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#151515]',
                      phase !== 'question' && 'cursor-default',
                    )}
                  >
                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#151515] font-mono text-xs font-black', letterStyle)}>
                      {LETTERS[i]}
                    </span>
                    <span className="text-sm font-black">{option}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4">
              {phase === 'question' ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className={cn(
                    'w-full rounded-[1rem] border-[3px] border-[#151515] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-all',
                    selectedOption !== null ? 'bg-[#151515] text-[#ffd426] hover:-translate-y-0.5' : 'cursor-not-allowed bg-[#151515]/20 text-[#151515]/40',
                  )}
                >
                  Submit Answer
                </button>
              ) : isLast ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-4 text-lg font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5"
                >
                  See Results
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#ffd426] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-transform hover:-translate-y-0.5"
                >
                  Next Question <ArrowRight className="inline size-5" />
                </button>
              )}
            </div>
          </>
        ) : (
          <ScoreScreen pct={pct} correct={correctCount} total={total} />
        )}
      </div>
    </section>
  )
}
