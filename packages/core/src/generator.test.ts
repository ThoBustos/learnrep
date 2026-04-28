import test from 'node:test'
import assert from 'node:assert/strict'
import { generateQuiz } from './generator.js'

const baseQuestions = [
  { id: 'q1', type: 'multiple-choice' as const, prompt: 'Which hook runs side effects?', options: ['useState', 'useEffect', 'useMemo', 'useRef'], correctIndex: 1, explanation: 'useEffect handles side effects.' },
  { id: 'q2', type: 'multiple-choice' as const, prompt: 'Which hook memoizes a function?', options: ['useMemo', 'useCallback', 'useState', 'useRef'], correctIndex: 1, explanation: 'useCallback memoizes functions.' },
  { id: 'q3', type: 'multiple-choice' as const, prompt: 'Which hook stores local state?', options: ['useState', 'useEffect', 'useLayoutEffect', 'useRef'], correctIndex: 0, explanation: 'useState stores local state.' },
  { id: 'q4', type: 'multiple-choice' as const, prompt: 'Which hook memoizes a computed value?', options: ['useCallback', 'useMemo', 'useEffect', 'useState'], correctIndex: 1, explanation: 'useMemo memoizes computed values.' },
  { id: 'q5', type: 'multiple-choice' as const, prompt: 'Which hook stores a mutable ref?', options: ['useId', 'useContext', 'useRef', 'useReducer'], correctIndex: 2, explanation: 'useRef stores mutable refs.' },
]

test('generateQuiz returns canonical quiz shape', async () => {
  const quiz = await generateQuiz({
    topic: 'React hooks',
    difficulty: 'easy',
    userId: 'user-1',
    source: 'cli',
    callStructured: async () => ({ title: 'React hooks', questions: baseQuestions }) as never,
  })

  assert.equal(quiz.questions.length, 5)
  assert.equal(quiz.questions[0]?.correctIndex, 1)
})

test('generateQuiz rejects when question count does not match difficulty', async () => {
  await assert.rejects(
    () => generateQuiz({
      topic: 'React hooks',
      difficulty: 'easy',
      userId: 'user-1',
      source: 'cli',
      callStructured: async () => ({ title: 'Broken quiz', questions: baseQuestions.slice(0, 2) }) as never,
    }),
    /expected 5/,
  )
})
