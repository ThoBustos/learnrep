import type { Question, QuizAttempt } from './types'
import { EVALUATE_ANSWER_SYSTEM_PROMPT } from './schemas'

export interface EvaluateAnswerParams {
  question: Question
  userAnswer: number | number[] | string
  callLLM?: (system: string, prompt: string) => Promise<string>
}

export interface EvaluationResult {
  correct: boolean
  score: number
  feedback: string
}

export async function evaluateAnswer(params: EvaluateAnswerParams): Promise<EvaluationResult> {
  const { question, userAnswer, callLLM } = params

  if (question.type === 'multiple-choice') {
    const correct = userAnswer === question.correctIndex
    return {
      correct,
      score: correct ? 100 : 0,
      feedback: correct
        ? 'Correct!'
        : `The correct answer was option ${['A', 'B', 'C', 'D'][question.correctIndex ?? 0]}. ${question.explanation ?? ''}`,
    }
  }

  if (question.type === 'multi-select') {
    const userIndices = Array.isArray(userAnswer) ? (userAnswer as number[]) : []
    const correctIndices = question.correctIndices ?? []
    const userSet = new Set(userIndices)
    const correctSet = new Set(correctIndices)

    const correctlySelected = userIndices.filter((i) => correctSet.has(i)).length
    const incorrectlySelected = userIndices.filter((i) => !correctSet.has(i)).length
    const isCorrect = correctlySelected === correctIndices.length && incorrectlySelected === 0

    let score: number
    if (isCorrect) {
      score = 100
    } else {
      const earned = Math.max(0, correctlySelected - incorrectlySelected)
      score = Math.round((earned / correctIndices.length) * 100)
    }

    const correctLetters = correctIndices.map((i) => ['A', 'B', 'C', 'D', 'E', 'F'][i]).join(', ')
    const feedback = isCorrect
      ? 'Correct! All right answers selected.'
      : `Not quite. Correct answers: ${correctLetters}. ${question.explanation ?? ''}`

    return { correct: isCorrect, score, feedback }
  }

  if (!callLLM) {
    return { correct: false, score: 0, feedback: 'LLM evaluator not provided for this question type.' }
  }

  const answer = typeof userAnswer === 'string' ? userAnswer : String(userAnswer)
  const prompt = `Question: ${question.prompt}

Expected answer: ${question.expectedAnswer ?? question.expectedSolution ?? ''}
Key points: ${(question.keyPoints ?? []).join(', ')}

User's answer: ${answer}

Is the user's answer correct?`

  const raw = await callLLM(EVALUATE_ANSWER_SYSTEM_PROMPT, prompt)

  let result: { correct: boolean; feedback: string }
  try {
    result = JSON.parse(raw)
  } catch {
    throw new Error(`LLM returned non-JSON: ${raw.slice(0, 200)}`)
  }

  if (typeof result.correct !== 'boolean' || typeof result.feedback !== 'string') {
    throw new Error('LLM evaluation response missing required fields')
  }

  return { correct: result.correct, score: result.correct ? 100 : 0, feedback: result.feedback }
}

export function scoreAttempt(
  questions: Question[],
  results: EvaluationResult[],
): Pick<QuizAttempt, 'score'> {
  const correct = results.filter((r) => r.correct).length
  return { score: Math.round((correct / questions.length) * 100) }
}
