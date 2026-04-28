import { notFound } from 'next/navigation'
import type { Difficulty } from '@learnrep/core'
import { cn } from '@/lib/utils'

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

const difficultyTone: Record<Difficulty, { label: string; bg: string; text: string; border: string; fill: string; score: number }> = {
  easy: {
    label: 'Easy',
    bg: 'bg-[#d9ff69]',
    text: 'text-[#1e6f38]',
    border: 'border-[#1e6f38]',
    fill: '#d9ff69',
    score: 1,
  },
  medium: {
    label: 'Medium',
    bg: 'bg-[#7bd8ef]',
    text: 'text-[#0d5c75]',
    border: 'border-[#0d5c75]',
    fill: '#7bd8ef',
    score: 2,
  },
  hard: {
    label: 'Hard',
    bg: 'bg-[#ff6b62]',
    text: 'text-[#9c231d]',
    border: 'border-[#9c231d]',
    fill: '#ff6b62',
    score: 3,
  },
  expert: {
    label: 'Expert',
    bg: 'bg-[#b995ff]',
    text: 'text-[#5735a7]',
    border: 'border-[#5735a7]',
    fill: '#b995ff',
    score: 4,
  },
}

const people = [
  { name: 'Sepideh Yazdi', handle: '@Sepidy', initials: 'SY', score: 2840 },
  { name: 'Sam Smith', handle: '@Sam', initials: 'SS', score: 2690 },
  { name: 'Maya Park', handle: '@Maya', initials: 'MP', score: 2510 },
]

export default function V2DevPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#ffd426] text-[#151515]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="absolute inset-0 -z-0 opacity-35 [background-image:radial-gradient(#151515_1.2px,transparent_1.2px)] [background-size:18px_18px]" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-5 py-10 sm:px-8 lg:px-12">
        <Hero />
        <TokenLab />
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
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
      <div className="rounded-[2rem] border-[3px] border-[#151515] bg-[#fff7ec] p-6 shadow-[8px_8px_0_#151515] sm:p-8">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Pill>V2 direction</Pill>
          <Pill tone="red">Challenge doodle app</Pill>
          <Pill tone="blue">No emoji UI</Pill>
        </div>
        <h1 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
          LearnRep as a challenge playground.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#514539]">
          This route tests the Image #12 direction: warm paper surfaces, black ink, simple doodle assets, chunky
          controls, and mobile-first screens for challenges, friends, levels, and quiz progress.
        </p>
      </div>
      <div className="relative min-h-64 rounded-[2rem] border-[3px] border-[#151515] bg-[#ff5858] p-5 shadow-[8px_8px_0_#151515]">
        <div className="absolute -left-4 top-8 size-20 rotate-[-12deg] rounded-[1.5rem] border-[3px] border-[#151515] bg-[#7bd8ef] shadow-[4px_4px_0_#151515]" />
        <div className="absolute bottom-8 right-8 size-24 rotate-[18deg] rounded-full border-[3px] border-[#151515] bg-[#d9ff69] shadow-[4px_4px_0_#151515]" />
        <div className="relative rounded-[1.75rem] border-[3px] border-[#151515] bg-[#fff7ec] p-5">
          <div className="mb-5 flex items-center justify-between">
            <DoodleAvatar initials="LR" />
            <IconButton icon="plus" label="Add challenge" tone="yellow" />
          </div>
          <h2 className="text-3xl font-black tracking-[-0.05em]">Day 1/7 - UI Challenge</h2>
          <p className="mt-1 text-sm font-semibold text-[#60554d]">Study in public. Submit your proof.</p>
          <div className="mt-5">
            <Countdown days={2} hours={10} minutes={6} />
          </div>
        </div>
      </div>
    </section>
  )
}

