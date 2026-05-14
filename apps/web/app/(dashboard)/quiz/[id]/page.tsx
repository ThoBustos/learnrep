'use client'

import { useContext, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Copy, Lock, Unlock, Check, ChevronLeft } from 'lucide-react'
import {
  ActionBar,
  AttemptRow,
  BackLink,
  CenteredState,
  DashboardCanvas,
  QuizHeroPanel,
  WorkbookActionLink,
  WorkbookButton,
  WorkbookEmptyState,
  WorkbookList,
  WorkbookPanel,
  WorkbookPanelHeader,
} from '@/components/ui/LearningSurface'
import { NotifContext } from '@/components/layout/NotifContext'
import { createClient } from '@/lib/supabase/client'

type Quiz = {
  id: string
  user_id: string
  title: string
  topic: string
  difficulty: string
  questions: unknown[]
  is_public: boolean
  share_code: string | null
}

type LeaderboardEntry = {
  id: string
  score: number
  firstScore: number
  delta: number | null
  attemptCount: number
  completed_at: string
  display_name: string | null
  avatar_url: string | null
  rank: number
}

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { openNotif, unreadCount } = useContext(NotifContext)
  const queryClient = useQueryClient()

  const [copied, setCopied] = useState(false)
  const [isPublicOverride, setIsPublicOverride] = useState<boolean | null>(null)

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => createClient().auth.getUser().then(({ data }) => data.user ?? null),
  })

  const { data: quiz, isLoading: quizLoading } = useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: ({ signal }) =>
      fetch(`/api/quiz/${id}`, { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Quiz not found'))
      ),
  })

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', id],
    queryFn: ({ signal }) =>
      fetch(`/api/quiz/${id}/leaderboard`, { signal }).then((r) =>
        r.ok ? r.json() : []
      ),
    enabled: !!quiz?.is_public,
  })

  const isOwner = !!(currentUser && quiz?.user_id && currentUser.id === quiz.user_id)
  const effectiveIsPublic = isPublicOverride ?? quiz?.is_public ?? false

  async function toggleVisibility() {
    if (!quiz) return
    const newValue = !effectiveIsPublic
    setIsPublicOverride(newValue) // optimistic
    try {
      const res = await fetch(`/api/quiz/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_public: newValue }),
      })
      if (!res.ok) {
        setIsPublicOverride(!newValue) // revert
      } else {
        queryClient.invalidateQueries({ queryKey: ['quiz', id] })
        if (newValue) {
          queryClient.invalidateQueries({ queryKey: ['leaderboard', id] })
        }
      }
    } catch {
      setIsPublicOverride(!newValue) // revert
    }
  }

  function copyLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}`).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (quizLoading) {
    return <CenteredState label="Loading..." />
  }

  if (!quiz) {
    return <CenteredState label="Quiz not found." />
  }

  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0
  const estMinutes = Math.round(questionCount * 1.5)
  const attemptCount = leaderboard.length

  return (
    <DashboardCanvas>
      <BackLink href="/quizzes" icon={ChevronLeft}>
        My Quizzes
      </BackLink>

      <QuizHeroPanel
        topic={quiz.topic}
        difficulty={quiz.difficulty}
        title={quiz.title}
        stats={[
          { value: questionCount, label: 'questions' },
          { value: `~${estMinutes} min`, label: 'to complete' },
          { value: attemptCount, label: 'attempts' },
        ]}
      />

      <ActionBar>
        <WorkbookActionLink
          href={`/quiz/${id}/take`}
          tone="ink"
        >
          Start Quiz
        </WorkbookActionLink>

        {isOwner && (
          <>
            <WorkbookButton
              onClick={toggleVisibility}
              tone={effectiveIsPublic ? 'teal' : 'paper'}
              icon={effectiveIsPublic ? Unlock : Lock}
            >
              {effectiveIsPublic ? 'Public' : 'Private'}
            </WorkbookButton>

            <WorkbookButton
              onClick={copyLink}
              tone={copied ? 'green' : 'paper'}
              icon={copied ? Check : Copy}
            >
              {copied ? 'Copied!' : 'Copy link'}
            </WorkbookButton>

            <WorkbookButton
              onClick={openNotif}
              tone="red"
              icon={Bell}
            >
              {unreadCount === 1 ? '1 notification' : unreadCount > 1 ? `${unreadCount} notifications` : 'Notifications'}
            </WorkbookButton>
          </>
        )}
      </ActionBar>

      <WorkbookPanel>
        <WorkbookPanelHeader kicker="quiz" title="Attempts" />
        {leaderboard.length === 0 ? (
          <WorkbookEmptyState title="No attempts yet." description="Be the first." />
        ) : (
          <WorkbookList>
            {leaderboard.map((entry) => {
              const displayName = entry.display_name ?? 'Anonymous'
              return (
                <AttemptRow
                  key={entry.id}
                  rank={entry.rank}
                  displayName={displayName}
                  attemptCount={entry.attemptCount}
                  dateLabel={new Date(entry.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  delta={entry.delta}
                  score={entry.score}
                />
              )
            })}
          </WorkbookList>
        )}
      </WorkbookPanel>
    </DashboardCanvas>
  )
}
