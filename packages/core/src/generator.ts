import type { Difficulty, Question, Quiz } from './types'
import { DIFFICULTY_QUESTION_COUNT, GENERATE_QUIZ_SYSTEM_PROMPT, normalizeQuestion } from './schemas'

export interface GenerateQuizParams {
  topic: string
  difficulty: Difficulty
  userId: string
  source: Quiz['source']
  /** Call the LLM and return its text response */
  callLLM: (system: string, prompt: string) => Promise<string>
}

export async function generateQuiz(params: GenerateQuizParams): Promise<Quiz> {
  const { topic, difficulty, userId, source, callLLM } = params
  const questionCount = DIFFICULTY_QUESTION_COUNT[difficulty]

  const prompt = `Generate a ${difficulty} quiz about "${topic}" with exactly ${questionCount} multiple-choice questions.

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
    }
  ]
}`

  const raw = await callLLM(GENERATE_QUIZ_SYSTEM_PROMPT, prompt)

  let parsed: { title: string; questions: unknown[] }
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(`LLM returned non-JSON: ${raw.slice(0, 200)}`)
  }

  if (!parsed.title || !Array.isArray(parsed.questions)) {
    throw new Error('LLM returned unexpected shape')
  }

  const questions = parsed.questions
    .map((question) => normalizeQuestion(question))
    .filter((question): question is Question => question !== null)

  if (questions.length !== questionCount) {
    throw new Error(`LLM returned ${questions.length} valid questions, expected ${questionCount}`)
  }

  return {
    id: crypto.randomUUID(),
    userId,
    title: parsed.title,
    topic,
    difficulty,
    questions,
    source,
    isPublic: false,
    createdAt: new Date().toISOString(),
  }
}
