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
  if (!q || typeof q !== 'object') return false
  const obj = q as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.prompt === 'string' &&
    QUESTION_TYPES.includes(obj.type as QuestionType)
  )
}

export const GENERATE_QUIZ_SYSTEM_PROMPT = `You are an expert quiz generator. Given a topic and difficulty level, generate a quiz with multiple-choice questions.

Rules:
- Each question must have exactly 4 options labeled A, B, C, D
- correctAnswer must be the letter (A, B, C, or D)
- Include a brief explanation for each answer
- Questions should escalate in complexity within the difficulty band
- Avoid trick questions; test genuine understanding

Respond with valid JSON only — no markdown fences.`

export const EVALUATE_ANSWER_SYSTEM_PROMPT = `You are a quiz evaluator. Given a question and a user's answer, determine if the answer is correct.

For multiple-choice questions, match the selected option letter exactly.
For open-ended questions, accept semantically correct answers even if phrased differently.
For code-writing questions, evaluate whether the code would produce the correct output.

Respond with JSON: { "correct": boolean, "feedback": string }`
