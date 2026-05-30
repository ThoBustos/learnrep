'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BookmarkX } from 'lucide-react'
import {
  DashboardCanvas,
  LoadingState,
  PageTitle,
  QuizCollectionRow,
  WorkbookActionLink,
  WorkbookButton,
  WorkbookEmptyState,
  WorkbookList,
  WorkbookPanel,
} from '@/components/ui/LearningSurface'

type LibraryQuiz = {
  id: string
  title: string
  topic: string
  difficulty: string
  questionCount: number
  bestScore: number | null
  lastAttemptAt: string | null
  savedAt: string | null
}

export default function LibraryPage() {
  const queryClient = useQueryClient()
  const { data: quizzes = [], isLoading } = useQuery<LibraryQuiz[]>({
    queryKey: ['library'],
    queryFn: ({ signal }) =>
      fetch('/api/library', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch'))
      ),
  })

  async function removeFromLibrary(quizId: string) {
    const res = await fetch(`/api/library?quizId=${encodeURIComponent(quizId)}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ['library'] })
    }
  }

  return (
    <DashboardCanvas>
      <PageTitle title="Library" />

      {isLoading ? (
        <LoadingState />
      ) : quizzes.length === 0 ? (
        <WorkbookEmptyState
          title="Your library is empty"
          description="Save shared quizzes to keep them here."
          action={<WorkbookActionLink href="/dashboard">Browse Feed</WorkbookActionLink>}
        />
      ) : (
        <WorkbookPanel>
          <WorkbookList>
            {quizzes.map((quiz) => (
              <LibraryRow key={quiz.id} quiz={quiz} onRemove={removeFromLibrary} />
            ))}
          </WorkbookList>
        </WorkbookPanel>
      )}
    </DashboardCanvas>
  )
}

function LibraryRow({
  quiz,
  onRemove,
}: {
  quiz: LibraryQuiz
  onRemove: (quizId: string) => void
}) {
  return (
    <QuizCollectionRow
      title={quiz.title}
      topic={quiz.topic}
      difficulty={quiz.difficulty}
      questionCount={quiz.questionCount}
      bestScore={quiz.bestScore}
      dateLabel={quiz.lastAttemptAt
        ? `Last: ${new Date(quiz.lastAttemptAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : quiz.savedAt
        ? `Saved: ${new Date(quiz.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : 'Saved'}
      actions={
        <>
          <WorkbookActionLink href={`/quiz/${quiz.id}/take`}>Take it</WorkbookActionLink>
          <WorkbookButton
            onClick={() => onRemove(quiz.id)}
            tone="paper"
            icon={BookmarkX}
            title="Remove from library"
          >
            Remove
          </WorkbookButton>
        </>
      }
    />
  )
}
