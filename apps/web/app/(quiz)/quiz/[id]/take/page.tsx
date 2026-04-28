'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { evaluateAnswer } from '@learnrep/core'
import type { EvaluationResult, Question, Quiz } from '@learnrep/core'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

type Phase = 'question' | 'evaluating' | 'feedback'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function TakePage() {
  const { id } = useParams<{ id: string }>()

  const { data: quiz, isError } = useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: ({ signal }) =>
      fetch(`/api/quiz/${id}`, { signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Quiz not found'))
      ),
  })

  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(new Set())
  const [textAnswer, setTextAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [scores, setScores] = useState<number[]>([])

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ffd426]">
        <div className="rounded-[1.5rem] border-[3px] border-[#151515] bg-white p-8 shadow-[6px_6px_0_#151515]">
          <p className="font-black text-lg">Quiz not found.</p>
          <Link href="/dashboard" className="mt-4 block font-mono text-sm font-bold text-[#67606a] underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ffd426]">
        <div className="font-mono text-sm font-bold text-[#67606a]">Loading quiz...</div>
      </div>
    )
  }

  const questions: Question[] = quiz.questions
  const question = questions[questionIndex]
  const total = questions.length
  const progress = ((questionIndex + (phase !== 'question' ? 1 : 0)) / total) * 100
  const isLast = questionIndex === total - 1


  function resetAnswerState() {
    setSelectedOption(null)
    setSelectedOptions(new Set())
    setTextAnswer('')
    setEvaluation(null)
    setPhase('question')
  }

  function handleNext() {
    if (isLast) return
    setQuestionIndex((i) => i + 1)
    resetAnswerState()
  }

  async function handleSubmit() {
    if (question.type === 'multiple-choice') {
      if (selectedOption === null) return
      const result = await evaluateAnswer({ question, userAnswer: selectedOption })
      setScores((s) => [...s, result.score])
      setEvaluation(result)
      setPhase('feedback')
      return
    }

    if (question.type === 'multi-select') {
      const result = await evaluateAnswer({ question, userAnswer: [...selectedOptions] })
      setScores((s) => [...s, result.score])
      setEvaluation(result)
      setPhase('feedback')
      return
    }

    // open-ended / code-writing: call API
    if (!textAnswer.trim()) return
    setPhase('evaluating')
    try {
      const res = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: id, questionId: question.id, userAnswer: textAnswer }),
      })
      if (!res.ok) throw new Error('Evaluation failed')
      const data: EvaluationResult = await res.json()
      setScores((s) => [...s, data.score])
      setEvaluation(data)
      setPhase('feedback')
    } catch {
      setEvaluation({ correct: false, score: 0, feedback: 'Evaluation failed. Please try again.' })
      setPhase('feedback')
    }
  }

  const canSubmit =
    (question.type === 'multiple-choice' && selectedOption !== null) ||
    (question.type === 'multi-select' && selectedOptions.size > 0) ||
    (['open-ended', 'code-writing'].includes(question.type) && textAnswer.trim().length > 0)

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#ffd426] text-[#151515]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#151515_1.2px,transparent_1.2px)] [background-size:18px_18px]" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-4 border-b-[3px] border-[#151515] bg-[#ffd426] px-5 py-4">
        <Link
          href={`/quiz/${id}`}
          className="rounded-[0.7rem] border-[3px] border-[#151515] bg-white px-3 py-1.5 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5"
        >
          Quit
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate font-mono text-[10px] font-bold text-[#67606a]">{quiz.title}</p>
            <p className="shrink-0 font-mono text-[10px] font-black uppercase tracking-widest">
              Q{questionIndex + 1} of {total}
            </p>
          </div>
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
        {/* Question type badge */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">
            Question {questionIndex + 1}
          </span>
          <QuestionTypeBadge type={question.type} />
        </div>

        {/* Question card */}
        <div className="rounded-[1.5rem] border-[3px] border-[#151515] bg-white/80 p-6 shadow-[6px_6px_0_#151515]">
          <p className="text-xl font-black leading-snug">{question.prompt}</p>
        </div>

        {/* Feedback banner */}
        {phase === 'feedback' && evaluation && (
          <div className={cn(
            'rounded-[1rem] border-[3px] border-[#151515] p-4 shadow-[4px_4px_0_#151515]',
            evaluation.correct ? 'bg-[#d9ff69]' : 'bg-[#ff6b62]'
          )}>
            <div className="flex items-center justify-between">
              <p className={cn('text-sm font-black', evaluation.correct ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
                {evaluation.correct ? 'Correct!' : 'Not quite.'}
              </p>
              {question.type !== 'multiple-choice' && (
                <span className={cn('font-mono text-xs font-black', evaluation.correct ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
                  {evaluation.score}%
                </span>
              )}
            </div>
            <p className={cn('mt-1 text-sm leading-relaxed', evaluation.correct ? 'text-[#1e6f38]' : 'text-[#9c231d]')}>
              {evaluation.feedback}
            </p>
          </div>
        )}

        {phase === 'evaluating' && (
          <div className="rounded-[1rem] border-[3px] border-[#151515] bg-white/80 p-4 shadow-[4px_4px_0_#151515]">
            <p className="font-mono text-xs font-black uppercase tracking-widest text-[#67606a]">Evaluating your answer...</p>
          </div>
        )}

        {/* Answer input based on question type */}
        {question.type === 'multiple-choice' && (
          <MultipleChoiceInput
            question={question}
            phase={phase}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
          />
        )}

        {question.type === 'multi-select' && (
          <MultiSelectInput
            question={question}
            phase={phase}
            selectedOptions={selectedOptions}
            onToggle={(i) => {
              if (phase !== 'question') return
              setSelectedOptions((prev) => {
                const next = new Set(prev)
                if (next.has(i)) {
                  next.delete(i)
                } else {
                  next.add(i)
                }
                return next
              })
            }}
            correctIndices={question.correctIndices ?? []}
          />
        )}

        {question.type === 'open-ended' && (
          <OpenEndedInput
            value={textAnswer}
            onChange={setTextAnswer}
            disabled={phase !== 'question'}
          />
        )}

        {question.type === 'code-writing' && (
          <CodeWritingInput
            question={question}
            value={textAnswer}
            onChange={setTextAnswer}
            disabled={phase !== 'question'}
          />
        )}

        {/* Action button */}
        <div className="mt-2">
          {phase === 'question' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                'w-full rounded-[1rem] border-[3px] border-[#151515] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-all',
                canSubmit
                  ? 'bg-[#151515] text-[#ffd426] hover:-translate-y-0.5'
                  : 'cursor-not-allowed bg-[#151515]/30 text-[#151515]/40'
              )}
            >
              Submit Answer
            </button>
          ) : phase === 'evaluating' ? (
            <div className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#151515]/30 py-4 text-center text-lg font-black text-[#151515]/40">
              Evaluating...
            </div>
          ) : isLast ? (
            <Link
              href={`/quiz/${id}/result?score=${avgScore}`}
              className="block w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-4 text-center text-lg font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5"
            >
              See Results
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#ffd426] py-4 text-lg font-black shadow-[4px_4px_0_#151515] transition-transform hover:-translate-y-0.5"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function QuestionTypeBadge({ type }: { type: Question['type'] }) {
  const styles: Record<Question['type'], string> = {
    'multiple-choice': 'bg-white border-[#151515] text-[#151515]',
    'multi-select': 'bg-[#7bd8ef] border-[#0d5c75] text-[#0d5c75]',
    'open-ended': 'bg-[#b995ff] border-[#5735a7] text-[#5735a7]',
    'code-writing': 'bg-[#151515] border-[#151515] text-[#ffd426]',
  }
  const labels: Record<Question['type'], string> = {
    'multiple-choice': 'Single choice',
    'multi-select': 'Multi-select',
    'open-ended': 'Open ended',
    'code-writing': 'Code',
  }
  return (
    <span className={cn('rounded-full border-[2px] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest', styles[type])}>
      {labels[type]}
    </span>
  )
}

function MultipleChoiceInput({
  question,
  phase,
  selectedOption,
  onSelect,
}: {
  question: Question
  phase: Phase
  selectedOption: number | null
  onSelect: (i: number) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {(question.options ?? []).map((option, i) => {
        const isSelected = selectedOption === i
        const isCorrectOption = i === question.correctIndex

        let cardStyle = 'bg-white border-[#151515]'
        let letterStyle = 'bg-[#f5f4f0] text-[#151515]'
        let textStyle = 'text-[#151515]'

        if (phase === 'question' && isSelected) {
          cardStyle = 'bg-[#ffd426] border-[#151515] shadow-[4px_4px_0_#151515]'
          letterStyle = 'bg-[#151515] text-[#ffd426]'
          textStyle = 'text-[#151515]'
        } else if (phase === 'feedback' && isCorrectOption) {
          cardStyle = 'bg-[#d9ff69] border-[#1e6f38]'
          letterStyle = 'bg-[#1e6f38] text-[#d9ff69]'
          textStyle = 'text-[#1e6f38]'
        } else if (phase === 'feedback' && isSelected && !isCorrectOption) {
          cardStyle = 'bg-[#ff6b62] border-[#9c231d]'
          letterStyle = 'bg-[#9c231d] text-[#ff6b62]'
          textStyle = 'text-[#9c231d]'
        }

        return (
          <button
            key={i}
            type="button"
            disabled={phase !== 'question'}
            onClick={() => onSelect(i)}
            className={cn(
              'flex items-center gap-4 rounded-[1rem] border-[3px] p-4 text-left shadow-[3px_3px_0_#151515] transition-all',
              cardStyle,
              phase === 'question' && 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#151515]',
              phase !== 'question' && 'cursor-default'
            )}
          >
            <span className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#151515] font-mono text-xs font-black',
              letterStyle
            )}>
              {LETTERS[i]}
            </span>
            <span className={cn('text-sm font-black', textStyle)}>{option}</span>
          </button>
        )
      })}
    </div>
  )
}

function MultiSelectInput({
  question,
  phase,
  selectedOptions,
  onToggle,
  correctIndices,
}: {
  question: Question
  phase: Phase
  selectedOptions: Set<number>
  onToggle: (i: number) => void
  correctIndices: number[]
}) {
  const correctSet = new Set(correctIndices)
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#67606a]">
        Select all that apply
      </p>
      {(question.options ?? []).map((option, i) => {
        const isSelected = selectedOptions.has(i)
        const isCorrectOption = correctSet.has(i)

        let cardStyle = 'bg-white border-[#151515]'
        let boxStyle = 'bg-[#f5f4f0] border-[#151515]'
        let textStyle = 'text-[#151515]'

        if (phase === 'question' && isSelected) {
          cardStyle = 'bg-[#ffd426] border-[#151515] shadow-[4px_4px_0_#151515]'
          boxStyle = 'bg-[#151515] border-[#151515]'
        } else if (phase === 'feedback' && isCorrectOption) {
          cardStyle = 'bg-[#d9ff69] border-[#1e6f38]'
          boxStyle = 'bg-[#1e6f38] border-[#1e6f38]'
          textStyle = 'text-[#1e6f38]'
        } else if (phase === 'feedback' && isSelected && !isCorrectOption) {
          cardStyle = 'bg-[#ff6b62] border-[#9c231d]'
          boxStyle = 'bg-[#9c231d] border-[#9c231d]'
          textStyle = 'text-[#9c231d]'
        }

        return (
          <button
            key={i}
            type="button"
            disabled={phase !== 'question'}
            onClick={() => onToggle(i)}
            className={cn(
              'flex items-center gap-4 rounded-[1rem] border-[3px] p-4 text-left shadow-[3px_3px_0_#151515] transition-all',
              cardStyle,
              phase === 'question' && 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#151515]',
              phase !== 'question' && 'cursor-default'
            )}
          >
            <span className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-[0.3rem] border-[3px] font-mono text-xs font-black',
              boxStyle
            )}>
              {isSelected && (
                <svg className={phase === 'question' ? 'text-[#ffd426]' : textStyle} width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className={cn('text-sm font-black', textStyle)}>{option}</span>
          </button>
        )
      })}
    </div>
  )
}

function OpenEndedInput({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Type your answer here..."
      rows={6}
      className={cn(
        'w-full rounded-[1rem] border-[3px] border-[#151515] bg-white/90 p-4 text-sm font-bold shadow-[3px_3px_0_#151515] outline-none resize-none',
        'placeholder:font-mono placeholder:text-[10px] placeholder:font-bold placeholder:uppercase placeholder:tracking-widest placeholder:text-[#67606a]',
        'focus:shadow-[4px_4px_0_#151515]',
        disabled && 'cursor-default opacity-70'
      )}
    />
  )
}

function CodeWritingInput({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Question
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  return (
    <div className="overflow-hidden rounded-[1rem] border-[3px] border-[#151515] shadow-[3px_3px_0_#151515]">
      <div className="flex items-center justify-between border-b-[2px] border-[#151515] bg-[#151515] px-4 py-2">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#ffd426]">
          {question.language ?? 'code'}
        </span>
      </div>
      <MonacoEditor
        height="300px"
        language={question.language ?? 'typescript'}
        value={value || question.starterCode || ''}
        onChange={(v) => !disabled && onChange(v ?? '')}
        options={{
          fontSize: 13,
          fontFamily: 'var(--font-geist-mono), monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          readOnly: disabled,
          theme: 'vs-dark',
          padding: { top: 12, bottom: 12 },
          overviewRulerBorder: false,
          renderLineHighlight: 'none',
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
        }}
      />
    </div>
  )
}
