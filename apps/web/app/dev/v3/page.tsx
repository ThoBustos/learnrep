import { notFound } from 'next/navigation'
import type { Difficulty } from '@learnrep/core'
import { cn } from '@/lib/utils'

type Rarity = 'common' | 'rare' | 'epic' | 'legend'

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

const difficulty: Record<Difficulty, { label: string; card: string; ink: string; fill: string; power: number }> = {
  easy: { label: 'Easy', card: 'bg-[#8de37f]', ink: 'text-[#0d4f29]', fill: '#8de37f', power: 1 },
  medium: { label: 'Medium', card: 'bg-[#6ec7ff]', ink: 'text-[#164f8f]', fill: '#6ec7ff', power: 2 },
  hard: { label: 'Hard', card: 'bg-[#ff6b58]', ink: 'text-[#8d2118]', fill: '#ff6b58', power: 3 },
  expert: { label: 'Expert', card: 'bg-[#c15bff]', ink: 'text-[#641c91]', fill: '#c15bff', power: 4 },
}

const rarity: Record<Rarity, { label: string; bg: string; text: string }> = {
  common: { label: 'Common', bg: 'bg-[#f8efe0]', text: 'text-[#191919]' },
  rare: { label: 'Rare', bg: 'bg-[#6ec7ff]', text: 'text-[#191919]' },
  epic: { label: 'Epic', bg: 'bg-[#c15bff]', text: 'text-white' },
  legend: { label: 'Legend', bg: 'bg-[#ffcf3f]', text: 'text-[#191919]' },
}

const cards = [
  { title: 'Closures', topic: 'JavaScript', difficulty: 'easy' as Difficulty, rarity: 'common' as Rarity, no: '001', best: 95 },
  { title: 'Generics', topic: 'TypeScript', difficulty: 'medium' as Difficulty, rarity: 'rare' as Rarity, no: '002', best: 72 },
  { title: 'Query Plans', topic: 'Database', difficulty: 'hard' as Difficulty, rarity: 'epic' as Rarity, no: '003', best: 48 },
  { title: 'Distributed Locks', topic: 'Systems', difficulty: 'expert' as Difficulty, rarity: 'legend' as Rarity, no: '004', best: 30 },
]

const leaderboard = [
  { rank: 1, name: 'Sarah Chen', handle: '@sarah', score: 2840 },
  { rank: 2, name: 'Marcus Rivera', handle: '@marcus', score: 2710 },
  { rank: 3, name: 'Priya Patel', handle: '@priya', score: 2590 },
]

export default function V3DevPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main className="min-h-screen bg-[#111111] text-[#f8efe0]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#f8efe0_1px,transparent_1px),linear-gradient(90deg,#f8efe0_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-5 py-10 sm:px-8 lg:px-12">
        <Hero />
        <Foundations />
        <ComponentLab />
        <ScreenLab />
        <DashboardLab />
        <AssetBrief />
      </div>
    </main>
  )
}

function Hero() {
  return (
    <section className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <div className="mb-6 flex flex-wrap gap-3">
          <Badge tone="yellow">V3 direction</Badge>
          <Badge tone="blue">Collectible quiz deck</Badge>
          <Badge tone="pink">Card-game energy</Badge>
        </div>
        <h1 className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.05em] sm:text-7xl" style={{ fontFamily: 'var(--font-bowlby)' }}>
          LearnRep as a deck you want to collect.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#cbbda8]">
          This version leans harder into trading cards: illustrated panels, rarity frames, power stats, high-contrast
          decks, and progress screens that feel like unlocking a collection.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card, index) => (
          <div key={card.no} className={cx(index % 2 === 0 ? 'sm:translate-y-8' : 'sm:-translate-y-4')}>
            <QuizCard {...card} compact />
          </div>
        ))}
      </div>
    </section>
  )
}

