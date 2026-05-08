'use client'

import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { FlameIcon } from '@/components/icons/FlameIcon'
import { BrainIcon } from '@/components/icons/BrainIcon'
import { TrendIcon } from '@/components/icons/TrendIcon'
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
    <div className="flex flex-col gap-6 p-5 lg:p-8">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">Performance</p>
        <h1 className="text-4xl font-black tracking-[-0.05em]">Stats</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<FlameIcon size={30} />} label="Current Streak" value={streak} />
        <StatCard icon={<BrainIcon size={30} />} label="Topics Explored" value={topicsMastered} />
        <StatCard icon={<TrendIcon size={30} />} label="Avg Improvement" value={avgImprovement} />
      </div>

      {/* Summary row */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Quizzes taken" value={stats.quizzesTaken} />
          <MiniStat label="Quizzes generated" value={stats.quizzesGenerated} />
          <MiniStat label="Avg score" value={stats.avgScore != null ? `${stats.avgScore}%` : '--'} />
          <MiniStat label="Topics explored" value={stats.topicsExplored} />
        </div>
      )}

      {/* Topic breakdown */}
      <div className="flex flex-col gap-4 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 p-5 shadow-[6px_6px_0_#151515]">
        <h2 className="text-lg font-black">Topic Breakdown</h2>
        {topicsLoading ? (
          <p className="font-mono text-xs font-bold text-[#67606a]">Loading...</p>
        ) : topics.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#67606a]">
              No attempts yet. Generate a quiz to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {topics.map((topic) => (
              <TopicRow key={topic.topic} topic={topic} maxScore={Math.max(...topics.map((t) => t.bestScore))} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TopicRow({ topic, maxScore }: { topic: TopicStat; maxScore: number }) {
  const pct = maxScore > 0 ? (topic.bestScore / maxScore) * 100 : 0
  const scoreColor =
    topic.bestScore >= 80 ? 'bg-[#d9ff69]' :
    topic.bestScore >= 60 ? 'bg-[#7bd8ef]' :
    'bg-[#ff6b62]'
  const scoreTextColor =
    topic.bestScore >= 80 ? 'text-[#1e6f38]' :
    topic.bestScore >= 60 ? 'text-[#0d5c75]' :
    'text-[#9c231d]'

  return (
    <div className="rounded-[1rem] border-[3px] border-[#151515] bg-white p-4 shadow-[3px_3px_0_#151515]">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-black">{topic.topic}</p>
            <span className="font-mono text-[10px] font-bold text-[#67606a]">
              {topic.attempts} attempt{topic.attempts !== 1 ? 's' : ''}
            </span>
            {topic.improvement !== null && (
              <span className={cn(
                'rounded-full border-[2px] px-2 py-0.5 font-mono text-[9px] font-black',
                topic.improvement >= 0
                  ? 'border-[#1e6f38] bg-[#d9ff69] text-[#1e6f38]'
                  : 'border-[#9c231d] bg-[#ff6b62] text-[#9c231d]'
              )}>
                {topic.improvement >= 0 ? '+' : ''}{topic.improvement}%
              </span>
            )}
          </div>
          {/* Score bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full border-[2px] border-[#151515] bg-[#f5f4f0]">
              <div
                className={cn('h-full rounded-full transition-all duration-500', scoreColor)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={cn('shrink-0 font-mono text-xs font-black', scoreTextColor)}>
              {topic.bestScore}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border-[3px] border-[#151515] bg-white/60 p-5 shadow-[4px_4px_0_#151515]">
      <div className="flex items-center gap-3">
        <span className="flex items-center text-3xl">{icon}</span>
        <div>
          <p className="text-3xl font-black leading-none tracking-[-0.06em] text-[#151515]">{value}</p>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#67606a]">{label}</p>
        </div>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[0.9rem] border-[3px] border-[#151515] bg-white/80 px-4 py-3 shadow-[3px_3px_0_#151515]">
      <p className="text-xl font-black leading-none">{value}</p>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#67606a]">{label}</p>
    </div>
  )
}