function TokenLab() {
  return (
    <section className="space-y-5">
      <SectionTitle kicker="Foundations" title="Tokens are more expressive here." />
      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="md:col-span-2">
          <h3 className="mb-4 text-xl font-black tracking-[-0.03em]">Color roles</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Token name="paper" color="bg-[#fff7ec]" />
            <Token name="sun" color="bg-[#ffd426]" />
            <Token name="coral" color="bg-[#ff5858]" />
            <Token name="sky" color="bg-[#7bd8ef]" />
            <Token name="lime" color="bg-[#d9ff69]" />
            <Token name="violet" color="bg-[#b995ff]" />
            <Token name="ink" color="bg-[#151515]" dark />
            <Token name="sand" color="bg-[#ffd99e]" />
          </div>
        </Panel>
        <Panel className="bg-[#d9ff69]">
          <h3 className="mb-4 text-xl font-black tracking-[-0.03em]">Typography</h3>
          <p className="text-4xl font-black leading-none tracking-[-0.06em]">Space Grotesk</p>
          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.18em]">Mono labels</p>
          <p className="mt-3 text-sm font-semibold leading-6">Friendly product text with enough weight to survive the heavy outline style.</p>
        </Panel>
      </div>
    </section>
  )
}

function ComponentLab() {
  return (
    <section className="space-y-5">
      <SectionTitle kicker="Pieces" title="The same component inventory, redesigned." />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <h3 className="mb-4 text-xl font-black tracking-[-0.03em]">Difficulty system</h3>
          <div className="grid grid-cols-2 gap-3">
            {difficulties.map((difficulty) => (
              <div key={difficulty} className="rounded-[1.25rem] border-[3px] border-[#151515] bg-white p-4">
                <DifficultyBadge difficulty={difficulty} />
                <div className="mt-4">
                  <StarRating difficulty={difficulty} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="bg-[#fff7ec]">
          <h3 className="mb-4 text-xl font-black tracking-[-0.03em]">Quiz cards</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuizCard title="Landing Page in Brutalism" topic="UI Systems" difficulty="expert" questions={20} attempts={5} best={62} />
            <QuizCard title="TypeScript Generics" topic="Types" difficulty="medium" questions={12} attempts={8} best={75} />
          </div>
        </Panel>

        <Panel className="bg-[#7bd8ef]">
          <h3 className="mb-4 text-xl font-black tracking-[-0.03em]">Stats and score</h3>
          <div className="flex flex-wrap gap-3">
            <StatBlock value="24" label="joined" tone="paper" />
            <StatBlock value="7" label="days" tone="yellow" />
            <StatBlock value="95" label="score" tone="red" />
            <ScoreCard score={72} label="Good run" />
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-4 text-xl font-black tracking-[-0.03em]">Rows and progress</h3>
          <div className="space-y-3">
            <ProgressBar label="Challenge progress" value={63} tone="yellow" />
            <LevelRow number={1} title="Variables and Types" description="Learn the fundamentals" state="done" />
            <LevelRow number={2} title="Functions and Generics" description="Start this next" state="active" />
            <LevelRow number={3} title="Advanced Types" description="Unlock after level 2" state="locked" />
          </div>
        </Panel>
      </div>
    </section>
  )
}

function ScreenLab() {
  return (
    <section className="space-y-5">
      <SectionTitle kicker="Compositions" title="Screens, not specimen cards." />
      <div className="grid gap-8 lg:grid-cols-3">
        <PhoneShell title="Challenges">
          <ChallengeHomeScreen />
        </PhoneShell>
        <PhoneShell title="Challenge detail">
          <ChallengeDetailScreen />
        </PhoneShell>
        <PhoneShell title="Friends">
          <FriendsScreen />
        </PhoneShell>
      </div>
    </section>
  )
}

const feedQuizzes = [
  { title: 'React Server Components', topic: 'React', difficulty: 'medium' as Difficulty, questions: 8, attempts: 3, best: 75 },
  { title: 'TypeScript Generics', topic: 'TypeScript', difficulty: 'hard' as Difficulty, questions: 10, attempts: 1, best: 60 },
  { title: 'Closures & Scope', topic: 'JavaScript', difficulty: 'easy' as Difficulty, questions: 6, attempts: 5, best: 90 },
  { title: 'SQL Indexes', topic: 'Database', difficulty: 'expert' as Difficulty, questions: 12, attempts: 2, best: 45 },
]

const teamBoard = [
  { rank: 1, person: { name: 'Thomas B.', handle: '@thomas', initials: 'TB', score: 3240, streak: 12 } },
  { rank: 2, person: { name: 'Angel C.', handle: '@angel', initials: 'AC', score: 2870, streak: 8 } },
  { rank: 3, person: { name: 'John M.', handle: '@john', initials: 'JM', score: 2510, streak: 5 } },
]

function DashboardLab() {
  return (
    <section className="space-y-5">
      <SectionTitle kicker="Dashboard" title="First view after login." />
      <div className="grid gap-8 lg:grid-cols-3">
        <PhoneShell title="Feed">
          <DashFeedScreen />
        </PhoneShell>
        <PhoneShell title="My Quizzes">
          <DashMyQuizzesScreen />
        </PhoneShell>
        <PhoneShell title="Leaderboard">
          <DashLeaderboardScreen />
        </PhoneShell>
      </div>
    </section>
  )
}

function DashFeedScreen() {
  return (
    <div className="space-y-3">
      <UserHeader compact />
      <div className="flex items-center justify-between rounded-[1.2rem] border-[3px] border-[#151515] bg-[#151515] px-4 py-3 text-white shadow-[4px_4px_0_#ff5858]">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd426]">Team · Supernal</p>
          <p className="text-lg font-black leading-tight">3 new quizzes today</p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-[#ffd426] bg-[#ffd426] text-2xl font-black text-[#151515]">3</div>
      </div>
      <Tabs labels={['Feed', 'Trending', 'New']} active="Feed" />
      <div className="space-y-2">
        {feedQuizzes.slice(0, 3).map((q) => (
          <div key={q.title} className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white p-3 shadow-[3px_3px_0_#151515]">
            <DifficultyBadge difficulty={q.difficulty} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">{q.title}</p>
              <p className="text-[10px] font-bold text-[#67606a]">{q.topic} · {q.questions}q</p>
            </div>
            <Button size="sm" tone="yellow">Go</Button>
          </div>
        ))}
      </div>
      <BottomNav active="Feed" />
    </div>
  )
}

function DashMyQuizzesScreen() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-black">My Quizzes</p>
        <Button size="sm" tone="yellow">+ New</Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatBlock value="24" label="Total" tone="yellow" />
        <StatBlock value="12" label="Streak" tone="paper" />
        <StatBlock value="74" label="Avg %" tone="paper" />
      </div>
      <SearchBar placeholder="Search quizzes…" />
      <div className="space-y-2">
        {feedQuizzes.map((q) => (
          <QuizCard key={q.title} {...q} />
        ))}
      </div>
      <BottomNav active="Quizzes" />
    </div>
  )
}

function DashLeaderboardScreen() {
  return (
    <div className="space-y-3">
      <div className="rounded-[1.3rem] border-[3px] border-[#151515] bg-[#d9ff69] p-4 shadow-[4px_4px_0_#151515]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">Team · Supernal</p>
        <p className="text-2xl font-black leading-tight">Weekly Leaderboard</p>
        <p className="text-[10px] font-bold text-[#1e6f38]">Resets Sunday · 3 days left</p>
      </div>
      <div className="space-y-2">
        {teamBoard.map(({ rank, person }) => (
          <LeaderboardRow key={person.handle} rank={rank} person={person} />
        ))}
      </div>
      <div className="rounded-[1rem] border-[3px] border-[#151515] bg-[#fff7ec] p-3 text-center shadow-[3px_3px_0_#151515]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#67606a]">You&apos;re ranked</p>
        <p className="text-4xl font-black">#1</p>
        <p className="text-[10px] font-bold text-[#67606a]">Keep it up this week</p>
      </div>
      <BottomNav active="Team" />
    </div>
  )
}

function AssetBrief() {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel className="bg-[#151515] text-white shadow-[8px_8px_0_#ff5858]">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#ffd426]">SVG brief</p>
        <h2 className="mt-3 text-4xl font-black leading-none tracking-[-0.06em]">What Recraft should create after approval.</h2>
      </Panel>
      <Panel className="bg-[#fff7ec]">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'One LearnRep mascot/avatar in black ink style',
            'Four difficulty badges with consistent shape language',
            'Six utility icons: search, plus, play, lock, share, check',
            'Three doodle stickers: burst, dot cloud, progress spark',
            'Quiz subject illustrations that can sit inside card headers',
            'One empty-state illustration for no attempts or no friends',
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white p-3">
              <Icon name="check" className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm font-bold leading-5">{item}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  )
}

function ChallengeHomeScreen() {
  return (
    <div className="space-y-4">
      <UserHeader />
      <SearchBar placeholder="Search by name or creator" />
      <Tabs labels={['Created', 'Invited', 'Public']} active="Created" />
      <ChallengeCard title="Day 1/7 - UI Challenge" difficulty="medium" meta="0/4 participants" due="Starts in 2 days" />
      <ChallengeCard title="Landing page in Brutalism" difficulty="expert" meta="0/10 participants" due="Ends tomorrow" />
      <ActivityItem name="Maya Park" action="submitted a proof link" time="8m ago" />
      <BottomNav active="Challenges" />
    </div>
  )
}

function ChallengeDetailScreen() {
  return (
    <div className="space-y-4">
      <UserHeader compact />
      <div className="rounded-[1.35rem] border-[3px] border-[#151515] bg-white p-4 shadow-[4px_4px_0_#151515]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black tracking-[-0.04em]">Day 1/7 - UI Challenge</h3>
            <p className="text-xs font-bold text-[#6b625c]">Difficulty</p>
          </div>
          <StarRating difficulty="medium" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <DoodleAvatar initials="SY" size="sm" />
          <div>
            <p className="text-sm font-black">Sepideh Yazdi</p>
            <TopicTag label="@Sepidy" tone="lime" />
          </div>
        </div>
        <div className="mt-5">
          <Countdown days={2} hours={10} minutes={6} />
        </div>
        <input
          className="mt-5 w-full rounded-[1rem] border-[3px] border-[#151515] bg-[#fff7ec] px-4 py-3 text-sm font-bold outline-none placeholder:text-[#8b827a]"
          placeholder="Paste submission URL here"
        />
        <Button className="mx-auto mt-5 flex w-fit">I am done</Button>
      </div>
      <ChallengeCard title="Landing page in Neo Brutalism" difficulty="expert" meta="0/10 participants" due="Ends in 2 days" />
      <BottomNav active="Home" />
    </div>
  )
}

function FriendsScreen() {
  return (
    <div className="space-y-4">
      <UserHeader compact />
      <div className="rounded-[1rem] border-[3px] border-[#151515] bg-[#d9ff69] p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black leading-5">Cannot find your friends? Invite them now.</p>
          <Button tone="yellow" size="sm">Invite</Button>
        </div>
      </div>
      <SearchBar placeholder="Search by name or username" />
      <FriendSection title="Received requests" people={people.slice(1)} action="check" />
      <FriendSection title="Leaderboard" people={people} />
      <BottomNav active="Friends" />
    </div>
  )
}

function UserHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <DoodleAvatar initials="SY" size={compact ? 'sm' : 'md'} />
        <div>
          <p className="text-base font-black">Sepideh Yazdi</p>
          <TopicTag label="@Sepidy" tone="lime" />
          {!compact && <p className="mt-1 text-xs font-bold text-[#6b625c]">Let us grow together.</p>}
        </div>
      </div>
      <IconButton icon="edit" label="Edit profile" tone="blue" />
    </div>
  )
}

