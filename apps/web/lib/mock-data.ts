import type { Difficulty, Question } from '@learnrep/core'

export type { Difficulty }

export interface MockQuiz {
  id: string
  title: string
  topic: string
  difficulty: Difficulty
  questionCount: number
  attempts: number
  bestScore: number
  author: string
  authorHandle: string
  createdAt: string
  visibility: 'public' | 'private'
  isOwner: boolean
}

export interface MockAttempt {
  id: string
  quizId: string
  user: string
  userHandle: string
  score: number
  completedAt: string
  rank: number
}

export interface MockNotification {
  id: string
  type: 'invite' | 'access_request' | 'approved'
  from: string
  quizTitle: string
  quizId: string
  createdAt: string
}

export const mockQuizzes: MockQuiz[] = [
  {
    id: '1',
    title: 'React Server Components',
    topic: 'React',
    difficulty: 'medium',
    questionCount: 8,
    attempts: 3,
    bestScore: 75,
    author: 'Thomas B.',
    authorHandle: '@thomas',
    createdAt: '2026-04-25T10:00:00Z',
    visibility: 'public',
    isOwner: true,
  },
  {
    id: '2',
    title: 'TypeScript Generics Deep Dive',
    topic: 'TypeScript',
    difficulty: 'hard',
    questionCount: 10,
    attempts: 1,
    bestScore: 60,
    author: 'Thomas B.',
    authorHandle: '@thomas',
    createdAt: '2026-04-24T14:00:00Z',
    visibility: 'private',
    isOwner: true,
  },
  {
    id: '3',
    title: 'Closures and Scope',
    topic: 'JavaScript',
    difficulty: 'easy',
    questionCount: 6,
    attempts: 5,
    bestScore: 90,
    author: 'Thomas B.',
    authorHandle: '@thomas',
    createdAt: '2026-04-23T09:00:00Z',
    visibility: 'public',
    isOwner: true,
  },
  {
    id: '4',
    title: 'SQL Indexes Deep Dive',
    topic: 'Database',
    difficulty: 'expert',
    questionCount: 12,
    attempts: 0,
    bestScore: 0,
    author: 'Angel C.',
    authorHandle: '@angel',
    createdAt: '2026-04-22T16:00:00Z',
    visibility: 'public',
    isOwner: false,
  },
  {
    id: '5',
    title: 'Async Patterns in Go',
    topic: 'Go',
    difficulty: 'hard',
    questionCount: 9,
    attempts: 2,
    bestScore: 55,
    author: 'John M.',
    authorHandle: '@john',
    createdAt: '2026-04-21T11:00:00Z',
    visibility: 'public',
    isOwner: false,
  },
  {
    id: '6',
    title: 'CSS Grid Mastery',
    topic: 'CSS',
    difficulty: 'easy',
    questionCount: 7,
    attempts: 4,
    bestScore: 85,
    author: 'Angel C.',
    authorHandle: '@angel',
    createdAt: '2026-04-20T08:00:00Z',
    visibility: 'public',
    isOwner: false,
  },
]

export const mockLeaderboard: MockAttempt[] = [
  { id: 'a1', quizId: '1', user: 'Thomas B.', userHandle: '@thomas', score: 75, completedAt: '2026-04-27T09:00:00Z', rank: 1 },
  { id: 'a2', quizId: '1', user: 'Angel C.', userHandle: '@angel', score: 70, completedAt: '2026-04-26T14:00:00Z', rank: 2 },
  { id: 'a3', quizId: '1', user: 'John M.', userHandle: '@john', score: 62, completedAt: '2026-04-25T11:00:00Z', rank: 3 },
  { id: 'a4', quizId: '1', user: 'Sara K.', userHandle: '@sara', score: 50, completedAt: '2026-04-24T16:00:00Z', rank: 4 },
]

export const mockNotifications: MockNotification[] = [
  {
    id: 'n1',
    type: 'invite',
    from: 'Angel C.',
    quizTitle: 'TypeScript Generics Deep Dive',
    quizId: '2',
    createdAt: '2026-04-27T08:00:00Z',
  },
  {
    id: 'n2',
    type: 'access_request',
    from: 'John M.',
    quizTitle: 'React Server Components',
    quizId: '1',
    createdAt: '2026-04-26T20:00:00Z',
  },
  {
    id: 'n3',
    type: 'approved',
    from: 'Angel C.',
    quizTitle: 'SQL Indexes Deep Dive',
    quizId: '4',
    createdAt: '2026-04-26T15:00:00Z',
  },
]

