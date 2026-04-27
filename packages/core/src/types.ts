export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type QuestionType = 'multiple-choice' | 'multi-select' | 'open-ended' | 'code-writing'

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
}

export interface Quiz {
  id: string
  userId: string
  title: string
  topic: string
  difficulty: Difficulty
  questions: Question[]
  source: 'cli' | 'mcp' | 'web'
  isPublic: boolean
  shareCode?: string
  createdAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  score: number
  answers: Record<string, string | string[]>
  completedAt: string
}