function Foundations() {
  return (
    <section className="space-y-5">
      <SectionTitle kicker="Foundations" title="A card game needs stronger rules." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.8fr]">
        <Panel>
          <h3 className="mb-4 text-2xl font-black tracking-[-0.04em]">Palette</h3>
          <div className="grid grid-cols-2 gap-3">
            <Token name="ink" color="bg-[#111111]" dark />
            <Token name="paper" color="bg-[#f8efe0]" />
            <Token name="gold" color="bg-[#ffcf3f]" />
            <Token name="coral" color="bg-[#ff6b58]" />
            <Token name="sky" color="bg-[#6ec7ff]" />
            <Token name="violet" color="bg-[#c15bff]" />
          </div>
        </Panel>
        <Panel className="bg-[#ffcf3f] text-[#111111]">
          <h3 className="mb-4 text-2xl font-black tracking-[-0.04em]">Type</h3>
          <p className="text-4xl leading-none" style={{ fontFamily: 'var(--font-bowlby)' }}>Bowlby Display</p>
          <p className="mt-4 text-lg font-black tracking-[-0.04em]">Space Grotesk for product copy</p>
          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.2em]">Space Mono metadata</p>
        </Panel>
        <Panel>
          <h3 className="mb-4 text-2xl font-black tracking-[-0.04em]">Stroke recipe</h3>
          <Spec label="Outer card" value="4px" />
          <Spec label="Inner grid" value="3px" />
          <Spec label="Shadow" value="7px hard" />
          <Spec label="Radius" value="18-26px" />
        </Panel>
      </div>
    </section>
  )
}