function ChallengeCard({ title, difficulty, meta, due }: { title: string; difficulty: Difficulty; meta: string; due: string }) {
  return (
    <div className="rounded-[1.2rem] border-[3px] border-[#151515] bg-white p-4 shadow-[4px_4px_0_#151515]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black leading-5 tracking-[-0.04em]">{title}</h3>
          <p className="mt-1 text-xs font-bold text-[#6b625c]">Difficulty</p>
        </div>
        <StarRating difficulty={difficulty} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DoodleAvatar initials="SY" size="sm" />
          <div>
            <p className="text-sm font-black">Sepideh Yazdi</p>
            <TopicTag label="@Sepidy" tone="lime" />
          </div>
        </div>
        <p className="text-right text-xs font-black text-[#6b625c]">{meta}</p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t-[3px] border-[#151515] pt-3">
        <p className="text-xs font-black text-[#ff4f52]">{due}</p>
        <div className="flex gap-2">
          <Button tone="yellow" size="sm">Edit</Button>
          <Button tone="blue" size="sm">Share</Button>
        </div>
      </div>
    </div>
  )
}

function QuizCard({ title, topic, difficulty, questions, attempts, best }: {
  title: string
  topic: string
  difficulty: Difficulty
  questions: number
  attempts: number
  best: number
}) {
  const tone = difficultyTone[difficulty]
  return (
    <div className="overflow-hidden rounded-[1.35rem] border-[3px] border-[#151515] bg-white shadow-[5px_5px_0_#151515]">
      <div className={cn('h-4 border-b-[3px] border-[#151515]', tone.bg)} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black leading-5 tracking-[-0.04em]">{title}</h3>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b625c]">No. 02</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <StarRating difficulty={difficulty} />
          <TopicTag label={topic} tone={difficulty === 'expert' ? 'violet' : 'blue'} />
        </div>
      </div>
      <div className="grid grid-cols-3 border-t-[3px] border-[#151515] text-center">
        <MiniStat value={questions} label="Questions" />
        <MiniStat value={attempts} label="Attempts" border />
        <MiniStat value={`${best}%`} label="Best" border />
      </div>
    </div>
  )
}

function LevelRow({ number, title, description, state }: {
  number: number
  title: string
  description: string
  state: 'done' | 'active' | 'locked'
}) {
  const isLocked = state === 'locked'
  return (
    <div className={cn('flex items-center gap-3 rounded-[1.2rem] border-[3px] border-[#151515] bg-white p-3 shadow-[4px_4px_0_#151515]', isLocked && 'opacity-55 shadow-none')}>
      <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-full border-[3px] border-[#151515] font-black', state === 'done' && 'bg-[#d9ff69]', state === 'active' && 'bg-[#151515] text-white', state === 'locked' && 'bg-[#fff7ec]')}>
        {state === 'done' ? <Icon name="check" className="size-5" /> : state === 'locked' ? <Icon name="lock" className="size-5" /> : number}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-black', state === 'done' && 'line-through decoration-[3px]')}>{title}</p>
        <p className="truncate text-xs font-bold text-[#6b625c]">{description}</p>
      </div>
      {state === 'active' && <IconButton icon="play" label="Start level" tone="blue" />}
    </div>
  )
}

function LeaderboardRow({ rank, person }: { rank: number; person: typeof people[number] }) {
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white p-3">
      <div className={cn('flex size-10 items-center justify-center rounded-full border-[3px] border-[#151515] font-black', rank === 1 ? 'bg-[#ffd426]' : 'bg-[#fff7ec]')}>
        {rank}
      </div>
      <DoodleAvatar initials={person.initials} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{person.name}</p>
        <p className="truncate text-xs font-bold text-[#6b625c]">{person.handle}</p>
      </div>
      <div className="flex items-center gap-1 font-black">
        <span>{person.score}</span>
        <StarIcon filled className="size-4 text-[#ffd426]" />
      </div>
    </div>
  )
}

function ActivityItem({ name, action, time }: { name: string; action: string; time: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white p-3">
      <DoodleAvatar initials={name.split(' ').map((part) => part[0]).join('').slice(0, 2)} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{name}</p>
        <p className="truncate text-xs font-bold text-[#6b625c]">{action}</p>
      </div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b625c]">{time}</p>
    </div>
  )
}

