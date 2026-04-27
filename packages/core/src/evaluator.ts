import type { Question, QuizAttempt } from './types'
import { EVALUATE_ANSWER_SYSTEM_PROMPT } from './schemas'

export interface EvaluateAnswerParams {
  question: Question
  userAnswer: string | string[]
  callLLM?: (system: string, prompt: string) => Promise<string>
}

export interface EvaluationResult {
  correct: boolean
  feedback: string
}

export async function evaluateAnswer(params: EvaluateAnswerParams): Promise<EvaluationResult> {
  const { question, userAnswer, callLLM } = params

  if (question.type === 'multiple-choice') {
    const answer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer
    const correct = answer?.trim().toUpperCase() === String(question.correctAnswer).toUpperCase()
    return {
      correct,
      feedback: correct ? 'Correct!' : `The correct answer is ${question.correctAnswer}. ${question.explanation ?? ''}`,
    }
  }

  if (question.type === 'multi-select') {
    const userSet = new Set(
      (Array.isArray(userAnswer) ? userAnswer : [userAnswer]).map((a) => a.trim().toUpperCase()),
    )
    const correctSet = new Set(
      (Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer]
      ).map((a) => a.toUpperCase()),
    )
    const correct =
      userSet.size === correctSet.size && [...userSet].every((a) => correctSet.has(a))
    return {
      correct,
      feedback: correct
        ? 'Correct!'
        : `The correct answers are: ${[...correctSet].join(', ')}. ${question.explanation ?? ''}`,
    }
  }

  if (!callLLM) {
    return { correct: false, feedback: 'LLM evaluator not provided for this question type.' }
  }

  const answer = Array.isArray(userAnswer) ? userAnswer.join('\n') : userAnswer
  const prompt = `Question: ${question.prompt}

Expected answer: ${JSON.stringify(question.correctAnswer)}

User's answer: ${answer}

Is the user's answer correct?`

  const raw = await callLLM(EVALUATE_ANSWER_SYSTEM_PROMPT, prompt)

  let result: EvaluationResult
  try {
    result = JSON.parse(raw)
  } catch {
    throw new Error(`LLM returned non-JSON: ${raw.slice(0, 200)}`)
  }

  if (typeof result.correct !== 'boolean' || typeof result.feedback !== 'string') {
    throw new Error('LLM evaluation response missing required fields')
  }

  return result
}

export function scoreAttempt(
  questions: Question[],
  results: EvaluationResult[],
): Pick<QuizAttempt, 'score'> {
  const correct = results.filter((r) => r.correct).length
  return { score: Math.round((correct / questions.length) * 100) }
}