function ComponentLab() {
  return (
    <section className="space-y-5">
      <SectionTitle kicker="Components" title="Same inventory, deck-native treatment." />
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel>
          <h3 className="mb-5 text-2xl font-black tracking-[-0.04em]">Quiz card variants</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => <QuizCard key={card.no} {...card} />)}
          </div>
        </Panel>
        <Panel className="bg-[#f8efe0] text-[#111111]">
          <h3 className="mb-5 text-2xl font-black tracking-[-0.04em]">Difficulty and rarity</h3>
          <div className="grid grid-cols-2 gap-3">
            {difficulties.map((level) => (
              <div key={level} className="rounded-[1rem] border-[3px] border-[#111111] bg-white p-3">
                <DifficultyTag difficulty={level} />
                <div className="mt-3"><StarMeter difficulty={level} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {(Object.keys(rarity) as Rarity[]).map((item) => <RarityTag key={item} rarity={item} />)}
          </div>
        </Panel>
        <Panel className="bg-[#6ec7ff] text-[#111111]">
          <h3 className="mb-5 text-2xl font-black tracking-[-0.04em]">Stat blocks</h3>
          <div className="flex flex-wrap gap-3">
            <StatBlock value="42" label="Dark" tone="dark" />
            <StatBlock value="12" label="Streak" tone="gold" />
            <StatBlock value="83" label="Stats" tone="blue" />
            <StreakCounter days={21} />
          </div>
        </Panel>
        <Panel>
          <h3 className="mb-5 text-2xl font-black tracking-[-0.04em]">Rows and progress</h3>
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-3">
              <ProgressBar label="Deck completion" value={72} tone="gold" />
              <ProgressBar label="Hard mastery" value={48} tone="coral" />
              <ProgressBar label="Expert mastery" value={30} tone="violet" />
            </div>
            <div className="space-y-3">
              <LevelRow number={1} title="Closures" state="complete" />
              <LevelRow number={2} title="Generics" state="active" />
              <LevelRow number={3} title="Indexes" state="locked" />
            </div>
          </div>
        </Panel>
      </div>
    </section>
  )
}

function ScreenLab() {
  return (
    <section className="space-y-5">
      <SectionTitle kicker="Compositions" title="Product screens using the cards." />
      <div className="grid gap-6 lg:grid-cols-3">
        <ScreenFrame title="Deck">
          <DeckScreen />
        </ScreenFrame>
        <ScreenFrame title="Challenge">
          <ChallengeScreen />
        </ScreenFrame>
        <ScreenFrame title="Result">
          <ResultScreen />
        </ScreenFrame>
      </div>
    </section>
  )
}

const feedQuizzes = [
  { title: 'React Server Components', topic: 'React', difficulty: 'medium' as Difficulty, rarity: 'rare' as Rarity, no: '005', best: 75 },
  { title: 'TypeScript Generics', topic: 'TypeScript', difficulty: 'hard' as Difficulty, rarity: 'epic' as Rarity, no: '006', best: 60 },
  { title: 'Closures & Scope', topic: 'JavaScript', difficulty: 'easy' as Difficulty, rarity: 'common' as Rarity, no: '007', best: 90 },
]

const teamBoard = [
  { rank: 1, name: 'Thomas B.', handle: '@thomas', score: 3240 },
  { rank: 2, name: 'Angel C.', handle: '@angel', score: 2870 },
  { rank: 3, name: 'John M.', handle: '@john', score: 2510 },
]

function DashboardLab() {
  return (
    <section className="space-y-5">
      <SectionTitle kicker="Dashboard" title="First view after login." />
      <div className="grid gap-6 lg:grid-cols-3">
        <ScreenFrame title="Feed">
          <DashFeedScreen />
        </ScreenFrame>
        <ScreenFrame title="My Deck">
          <DashDeckScreen />
        </ScreenFrame>
        <ScreenFrame title="Leaderboard">
          <DashLeaderboardScreen />
        </ScreenFrame>
      </div>
    </section>
  )
}

function DashFeedScreen() {
  return (
    <div className="space-y-4">
      <TopBar title="LearnRep" />
      <div className="rounded-[1.3rem] border-[4px] border-[#111111] bg-[#ffcf3f] p-4 text-[#111111] shadow-[5px_5px_0_#111111]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">Team · Supernal</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="text-3xl font-black leading-none tracking-[-0.08em]">3 new today</p>
          <StreakCounter days={12} />
        </div>
      </div>
      <SearchBox />
      <div className="space-y-2">
        {feedQuizzes.map((q) => (
          <div key={q.title} className="flex items-center gap-3 overflow-hidden rounded-[1.1rem] border-[3px] border-[#111111] bg-[#191919] p-2 shadow-[4px_4px_0_#111111]">
            <div className={cx('flex size-10 shrink-0 items-center justify-center rounded-[0.7rem] border-[3px] border-[#111111] font-mono text-[9px] font-black', difficulty[q.difficulty].card, difficulty[q.difficulty].ink)}>
              {q.no}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[#f8efe0]">{q.title}</p>
              <TopicTag label={q.topic} />
            </div>
            <DifficultyTag difficulty={q.difficulty} />
          </div>
        ))}
      </div>
      <NavBar active="Feed" />
    </div>
  )
}

function DashDeckScreen() {
  return (
    <div className="space-y-4">
      <TopBar title="My Deck" />
      <div className="grid grid-cols-3 gap-2">
        <StatBlock value="24" label="Cards" tone="gold" small />
        <StatBlock value="12" label="Streak" tone="dark" small />
        <StatBlock value="74" label="Avg" tone="blue" small />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {feedQuizzes.slice(0, 2).map((q) => (
          <QuizCard key={q.title} {...q} compact />
        ))}
      </div>
      <div className="space-y-2">
        <LevelRow number={1} title="Closures" state="complete" />
        <LevelRow number={2} title="Generics" state="active" />
        <LevelRow number={3} title="RSC" state="locked" />
      </div>
      <NavBar active="Deck" />
    </div>
  )
}

function DashLeaderboardScreen() {
  return (
    <div className="space-y-4">
      <TopBar title="Leaderboard" />
      <Panel className="bg-[#ffcf3f] text-[#111111]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">Team · Supernal</p>
        <p className="text-2xl font-black leading-tight tracking-[-0.05em]">Weekly ranking</p>
        <p className="font-mono text-[10px] font-bold text-[#655b4d]">Resets Sunday · 3 days left</p>
      </Panel>
      <div className="space-y-2">
        {teamBoard.map((person) => (
          <LeaderboardRow key={person.handle} {...person} />
        ))}
      </div>
      <Panel className="bg-[#8de37f] p-4 text-center text-[#111111]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">You're ranked</p>
        <p className="text-5xl font-black leading-none tracking-[-0.08em]">#1</p>
        <p className="font-mono text-[10px] font-bold">Keep it up this week</p>
      </Panel>
      <NavBar active="Scores" />
    </div>
  )
}

function AssetBrief() {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel className="bg-[#c15bff]">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#111111]">SVG brief</p>
        <h2 className="mt-3 text-5xl leading-none tracking-[-0.05em]" style={{ fontFamily: 'var(--font-bowlby)' }}>
          What this direction needs from custom assets.
        </h2>
      </Panel>
      <Panel>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Subject illustrations for card art panels',
            'Four rarity frame ornaments',
            'Custom stat glyphs for questions, attempts, best, streak',
            'Badge system for easy, medium, hard, expert',
            'Deck empty state and reward pack illustration',
            'Animated SVG sticker set for unlock moments',
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-[1rem] border-[3px] border-[#f8efe0] bg-[#191919] p-3">
              <Icon name="spark" className="mt-0.5 size-5 shrink-0 text-[#ffcf3f]" />
              <p className="text-sm font-bold leading-5 text-[#f8efe0]">{item}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  )
}

function DeckScreen() {
  return (
    <div className="space-y-4">
      <TopBar title="My Deck" />
      <div className="rounded-[1.3rem] border-[4px] border-[#111111] bg-[#ffcf3f] p-4 text-[#111111] shadow-[5px_5px_0_#111111]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Collection</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-5xl font-black leading-none tracking-[-0.08em]">24/64</p>
          <RarityTag rarity="rare" />
        </div>
      </div>
      <SearchBox />
      <div className="grid grid-cols-2 gap-3">
        {cards.slice(0, 4).map((card) => <QuizCard key={card.no} {...card} compact />)}
      </div>
      <NavBar active="Deck" />
    </div>
  )
}

function ChallengeScreen() {
  return (
    <div className="space-y-4">
      <TopBar title="Sprint" />
      <ChallengeCard />
      <Countdown days={2} hours={10} minutes={6} />
      <div className="space-y-2">
        <ActivityItem name="Sarah Chen" action="cleared Generics" time="2m" />
        <ActivityItem name="Marcus Rivera" action="opened Expert Pack" time="14m" />
      </div>
      <NavBar active="Battle" />
    </div>
  )
}

function ResultScreen() {
  return (
    <div className="space-y-4">
      <TopBar title="Result" />
      <ScoreDisplay score={95} label="Excellent" />
      <div className="grid grid-cols-3 gap-2">
        <StatBlock value="20" label="Qs" tone="paper" small />
        <StatBlock value="18" label="Hit" tone="blue" small />
        <StatBlock value="2" label="Miss" tone="coral" small />
      </div>
      <Panel className="bg-[#f8efe0] p-4 text-[#111111] shadow-[4px_4px_0_#ffcf3f]">
        <h3 className="text-lg font-black tracking-[-0.04em]">Leaderboard</h3>
        <div className="mt-3 space-y-2">
          {leaderboard.map((person) => <LeaderboardRow key={person.handle} {...person} />)}
        </div>
      </Panel>
      <NavBar active="Scores" />
    </div>
  )
}

function QuizCard({ title, topic, difficulty: level, rarity: cardRarity, no, best, compact = false }: {
  title: string
  topic: string
  difficulty: Difficulty
  rarity: Rarity
  no: string
  best: number
  compact?: boolean
}) {
  const levelTone = difficulty[level]
  const rareTone = rarity[cardRarity]
  return (
    <article className={cx('overflow-hidden rounded-[1.25rem] border-[4px] border-[#111111] text-[#111111] shadow-[6px_6px_0_#000]', levelTone.card)}>
      <div className="flex items-center justify-between border-b-[4px] border-[#111111] bg-[#f8efe0] px-3 py-2">
        <h3 className={cx('truncate uppercase leading-none', compact ? 'text-sm' : 'text-lg')} style={{ fontFamily: 'var(--font-bowlby)' }}>
          {title}
        </h3>
        <StarMeter difficulty={level} compact />
      </div>
      <div className={cx('relative border-b-[4px] border-[#111111] bg-white', compact ? 'h-24' : 'h-36')}>
        <CardArt difficulty={level} />
        <div className={cx('absolute right-2 top-2 rounded-full border-[3px] border-[#111111] px-2 py-1 font-mono text-[9px] font-bold uppercase', rareTone.bg, rareTone.text)}>
          {rareTone.label}
        </div>
      </div>
      <div className="bg-[#f8efe0] p-3">
        <div className="flex items-center justify-between gap-2">
          <TopicTag label={topic} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]">No.{no}</span>
        </div>
        {!compact && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <CardStat icon="book" value="20" />
            <CardStat icon="bolt" value="8" />
            <CardStat icon="spark" value={`${best}`} />
          </div>
        )}
      </div>
    </article>
  )
}

