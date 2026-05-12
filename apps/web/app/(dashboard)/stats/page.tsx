'use client'

import { useQuery } from '@tanstack/react-query'
import { FlameIcon } from '@/components/icons/FlameIcon'
import { BrainIcon } from '@/components/icons/BrainIcon'
import { TrendIcon } from '@/components/icons/TrendIcon'
import {
  DashboardCanvas,
  IconMetricCard,
  LoadingState,
  MetricTicketGrid,
  MiniMetric,
  MiniMetricGrid,
  PageTitle,
  TopicScoreRow,
  WorkbookEmptyState,
  WorkbookList,
  WorkbookPanel,
  WorkbookPanelHeader,
} from '@/components/ui/LearningSurface'
import type { TopicStat } from '@/lib/types'

type UserStats = {
  quizzesTaken: number
  topicsExplored: number
  quizzesGenerated: number
  avgScore: number | null
  streak: number
  avgImprovement: number | null
}

export default function StatsPage() {
  const { data: stats } = useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: ({ signal }) =>
      fetch('/api/user/stats', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch stats'))
      ),
  })

  const { data: topics = [], isLoading: topicsLoading } = useQuery<TopicStat[]>({
    queryKey: ['stats-topics'],
    queryFn: ({ signal }) =>
      fetch('/api/stats/topics', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch topics'))
      ),
  })

  const streak = stats ? `${stats.streak}d` : '--'
  const topicsMastered = stats ? stats.topicsExplored.toString() : '--'
  const avgImprovement = stats?.avgImprovement != null
    ? `${stats.avgImprovement >= 0 ? '+' : ''}${stats.avgImprovement}%`
    : '--'

  return (
    <DashboardCanvas>
      <PageTitle title="Stats" />

      <MetricTicketGrid>
        <IconMetricCard icon={FlameIcon} label="Current Streak" value={streak} />
        <IconMetricCard icon={BrainIcon} label="Topics Explored" value={topicsMastered} />
        <IconMetricCard icon={TrendIcon} label="Avg Improvement" value={avgImprovement} />
      </MetricTicketGrid>

      {stats && (
        <MiniMetricGrid>
          <MiniMetric label="Quizzes taken" value={stats.quizzesTaken} />
          <MiniMetric label="Quizzes generated" value={stats.quizzesGenerated} />
          <MiniMetric label="Avg score" value={stats.avgScore != null ? `${stats.avgScore}%` : '--'} />
          <MiniMetric label="Topics explored" value={stats.topicsExplored} />
        </MiniMetricGrid>
      )}

      <WorkbookPanel>
        <WorkbookPanelHeader kicker="stats" title="Topic Breakdown" />
        {topicsLoading ? (
          <WorkbookList><LoadingState /></WorkbookList>
        ) : topics.length === 0 ? (
          <WorkbookEmptyState title="No attempts yet." description="Generate a quiz to get started." />
        ) : (
          <WorkbookList>
            {topics.map((topic) => (
              <TopicScoreRow
                key={topic.topic}
                topic={topic.topic}
                attempts={topic.attempts}
                bestScore={topic.bestScore}
                improvement={topic.improvement}
                maxScore={Math.max(...topics.map((t) => t.bestScore))}
              />
            ))}
          </WorkbookList>
        )}
      </WorkbookPanel>
    </DashboardCanvas>
  )
}
