import { normalizeQuestion } from '@learnrep/core/schemas'
import type { Question } from '@learnrep/core/types'

export interface EvaluateQuizAnswerRequest {
  quizId: string
  questionId: string
  userAnswer: string
}

export function parseEvaluateQuizAnswerRequest(body: unknown): EvaluateQuizAnswerRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be an object')
  }

  const { quizId, questionId, userAnswer } = body as Record<string, unknown>
  if (typeof quizId !== 'string' || typeof questionId !== 'string' || typeof userAnswer !== 'string') {
    throw new Error('quizId, questionId, and userAnswer are required')
  }

  return { quizId, questionId, userAnswer }
}

export function resolveEvaluationQuestion(questions: unknown, questionId: string): Question {
  if (!Array.isArray(questions)) {
    throw new Error('Quiz questions are invalid')
  }

  const rawQuestion = questions.find((question) => (
    typeof question === 'object' &&
    question !== null &&
    (question as { id?: unknown }).id === questionId
  ))

  if (!rawQuestion) {
    throw new Error('Question not found')
  }

  const question = normalizeQuestion(rawQuestion)
  if (!question) {
    throw new Error('Question is invalid')
  }

  return question
}