function ChallengeCard() {
  return (
    <div className="overflow-hidden rounded-[1.4rem] border-[4px] border-[#111111] bg-[#f8efe0] text-[#111111] shadow-[6px_6px_0_#111111]">
      <div className="border-b-[4px] border-[#111111] bg-[#ff6b58] px-4 py-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Active challenge</p>
        <h3 className="text-2xl font-black tracking-[-0.06em]">TypeScript Sprint</h3>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <DifficultyTag difficulty="hard" />
          <StarMeter difficulty="hard" />
        </div>
        <ProgressBar label="Submissions" value={48} tone="coral" />
        <button className="mt-5 w-full rounded-[1rem] border-[4px] border-[#111111] bg-[#ffcf3f] px-5 py-3 font-black uppercase tracking-[0.16em] shadow-[4px_4px_0_#111111]">
          Submit proof
        </button>
      </div>
    </div>
  )
}

function LevelRow({ number, title, state }: { number: number; title: string; state: 'complete' | 'active' | 'locked' }) {
  return (
    <div className={cx('flex items-center gap-3 rounded-[1rem] border-[3px] border-[#f8efe0] bg-[#191919] p-3 text-[#f8efe0]', state === 'locked' && 'opacity-45')}>
      <div className={cx('flex size-10 items-center justify-center rounded-full border-[3px] border-[#f8efe0] font-black', state === 'complete' && 'bg-[#8de37f] text-[#111111]', state === 'active' && 'bg-[#ffcf3f] text-[#111111]')}>
        {state === 'complete' ? <Icon name="check" className="size-5" /> : state === 'locked' ? <Icon name="lock" className="size-5" /> : number}
      </div>
      <p className="flex-1 truncate text-sm font-black">{title}</p>
      {state === 'active' && <Icon name="play" className="size-5 text-[#ffcf3f]" />}
    </div>
  )
}

