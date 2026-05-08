'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, Users } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { difficultyStyles } from '@/lib/mock-data'
import type { Difficulty } from '@/lib/mock-data'

type TeamMember = {
  userId: string
  role: 'owner' | 'member'
  joinedAt: string
  displayName: string | null
  avatarUrl: string | null
}

type Team = {
  id: string
  name: string
  inviteCode: string
  createdBy: string
  createdAt: string
  myRole: 'owner' | 'member'
  members: TeamMember[]
}

type TeamQuiz = {
  id: string
  title: string
  topic: string
  difficulty: string
  questionCount: number
  is_public: boolean
  createdAt: string
  authorName: string | null
  isOwn: boolean
  attemptCount: number
}

type LeaderboardEntry = {
  userId: string
  displayName: string | null
  avatarUrl: string | null
  quizzesGenerated: number
  quizzesTaken: number
  engagementScore: number
  rank: number
}

export default function TeamPage() {
  const qc = useQueryClient()
  const [createName, setCreateName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeCopied, setCodeCopied] = useState(false)

  const { data: team, isLoading } = useQuery<Team | null>({
    queryKey: ['team'],
    queryFn: ({ signal }) =>
      fetch('/api/team', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed'))
      ),
  })

  const { data: feed = [], isError: feedError } = useQuery<TeamQuiz[]>({
    queryKey: ['team-feed'],
    queryFn: ({ signal }) =>
      fetch('/api/team/feed', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch feed'))
      ),
    enabled: !!team,
  })

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ['team-leaderboard'],
    queryFn: ({ signal }) =>
      fetch('/api/team/leaderboard', { credentials: 'include', signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Failed to fetch leaderboard'))
      ),
    enabled: !!team,
  })

  async function createTeam() {
    if (!createName.trim()) return
    setIsCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: createName.trim() }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Failed to create team')
      } else {
        qc.invalidateQueries({ queryKey: ['team'] })
        qc.invalidateQueries({ queryKey: ['team-feed'] })
      }
    } finally {
      setIsCreating(false)
    }
  }

  async function joinTeam() {
    if (!joinCode.trim()) return
    setIsJoining(true)
    setError(null)
    try {
      const res = await fetch('/api/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ inviteCode: joinCode.trim() }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Failed to join team')
      } else {
        qc.invalidateQueries({ queryKey: ['team'] })
        qc.invalidateQueries({ queryKey: ['team-feed'] })
      }
    } finally {
      setIsJoining(false)
    }
  }

  function copyInviteLink() {
    if (!team) return
    navigator.clipboard.writeText(
      `${window.location.origin}/team/join/${team.inviteCode}`
    ).catch(() => {})
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 p-5 lg:p-8">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#67606a]">Collaborate</p>
        <h1 className="text-4xl font-black tracking-[-0.05em]">Team</h1>
      </div>

      {isLoading ? (
        <p className="font-mono text-xs font-bold text-[#67606a]">Loading...</p>
      ) : team ? (
        <TeamView team={team} feed={feed} feedError={feedError} leaderboard={leaderboard} codeCopied={codeCopied} onCopyLink={copyInviteLink} />
      ) : (
        <NoTeamView
          createName={createName}
          joinCode={joinCode}
          isCreating={isCreating}
          isJoining={isJoining}
          error={error}
          onCreateNameChange={setCreateName}
          onJoinCodeChange={setJoinCode}
          onCreate={createTeam}
          onJoin={joinTeam}
        />
      )}
    </div>
  )
}

