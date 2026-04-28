import { z } from 'zod'
import type { Difficulty, Quiz } from './types'
import { DIFFICULTY_QUESTION_COUNT, GENERATE_QUIZ_SYSTEM_PROMPT, QuizLLMOutputSchema } from './schemas'

export interface GenerateQuizParams {
  topic: string
  difficulty: Difficulty
  userId: string
  source: Quiz['source']
  callStructured: <T>(schema: z.ZodType<T>, system: string, prompt: string) => Promise<T>
}

export async function generateQuiz(params: GenerateQuizParams): Promise<Quiz> {
  const { topic, difficulty, userId, source, callStructured } = params
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

  const result = await callStructured(QuizLLMOutputSchema, GENERATE_QUIZ_SYSTEM_PROMPT, prompt)

  if (result.questions.length !== questionCount) {
    throw new Error(`LLM returned ${result.questions.length} valid questions, expected ${questionCount}`)
  }

  return {
    id: crypto.randomUUID(),
    userId,
    title: result.title,
    topic,
    difficulty,
    questions: result.questions,
    source,
    isPublic: false,
    createdAt: new Date().toISOString(),
  }
}