function ActivityItem({ name, action, time }: { name: string; action: string; time: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#111111] bg-[#f8efe0] p-3 text-[#111111] shadow-[4px_4px_0_#111111]">
      <Avatar name={name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{name}</p>
        <p className="truncate text-xs font-bold text-[#655b4d]">{action}</p>
      </div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">{time}</p>
    </div>
  )
}

function LeaderboardRow({ rank, name, handle, score }: { rank: number; name: string; handle: string; score: number }) {
  return (
    <div className="flex items-center gap-3 rounded-[0.9rem] border-[3px] border-[#111111] bg-white p-2">
      <div className={cx('flex size-9 items-center justify-center rounded-full border-[3px] border-[#111111] font-black', rank === 1 ? 'bg-[#ffcf3f]' : 'bg-[#f8efe0]')}>
        {rank}
      </div>
      <Avatar name={name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{name}</p>
        <p className="truncate text-[10px] font-bold text-[#655b4d]">{handle}</p>
      </div>
      <p className="font-black">{score}</p>
    </div>
  )
}

function ScoreDisplay({ score, label }: { score: number; label: string }) {
  return (
    <div className="rounded-[1.5rem] border-[4px] border-[#111111] bg-[#f8efe0] p-6 text-center text-[#111111] shadow-[6px_6px_0_#ffcf3f]">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]">{label}</p>
      <p className="text-8xl leading-none tracking-[-0.09em] text-[#8de37f]" style={{ fontFamily: 'var(--font-bowlby)' }}>{score}</p>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]">points</p>
    </div>
  )
}

function StreakCounter({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-3 rounded-[1.1rem] border-[4px] border-[#111111] bg-[#ffcf3f] px-4 py-3 text-[#111111] shadow-[5px_5px_0_#111111]">
      <Icon name="flame" className="size-8" />
      <div>
        <p className="text-4xl font-black leading-none tracking-[-0.08em]">{days}</p>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em]">day streak</p>
      </div>
    </div>
  )
}

function Countdown({ days, hours, minutes }: { days: number; hours: number; minutes: number }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[1.2rem] border-[4px] border-[#111111] bg-[#f8efe0] p-3 text-[#111111] shadow-[5px_5px_0_#111111]">
      <Time value={days} label="Days" />
      <Time value={hours} label="Hours" />
      <Time value={minutes} label="Mins" />
    </div>
  )
}