function FriendSection({ title, people: sectionPeople, action }: { title: string; people: typeof people; action?: 'check' }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border-[3px] border-[#151515] bg-white">
      <div className="border-b-[3px] border-[#151515] bg-[#fff7ec] px-4 py-2 text-xs font-black uppercase tracking-[0.14em]">
        {title}
      </div>
      {sectionPeople.map((person, index) => (
        <div key={person.handle} className="border-b-[3px] border-[#151515] last:border-b-0">
          {action ? (
            <div className="flex items-center gap-3 p-3">
              <DoodleAvatar initials={person.initials} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-black">{person.name}</p>
                <TopicTag label={person.handle} tone="lime" />
              </div>
              <IconButton icon="check" label="Accept" tone="lime" />
            </div>
          ) : (
            <LeaderboardRow rank={index + 1} person={person} />
          )}
        </div>
      ))}
    </div>
  )
}

function ScoreCard({ score, label }: { score: number; label: string }) {
  return (
    <div className="rounded-[1.35rem] border-[3px] border-[#151515] bg-white px-6 py-4 text-center shadow-[4px_4px_0_#151515]">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b625c]">{label}</p>
      <p className="text-6xl font-black leading-none tracking-[-0.08em] text-[#0d5c75]">{score}</p>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">points</p>
    </div>
  )
}

