import { z } from 'zod'
import type { Question, QuizAttempt } from './types'
import { EVALUATE_ANSWER_SYSTEM_PROMPT, EvaluationLLMOutputSchema } from './schemas'

export interface EvaluateAnswerParams {
  question: Question
  userAnswer: number | number[] | string
  callStructured?: <T>(schema: z.ZodType<T>, system: string, prompt: string) => Promise<T>
}

export interface EvaluationResult {
  correct: boolean
  score: number
  feedback: string
}

export async function evaluateAnswer(params: EvaluateAnswerParams): Promise<EvaluationResult> {
  const { question, userAnswer, callStructured } = params

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
    const correctSet = new Set(correctIndices)
    const incorrectOptionCount = Math.max((question.options?.length ?? correctIndices.length) - correctIndices.length, 1)

    const correctlySelected = userIndices.filter((i) => correctSet.has(i)).length
    const incorrectlySelected = userIndices.filter((i) => !correctSet.has(i)).length
    const isCorrect = correctlySelected === correctIndices.length && incorrectlySelected === 0

    let score: number
    if (isCorrect) {
      score = 100
    } else {
      const positive = correctlySelected / Math.max(correctIndices.length, 1)
      const negative = incorrectlySelected / incorrectOptionCount
      score = Math.round(Math.max(0, Math.min(1, positive - negative)) * 100)
    }

    const correctLetters = correctIndices.map((i) => ['A', 'B', 'C', 'D', 'E', 'F'][i]).join(', ')
    const feedback = isCorrect
      ? 'Correct! All right answers selected.'
      : `Not quite. Correct answers: ${correctLetters}. ${question.explanation ?? ''}`

    return { correct: isCorrect, score, feedback }
  }

  if (!callStructured) {
    return { correct: false, score: 0, feedback: 'LLM evaluator not provided for this question type.' }
  }

  const answer = typeof userAnswer === 'string' ? userAnswer : String(userAnswer)
  const prompt = `Question: ${question.prompt}

Expected answer: ${question.expectedAnswer ?? question.expectedSolution ?? ''}
Key points: ${(question.keyPoints ?? []).join(', ')}

User's answer: ${answer}

Is the user's answer correct?`

  const result = await callStructured(EvaluationLLMOutputSchema, EVALUATE_ANSWER_SYSTEM_PROMPT, prompt)
  return { correct: result.correct, score: result.correct ? 100 : 0, feedback: result.feedback }
}

export function scoreAttempt(
  questions: Question[],
  results: EvaluationResult[],
): Pick<QuizAttempt, 'score'> {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0)
  return { score: Math.round(totalScore / Math.max(questions.length, 1)) }
}