function TeamView({
  team,
  feed,
  feedError,
  leaderboard,
  codeCopied,
  onCopyLink,
}: {
  team: Team
  feed: TeamQuiz[]
  feedError: boolean
  leaderboard: LeaderboardEntry[]
  codeCopied: boolean
  onCopyLink: () => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Team header */}
      <div className="rounded-[1.5rem] border-[3px] border-[#151515] bg-white/80 p-6 shadow-[6px_6px_0_#151515]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#67606a]">Your team</p>
            <h2 className="text-2xl font-black tracking-[-0.04em]">{team.name}</h2>
            <p className="mt-1 font-mono text-[10px] font-bold text-[#67606a]">
              {team.members.length} member{team.members.length !== 1 ? 's' : ''}
            </p>
          </div>

          {team.myRole === 'owner' && (
            <button
              type="button"
              onClick={onCopyLink}
              className={cn(
                'flex items-center gap-2 rounded-[1rem] border-[3px] border-[#151515] px-5 py-3 font-black shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5',
                codeCopied ? 'bg-[#d9ff69] text-[#1e6f38]' : 'bg-white text-[#151515]'
              )}
            >
              {codeCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {codeCopied ? 'Link copied!' : 'Copy invite link'}
            </button>
          )}
        </div>

        {/* Members */}
        <div className="mt-4 flex flex-wrap gap-2">
          {team.members.map((m) => {
            const name = m.displayName ?? 'Anonymous'
            return (
              <div
                key={m.userId}
                className="flex items-center gap-2 rounded-full border-[3px] border-[#151515] bg-[#ffd426]/30 px-3 py-1.5"
              >
                <div className="flex size-6 items-center justify-center rounded-full border-[2px] border-[#151515] bg-[#151515] font-mono text-[9px] font-black text-[#ffd426]">
                  {name[0]?.toUpperCase() ?? '?'}
                </div>
                <span className="font-mono text-[10px] font-black">{name}</span>
                {m.role === 'owner' && (
                  <span className="font-mono text-[9px] font-bold text-[#67606a]">owner</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="flex flex-col gap-3 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 p-5 shadow-[6px_6px_0_#151515]">
          <h2 className="text-lg font-black">Leaderboard</h2>
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry) => (
              <TeamLeaderboardRow key={entry.userId} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {/* Team feed */}
      <div className="flex flex-col gap-3 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/70 p-5 shadow-[6px_6px_0_#151515]">
        <h2 className="text-lg font-black">Team Feed</h2>
        {feedError ? (
          <div className="rounded-[1rem] border-[3px] border-[#9c231d] bg-[#ff6b62]/20 px-4 py-3">
            <p className="font-mono text-xs font-bold text-[#9c231d]">Failed to load feed. Try refreshing.</p>
          </div>
        ) : feed.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#67606a]">
              No quizzes yet. Generate one from the CLI.
            </p>
          </div>
        ) : (
          feed.map((quiz) => <TeamFeedRow key={quiz.id} quiz={quiz} />)
        )}
      </div>
    </div>
  )
}

function TeamFeedRow({ quiz }: { quiz: TeamQuiz }) {
  const tone = difficultyStyles[quiz.difficulty as Difficulty] ?? difficultyStyles.medium
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white p-3 shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5">
      <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-[0.7rem] border-[3px]', tone.border, tone.bg)}>
        <span className={cn('font-mono text-[9px] font-black uppercase', tone.text)}>
          {quiz.topic.slice(0, 2)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{quiz.title}</p>
        <p className="font-mono text-[10px] font-bold text-[#67606a]">
          {quiz.isOwn ? 'You' : (quiz.authorName ?? 'Teammate')} · {quiz.questionCount}q · {quiz.attemptCount} attempts
        </p>
      </div>
      <Link
        href={`/quiz/${quiz.id}`}
        className="shrink-0 rounded-[0.7rem] border-[3px] border-[#151515] bg-[#ffd426] px-3 py-1.5 font-mono text-[10px] font-black shadow-[2px_2px_0_#151515] transition-transform hover:-translate-y-0.5"
      >
        Go
      </Link>
    </div>
  )
}

const RANK_STYLES: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: 'bg-[#ffd426]', border: 'border-[#151515]', text: 'text-[#151515]' },
  2: { bg: 'bg-[#e8e8e8]', border: 'border-[#151515]', text: 'text-[#151515]' },
  3: { bg: 'bg-[#d4a96a]', border: 'border-[#151515]', text: 'text-[#151515]' },
}

function TeamLeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const name = entry.displayName ?? 'Anonymous'
  const rank = RANK_STYLES[entry.rank] ?? { bg: 'bg-white', border: 'border-[#e5e3e6]', text: 'text-[#151515]' }
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white p-3 shadow-[3px_3px_0_#151515]">
      <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-full border-[3px] font-mono text-xs font-black', rank.border, rank.bg, rank.text)}>
        {entry.rank}
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-[2px] border-[#151515] bg-[#151515] font-mono text-[9px] font-black text-[#ffd426]">
        {name[0]?.toUpperCase() ?? '?'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{name}</p>
        <p className="font-mono text-[10px] font-bold text-[#67606a]">
          {entry.quizzesGenerated} generated · {entry.quizzesTaken} taken
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-mono text-sm font-black">{entry.engagementScore}</p>
        <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#67606a]">pts</p>
      </div>
    </div>
  )
}

function NoTeamView({
  createName,
  joinCode,
  isCreating,
  isJoining,
  error,
  onCreateNameChange,
  onJoinCodeChange,
  onCreate,
  onJoin,
}: {
  createName: string
  joinCode: string
  isCreating: boolean
  isJoining: boolean
  error: string | null
  onCreateNameChange: (v: string) => void
  onJoinCodeChange: (v: string) => void
  onCreate: () => void
  onJoin: () => void
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {/* Create */}
      <div className="flex flex-col gap-4 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/80 p-6 shadow-[6px_6px_0_#151515]">
        <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#151515]">
          <Users className="size-6 text-[#ffd426]" />
        </div>
        <div>
          <h2 className="text-xl font-black">Create a team</h2>
          <p className="mt-1 font-mono text-[11px] font-bold text-[#67606a]">
            Start a team and invite teammates with a link.
          </p>
        </div>
        <input
          type="text"
          placeholder="Team name"
          value={createName}
          onChange={(e) => onCreateNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onCreate()}
          className="rounded-[0.9rem] border-[3px] border-[#151515] bg-white px-4 py-3 text-sm font-black placeholder:font-mono placeholder:text-[11px] placeholder:font-bold placeholder:text-[#67606a] focus:outline-none focus:shadow-[3px_3px_0_#151515]"
        />
        <button
          type="button"
          onClick={onCreate}
          disabled={isCreating || !createName.trim()}
          className="rounded-[1rem] border-[3px] border-[#151515] bg-[#151515] py-3 font-black text-[#ffd426] shadow-[4px_4px_0_#ff5858] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create Team'}
        </button>
      </div>

      {/* Join */}
      <div className="flex flex-col gap-4 rounded-[1.5rem] border-[3px] border-[#151515] bg-white/80 p-6 shadow-[6px_6px_0_#151515]">
        <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-[#151515] bg-[#7bd8ef]">
          <span className="font-black text-[#0d5c75]">#</span>
        </div>
        <div>
          <h2 className="text-xl font-black">Join a team</h2>
          <p className="mt-1 font-mono text-[11px] font-bold text-[#67606a]">
            Paste an invite code or link from a teammate.
          </p>
        </div>
        <input
          type="text"
          placeholder="Invite code"
          value={joinCode}
          onChange={(e) => onJoinCodeChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onJoin()}
          className="rounded-[0.9rem] border-[3px] border-[#151515] bg-white px-4 py-3 font-mono text-sm font-bold placeholder:text-[11px] placeholder:font-bold placeholder:text-[#67606a] focus:outline-none focus:shadow-[3px_3px_0_#151515]"
        />
        <button
          type="button"
          onClick={onJoin}
          disabled={isJoining || !joinCode.trim()}
          className="rounded-[1rem] border-[3px] border-[#0d5c75] bg-[#7bd8ef] py-3 font-black text-[#0d5c75] shadow-[4px_4px_0_#0d5c75] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isJoining ? 'Joining...' : 'Join Team'}
        </button>
      </div>

      {error && (
        <div className="sm:col-span-2 rounded-[1rem] border-[3px] border-[#9c231d] bg-[#ff6b62]/20 px-4 py-3">
          <p className="font-mono text-sm font-bold text-[#9c231d]">{error}</p>
        </div>
      )}
    </div>
  )
}
