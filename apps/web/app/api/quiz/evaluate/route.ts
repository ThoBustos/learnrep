import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { evaluateAnswer } from '@learnrep/core'
import { parseEvaluateQuizAnswerRequest, resolveEvaluationQuestion } from '@/lib/evaluation'

const client = new Anthropic()

async function callLLM(system: string, prompt: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system,
    messages: [{ role: 'user', content: prompt }],
  })
  const block = message.content.find((b) => b.type === 'text')
  if (!block || block.type !== 'text') throw new Error('No text response from Claude')
  return block.text
}

export async function POST(request: Request) {
  try {
    const payload = parseEvaluateQuizAnswerRequest(await request.json())
    const question = resolveEvaluationQuestion(payload)

    const result = await evaluateAnswer({ question, userAnswer: payload.userAnswer, callLLM })
    return NextResponse.json(result)
  } catch (err) {
    console.error('Evaluation error:', err)
    return NextResponse.json(
      { correct: false, score: 0, feedback: 'Evaluation failed. Please try again.' },
      { status: 500 }
    )
  }
}
