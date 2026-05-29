import { z } from 'zod'
import type { Difficulty, Question, QuestionType } from './types'

export const DIFFICULTY_QUESTION_COUNT: Record<Difficulty, number> = {
  easy:   5,
  medium: 8,
  hard:   10,
  expert: 12,
}

export const QUESTION_TYPES: QuestionType[] = [
  'multiple-choice',
  'multi-select',
  'open-ended',
  'code-writing',
]

export function isValidDifficulty(value: unknown): value is Difficulty {
  return value === 'easy' || value === 'medium' || value === 'hard' || value === 'expert'
}

export function isValidQuestion(q: unknown): q is Question {
  return normalizeQuestion(q) !== null
}

function normalizeLetterIndex(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return value
  }

  if (typeof value !== 'string') return null

  const normalized = value.trim().toUpperCase()
  if (normalized.length !== 1) return null

  const index = normalized.charCodeAt(0) - 65
  return index >= 0 ? index : null
}

function normalizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    return undefined
  }

  return value
}

function normalizeNumberArray(value: unknown): number[] | undefined {
  if (!Array.isArray(value)) return undefined

  const parsed = value.filter((item): item is number => Number.isInteger(item) && item >= 0)
  return parsed.length === value.length ? parsed : undefined
}

export function normalizeQuestion(q: unknown): Question | null {
  if (!q || typeof q !== 'object') return null

  const obj = q as Record<string, unknown>
  if (
    typeof obj.id !== 'string' ||
    typeof obj.prompt !== 'string' ||
    !QUESTION_TYPES.includes(obj.type as QuestionType)
  ) {
    return null
  }

  const question: Question = {
    id: obj.id,
    type: obj.type as QuestionType,
    prompt: obj.prompt,
  }

  const options = normalizeStringArray(obj.options)
  const correctIndex = normalizeLetterIndex(obj.correctIndex ?? obj.correctAnswer)
  const correctIndices = normalizeNumberArray(obj.correctIndices)

  if (question.type === 'multiple-choice') {
    if (!options || options.length < 2 || correctIndex === null || correctIndex >= options.length) {
      return null
    }
    question.options = options
    question.correctIndex = correctIndex
  }

  if (question.type === 'multi-select') {
    if (
      !options ||
      options.length < 2 ||
      !correctIndices ||
      correctIndices.length === 0 ||
      correctIndices.some((index) => index >= options.length)
    ) {
      return null
    }
    question.options = options
    question.correctIndices = [...new Set(correctIndices)].sort((a, b) => a - b)
  }

  if (question.type === 'open-ended') {
    if (typeof obj.expectedAnswer !== 'string' || !Array.isArray(obj.keyPoints)) {
      return null
    }
    question.expectedAnswer = obj.expectedAnswer
    question.keyPoints = normalizeStringArray(obj.keyPoints) ?? []
  }

  if (question.type === 'code-writing') {
    if (typeof obj.language !== 'string' || typeof obj.expectedSolution !== 'string') {
      return null
    }
    question.language = obj.language
    if (typeof obj.starterCode === 'string') {
      question.starterCode = obj.starterCode
    }
    question.expectedSolution = obj.expectedSolution
    question.keyPoints = normalizeStringArray(obj.keyPoints) ?? []
  }

  if (typeof obj.explanation === 'string') {
    question.explanation = obj.explanation
  }

  return question
}

export const GENERATE_QUIZ_SYSTEM_PROMPT = `You are an expert quiz generator. Given a topic, optional source content, and difficulty level, generate a quiz.

Rules:
- For multiple-choice questions, include exactly 4 options and correctIndex as the zero-based correct option
- For multi-select questions, include 4-6 options and correctIndices as zero-based correct options
- For open-ended questions, include expectedAnswer and keyPoints
- For code-writing questions, include language, optional starterCode, expectedSolution, and keyPoints
- Include a brief explanation for closed-answer questions
- Questions should escalate in complexity within the difficulty band
- Avoid trick questions; test genuine understanding
- Only use the requested question types

Respond with valid JSON only — no markdown fences.`

export const EVALUATE_ANSWER_SYSTEM_PROMPT = `You are a quiz evaluator. Given a question and a user's answer, determine if the answer is correct.

For multiple-choice questions, compare the submitted option index with correctIndex.
For open-ended questions, accept semantically correct answers even if phrased differently.
For code-writing questions, evaluate whether the code would produce the correct output.

Respond with JSON: { "correct": boolean, "feedback": string }`

export const MultipleChoiceLLMQuestionSchema = z.object({
  id: z.string(),
  type: z.literal('multiple-choice'),
  prompt: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
})

export const MultiSelectLLMQuestionSchema = z.object({
  id: z.string(),
  type: z.literal('multi-select'),
  prompt: z.string(),
  options: z.array(z.string()).min(4).max(6),
  correctIndices: z.array(z.number().int().min(0)).min(1),
  explanation: z.string(),
})

export const OpenEndedLLMQuestionSchema = z.object({
  id: z.string(),
  type: z.literal('open-ended'),
  prompt: z.string(),
  expectedAnswer: z.string(),
  keyPoints: z.array(z.string()),
})

export const CodeWritingLLMQuestionSchema = z.object({
  id: z.string(),
  type: z.literal('code-writing'),
  prompt: z.string(),
  language: z.string(),
  starterCode: z.string().optional(),
  expectedSolution: z.string(),
  keyPoints: z.array(z.string()).default([]),
})

export const QuizLLMQuestionSchema = z.discriminatedUnion('type', [
  MultipleChoiceLLMQuestionSchema,
  MultiSelectLLMQuestionSchema,
  OpenEndedLLMQuestionSchema,
  CodeWritingLLMQuestionSchema,
])

export const QuizLLMOutputSchema = z.object({
  title: z.string(),
  questions: z.array(QuizLLMQuestionSchema),
})

export const EvaluationLLMOutputSchema = z.object({
  correct: z.boolean(),
  feedback: z.string(),
})
