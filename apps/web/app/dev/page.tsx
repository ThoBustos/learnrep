import { notFound } from 'next/navigation'
import type { Difficulty } from '@learnrep/core'
import { QuizCard } from '@/components/quiz/QuizCard'
import { DifficultyBadge } from '@/components/quiz/DifficultyBadge'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

export default function DevPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main className="min-h-screen bg-background p-10 space-y-12">

      <section className="space-y-4">
        <h2 className="text-heading text-foreground">Color Tokens</h2>
        <div className="flex flex-wrap gap-3">
          {[
            ['background', 'bg-background border border-border'],
            ['surface', 'bg-surface border border-border'],
            ['card', 'bg-card border border-border'],
            ['muted', 'bg-muted'],
            ['primary', 'bg-primary'],
            ['secondary', 'bg-secondary'],
            ['streak', 'bg-streak'],
            ['stats', 'bg-stats'],
            ['destructive', 'bg-destructive'],
          ].map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className={`h-12 w-20 rounded-lg ${cls}`} />
              <span className="text-caption text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading text-foreground">Difficulty Badges</h2>
        <div className="flex flex-wrap gap-3">
          {DIFFICULTIES.map((d) => <DifficultyBadge key={d} difficulty={d} />)}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading text-foreground">Typography Scale</h2>
        <p className="text-display text-foreground">Display 48/700</p>
        <p className="text-heading text-foreground">Heading 24/700</p>
        <p className="text-subhead text-foreground">Subhead 16/700</p>
        <p className="text-body text-foreground">Body 14/400 — The quick brown fox jumps over the lazy dog</p>
        <p className="text-caption text-muted-foreground">Caption 12/400 — The quick brown fox jumps over the lazy dog</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading text-foreground">Quiz Cards - all difficulty variants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIFFICULTIES.map((d) => (
            <QuizCard
              key={d}
              title={`${d.charAt(0).toUpperCase() + d.slice(1)} Quiz`}
              topic="TypeScript"
              difficulty={d}
              attemptCount={12}
              createdBy="thomas"
              onClick={() => {}}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading text-foreground">Quiz Cards - variants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuizCard
            title="No attempts yet"
            topic="React Hooks"
            difficulty="easy"
            attemptCount={0}
          />
          <QuizCard
            title="With share code"
            topic="Async/Await"
            difficulty="medium"
            attemptCount={3}
            shareCode="ab12cd34"
          />
          <QuizCard
            title="Non-interactive"
            topic="Database Design"
            difficulty="expert"
            attemptCount={1}
            createdBy="alice"
          />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-heading text-foreground">Radius</h2>
        <div className="flex flex-wrap gap-3">
          {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-4xl'].map(
            (cls) => (
              <div
                key={cls}
                className={`h-12 w-20 bg-primary ${cls} flex items-center justify-center`}
              >
                <span className="text-caption text-primary-foreground">{cls.replace('rounded-', '')}</span>
              </div>
            ),
          )}
        </div>
      </section>

    </main>
  )
}
