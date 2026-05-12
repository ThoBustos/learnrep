'use client'

import { useState } from 'react'
import { Copy, Check, Users } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertPanel,
  DashboardCanvas,
  FormGrid,
  LoadingState,
  MemberPill,
  MemberPillList,
  PageTitle,
  SetupCard,
  TeamEventRow,
  TeamLeaderboardRow,
  TeamSummaryPanel,
  TextInput,
  WorkbookButton,
  WorkbookEmptyState,
  WorkbookList,
  WorkbookPanel,
  WorkbookPanelHeader,
} from '@/components/ui/LearningSurface'
import type { LeaderboardEntry } from '@/app/api/team/leaderboard/route'
import type { FeedEvent } from '@/app/api/team/feed/route'

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

  const { data: feed = [], isError: feedError } = useQuery<FeedEvent[]>({
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
    <DashboardCanvas>
      <PageTitle title="Team" />

      {isLoading ? (
        <LoadingState />
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
    </DashboardCanvas>
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
  feed: FeedEvent[]
  feedError: boolean
  leaderboard: LeaderboardEntry[]
  codeCopied: boolean
  onCopyLink: () => void
}) {
  return (
    <>
      <TeamSummaryPanel
        name={team.name}
        memberCount={team.members.length}
        action={team.myRole === 'owner' && (
          <WorkbookButton
            onClick={onCopyLink}
            tone={codeCopied ? 'green' : 'paper'}
            icon={codeCopied ? Check : Copy}
          >
            {codeCopied ? 'Link copied!' : 'Copy invite link'}
          </WorkbookButton>
        )}
      >
        <MemberPillList>
          {team.members.map((m) => {
            const name = m.displayName ?? 'Anonymous'
            return (
              <MemberPill key={m.userId} name={name} role={m.role} />
            )
          })}
        </MemberPillList>
      </TeamSummaryPanel>

      {leaderboard.length > 0 && (
        <WorkbookPanel>
          <WorkbookPanelHeader kicker="team" title="Leaderboard" />
          <WorkbookList>
            {leaderboard.map((entry) => (
              <TeamLeaderboardRow
                key={entry.userId}
                rank={entry.rank}
                name={entry.displayName ?? 'Anonymous'}
                generated={entry.quizzesGenerated}
                taken={entry.quizzesTaken}
                score={entry.engagementScore}
              />
            ))}
          </WorkbookList>
        </WorkbookPanel>
      )}

      <WorkbookPanel>
        <WorkbookPanelHeader kicker="team" title="Team Feed" />
        {feedError ? (
          <WorkbookList><AlertPanel>Failed to load feed. Try refreshing.</AlertPanel></WorkbookList>
        ) : feed.length === 0 ? (
          <WorkbookEmptyState title="No quizzes yet." description="Generate one from the CLI." />
        ) : (
          <WorkbookList>
            {feed.map((event) => <TeamFeedRow key={`${event.type}-${event.id}`} event={event} />)}
          </WorkbookList>
        )}
      </WorkbookPanel>
    </>
  )
}

function TeamFeedRow({ event }: { event: FeedEvent }) {
  const actor = event.isOwn ? 'You' : (event.actorName ?? 'Teammate')

  if (event.type === 'generated') {
    return (
      <TeamEventRow
        title={event.title}
        topic={event.topic}
        difficulty={event.difficulty}
        actor={actor}
        description={`generated · ${event.questionCount}q · ${event.attemptCount} attempts`}
        href={`/quiz/${event.quizId}`}
      />
    )
  }

  const pct = Math.round(event.score)

  return (
    <TeamEventRow
      title={event.title}
      topic={event.topic}
      difficulty={event.difficulty}
      actor={actor}
      description="took this"
      href={`/quiz/${event.quizId}`}
      score={pct}
    />
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
    <FormGrid>
      <SetupCard
        icon={Users}
        title="Create a team"
        description="Start a team and invite teammates with a link."
      >
        <TextInput
          placeholder="Team name"
          value={createName}
          onChange={onCreateNameChange}
          onEnter={onCreate}
        />
        <WorkbookButton
          onClick={onCreate}
          disabled={isCreating || !createName.trim()}
          tone="ink"
        >
          {isCreating ? 'Creating...' : 'Create Team'}
        </WorkbookButton>
      </SetupCard>

      <SetupCard
        iconLabel="#"
        title="Join a team"
        description="Paste an invite code or link from a teammate."
      >
        <TextInput
          placeholder="Invite code"
          value={joinCode}
          onChange={onJoinCodeChange}
          onEnter={onJoin}
          mono
        />
        <WorkbookButton
          onClick={onJoin}
          disabled={isJoining || !joinCode.trim()}
          tone="teal"
        >
          {isJoining ? 'Joining...' : 'Join Team'}
        </WorkbookButton>
      </SetupCard>

      {error && <AlertPanel>{error}</AlertPanel>}
    </FormGrid>
  )
}
