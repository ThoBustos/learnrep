'use client'

import { useQuery } from '@tanstack/react-query'
import {
  DashboardCanvas,
  LoadingState,
  PageTitle,
  QuizCollectionRow,
  WorkbookActionLink,
  WorkbookEmptyState,
  WorkbookList,
} from '@/components/ui/LearningSurface'

type LibraryQuiz = {
  id: string
  title: string
  topic: string
  difficulty: string
  questionCount: number
  bestScore: number | null
  lastAttemptAt: string | null
}

export default function LibraryPage() {
  const { data: quizzes = [], isLoading } = useQuery<LibraryQuiz[]>({
    queryKey: ['library'],
    queryFn: ({ signal }) =>
      fetch('/api/library', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch'))
      ),
  })

  return (
    <DashboardCanvas>
      <PageTitle title="Library" />

      {isLoading ? (
        <LoadingState />
      ) : quizzes.length === 0 ? (
        <WorkbookEmptyState
          title="Your library is empty"
          description="Take a public quiz shared with you to save it here"
          action={<WorkbookActionLink href="/dashboard">Browse Feed</WorkbookActionLink>}
        />
      ) : (
        <WorkbookList>
          {quizzes.map((quiz) => (
            <LibraryRow key={quiz.id} quiz={quiz} />
          ))}
        </WorkbookList>
      )}
    </DashboardCanvas>
  )
}

function LibraryRow({ quiz }: { quiz: LibraryQuiz }) {
  return (
    <QuizCollectionRow
      title={quiz.title}
      topic={quiz.topic}
      difficulty={quiz.difficulty}
      questionCount={quiz.questionCount}
      bestScore={quiz.bestScore}
      dateLabel={quiz.lastAttemptAt
        ? `Last: ${new Date(quiz.lastAttemptAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : 'Not attempted'}
      actions={<WorkbookActionLink href={`/quiz/${quiz.id}/take`}>Take it</WorkbookActionLink>}
    />
  )
}
