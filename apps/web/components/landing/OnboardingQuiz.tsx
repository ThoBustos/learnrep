'use client'

import { useReducer, type KeyboardEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScoreScreen } from './ScoreScreen'
import type { QuestionDef } from '@/lib/landing/quizQuestions'

type QuizPhase = 'question' | 'feedback'

const LETTERS = ['A', 'B', 'C', 'D']
const INTERACTIVE_TARGETS = 'button,a,input,textarea,select,[contenteditable="true"]'

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
  | { type: 'RESET' }

function quizReducer(state: State, action: Action): State {
  if (action.type === 'RESET')
    return { questions: state.questions, questionIndex: 0, phase: 'question', selectedOption: null, answers: [], done: false }
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
  const questionId = `onboarding-question-${question.id}`
  const feedbackId = `onboarding-feedback-${question.id}`

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    const target = e.target
    if (target instanceof HTMLElement && target.closest(INTERACTIVE_TARGETS)) return
    if (done) return

    const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 }
    const idx = keyMap[e.key.toLowerCase()]
    if (idx !== undefined && idx < question.options.length && phase === 'question') {
      e.preventDefault()
      dispatch({ type: 'SELECT', index: idx })
      return
    }
    if (e.key === 'Enter' && (phase === 'feedback' || selectedOption !== null)) {
      e.preventDefault()
      dispatch({ type: 'ENTER' })
      return
    }
    if (e.key === ' ' && phase === 'feedback') {
      e.preventDefault()
      dispatch({ type: 'NEXT' })
    }
  }

  return (
    <section
      className="relative overflow-hidden border-t-[4px] border-[var(--lr-line)] bg-[var(--lr-blue)] px-6 py-12 text-[var(--lr-blue-dark)] sm:px-10 sm:py-16"
      tabIndex={0}
      role="region"
      aria-label="Sample LearnRep quiz"
      onKeyDown={handleKeyDown}
    >
      <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-25" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {!done ? (
          <>
            <div className="mb-8 text-center">
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em]">
                No account needed
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">
                See what your
                <br />
                team will take.
              </h2>
              <p className="mt-3 font-mono text-sm font-bold">
                Three questions. This is what lr generate produces.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Q{questionIndex + 1} of {total}
                </p>
                {answers.length > 0 && (
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
                    {correctCount} correct
                  </p>
                )}
              </div>
              <div
                className="mt-2 h-2 w-full overflow-hidden border-[2px] border-[var(--lr-line)] bg-white"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Quiz progress"
              >
                <div
                  className="h-full bg-[var(--lr-blue-dark)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="border-[3px] border-[var(--lr-line)] bg-white/90 p-6 shadow-[var(--lr-shadow-lg)]">
              <p id={questionId} className="text-xl font-black leading-snug sm:text-2xl">{question.prompt}</p>
            </div>

            {phase === 'feedback' && (
              <div id={feedbackId} aria-live="polite" className={cn(
                'mt-4 border-[3px] p-4 shadow-[var(--lr-shadow-md)]',
                selectedOption === question.correctIndex
                  ? 'border-[var(--lr-green-dark)] bg-[var(--lr-green)] text-[var(--lr-green-dark)]'
                  : 'border-[var(--lr-red-dark)] bg-[var(--lr-red)] text-[var(--lr-red-dark)]',
              )}>
                <p className="text-sm font-black">
                  {selectedOption === question.correctIndex ? 'Correct.' : 'Nope.'}
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  {question.feedback}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2.5" role="radiogroup" aria-labelledby={questionId}>
              {question.options.map((option, i) => {
                const isSelected = selectedOption === i
                const isCorrect = i === question.correctIndex
                let cardStyle = 'bg-white/85 border-[var(--lr-line)]'
                let letterStyle = 'bg-[var(--lr-paper)] text-[var(--lr-ink)]'
                if (phase === 'question' && isSelected) {
                  cardStyle = 'bg-[var(--lr-yolk)] border-[var(--lr-line)] shadow-[4px_4px_0_var(--lr-line)]'
                  letterStyle = 'bg-[var(--lr-ink)] text-[var(--lr-yolk)]'
                } else if (phase === 'feedback' && isCorrect) {
                  cardStyle = 'bg-[var(--lr-green)] border-[var(--lr-green-dark)]'
                  letterStyle = 'bg-[var(--lr-green-dark)] text-[var(--lr-green)]'
                } else if (phase === 'feedback' && isSelected && !isCorrect) {
                  cardStyle = 'bg-[var(--lr-red)] border-[var(--lr-red-dark)]'
                  letterStyle = 'bg-[var(--lr-red-dark)] text-[var(--lr-red)]'
                }
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-describedby={phase === 'feedback' ? feedbackId : undefined}
                    disabled={phase !== 'question'}
                    onClick={() => dispatch({ type: 'SELECT', index: i })}
                    className={cn(
                      'flex items-center gap-4 border-[3px] p-4 text-left shadow-[3px_3px_0_var(--lr-line)] transition-all',
                      cardStyle,
                      phase === 'question' && 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--lr-line)]',
                      phase !== 'question' && 'cursor-default',
                    )}
                  >
                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[var(--lr-line)] font-mono text-xs font-black', letterStyle)}>
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
                    'w-full border-[3px] border-[var(--lr-line)] py-4 text-lg font-black transition-all',
                    selectedOption !== null ? 'bg-[var(--lr-ink)] text-[var(--lr-yolk)] hover:-translate-y-0.5' : 'cursor-not-allowed bg-white/50 text-[var(--lr-muted)]',
                  )}
                >
                  Submit
                </button>
              ) : isLast ? (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'NEXT' })}
                  className="w-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] py-4 text-lg font-black text-[var(--lr-yolk)] shadow-[4px_4px_0_var(--lr-tomato)] transition-transform hover:-translate-y-0.5"
                >
                  See Results
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'NEXT' })}
                  className="w-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)] py-4 text-lg font-black shadow-[var(--lr-shadow-md)] transition-transform hover:-translate-y-0.5"
                >
                  Next <ArrowRight className="inline size-5" />
                </button>
              )}
            </div>

          </>
        ) : (
          <ScoreScreen pct={pct} correct={correctCount} total={total} onRetry={() => dispatch({ type: 'RESET' })} />
        )}
      </div>
    </section>
  )
}
