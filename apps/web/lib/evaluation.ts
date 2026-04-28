import type { Question } from '@learnrep/core'
import { getMockQuestion } from './mock-data.ts'

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

export function resolveEvaluationQuestion(request: EvaluateQuizAnswerRequest): Question {
  const question = getMockQuestion(request.quizId, request.questionId)
  if (!question) {
    throw new Error('Question not found')
  }

  return question
}
