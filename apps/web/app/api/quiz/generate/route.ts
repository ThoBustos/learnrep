import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { generateQuiz } from '@learnrep/core'
import { isValidDifficulty } from '@learnrep/core'
import type { Difficulty } from '@learnrep/core'

type QuizSource = 'cli' | 'mcp' | 'web'

const anthropic = new Anthropic()

async function callLLM(system: string, prompt: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system,
    messages: [{ role: 'user', content: prompt }],
  })
  const block = msg.content.find((b) => b.type === 'text')
  if (!block || block.type !== 'text') throw new Error('No text response from LLM')
  return block.text
}

function makeSupabaseClient(cookieStore?: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore?.getAll() ?? [],
        setAll: () => {},
      },
    },
  )
}

// Resolves the authenticated user from either a Bearer token (CLI) or a cookie session (web).
async function getAuthUser(request: Request) {
  const authHeader = request.headers.get('Authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const { data: { user } } = await makeSupabaseClient().auth.getUser(token)
    return user
  }

  const cookieStore = await cookies()
  const { data: { user } } = await makeSupabaseClient(cookieStore).auth.getUser()
  return user
}

export async function POST(request: Request) {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { topic, difficulty = 'medium', source = 'web' } = body as {
    topic?: string
    difficulty?: string
    source?: string
  }

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }
  if (!isValidDifficulty(difficulty)) {
    return NextResponse.json({ error: 'difficulty must be easy | medium | hard | expert' }, { status: 400 })
  }
  const validSources: QuizSource[] = ['cli', 'mcp', 'web']
  const quizSource: QuizSource = validSources.includes(source as QuizSource) ? (source as QuizSource) : 'web'

  let quiz
  try {
    quiz = await generateQuiz({
      topic: topic.trim(),
      difficulty: difficulty as Difficulty,
      userId: user.id,
      source: quizSource,
      callLLM,
    })
  } catch (err) {
    console.error('Generation error:', err)
    return NextResponse.json({ error: 'Quiz generation failed' }, { status: 500 })
  }

  const shareCode = quiz.id.slice(0, 8)
  const cookieStore = await cookies()

  const { error: insertError } = await makeSupabaseClient(cookieStore).from('quizzes').insert({
    id: quiz.id,
    user_id: user.id,
    title: quiz.title,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    questions: quiz.questions,
    source: quiz.source,
    is_public: true,
    share_code: shareCode,
    created_at: quiz.createdAt,
  })

  if (insertError) {
    console.error('Insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save quiz' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://learnrep.ideabench.ai'

  return NextResponse.json({
    id: quiz.id,
    title: quiz.title,
    shareCode,
    shareUrl: `${siteUrl}/quiz/${quiz.id}/take`,
  })
}
