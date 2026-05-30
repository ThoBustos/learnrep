'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ProgressMeter, QuizChoiceButton } from '@/components/ui/LearningSurface'
import { cn } from '@/lib/utils'
import { evaluateAnswer } from '@learnrep/core'
import type { EvaluationResult, Question, Quiz } from '@learnrep/core'

type StoredAnswer = {
  questionId: string
  prompt: string
  type: string
  correct: boolean
  score: number
  feedback: string
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

type Phase = 'question' | 'evaluating' | 'feedback'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function TakePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

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
  const [answerRecords, setAnswerRecords] = useState<StoredAnswer[]>([])
  const [isSaving, setIsSaving] = useState(false)

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--lr-notebook)]">
        <div className="border-[3px] border-[var(--lr-line)] bg-white p-8 shadow-[var(--lr-shadow-lg)]">
          <p className="font-black text-lg">Quiz not found.</p>
          <Link href="/dashboard" className="mt-4 block font-mono text-sm font-bold text-[var(--lr-muted)] underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--lr-notebook)]">
        <div className="font-mono text-sm font-bold text-[var(--lr-muted)]">Loading quiz...</div>
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
      setAnswerRecords((r) => [...r, {
        questionId: question.id,
        prompt: question.prompt,
        type: question.type,
        correct: result.correct,
        score: result.score,
        feedback: result.feedback,
      }])
      setEvaluation(result)
      setPhase('feedback')
      return
    }

    if (question.type === 'multi-select') {
      const result = await evaluateAnswer({ question, userAnswer: [...selectedOptions] })
      setScores((s) => [...s, result.score])
      setAnswerRecords((r) => [...r, {
        questionId: question.id,
        prompt: question.prompt,
        type: question.type,
        correct: result.correct,
        score: result.score,
        feedback: result.feedback,
      }])
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
      setAnswerRecords((r) => [...r, {
        questionId: question.id,
        prompt: question.prompt,
        type: question.type,
        correct: data.correct,
        score: data.score,
        feedback: data.feedback,
      }])
      setEvaluation(data)
      setPhase('feedback')
    } catch {
      setEvaluation({ correct: false, score: 0, feedback: 'Evaluation failed. Please try again.' })
      setPhase('feedback')
    }
  }

  async function saveAndNavigate() {
    const computedAvgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0
    setIsSaving(true)
    try {
      const res = await fetch(`/api/quiz/${id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: computedAvgScore, answers: answerRecords }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/quiz/${id}/result?attempt=${data.id}`)
      } else {
        router.push(`/quiz/${id}/result?score=${computedAvgScore}`)
      }
    } catch {
      router.push(`/quiz/${id}/result?score=${computedAvgScore}`)
    } finally {
      setIsSaving(false)
    }
  }

  const canSubmit =
    (question.type === 'multiple-choice' && selectedOption !== null) ||
    (question.type === 'multi-select' && selectedOptions.size > 0) ||
    (['open-ended', 'code-writing'].includes(question.type) && textAnswer.trim().length > 0)

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[var(--lr-notebook)] text-[var(--lr-ink)]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-70" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-4 border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-5 py-4">
        <Link
          href={`/quiz/${id}`}
          className="border-[3px] border-[var(--lr-line)] bg-white px-3 py-1.5 font-mono text-[10px] font-black uppercase shadow-[var(--lr-shadow-sm)] transition-transform hover:-translate-y-0.5"
        >
          Quit
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate font-mono text-[10px] font-bold text-[var(--lr-muted)]">{quiz.title}</p>
            <p className="shrink-0 font-mono text-[10px] font-black uppercase tracking-widest">
              Q{questionIndex + 1} of {total}
            </p>
          </div>
          <ProgressMeter value={progress} tone="teal" className="mt-2" />
        </div>
      </div>

      {/* Question area */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-5 lg:p-8">
        {/* Question type badge */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--lr-muted)]">
            Question {questionIndex + 1}
          </span>
          <QuestionTypeBadge type={question.type} />
        </div>

        {/* Question card */}
        <div className="border-[3px] border-[var(--lr-line)] bg-white/85 p-6 shadow-[var(--lr-shadow-lg)]">
          <p className="text-xl font-black leading-snug">{question.prompt}</p>
        </div>

        {/* Feedback banner */}
        {phase === 'feedback' && evaluation && (
          <div className={cn(
            'border-[3px] p-4 shadow-[var(--lr-shadow-md)]',
            evaluation.correct
              ? 'border-[var(--lr-green-dark)] bg-[var(--lr-green)] text-[var(--lr-green-dark)]'
              : 'border-[var(--lr-red-dark)] bg-[var(--lr-red)] text-[var(--lr-ink)]'
          )}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-black">
                {evaluation.correct ? 'Correct!' : 'Not quite.'}
              </p>
              {question.type !== 'multiple-choice' && (
                <span className="font-mono text-xs font-black">
                  {evaluation.score}%
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed">
              {evaluation.feedback}
            </p>
          </div>
        )}

        {phase === 'evaluating' && (
          <div className="border-[3px] border-[var(--lr-line)] bg-white/85 p-4 shadow-[var(--lr-shadow-md)]">
            <p className="font-mono text-xs font-black uppercase tracking-widest text-[var(--lr-muted)]">Evaluating your answer...</p>
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
                'w-full border-[3px] border-[var(--lr-line)] py-4 text-lg font-black shadow-[var(--lr-shadow-md)] transition-all',
                canSubmit
                  ? 'bg-[var(--lr-ink)] text-[var(--lr-yolk)] hover:-translate-y-0.5'
                  : 'cursor-not-allowed bg-white/50 text-[var(--lr-muted)]'
              )}
            >
              Submit Answer
            </button>
          ) : phase === 'evaluating' ? (
            <div className="w-full border-[3px] border-[var(--lr-line)] bg-white/50 py-4 text-center text-lg font-black text-[var(--lr-muted)]">
              Evaluating...
            </div>
          ) : isLast ? (
            <button
              type="button"
              onClick={saveAndNavigate}
              disabled={isSaving}
              className="block w-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] py-4 text-center text-lg font-black text-[var(--lr-yolk)] shadow-[4px_4px_0_var(--lr-tomato)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'See Results'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)] py-4 text-lg font-black shadow-[var(--lr-shadow-md)] transition-transform hover:-translate-y-0.5"
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
    'multiple-choice': 'bg-white border-[var(--lr-line)] text-[var(--lr-ink)]',
    'multi-select': 'bg-[var(--lr-blue)] border-[var(--lr-blue-dark)] text-[var(--lr-blue-dark)]',
    'open-ended': 'bg-[var(--lr-purple)] border-[var(--lr-purple-dark)] text-[var(--lr-ink)]',
    'code-writing': 'bg-[var(--lr-ink)] border-[var(--lr-line)] text-[var(--lr-yolk)]',
  }
  const labels: Record<Question['type'], string> = {
    'multiple-choice': 'Single choice',
    'multi-select': 'Multi-select',
    'open-ended': 'Open ended',
    'code-writing': 'Code',
  }
  return (
    <span className={cn('inline-flex border-[2px] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest', styles[type])}>
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

        let choiceState: 'default' | 'selected' | 'correct' | 'incorrect' = 'default'

        if (phase === 'question' && isSelected) {
          choiceState = 'selected'
        } else if (phase === 'feedback' && isCorrectOption) {
          choiceState = 'correct'
        } else if (phase === 'feedback' && isSelected && !isCorrectOption) {
          choiceState = 'incorrect'
        }

        return (
          <QuizChoiceButton
            key={i}
            disabled={phase !== 'question'}
            onClick={() => onSelect(i)}
            letter={LETTERS[i]}
            state={choiceState}
          >
            {option}
          </QuizChoiceButton>
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
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--lr-muted)]">
        Select all that apply
      </p>
      {(question.options ?? []).map((option, i) => {
        const isSelected = selectedOptions.has(i)
        const isCorrectOption = correctSet.has(i)

        let cardStyle = 'bg-white border-[var(--lr-line)]'
        let boxStyle = 'bg-[var(--lr-paper)] border-[var(--lr-line)]'
        let textStyle = 'text-[var(--lr-ink)]'
        let checkStyle = 'text-[var(--lr-ink)]'

        if (phase === 'question' && isSelected) {
          cardStyle = 'bg-[var(--lr-yolk)] border-[var(--lr-line)] shadow-[4px_4px_0_var(--lr-line)]'
          boxStyle = 'bg-[var(--lr-ink)] border-[var(--lr-line)]'
          checkStyle = 'text-[var(--lr-yolk)]'
        } else if (phase === 'feedback' && isCorrectOption) {
          cardStyle = 'bg-[var(--lr-green)] border-[var(--lr-green-dark)]'
          boxStyle = 'bg-[var(--lr-green-dark)] border-[var(--lr-green-dark)]'
          textStyle = 'text-[var(--lr-green-dark)]'
          checkStyle = 'text-[var(--lr-green)]'
        } else if (phase === 'feedback' && isSelected && !isCorrectOption) {
          cardStyle = 'bg-[var(--lr-red)] border-[var(--lr-red-dark)]'
          boxStyle = 'bg-[var(--lr-red-dark)] border-[var(--lr-red-dark)]'
          textStyle = 'text-[var(--lr-ink)]'
          checkStyle = 'text-white'
        }

        return (
          <button
            key={i}
            type="button"
            disabled={phase !== 'question'}
            onClick={() => onToggle(i)}
            className={cn(
              'flex items-center gap-4 border-[3px] p-4 text-left shadow-[3px_3px_0_var(--lr-line)] transition-all',
              cardStyle,
              phase === 'question' && 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--lr-line)]',
              phase !== 'question' && 'cursor-default'
            )}
          >
            <span className={cn(
              'flex size-6 shrink-0 items-center justify-center border-[3px] font-mono text-xs font-black',
              boxStyle
            )}>
              {isSelected && (
                <svg className={checkStyle} width="10" height="10" viewBox="0 0 10 10" fill="none">
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
        'w-full resize-none border-[3px] border-[var(--lr-line)] bg-white/90 p-4 text-sm font-bold shadow-[3px_3px_0_var(--lr-line)] outline-none',
        'placeholder:font-mono placeholder:text-[10px] placeholder:font-bold placeholder:uppercase placeholder:tracking-widest placeholder:text-[var(--lr-muted)]',
        'focus:shadow-[4px_4px_0_var(--lr-line)]',
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
    <div className="overflow-hidden border-[3px] border-[var(--lr-line)] shadow-[3px_3px_0_var(--lr-line)]">
      <div className="flex items-center justify-between border-b-[2px] border-[var(--lr-line)] bg-[var(--lr-ink)] px-4 py-2">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-yolk)]">
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
