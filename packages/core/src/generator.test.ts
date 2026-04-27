import test from 'node:test'
import assert from 'node:assert/strict'
import { generateQuiz } from './generator.js'

test('generateQuiz normalizes valid output into canonical question shape', async () => {
  const quiz = await generateQuiz({
    topic: 'React hooks',
    difficulty: 'easy',
    userId: 'user-1',
    source: 'cli',
    callLLM: async () => JSON.stringify({
      title: 'React hooks',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          prompt: 'Which hook runs side effects?',
          options: ['useState', 'useEffect', 'useMemo', 'useRef'],
          correctAnswer: 'B',
          explanation: 'useEffect handles side effects.',
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          prompt: 'Which hook memoizes a function?',
          options: ['useMemo', 'useCallback', 'useState', 'useRef'],
          correctIndex: 1,
          explanation: 'useCallback memoizes functions.',
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          prompt: 'Which hook stores local state?',
          options: ['useState', 'useEffect', 'useLayoutEffect', 'useRef'],
          correctIndex: 0,
          explanation: 'useState stores local state.',
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          prompt: 'Which hook memoizes a computed value?',
          options: ['useCallback', 'useMemo', 'useEffect', 'useState'],
          correctIndex: 1,
          explanation: 'useMemo memoizes computed values.',
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          prompt: 'Which hook stores a mutable ref?',
          options: ['useId', 'useContext', 'useRef', 'useReducer'],
          correctIndex: 2,
          explanation: 'useRef stores mutable refs.',
        },
      ],
    }),
  })

  assert.equal(quiz.questions.length, 5)
  assert.equal(quiz.questions[0]?.correctIndex, 1)
})

test('generateQuiz rejects malformed question shapes', async () => {
  await assert.rejects(
    () => generateQuiz({
      topic: 'React hooks',
      difficulty: 'easy',
      userId: 'user-1',
      source: 'cli',
      callLLM: async () => JSON.stringify({
        title: 'Broken quiz',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            prompt: 'Broken question',
            options: ['A', 'B'],
          },
        ],
      }),
    }),
    /expected 5/,
  )
})