function Time({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[0.9rem] border-[3px] border-[#111111] bg-white p-2 text-center">
      <p className="text-3xl font-black leading-none tabular-nums tracking-[-0.08em]">{String(value).padStart(2, '0')}</p>
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#655b4d]">{label}</p>
    </div>
  )
}

function ProgressBar({ label, value, tone }: { label: string; value: number; tone: 'gold' | 'coral' | 'violet' }) {
  const fills = {
    gold: 'bg-[#ffcf3f]',
    coral: 'bg-[#ff6b58]',
    violet: 'bg-[#c15bff]',
  }
  return (
    <div className="mt-4">
      <div className="mb-2 flex justify-between font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-5 overflow-hidden rounded-full border-[3px] border-current bg-transparent">
        <div className={cx('h-full border-r-[3px] border-current', fills[tone])} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function StatBlock({ value, label, tone, small = false }: {
  value: string
  label: string
  tone: 'dark' | 'gold' | 'blue' | 'paper' | 'coral'
  small?: boolean
}) {
  const tones = {
    dark: 'bg-[#111111] text-[#f8efe0]',
    gold: 'bg-[#ffcf3f] text-[#111111]',
    blue: 'bg-[#6ec7ff] text-[#111111]',
    paper: 'bg-[#f8efe0] text-[#111111]',
    coral: 'bg-[#ff6b58] text-[#111111]',
  }
  return (
    <div className={cx('rounded-[1rem] border-[4px] border-[#111111] text-center shadow-[4px_4px_0_#111111]', tones[tone], small ? 'px-2 py-3' : 'px-5 py-4')}>
      <p className={cx('font-black leading-none tracking-[-0.08em]', small ? 'text-3xl' : 'text-5xl')}>{value}</p>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em]">{label}</p>
    </div>
  )
}

function CardArt({ difficulty: level }: { difficulty: Difficulty }) {
  const tone = difficulty[level]
  return (
    <svg viewBox="0 0 160 120" className="size-full" aria-hidden="true">
      <rect width="160" height="120" fill={tone.fill} />
      <path d="M18 89 58 30l32 42 17-21 35 38Z" fill="#f8efe0" stroke="#111111" strokeWidth="5" />
      <circle cx="124" cy="28" r="16" fill="#ffcf3f" stroke="#111111" strokeWidth="5" />
      <path d="M21 22h41M21 36h27M101 84h37" stroke="#111111" strokeLinecap="round" strokeWidth="5" />
      <circle cx="35" cy="84" r="8" fill="#111111" />
      <circle cx="132" cy="90" r="8" fill="#111111" />
    </svg>
  )
}

function CardStat({ icon, value }: { icon: IconName; value: string }) {
  return (
    <div className="flex items-center justify-center gap-1 rounded-[0.7rem] border-[3px] border-[#111111] bg-white px-2 py-1 font-black">
      <Icon name={icon} className="size-4" />
      <span>{value}</span>
    </div>
  )
}

function DifficultyTag({ difficulty: level }: { difficulty: Difficulty }) {
  const tone = difficulty[level]
  return (
    <span className={cx('inline-flex rounded-full border-[3px] border-[#111111] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]', tone.card, tone.ink)}>
      {tone.label}
    </span>
  )
}

function RarityTag({ rarity: cardRarity }: { rarity: Rarity }) {
  const tone = rarity[cardRarity]
  return (
    <span className={cx('inline-flex rounded-full border-[3px] border-[#111111] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]', tone.bg, tone.text)}>
      {tone.label}
    </span>
  )
}

function StarMeter({ difficulty: level, compact = false }: { difficulty: Difficulty; compact?: boolean }) {
  const power = difficulty[level].power
  return (
    <div className={cx('flex', compact ? 'gap-0.5' : 'gap-1')}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Icon key={index} name="star" className={cx(compact ? 'size-3.5' : 'size-5', index < power ? 'fill-[#111111] text-[#111111]' : 'text-[#b7a993]')} />
      ))}
    </div>
  )
}

function TopicTag({ label }: { label: string }) {
  return (
    <span className="rounded-full border-[3px] border-[#111111] bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
      {label}
    </span>
  )
}

function TopBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between text-[#111111]">
      <Icon name="back" className="size-5" />
      <p className="font-black">{title}</p>
      <Icon name="menu" className="size-5" />
    </div>
  )
}

function SearchBox() {
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[4px] border-[#111111] bg-[#f8efe0] px-4 py-3 text-[#111111] shadow-[4px_4px_0_#111111]">
      <Icon name="search" className="size-5" />
      <p className="text-sm font-bold text-[#655b4d]">Search cards or topics</p>
    </div>
  )
}

function NavBar({ active }: { active: string }) {
  const items = ['Deck', 'Battle', 'Scores']
  return (
    <div className="grid grid-cols-3 rounded-full border-[4px] border-[#111111] bg-[#f8efe0] p-2 text-[#111111]">
      {items.map((item) => (
        <div key={item} className={cx('rounded-full px-3 py-2 text-center text-xs font-black', active === item && 'bg-[#ffcf3f]')}>
          {item}
        </div>
      ))}
    </div>
  )
}

function ScreenFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[2rem] border-[5px] border-[#111111] bg-[#f8efe0] p-4 text-[#111111] shadow-[10px_10px_0_#ffcf3f]">
      <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#655b4d]">{title}</p>
      {children}
    </div>
  )
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx('rounded-[1.75rem] border-[4px] border-[#f8efe0] bg-[#191919] p-5 shadow-[7px_7px_0_#ffcf3f]', className)}>
      {children}
    </div>
  )
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex flex-col gap-3 border-b-[4px] border-[#f8efe0] pb-4 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="max-w-4xl text-4xl leading-none tracking-[-0.05em] sm:text-5xl" style={{ fontFamily: 'var(--font-bowlby)' }}>{title}</h2>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#ffcf3f]">{kicker}</p>
    </div>
  )
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'yellow' | 'blue' | 'pink' }) {
  const tones = {
    yellow: 'bg-[#ffcf3f] text-[#111111]',
    blue: 'bg-[#6ec7ff] text-[#111111]',
    pink: 'bg-[#c15bff] text-white',
  }
  return (
    <span className={cx('rounded-full border-[4px] border-[#f8efe0] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] shadow-[4px_4px_0_#ffcf3f]', tones[tone])}>
      {children}
    </span>
  )
}

function Token({ name, color, dark = false }: { name: string; color: string; dark?: boolean }) {
  return (
    <div className={cx('rounded-[1rem] border-[3px] border-[#111111] p-3 shadow-[4px_4px_0_#111111]', color, dark ? 'text-[#f8efe0]' : 'text-[#111111]')}>
      <div className="h-16" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">{name}</p>
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b-[3px] border-[#f8efe0] py-3 last:border-b-0">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#cbbda8]">{label}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[3px] border-[#111111] bg-[#111111] font-mono text-xs font-bold text-[#f8efe0]">
      {initials}
    </div>
  )
}

type IconName = 'book' | 'bolt' | 'spark' | 'star' | 'check' | 'lock' | 'play' | 'flame' | 'back' | 'menu' | 'search'

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.7">
      {name === 'book' && <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4V4Zm0 12V4" />}
      {name === 'bolt' && <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />}
      {name === 'spark' && <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />}
      {name === 'star' && <path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9l5.9-.8L12 3Z" />}
      {name === 'check' && <path d="m5 12 4 4L19 6" />}
      {name === 'lock' && <path d="M7 11h10v8H7zM9 11V8a3 3 0 0 1 6 0v3" />}
      {name === 'play' && <path d="M8 5v14l11-7Z" fill="currentColor" />}
      {name === 'flame' && <path d="M12 22c4.4 0 8-3.3 8-7.8 0-3.7-2.2-6.1-5-8.7.1 2.6-.9 4.2-2.2 5.1.2-3.2-1.3-5.9-4.4-8.6.4 4.6-4.4 6.6-4.4 12.1C4 18.7 7.6 22 12 22Z" />}
      {name === 'back' && <path d="m15 5-7 7 7 7" />}
      {name === 'menu' && <path d="M5 7h14M5 12h14M5 17h14" />}
      {name === 'search' && <path d="m20 20-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />}
    </svg>
  )
}
