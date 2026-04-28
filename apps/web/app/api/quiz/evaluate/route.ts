import { NextResponse } from 'next/server'
import { evaluateAnswer } from '@learnrep/core'
import { parseEvaluateQuizAnswerRequest, resolveEvaluationQuestion } from '@/lib/evaluation'
import { callStructured } from '@/lib/llm'

export async function POST(request: Request) {
  try {
    const payload = parseEvaluateQuizAnswerRequest(await request.json())
    const question = resolveEvaluationQuestion(payload)

    const result = await evaluateAnswer({ question, userAnswer: payload.userAnswer, callStructured })
    return NextResponse.json(result)
  } catch (err) {
    console.error('Evaluation error:', err)
    return NextResponse.json(
      { correct: false, score: 0, feedback: 'Evaluation failed. Please try again.' },
      { status: 500 }
    )
  }
}
