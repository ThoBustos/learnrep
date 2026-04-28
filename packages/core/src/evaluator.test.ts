import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateAnswer, scoreAttempt } from './evaluator.js'
import { normalizeQuestion } from './schemas.js'
import type { Question } from './types.js'

const multipleChoiceQuestion = normalizeQuestion({
  id: 'q1',
  type: 'multiple-choice',
  prompt: 'Question?',
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 'B',
  explanation: 'Because B.',
}) as Question

const multiSelectQuestion = normalizeQuestion({
  id: 'q2',
  type: 'multi-select',
  prompt: 'Pick all valid hooks',
  options: ['useEffect', 'useServer', 'useCallback', 'useRef'],
  correctIndices: [0, 2, 3],
  explanation: 'React core hooks only.',
}) as Question

const openEndedQuestion = normalizeQuestion({
  id: 'q3',
  type: 'open-ended',
  prompt: 'Explain useMemo',
  expectedAnswer: 'Memoizes a computed value',
  keyPoints: ['memoized value'],
}) as Question

test('normalizeQuestion converts legacy correctAnswer letters to correctIndex', () => {
  assert.equal(multipleChoiceQuestion.correctIndex, 1)
})

test('normalizeQuestion rejects malformed multiple-choice questions', () => {
  assert.equal(normalizeQuestion({
    id: 'bad',
    type: 'multiple-choice',
    prompt: 'Broken',
    options: ['A', 'B'],
  }), null)
})

test('evaluateAnswer scores multiple-choice answers as binary', async () => {
  const correct = await evaluateAnswer({ question: multipleChoiceQuestion, userAnswer: 1 })
  const wrong = await evaluateAnswer({ question: multipleChoiceQuestion, userAnswer: 0 })

  assert.deepEqual(correct, { correct: true, score: 100, feedback: 'Correct!' })
  assert.equal(wrong.correct, false)
  assert.equal(wrong.score, 0)
})

test('evaluateAnswer scores multi-select exact matches at 100', async () => {
  const result = await evaluateAnswer({ question: multiSelectQuestion, userAnswer: [0, 2, 3] })
  assert.equal(result.correct, true)
  assert.equal(result.score, 100)
})

test('evaluateAnswer scores partial multi-select answers without rewarding select-all', async () => {
  const missingOne = await evaluateAnswer({ question: multiSelectQuestion, userAnswer: [0, 2] })
  const oneWrong = await evaluateAnswer({ question: multiSelectQuestion, userAnswer: [0, 1, 2] })
  const selectAll = await evaluateAnswer({ question: multiSelectQuestion, userAnswer: [0, 1, 2, 3] })
  const none = await evaluateAnswer({ question: multiSelectQuestion, userAnswer: [] })

  assert.equal(missingOne.score, 67)
  assert.equal(oneWrong.score, 0)
  assert.equal(selectAll.score, 0)
  assert.equal(none.score, 0)
})

test('evaluateAnswer calls callStructured for open-ended questions', async () => {
  const result = await evaluateAnswer({
    question: openEndedQuestion,
    userAnswer: 'It memoizes a value so it only recomputes when dependencies change',
    callStructured: async () => ({ correct: true, feedback: 'Good explanation.' }) as never,
  })

  assert.equal(result.correct, true)
  assert.equal(result.score, 100)
  assert.equal(result.feedback, 'Good explanation.')
})

test('evaluateAnswer returns fallback when callStructured not provided for open-ended', async () => {
  const result = await evaluateAnswer({ question: openEndedQuestion, userAnswer: 'answer' })
  assert.equal(result.correct, false)
  assert.equal(result.score, 0)
})

test('scoreAttempt averages per-question scores', () => {
  const result = scoreAttempt(
    [multipleChoiceQuestion, multiSelectQuestion],
    [
      { correct: true, score: 100, feedback: 'Correct!' },
      { correct: false, score: 50, feedback: 'Partial' },
    ],
  )

  assert.equal(result.score, 75)
})