export const difficultyStyles: Record<Difficulty, { bg: string; text: string; border: string; label: string }> = {
  easy:   { bg: 'bg-[#d9ff69]', text: 'text-[#1e6f38]', border: 'border-[#1e6f38]', label: 'Easy' },
  medium: { bg: 'bg-[#7bd8ef]', text: 'text-[#0d5c75]', border: 'border-[#0d5c75]', label: 'Medium' },
  hard:   { bg: 'bg-[#ff6b62]', text: 'text-[#9c231d]', border: 'border-[#9c231d]', label: 'Hard' },
  expert: { bg: 'bg-[#b995ff]', text: 'text-[#5735a7]', border: 'border-[#5735a7]', label: 'Expert' },
}

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    prompt: 'What is a React Server Component?',
    options: [
      'A component that runs on the client',
      'A component that renders on the server with no client JS',
      'A Redux state component',
      'A server-side API handler',
    ],
    correctIndex: 1,
    explanation: 'React Server Components run entirely on the server and send no JavaScript to the client, enabling faster page loads and direct database access.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    prompt: 'Which hook is used for side effects?',
    options: [
      'useState',
      'useCallback',
      'useEffect',
      'useMemo',
    ],
    correctIndex: 2,
    explanation: 'useEffect runs after render and handles side effects like data fetching, subscriptions, and DOM mutations.',
  },
  {
    id: 'q3',
    type: 'multi-select',
    prompt: 'Which of the following are valid React hooks? (Select all that apply)',
    options: [
      'useEffect',
      'useDatabase',
      'useCallback',
      'useServer',
      'useRef',
      'useNetwork',
    ],
    correctIndices: [0, 2, 4],
    explanation: 'useEffect, useCallback, and useRef are built-in React hooks. useDatabase, useServer, and useNetwork do not exist in React core.',
  },
  {
    id: 'q4',
    type: 'multi-select',
    prompt: 'Which statements about React Server Components are true? (Select all that apply)',
    options: [
      'They can directly access databases',
      'They can use useState',
      'They reduce client-side JavaScript',
      'They run in the browser',
    ],
    correctIndices: [0, 2],
    explanation: 'Server Components run on the server so they can access databases directly and their code never ships to the client, reducing JS bundle size. They cannot use client-only APIs like useState.',
  },
  {
    id: 'q5',
    type: 'open-ended',
    prompt: 'Explain the difference between useCallback and useMemo in React.',
    expectedAnswer: 'useCallback memoizes a function reference, preventing it from being recreated on every render. useMemo memoizes the result of a computation. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).',
    keyPoints: [
      'useCallback returns a memoized function',
      'useMemo returns a memoized value/result',
      'Both accept a dependency array',
      'useCallback prevents unnecessary re-renders of child components that receive callbacks as props',
    ],
    explanation: 'useCallback memoizes a function reference, preventing it from being recreated on every render. useMemo memoizes the result of a computation. They solve similar problems but for functions vs computed values.',
  },
  {
    id: 'q6',
    type: 'code-writing',
    prompt: 'Write a custom React hook called useLocalStorage that persists state to localStorage. It should have the same API as useState.',
    language: 'typescript',
    starterCode: `import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // your implementation here
}`,
    expectedSolution: `import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error('Failed to write to localStorage')
    }
  }

  return [storedValue, setValue] as const
}`,
    keyPoints: [
      'Reads initial value from localStorage on mount',
      'Falls back to initialValue if key not found or parse fails',
      'Syncs state updates back to localStorage',
      'Returns [value, setter] tuple like useState',
      'Handles JSON serialization/deserialization',
    ],
    explanation: 'The hook initializes state lazily from localStorage, wraps the setter to also persist to localStorage, and handles JSON serialization with error handling for SSR environments.',
  },
]

export function getMockQuestionsForQuiz(quizId: string): Question[] {
  return mockQuizzes.some((quiz) => quiz.id === quizId) ? MOCK_QUESTIONS : []
}

export function getMockQuestion(quizId: string, questionId: string): Question | undefined {
  return getMockQuestionsForQuiz(quizId).find((question) => question.id === questionId)
}
