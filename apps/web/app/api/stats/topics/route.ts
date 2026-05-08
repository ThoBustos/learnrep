import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TopicStat } from '@/lib/types'

export type { TopicStat }

export async function GET() {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: attempts, error: attemptsError } = await db
    .from('quiz_attempts')
    .select('quiz_id, score, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: true })

  if (attemptsError) {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
  }

  if (!attempts || attempts.length === 0) {
    return NextResponse.json([])
  }

  const quizIds = [...new Set(attempts.map((a) => a.quiz_id))]

  const { data: quizzes, error: quizzesError } = await db
    .from('quizzes')
    .select('id, topic')
    .in('id', quizIds)

  if (quizzesError) {
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }

  const topicByQuiz = new Map((quizzes ?? []).map((q) => [q.id, q.topic]))

  const byTopic = new Map<string, { scores: number[]; firstScore: number; bestScore: number }>()

  for (const attempt of attempts) {
    const topic = topicByQuiz.get(attempt.quiz_id)
    if (!topic) continue
    const existing = byTopic.get(topic)
    if (!existing) {
      byTopic.set(topic, { scores: [attempt.score], firstScore: attempt.score, bestScore: attempt.score })
    } else {
      existing.scores.push(attempt.score)
      if (attempt.score > existing.bestScore) existing.bestScore = attempt.score
    }
  }

  const result: TopicStat[] = Array.from(byTopic.entries()).map(([topic, { scores, firstScore, bestScore }]) => ({
    topic,
    attempts: scores.length,
    avgScore: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
    bestScore,
    improvement: scores.length >= 2 ? bestScore - firstScore : null,
  }))

  result.sort((a, b) => b.attempts - a.attempts || b.avgScore - a.avgScore)

  return NextResponse.json(result)
}
