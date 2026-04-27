export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type QuestionType = 'multiple-choice' | 'multi-select' | 'open-ended' | 'code-writing'

export interface CodeSnippet {
  language: string
  code: string
  label?: string
}

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  // multiple-choice
  options?: string[]
  correctIndex?: number
  // multi-select
  correctIndices?: number[]
  // open-ended
  expectedAnswer?: string
  keyPoints?: string[]
  // code-writing
  language?: string
  starterCode?: string
  expectedSolution?: string
  // shared
  explanation?: string
  codeContext?: CodeSnippet[]
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
  answers: Record<string, number | number[] | string>
  completedAt: string
}
