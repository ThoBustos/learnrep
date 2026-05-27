import { z } from 'zod'
import type { Difficulty, QuestionType, Quiz } from './types'
import { DIFFICULTY_QUESTION_COUNT, GENERATE_QUIZ_SYSTEM_PROMPT, QUESTION_TYPES, QuizLLMOutputSchema, normalizeQuestion } from './schemas'

export interface GenerateQuizParams {
  topic?: string
  focus?: string
  content?: string
  difficulty: Difficulty
  questionCount?: number
  questionTypes?: QuestionType[]
  userId: string
  source: Quiz['source']
  callStructured: <T>(schema: z.ZodType<T>, system: string, prompt: string) => Promise<T>
}

export async function generateQuiz(params: GenerateQuizParams): Promise<Quiz> {
  const { topic, focus, content, difficulty, userId, source, callStructured } = params
  const questionCount = params.questionCount ?? DIFFICULTY_QUESTION_COUNT[difficulty]
  const questionTypes = params.questionTypes?.length ? params.questionTypes : ['multiple-choice']
  const quizTopic = topic?.trim() || focus?.trim() || 'Uploaded content'
  const contentBlock = content?.trim()
    ? `\nSource content to quiz on:\n---\n${content.trim().slice(0, 12000)}\n---\n`
    : ''
  const focusBlock = focus?.trim() ? `\nFocus especially on: ${focus.trim()}\n` : ''

  const prompt = `Generate a ${difficulty} quiz about "${quizTopic}" with exactly ${questionCount} questions.
Use only these question types: ${questionTypes.join(', ')}.${focusBlock}${contentBlock}

Return JSON with this exact shape:
{
  "title": "string",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "prompt": "string",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0,
      "explanation": "string"
    },
    {
      "id": "q2",
      "type": "multi-select",
      "prompt": "string",
      "options": ["...", "...", "...", "..."],
      "correctIndices": [0, 2],
      "explanation": "string"
    },
    {
      "id": "q3",
      "type": "open-ended",
      "prompt": "string",
      "expectedAnswer": "string",
      "keyPoints": ["string"]
    },
    {
      "id": "q4",
      "type": "code-writing",
      "prompt": "string",
      "language": "typescript",
      "starterCode": "string",
      "expectedSolution": "string",
      "keyPoints": ["string"]
    }
  ]
}`

  const result = await callStructured(QuizLLMOutputSchema, GENERATE_QUIZ_SYSTEM_PROMPT, prompt)

  if (result.questions.length !== questionCount) {
    throw new Error(`LLM returned ${result.questions.length} valid questions, expected ${questionCount}`)
  }

  const questions = result.questions.map((question) => normalizeQuestion(question))
  if (questions.some((question) => question === null)) {
    throw new Error('LLM returned an invalid question')
  }
  const normalizedQuestions = questions.filter((question) => question !== null)

  const unexpectedType = normalizedQuestions.find((question) => !questionTypes.includes(question.type))
  if (unexpectedType) {
    throw new Error(`LLM returned unsupported question type: ${unexpectedType.type}`)
  }

  return {
    id: crypto.randomUUID(),
    userId,
    title: result.title,
    topic: quizTopic,
    difficulty,
    questions: normalizedQuestions,
    source,
    isPublic: false,
    createdAt: new Date().toISOString(),
  }
}

export function normalizeQuestionTypes(types: unknown): QuestionType[] {
  if (!Array.isArray(types)) return ['multiple-choice']

  const normalized = types.filter((type): type is QuestionType =>
    typeof type === 'string' && QUESTION_TYPES.includes(type as QuestionType)
  )

  return normalized.length > 0 ? [...new Set(normalized)] : ['multiple-choice']
}
