'use client'

import { useState } from 'react'
import { Lock, Unlock, Share2, Eye } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DashboardCanvas,
  IconButton,
  LoadingState,
  PageTitle,
  QuizCollectionRow,
  WorkbookActionLink,
  WorkbookButton,
  WorkbookEmptyState,
  WorkbookList,
} from '@/components/ui/LearningSurface'

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

export default function QuizzesPage() {
  const queryClient = useQueryClient()
  const [copied, setCopied] = useState<string | null>(null)
  const [optimisticPublic, setOptimisticPublic] = useState<Record<string, boolean>>({})

  const { data: quizzes = [], isLoading } = useQuery<ApiQuiz[]>({
    queryKey: ['quizzes'],
    queryFn: ({ signal }) =>
      fetch('/api/quizzes', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch'))
      ),
  })

  async function toggleVisibility(quiz: ApiQuiz) {
    const current = optimisticPublic[quiz.id] ?? quiz.is_public
    const newValue = !current
    setOptimisticPublic((prev) => ({ ...prev, [quiz.id]: newValue }))
    try {
      const res = await fetch(`/api/quiz/${quiz.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_public: newValue }),
      })
      if (!res.ok) {
        setOptimisticPublic((prev) => ({ ...prev, [quiz.id]: current }))
      } else {
        queryClient.invalidateQueries({ queryKey: ['quizzes'] })
      }
    } catch {
      setOptimisticPublic((prev) => ({ ...prev, [quiz.id]: current }))
    }
  }

  function copyLink(id: string) {
    const url = `${window.location.origin}/quiz/${id}`
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (isLoading) {
    return (
      <DashboardCanvas>
        <PageTitle title="My Quizzes" />
        <LoadingState />
      </DashboardCanvas>
    )
  }

  return (
    <DashboardCanvas>
      <PageTitle title="My Quizzes" />

      {quizzes.length === 0 ? (
        <WorkbookEmptyState
          title="No quizzes yet"
          description="Generate your first quiz with the CLI"
        />
      ) : (
        <WorkbookList>
          {quizzes.map((quiz) => {
            const isPublic = optimisticPublic[quiz.id] ?? quiz.is_public
            return (
              <QuizRow
                key={quiz.id}
                quiz={quiz}
                isPublic={isPublic}
                copied={copied === quiz.id}
                onCopy={() => copyLink(quiz.id)}
                onToggle={() => toggleVisibility(quiz)}
              />
            )
          })}
        </WorkbookList>
      )}
    </DashboardCanvas>
  )
}

function QuizRow({
  quiz,
  isPublic,
  copied,
  onCopy,
  onToggle,
}: {
  quiz: ApiQuiz
  isPublic: boolean
  copied: boolean
  onCopy: () => void
  onToggle: () => void
}) {
  return (
    <QuizCollectionRow
      title={quiz.title}
      topic={quiz.topic}
      difficulty={quiz.difficulty}
      questionCount={quiz.questionCount}
      attemptCount={quiz.attemptCount}
      bestScore={quiz.myBestScore}
      dateLabel={`Created ${new Date(quiz.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
      status={{ label: isPublic ? 'Public' : 'Private', tone: isPublic ? 'teal' : 'paper' }}
      actions={(
        <>
          <IconButton
            icon={isPublic ? Unlock : Lock}
            onClick={onToggle}
            title={isPublic ? 'Make private' : 'Make public'}
          />
          <WorkbookButton
            onClick={onCopy}
            tone={copied ? 'green' : 'paper'}
            icon={Share2}
            iconSize="xs"
          >
            {copied ? 'Copied!' : 'Share'}
          </WorkbookButton>
          <WorkbookActionLink href={`/quiz/${quiz.id}`} icon={Eye}>
            View
          </WorkbookActionLink>
        </>
      )}
    />
  )
}
