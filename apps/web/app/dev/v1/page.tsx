/* DEV ONLY — remove before production */
import type { Difficulty } from '@learnrep/core'
import { QuizCard } from '@/components/quiz/QuizCard'
import { DifficultyBadge } from '@/components/quiz/DifficultyBadge'
import { DifficultyStars } from '@/components/quiz/DifficultyStars'
import { StatBlock } from '@/components/ui/StatBlock'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ScoreDisplay } from '@/components/ui/ScoreDisplay'
import { StreakCounter } from '@/components/ui/StreakCounter'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { LevelRow } from '@/components/ui/LevelRow'
import { LeaderboardRow } from '@/components/ui/LeaderboardRow'
import { ActivityItem } from '@/components/ui/ActivityItem'
import { ChallengeCard } from '@/components/ui/ChallengeCard'
import { TopicTag } from '@/components/ui/TopicTag'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-heading text-foreground border-b-2 border-foreground pb-2 uppercase tracking-tight">
      {title}
    </h2>
  )
}

export default function V1DevPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-6 space-y-16">

        <div className="border-b-4 border-foreground pb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground font-bold mb-3">V1 baseline</p>
          <h1 className="text-display text-foreground uppercase tracking-tighter">LearnRep Design System</h1>
          <p className="text-body text-muted-foreground mt-2">Neo-brutalism meets trading cards — component showcase</p>
        </div>

        {/* 1. Color Tokens */}
        <section className="space-y-4">
          <SectionHeader title="Color Tokens" />
          <div className="flex flex-wrap gap-3">
            {[
              ['background', 'bg-background border-2 border-foreground'],
              ['surface', 'bg-surface border-2 border-foreground'],
              ['card', 'bg-card border-2 border-foreground'],
              ['muted', 'bg-muted border-2 border-foreground'],
              ['primary', 'bg-primary'],
              ['secondary', 'bg-secondary border-2 border-foreground'],
              ['streak', 'bg-streak border-2 border-foreground'],
              ['stats', 'bg-stats'],
              ['destructive', 'bg-destructive'],
              ['difficulty-easy', 'bg-difficulty-easy'],
              ['difficulty-medium', 'bg-difficulty-medium'],
              ['difficulty-hard', 'bg-difficulty-hard'],
              ['difficulty-expert', 'bg-difficulty-expert'],
            ].map(([name, cls]) => (
              <div key={name} className="flex flex-col items-center gap-1.5">
                <div className={`h-12 w-20 rounded-lg shadow-hard-sm ${cls}`} />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-4">
          <SectionHeader title="Typography Scale" />
          <div className="space-y-3 border-2 border-foreground rounded-2xl bg-card p-6 shadow-hard">
            <p className="text-display text-foreground">Display 48/700</p>
            <p className="text-heading text-foreground">Heading 24/700</p>
            <p className="text-subhead text-foreground">Subhead 16/700</p>
            <p className="text-body text-foreground">Body 14/400 — The quick brown fox jumps over the lazy dog</p>
            <p className="text-caption text-muted-foreground">Caption 12/400 — The quick brown fox jumps over the lazy dog</p>
          </div>
        </section>

        {/* 3. Difficulty System */}
        <section className="space-y-4">
          <SectionHeader title="Difficulty System" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DIFFICULTIES.map((d) => (
              <div key={d} className="flex flex-col items-start gap-3 border-2 border-foreground rounded-2xl bg-card p-4 shadow-hard">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{d}</span>
                <DifficultyBadge difficulty={d} />
                <DifficultyStars difficulty={d} />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Stat Blocks */}
        <section className="space-y-4">
          <SectionHeader title="Stat Blocks" />
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Large</p>
              <div className="flex flex-wrap gap-4">
                {(['dark', 'streak', 'stats', 'easy', 'medium', 'hard', 'expert'] as const).map((v) => (
                  <StatBlock key={v} value="42" label={v} variant={v} size="lg" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Medium (default)</p>
              <div className="flex flex-wrap gap-4">
                {(['dark', 'streak', 'stats', 'easy', 'medium', 'hard', 'expert'] as const).map((v) => (
                  <StatBlock key={v} value="99" label={v} variant={v} size="md" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Small</p>
              <div className="flex flex-wrap gap-4">
                {(['dark', 'streak', 'stats', 'easy', 'medium', 'hard', 'expert'] as const).map((v) => (
                  <StatBlock key={v} value="7" label={v} variant={v} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Progress Bars */}
        <section className="space-y-4">
          <SectionHeader title="Progress Bars" />
          <div className="border-2 border-foreground rounded-2xl bg-card p-6 shadow-hard space-y-4">
            <ProgressBar value={95} label="Easy" color="easy" />
            <ProgressBar value={72} label="Medium" color="medium" />
            <ProgressBar value={48} label="Hard" color="hard" />
            <ProgressBar value={30} label="Expert" color="expert" />
            <ProgressBar value={60} label="Streak" color="streak" />
            <ProgressBar value={83} label="Stats" color="stats" />
          </div>
        </section>

        {/* 6. Quiz Cards */}
        <section className="space-y-4">
          <SectionHeader title="Quiz Cards" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIFFICULTIES.map((d, i) => (
              <QuizCard
                key={d}
                title={`${d.charAt(0).toUpperCase() + d.slice(1)} TypeScript Quiz`}
                topic="TypeScript"
                difficulty={d}
                questionCount={10 + i * 5}
                attemptCount={12 - i * 2}
                bestScore={90 - i * 15}
                cardNo={String(i + 1).padStart(3, '0')}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <QuizCard
              title="No Attempts Yet"
              topic="React Hooks"
              difficulty="easy"
              questionCount={8}
              attemptCount={0}
              cardNo="005"
            />
            <QuizCard
              title="First Try — No Best Score"
              topic="Async/Await"
              difficulty="medium"
              questionCount={12}
              attemptCount={1}
              cardNo="006"
            />
            <QuizCard
              title="Database Design Patterns"
              topic="Databases"
              difficulty="expert"
              questionCount={20}
              attemptCount={5}
              bestScore={62}
              cardNo="007"
            />
          </div>
        </section>

        {/* 7. Score Display */}
        <section className="space-y-4">
          <SectionHeader title="Score Display" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreDisplay score={95} label="Excellent" />
            <ScoreDisplay score={72} label="Good" />
            <ScoreDisplay score={48} label="Passing" />
            <ScoreDisplay score={20} label="Try Again" />
          </div>
        </section>

        {/* 8. Streak Counter */}
        <section className="space-y-4">
          <SectionHeader title="Streak Counter" />
          <div className="flex flex-wrap items-end gap-6">
            <StreakCounter count={7} size="sm" />
            <StreakCounter count={21} size="md" />
            <StreakCounter count={365} size="lg" />
          </div>
        </section>

        {/* 9. Countdown Timer */}
        <section className="space-y-4">
          <SectionHeader title="Countdown Timer" />
          <div className="border-2 border-foreground rounded-2xl bg-card p-6 shadow-hard inline-block">
            <CountdownTimer days={2} hours={14} minutes={37} label="Challenge ends in" />
          </div>
        </section>

        {/* 10. Level Rows */}
        <section className="space-y-4">
          <SectionHeader title="Level Rows" />
          <div className="flex flex-col gap-2 max-w-lg">
            <LevelRow number={1} title="Variables & Types" description="Learn TypeScript fundamentals" state="completed" />
            <LevelRow number={2} title="Functions & Generics" description="Master generic patterns" state="active" />
            <LevelRow number={3} title="Advanced Types" description="Conditional and mapped types" state="locked" />
            <LevelRow number={4} title="Decorators" description="Experimental meta-programming" state="locked" />
          </div>
        </section>

        {/* 11. Leaderboard Rows */}
        <section className="space-y-4">
          <SectionHeader title="Leaderboard Rows" />
          <div className="flex flex-col gap-2 max-w-lg">
            <LeaderboardRow rank={1} name="Sarah Chen" handle="@sarahchen" score={2840} />
            <LeaderboardRow rank={2} name="Marcus Rivera" handle="@mrivera" score={2710} />
            <LeaderboardRow rank={3} name="Priya Patel" handle="@priyap" score={2590} />
            <LeaderboardRow rank={4} name="Thomas Bustos" handle="@thomas" score={2340} isCurrentUser />
            <LeaderboardRow rank={5} name="Alex Kim" handle="@alexk" score={2100} />
          </div>
        </section>

        {/* 12. Activity Feed */}
        <section className="space-y-4">
          <SectionHeader title="Activity Feed" />
          <div className="flex flex-col gap-2 max-w-lg">
            <ActivityItem name="Sarah Chen" action="completed" target="TypeScript Generics Quiz" time="2m ago" />
            <ActivityItem name="Marcus Rivera" action="scored 95% on" target="React Hooks Quiz" time="15m ago" />
            <ActivityItem name="Priya Patel" action="started challenge" target="7-Day TypeScript Sprint" time="1h ago" />
            <ActivityItem name="Alex Kim" action="created" target="Database Design Quiz" time="3h ago" />
          </div>
        </section>

        {/* 13. Challenge Card */}
        <section className="space-y-4">
          <SectionHeader title="Challenge Card" />
          <div className="max-w-sm">
            <ChallengeCard
              title="7-Day TypeScript Sprint"
              difficulty="hard"
              creatorName="Thomas Bustos"
              participants={24}
              maxParticipants={50}
              daysLeft={2}
              hoursLeft={14}
              minsLeft={37}
            />
          </div>
        </section>

        {/* 14. Topic Tags */}
        <section className="space-y-4">
          <SectionHeader title="Topic Tags" />
          <div className="flex flex-wrap gap-2">
            <TopicTag label="TypeScript" color="bg-difficulty-medium/15" />
            <TopicTag label="React" color="bg-difficulty-easy/15" />
            <TopicTag label="Databases" color="bg-difficulty-hard/15" />
            <TopicTag label="Node.js" color="bg-difficulty-expert/15" />
            <TopicTag label="CSS" color="bg-streak/15" />
            <TopicTag label="Testing" color="bg-stats/15" />
            <TopicTag label="Algorithms" />
            <TopicTag label="Design Patterns" color="bg-muted" />
          </div>
        </section>

      </div>
    </main>
  )
}
