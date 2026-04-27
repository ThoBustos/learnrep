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
  const question = resolveEvaluationQuestion({ quizId: '1', questionId: 'q6', userAnswer: 'answer' })

  assert.equal(question.id, 'q6')
  assert.equal(question.type, 'code-writing')
})

test('resolveEvaluationQuestion rejects unknown questions', () => {
  assert.throws(
    () => resolveEvaluationQuestion({ quizId: '1', questionId: 'missing', userAnswer: 'answer' }),
    /Question not found/,
  )
})
