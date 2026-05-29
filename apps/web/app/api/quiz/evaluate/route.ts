import { NextResponse } from 'next/server'
import { evaluateAnswer } from '@learnrep/core'
import {
  parseEvaluateQuizAnswerRequest,
  resolveEvaluationQuestion,
  type EvaluateQuizAnswerRequest,
} from '@/lib/evaluation'
import { callStructured } from '@/lib/llm'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  let payload: EvaluateQuizAnswerRequest
  try {
    payload = parseEvaluateQuizAnswerRequest(await request.json())
  } catch {
    return NextResponse.json({ error: 'quizId, questionId, and userAnswer are required' }, { status: 400 })
  }

  const db = await createClient()
  const { data: quiz, error } = await db
    .from('quizzes')
    .select('questions')
    .eq('id', payload.quizId)
    .single()

  if (error || !quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  let question: ReturnType<typeof resolveEvaluationQuestion>
  try {
    question = resolveEvaluationQuestion(quiz.questions, payload.questionId)
  } catch {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  try {
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