function StatBlock({ value, label, tone }: { value: string; label: string; tone: 'paper' | 'yellow' | 'red' }) {
  const styles = {
    paper: 'bg-white',
    yellow: 'bg-[#ffd426]',
    red: 'bg-[#ff5858] text-white',
  }
  return (
    <div className={cn('min-w-24 rounded-[1.2rem] border-[3px] border-[#151515] px-4 py-3 text-center shadow-[4px_4px_0_#151515]', styles[tone])}>
      <p className="text-4xl font-black leading-none tracking-[-0.08em]">{value}</p>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">{label}</p>
    </div>
  )
}

function Countdown({ days, hours, minutes }: { days: number; hours: number; minutes: number }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
      <TimeBlock value={days} label="Days" />
      <span className="text-2xl font-black text-[#ff5858]">:</span>
      <TimeBlock value={hours} label="Hours" />
      <span className="text-2xl font-black text-[#ff5858]">:</span>
      <TimeBlock value={minutes} label="Mins" />
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[0.9rem] border-[3px] border-[#151515] bg-[#fff7ec] px-3 py-2 text-center">
      <p className="text-2xl font-black leading-none tabular-nums tracking-[-0.05em]">{String(value).padStart(2, '0')}</p>
      <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b625c]">{label}</p>
    </div>
  )
}

