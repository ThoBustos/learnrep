'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  DashboardCanvas,
  MetricTicket,
  MetricTicketGrid,
  PromptCard,
  QuizFeedRow,
  WorkbookEmptyState,
  WorkbookList,
  WorkbookPanel,
  WorkbookPanelHeader,
} from '@/components/ui/LearningSurface'

const HARNESS_PROMPT = 'run lr help, then generate a quiz about all the learnings from this session'

type UserStats = {
  quizzesTaken: number
  topicsExplored: number
  quizzesGenerated: number
  avgScore: number | null
  streak: number
  avgImprovement: number | null
}

type ApiQuiz = {
  id: string
  title: string
  topic: string
  difficulty: string
  questionCount: number
  is_public: boolean
  created_at: string
  attemptCount: number
  myBestScore: number | null
}

export default function DashboardPage() {
  const [copied, setCopied] = useState(false)

  const { data: stats } = useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: ({ signal }) =>
      fetch('/api/user/stats', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch stats'))
      ),
  })

  const { data: quizzes = [] } = useQuery<ApiQuiz[]>({
    queryKey: ['quizzes'],
    queryFn: ({ signal }) =>
      fetch('/api/quizzes', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch'))
      ),
  })

  function copyPrompt() {
    navigator.clipboard.writeText(HARNESS_PROMPT).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statCards = [
    {
      value: stats ? stats.quizzesTaken.toString() : '--',
      label: 'Quizzes taken',
      tone: 'paper' as const,
      meta: stats ? `${stats.streak} day streak` : 'Waiting for stats',
    },
    {
      value: stats ? stats.topicsExplored.toString() : '--',
      label: 'Topics explored',
      tone: 'teal' as const,
      meta: 'Across generated quizzes',
    },
    {
      value: stats?.avgScore != null ? `${stats.avgScore}%` : '--',
      label: 'Avg score',
      tone: 'yolk' as const,
      meta: stats?.avgImprovement != null ? `${stats.avgImprovement}% avg lift` : 'Scoreboard warming up',
    },
  ]

  return (
    <DashboardCanvas>
      <MetricTicketGrid>
        {statCards.map((card) => <MetricTicket key={card.label} {...card} />)}
      </MetricTicketGrid>

      <PromptCard
        kicker="agent note"
        prompt={HARNESS_PROMPT}
        copied={copied}
        onCopy={copyPrompt}
      />

      <WorkbookPanel>
        <WorkbookPanelHeader kicker="feed" title="Your Feed" />

        {quizzes.length === 0 ? (
          <WorkbookEmptyState
            title="No quizzes yet."
            description="Your first generated quiz will land here."
          />
        ) : (
          <WorkbookList>
            {quizzes.map((quiz) => (
              <QuizFeedRow
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                title={quiz.title}
                topic={quiz.topic}
                difficulty={quiz.difficulty}
                questionCount={quiz.questionCount}
                attemptCount={quiz.attemptCount}
                bestScore={quiz.myBestScore}
              />
            ))}
          </WorkbookList>
        )}
      </WorkbookPanel>
    </DashboardCanvas>
  )
}
