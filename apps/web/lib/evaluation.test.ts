import test from 'node:test'
import assert from 'node:assert/strict'
import { parseEvaluateQuizAnswerRequest, resolveEvaluationQuestion } from './evaluation.ts'

test('parseEvaluateQuizAnswerRequest validates payload shape', () => {
  assert.deepEqual(
    parseEvaluateQuizAnswerRequest({ quizId: '1', questionId: 'q5', userAnswer: 'memoizes values' }),
    { quizId: '1', questionId: 'q5', userAnswer: 'memoizes values' },
  )

  assert.throws(
    () => parseEvaluateQuizAnswerRequest({ quizId: '1', questionId: 'q5' }),
    /quizId, questionId, and userAnswer are required/,
  )
})

test('resolveEvaluationQuestion looks up canonical server question data', () => {
  const question = resolveEvaluationQuestion([
    {
      id: 'q6',
      type: 'code-writing',
      prompt: 'Write a memoized hook helper.',
      language: 'typescript',
      starterCode: 'function useStableValue() {}',
      expectedSolution: 'function useStableValue() { return useMemo(() => value, [value]) }',
      keyPoints: ['uses useMemo', 'includes dependency array'],
    },
  ], 'q6')

  assert.equal(question.id, 'q6')
  assert.equal(question.type, 'code-writing')
})

test('resolveEvaluationQuestion rejects unknown questions', () => {
  assert.throws(
    () => resolveEvaluationQuestion([], 'missing'),
    /Question not found/,
  )
})

test('resolveEvaluationQuestion rejects malformed stored questions', () => {
  assert.throws(
    () => resolveEvaluationQuestion([
      { id: 'q1', type: 'open-ended', prompt: 'Explain memoization.' },
    ], 'q1'),
    /Question is invalid/,
  )
})

test('resolveEvaluationQuestion uses shared question bounds validation', () => {
  assert.throws(
    () => resolveEvaluationQuestion([
      {
        id: 'q1',
        type: 'multiple-choice',
        prompt: 'Pick one.',
        options: ['A', 'B'],
        correctIndex: 2,
        explanation: 'Out of range.',
      },
    ], 'q1'),
    /Question is invalid/,
  )
})