function ProgressBar({ label, value, tone }: { label: string; value: number; tone: 'yellow' | 'blue' }) {
  return (
    <div>
      <div className="mb-2 flex justify-between font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-5 overflow-hidden rounded-full border-[3px] border-[#151515] bg-white">
        <div className={cn('h-full rounded-full border-r-[3px] border-[#151515]', tone === 'yellow' ? 'bg-[#ffd426]' : 'bg-[#7bd8ef]')} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border-[3px] border-[#151515] bg-white px-4 py-3">
      <Icon name="search" className="size-5" />
      <span className="text-sm font-bold text-[#8b827a]">{placeholder}</span>
    </div>
  )
}

function Tabs({ labels, active }: { labels: string[]; active: string }) {
  return (
    <div className="flex gap-4 overflow-hidden border-b-[3px] border-[#151515] pb-2">
      {labels.map((label) => (
        <span key={label} className={cn('font-mono text-[10px] font-bold uppercase tracking-[0.18em]', label === active && 'border-b-[3px] border-[#151515]')}>
          {label}
        </span>
      ))}
    </div>
  )
}

function BottomNav({ active }: { active: string }) {
  const items = [
    { label: 'Challenges', icon: 'star' as const },
    { label: 'Home', icon: 'home' as const },
    { label: 'Friends', icon: 'users' as const },
  ]
  return (
    <div className="sticky bottom-0 mt-5 grid grid-cols-3 rounded-full border-[3px] border-[#151515] bg-[#fff7ec] p-2">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1">
          <div className={cn('rounded-full px-4 py-1', active === item.label && 'bg-[#ffd426]')}>
            <Icon name={item.icon} className="size-5" />
          </div>
          <span className="text-[10px] font-black">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function PhoneShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[2rem] border-[4px] border-[#151515] bg-[#fff7ec] p-4 shadow-[10px_10px_0_#151515]">
      <div className="mb-5 flex items-center justify-between">
        <Icon name="back" className="size-5" />
        <p className="text-sm font-black">{title}</p>
        <Icon name="menu" className="size-5" />
      </div>
      {children}
    </div>
  )
}

function Button({ children, tone = 'yellow', size = 'md', className }: {
  children: React.ReactNode
  tone?: 'yellow' | 'blue' | 'lime'
  size?: 'sm' | 'md'
  className?: string
}) {
  const tones = {
    yellow: 'bg-[#ffd426]',
    blue: 'bg-[#7bd8ef]',
    lime: 'bg-[#d9ff69]',
  }
  return (
    <button className={cn('rounded-full border-[3px] border-[#151515] font-black uppercase shadow-[3px_3px_0_#151515]', tones[tone], size === 'sm' ? 'px-4 py-2 text-xs tracking-[0.12em]' : 'px-7 py-3 text-sm tracking-[0.14em]', className)}>
      {children}
    </button>
  )
}

function IconButton({ icon, label, tone = 'paper' }: { icon: IconName; label: string; tone?: 'paper' | 'blue' | 'yellow' | 'lime' }) {
  const tones = {
    paper: 'bg-[#fff7ec]',
    blue: 'bg-[#7bd8ef]',
    yellow: 'bg-[#ffd426]',
    lime: 'bg-[#d9ff69]',
  }
  return (
    <button aria-label={label} className={cn('flex size-10 items-center justify-center rounded-full border-[3px] border-[#151515] shadow-[3px_3px_0_#151515]', tones[tone])}>
      <Icon name={icon} className="size-5" />
    </button>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const tone = difficultyTone[difficulty]
  return (
    <span className={cn('inline-flex rounded-full border-[3px] px-3 py-1 text-xs font-black', tone.bg, tone.text, tone.border)}>
      {tone.label}
    </span>
  )
}

function TopicTag({ label, tone = 'paper' }: { label: string; tone?: 'paper' | 'lime' | 'blue' | 'violet' }) {
  const tones = {
    paper: 'bg-white',
    lime: 'bg-[#d9ff69]',
    blue: 'bg-[#7bd8ef]',
    violet: 'bg-[#b995ff]',
  }
  return (
    <span className={cn('inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-black leading-none', tones[tone])}>
      {label}
    </span>
  )
}

function StarRating({ difficulty }: { difficulty: Difficulty }) {
  const tone = difficultyTone[difficulty]
  return (
    <div className="flex gap-1" aria-label={`${tone.label} difficulty`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon key={index} filled={index < tone.score} className={cn('size-5', index < tone.score ? tone.text : 'text-[#d3ccc5]')} />
      ))}
    </div>
  )
}

function MiniStat({ value, label, border = false }: { value: string | number; label: string; border?: boolean }) {
  return (
    <div className={cn('px-2 py-3', border && 'border-l-[3px] border-[#151515]')}>
      <p className="font-black leading-none">{value}</p>
      <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#6b625c]">{label}</p>
    </div>
  )
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-[2rem] border-[3px] border-[#151515] bg-[#fff7ec] p-5 shadow-[7px_7px_0_#151515]', className)}>
      {children}
    </div>
  )
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex flex-col gap-2 border-b-[3px] border-[#151515] pb-4 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">{title}</h2>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#6b3d1f]">{kicker}</p>
    </div>
  )
}

function Pill({ children, tone = 'paper' }: { children: React.ReactNode; tone?: 'paper' | 'red' | 'blue' }) {
  const tones = {
    paper: 'bg-white',
    red: 'bg-[#ff5858] text-white',
    blue: 'bg-[#7bd8ef]',
  }
  return (
    <span className={cn('rounded-full border-[3px] border-[#151515] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] shadow-[3px_3px_0_#151515]', tones[tone])}>
      {children}
    </span>
  )
}

function Token({ name, color, dark = false }: { name: string; color: string; dark?: boolean }) {
  return (
    <div className={cn('rounded-[1rem] border-[3px] border-[#151515] p-3 shadow-[3px_3px_0_#151515]', color, dark && 'text-white')}>
      <div className="h-16" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">{name}</p>
    </div>
  )
}

function DoodleAvatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'size-11' : 'size-14'
  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-full border-[3px] border-[#151515] bg-[#fff7ec]', box)}>
      <svg viewBox="0 0 64 64" className="size-full" aria-hidden="true">
        <circle cx="32" cy="31" r="17" fill="#fff7ec" stroke="#151515" strokeWidth="3" />
        <path d="M18 29c3-15 23-17 29-3-8-2-17-2-29 3Z" fill="#151515" />
        <circle cx="26" cy="34" r="2" fill="#151515" />
        <circle cx="38" cy="34" r="2" fill="#151515" />
        <path d="M27 43c4 3 8 3 12 0" fill="none" stroke="#151515" strokeLinecap="round" strokeWidth="3" />
      </svg>
      <span className="absolute inset-x-0 bottom-0 bg-[#151515] py-0.5 text-center font-mono text-[9px] font-bold text-white">
        {initials}
      </span>
    </div>
  )
}

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="m12 2.8 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9l5.9-.8L12 2.8Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  )
}

type IconName = 'plus' | 'check' | 'play' | 'lock' | 'search' | 'edit' | 'star' | 'home' | 'users' | 'back' | 'menu'

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8">
      {name === 'plus' && <path d="M12 5v14M5 12h14" />}
      {name === 'check' && <path d="m5 12 4 4L19 6" />}
      {name === 'play' && <path d="M8 5v14l11-7Z" fill="currentColor" />}
      {name === 'lock' && <path d="M7 11h10v8H7zM9 11V8a3 3 0 0 1 6 0v3" />}
      {name === 'search' && <path d="m20 20-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />}
      {name === 'edit' && <path d="m4 16 1 4 4-1L19 9l-5-5L4 16Z" />}
      {name === 'star' && <path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9l5.9-.8L12 3Z" />}
      {name === 'home' && <path d="m4 11 8-7 8 7v9H6v-7h12" />}
      {name === 'users' && <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21c1-4 4-6 8-6s7 2 8 6M18 12a3 3 0 0 0 0-6" />}
      {name === 'back' && <path d="m15 5-7 7 7 7" />}
      {name === 'menu' && <path d="M5 7h14M5 12h14M5 17h14" />}
    </svg>
  )
}
