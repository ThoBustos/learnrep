'use client'

import { useReducer } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMountEffect } from '@/hooks/useMountEffect'
import { ScoreScreen } from './ScoreScreen'
import type { QuestionDef } from '@/lib/landing/quizQuestions'

type QuizPhase = 'question' | 'feedback'

const LETTERS = ['A', 'B', 'C', 'D']

type State = {
  questions: QuestionDef[]
  questionIndex: number
  phase: QuizPhase
  selectedOption: number | null
  answers: { correct: boolean }[]
  done: boolean
}

type Action =
  | { type: 'SELECT'; index: number }
  | { type: 'ENTER' }
  | { type: 'NEXT' }

function quizReducer(state: State, action: Action): State {
  if (state.done) return state
  const q = state.questions[state.questionIndex]
  switch (action.type) {
    case 'SELECT':
      if (state.phase !== 'question') return state
      return { ...state, selectedOption: action.index }
    case 'ENTER':
      if (state.phase === 'question' && state.selectedOption !== null) {
        return {
          ...state,
          answers: [...state.answers, { correct: state.selectedOption === q.correctIndex }],
          phase: 'feedback',
        }
      }
      if (state.phase === 'feedback') {
        if (state.questionIndex === state.questions.length - 1) return { ...state, done: true }
        return { ...state, questionIndex: state.questionIndex + 1, phase: 'question', selectedOption: null }
      }
      return state
    case 'NEXT':
      if (state.phase !== 'feedback') return state
      if (state.questionIndex === state.questions.length - 1) return { ...state, done: true }
      return { ...state, questionIndex: state.questionIndex + 1, phase: 'question', selectedOption: null }
  }
}

type Props = { questions: QuestionDef[] }

export function OnboardingQuiz({ questions }: Props) {
  const [{ questionIndex, phase, selectedOption, answers, done }, dispatch] = useReducer(
    quizReducer,
    questions,
    (qs): State => ({ questions: qs, questionIndex: 0, phase: 'question', selectedOption: null, answers: [], done: false }),
  )

  const question = questions[questionIndex]
  const isLast = questionIndex === questions.length - 1
  const total = questions.length
  const correctCount = answers.filter((a) => a.correct).length
  const pct = Math.round((correctCount / total) * 100)
  const progress = ((questionIndex + (phase === 'feedback' ? 1 : 0)) / total) * 100

  useMountEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 }
      const idx = keyMap[e.key.toLowerCase()]
      if (idx !== undefined && idx < questions.length) dispatch({ type: 'SELECT', index: idx })
      if (e.key === 'Enter') dispatch({ type: 'ENTER' })
      if (e.key === ' ') { e.preventDefault(); dispatch({ type: 'NEXT' }) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

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
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#151515]/50">
                  Q{questionIndex + 1} of {total}
                </p>
                {answers.length > 0 && (
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#151515]/50">
                    {correctCount} correct
                  </p>
                )}
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#151515]/20">
                <div
                  className="h-full rounded-full bg-[#151515] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
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
                  {selectedOption === question.correctIndex ? 'Correct.' : 'Nope.'}
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
                    onClick={() => dispatch({ type: 'SELECT', index: i })}
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
                  onClick={() => dispatch({ type: 'ENTER' })}
                  disabled={selectedOption === null}
                  className={cn(
                    'w-full rounded-[1rem] border-[3px] border-[#151515] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-all',
                    selectedOption !== null ? 'bg-[#151515] text-[#ffd426] hover:-translate-y-0.5' : 'cursor-not-allowed bg-[#151515]/20 text-[#151515]/40',
                  )}
                >
                  Submit
                </button>
              ) : isLast ? (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'NEXT' })}
                  className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-4 text-lg font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5"
                >
                  See Results
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'NEXT' })}
                  className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#ffd426] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-transform hover:-translate-y-0.5"
                >
                  Next <ArrowRight className="inline size-5" />
                </button>
              )}
            </div>

            <p className="mt-3 text-center font-mono text-[10px] text-[#151515]/30">
              press A · B · C · D to select · Enter to submit
            </p>
          </>
        ) : (
          <ScoreScreen pct={pct} correct={correctCount} total={total} />
        )}
      </div>
    </section>
  )
}
