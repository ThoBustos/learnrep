'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart2,
  BookOpen,
  Check,
  Copy,
  Home,
  Library,
  Play,
  Plus,
  Share2,
  Trophy,
  Users,
} from 'lucide-react'
import {
  DifficultyStamp,
  MetricTicket,
  QuizCollectionRow,
  StatusStamp,
  WorkbookButton,
  WorkbookList,
  WorkbookPanel,
  WorkbookPanelHeader,
} from '@/components/ui/LearningSurface'
import { cn } from '@/lib/utils'
import { brandColors, colors, landingColorVars } from '@/lib/tokens'

const tokenGroups = [
  {
    label: 'Core brand',
    vars: ['--lr-ink', '--lr-cream', '--lr-white', '--lr-notebook', '--lr-paper', '--lr-yellow', '--lr-yolk', '--lr-teal', '--lr-tomato'],
  },
  {
    label: 'Supporting accents',
    vars: ['--lr-green', '--lr-red', '--lr-blue', '--lr-purple', '--lr-cobalt', '--lr-mint', '--lr-muted', '--lr-line'],
  },
  {
    label: 'Difficulty',
    vars: ['--lr-green-dark', '--lr-blue-dark', '--lr-red-dark', '--lr-purple-dark'],
  },
] as const

const shadowTokens = [
  ['--lr-shadow-sm', '2px 2px 0 var(--lr-line)'],
  ['--lr-shadow-md', '4px 4px 0 var(--lr-line)'],
  ['--lr-shadow-lg', '6px 6px 0 var(--lr-line)'],
] as const

const fontTokens = [
  ['--font-sans', 'var(--font-geist-sans)'],
  ['--font-mono', 'var(--font-geist-mono)'],
  ['--font-heading', 'var(--font-geist-sans)'],
] as const

const colorVarValues = landingColorVars as Record<string, string>

const DESIGN_TOKENS_CSS = `/* LearnRep Design Tokens */
:root {
${tokenGroups.map((group) => `  /* ${group.label} */
${group.vars.map((name) => `  ${name}: ${colorVarValues[name]};`).join('\n')}`).join('\n\n')}

  /* Surface shadows */
${shadowTokens.map(([name, value]) => `  ${name}: ${value};`).join('\n')}

  /* Tailwind theme font aliases */
${fontTokens.map(([name, value]) => `  ${name}: ${value};`).join('\n')}
}`

const LOGO_VARIANTS = [
  { name: 'Default', file: '/logos/logo.svg', bg: '#F5F4F0', wide: false },
  { name: 'Dark', file: '/logos/logo-dark.svg', bg: brandColors.ink, wide: false },
  { name: 'Mono Black', file: '/logos/logo-mono-black.svg', bg: colors.white, wide: false },
  { name: 'Mono White', file: '/logos/logo-mono-white.svg', bg: brandColors.ink, wide: false },
  { name: 'Wordmark', file: '/logos/logo-wordmark.svg', bg: '#F5F4F0', wide: true },
]

const COLORS = {
  core: [
    { name: 'Ink', hex: brandColors.ink },
    { name: 'Notebook', hex: brandColors.notebook },
    { name: 'Paper', hex: brandColors.paper },
    { name: 'Yolk', hex: brandColors.yolk },
    { name: 'Teal', hex: brandColors.teal },
    { name: 'Tomato', hex: brandColors.tomato },
  ],
  accents: [
    { name: 'Green', hex: colors.green },
    { name: 'Red', hex: colors.red },
    { name: 'Blue', hex: colors.blue },
    { name: 'Purple', hex: colors.purple },
    { name: 'Cobalt', hex: colors.cobalt },
    { name: 'Mint', hex: colors.mint },
  ],
  difficulty: [
    { name: 'Easy text', hex: colors.greenDark },
    { name: 'Medium text', hex: colors.blueDark },
    { name: 'Hard text', hex: colors.redDark },
    { name: 'Expert text', hex: colors.purpleDark },
  ],
}

const FONTS = [
  { name: 'Geist Sans', cssVar: '--font-geist-sans', role: 'UI and body text', sample: 'Aa Bb Gg Qq 01' },
  { name: 'Geist Mono', cssVar: '--font-geist-mono', role: 'Code, terminal, labels', sample: 'lr generate "hooks"' },
  { name: 'Space Grotesk', cssVar: '--font-space-grotesk', role: 'Product headings', sample: 'Rr Oo Uu 0123' },
  { name: 'Space Mono', cssVar: '--font-space-mono', role: 'Dense mono labels', sample: '$ npm install -g' },
  { name: 'Bowlby One SC', cssVar: '--font-bowlby', role: 'Display moments only', sample: 'LearnRep' },
]

const TYPE_SCALE = [
  { name: 'Display', cls: 'text-display', meta: '48 / 700 / 1.1lh', sample: 'Learning reps' },
  { name: 'Heading', cls: 'text-heading', meta: '24 / 700 / 1.25lh', sample: 'React Hooks Deep Dive' },
  { name: 'Subhead', cls: 'text-subhead', meta: '16 / 700 / 1.4lh', sample: 'Generated 5 questions' },
  { name: 'Body', cls: 'text-body', meta: '14 / 400 / 1.6lh', sample: 'Paste the URL in your browser to start the quiz.' },
  { name: 'Caption', cls: 'text-caption', meta: '12 / 400 / 1.5lh', sample: 'TOPIC / MEDIUM / 5 QUESTIONS' },
]

const VOICE = [
  {
    adj: 'Direct',
    do: 'lr generate "react hooks"',
    dont: 'Please consider utilizing our generate command for the React Hooks topic',
  },
  {
    adj: 'Curious',
    do: "What's your weakest topic? Find out.",
    dont: 'Our AI-powered platform provides comprehensive learning insights',
  },
  {
    adj: 'No hype',
    do: 'A live quiz URL in seconds.',
    dont: 'Revolutionary AI-powered learning transformation engine',
  },
]

const PRODUCT_NAV = [
  { label: 'Feed', icon: Home, active: true },
  { label: 'My Quizzes', icon: BookOpen, active: false },
  { label: 'Library', icon: Library, active: false },
  { label: 'Stats', icon: BarChart2, active: false },
  { label: 'Team', icon: Users, active: false },
]

const METRIC_EXAMPLES = [
  { value: '12', label: 'Day streak', tone: 'ink', meta: 'Daily review loop' },
  { value: '84%', label: 'Avg score', tone: 'teal', meta: '+9 pts this week' },
  { value: '31', label: 'Saved slips', tone: 'yolk', meta: 'Library ready' },
] as const

const COMPONENT_RULES = [
  'Notebook is the app canvas, not a decorative backdrop.',
  'Teal owns persistent navigation and product framing.',
  'Paper panels hold workbook tasks, quiz rows, and dense lists.',
  'Yolk is an action and reward color, not the whole page.',
  'Blue and cobalt can carry quiz previews or focused demo areas.',
]

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t-[3px] border-[var(--lr-line)]/15 py-12">
      <p className="mb-8 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[var(--lr-muted)]">
        {label}
      </p>
      {children}
    </section>
  )
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(hex).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex flex-col overflow-hidden border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] text-left shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="h-14" style={{ background: hex }} />
      <div className="border-t-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] px-3 py-2">
        <p className="text-[11px] font-black text-[var(--lr-ink)]">{name}</p>
        <p className="flex items-center gap-1 font-mono text-[10px] text-[var(--lr-muted)]">
          {hex.toLowerCase()}
          {copied
            ? <Check size={9} className="shrink-0 text-[var(--lr-green-dark)]" />
            : <Copy size={9} className="shrink-0 opacity-0 group-hover:opacity-60" />}
        </p>
      </div>
    </button>
  )
}

function ColorGroup({ label, swatches, cols }: { label: string; swatches: { name: string; hex: string }[]; cols: string }) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[var(--lr-muted)]">
        {label}
      </p>
      <div className={cn('grid gap-3', cols)}>
        {swatches.map((s) => <ColorSwatch key={s.hex} {...s} />)}
      </div>
    </div>
  )
}

function ProductSystemShowcase() {
  return (
    <div className="overflow-hidden border-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] shadow-[8px_8px_0_var(--lr-line)]">
      <div className="grid lg:grid-cols-[220px_1fr]">
        <aside className="border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-teal)] p-4 lg:border-b-0 lg:border-r-[3px]">
          <div className="mb-6 flex items-center gap-3">
            <Image src="/logos/robot.svg" alt="" width={44} height={44} className="size-11 shrink-0" />
            <span className="text-xl font-black text-white">LearnRep</span>
          </div>

          <nav className="grid gap-2">
            {PRODUCT_NAV.map((item) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-3 border-[3px] border-[var(--lr-line)] px-3 py-2 text-sm font-black',
                  item.active
                    ? 'bg-[var(--lr-yolk)] text-[var(--lr-ink)] shadow-[4px_4px_0_var(--lr-line)]'
                    : 'bg-[var(--lr-paper)] text-[var(--lr-ink)] shadow-[2px_2px_0_var(--lr-line)]'
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 bg-[var(--lr-notebook)]">
          <div className="border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)] px-4 py-3">
            <p className="text-xl font-black">Good morning, Thomas</p>
            <p className="font-mono text-[11px] font-bold text-[var(--lr-muted)]">Workbook mode / focused review</p>
          </div>

          <div className="relative p-4 sm:p-5">
            <div className="pointer-events-none absolute inset-0 bg-ruled-paper opacity-70" />
            <div className="relative grid gap-4">
              <div className="grid gap-3 md:grid-cols-3">
                {METRIC_EXAMPLES.map((metric) => (
                  <MetricTicket key={metric.label} {...metric} className="min-h-28" />
                ))}
              </div>

              <WorkbookPanel>
                <WorkbookPanelHeader kicker="Today" title="Practice slips" />
                <WorkbookList>
                  <QuizCollectionRow
                    title="React hooks recall"
                    topic="React"
                    difficulty="medium"
                    questionCount={8}
                    attemptCount={3}
                    bestScore={86}
                    status={{ label: 'Saved', tone: 'teal' }}
                    actions={<WorkbookButton tone="paper" icon={Play}>Review</WorkbookButton>}
                  />
                  <QuizCollectionRow
                    title="TypeScript generics"
                    topic="TS"
                    difficulty="hard"
                    questionCount={10}
                    attemptCount={1}
                    bestScore={72}
                    status={{ label: 'Private', tone: 'paper' }}
                    actions={<WorkbookButton tone="yolk" icon={Share2}>Share</WorkbookButton>}
                  />
                </WorkbookList>
              </WorkbookPanel>

              <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                <div className="border-[3px] border-[var(--lr-blue-dark)] bg-[var(--lr-blue)] p-4 text-[var(--lr-blue-dark)] shadow-[4px_4px_0_var(--lr-line)]">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <StatusStamp tone="teal">Quiz preview</StatusStamp>
                    <DifficultyStamp difficulty="expert" />
                  </div>
                  <p className="text-lg font-black">Which hook prevents stale closures in this callback?</p>
                  <div className="mt-4 grid gap-2 font-mono text-[11px] font-black">
                    <div className="border-[2px] border-[var(--lr-blue-dark)] bg-white/70 px-3 py-2">A. useRef</div>
                    <div className="border-[2px] border-[var(--lr-blue-dark)] bg-[var(--lr-cobalt)] px-3 py-2 text-white">B. useCallback</div>
                  </div>
                </div>

                <div className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)] p-4 shadow-[4px_4px_0_var(--lr-line)]">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em]">Actions</p>
                  <div className="mt-3 grid gap-2">
                    <WorkbookButton tone="ink" icon={Plus}>Generate</WorkbookButton>
                    <WorkbookButton tone="paper" icon={Trophy}>Stats</WorkbookButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComponentRules() {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {COMPONENT_RULES.map((rule, index) => (
        <div key={rule} className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] p-4 shadow-[3px_3px_0_var(--lr-line)]">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[var(--lr-tomato)]">
            0{index + 1}
          </p>
          <p className="mt-3 text-sm font-black leading-snug">{rule}</p>
        </div>
      ))}
    </div>
  )
}

export default function BrandPage() {
  const [tokensCopied, setTokensCopied] = useState(false)

  function copyTokens() {
    navigator.clipboard.writeText(DESIGN_TOKENS_CSS).catch(() => {})
    setTokensCopied(true)
    setTimeout(() => setTokensCopied(false), 2000)
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[var(--lr-notebook)] text-[var(--lr-ink)]"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="pointer-events-none fixed inset-0 bg-ruled-paper opacity-60" />

      <header className="sticky top-0 z-20 border-b-[3px] border-[var(--lr-line)] bg-[var(--lr-paper)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image src="/logos/logo.svg" alt="LearnRep" width={44} height={44} className="size-11 shrink-0" />
            <span className="truncate text-lg font-black">LearnRep</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/docs"
              className="hidden border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5 sm:block"
            >
              Docs
            </Link>
            <button
              type="button"
              onClick={copyTokens}
              className="flex items-center gap-1.5 border-[3px] border-[var(--lr-line)] bg-[var(--lr-yolk)] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-[var(--lr-ink)] shadow-[3px_3px_0_var(--lr-line)] transition-transform hover:-translate-y-0.5"
            >
              {tokensCopied
                ? <><Check className="size-3" /> Copied</>
                : <><Copy className="size-3" /> Tokens</>}
            </button>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        <div className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <StatusStamp tone="ink">Source of truth</StatusStamp>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">LearnRep brand system</h1>
            <p className="mt-3 max-w-2xl font-mono text-sm font-bold leading-6 text-[var(--lr-muted)]">
              Tokens, surface rules, and product components for the CLI, docs, landing page, and signed-in app.
            </p>
          </div>
          <div className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-teal)] p-4 text-white shadow-[5px_5px_0_var(--lr-line)]">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/70">Canonical palette</p>
            <div className="mt-3 grid grid-cols-6 gap-1">
              {COLORS.core.map((color) => (
                <div
                  key={color.hex}
                  title={`${color.name} ${color.hex}`}
                  className="h-10 border-[2px] border-[var(--lr-line)]"
                  style={{ background: color.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        <Section label="01 / Product UI system">
          <div className="grid gap-6">
            <ProductSystemShowcase />
            <ComponentRules />
          </div>
        </Section>

        <Section label="02 / Logo system">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {LOGO_VARIANTS.filter((v) => !v.wide).map((v) => (
              <LogoCard key={v.name} {...v} />
            ))}
          </div>
          <div className="mt-4">
            {LOGO_VARIANTS.filter((v) => v.wide).map((v) => (
              <LogoCard key={v.name} {...v} />
            ))}
          </div>

          <div className="mt-6 border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] p-5 shadow-[3px_3px_0_var(--lr-line)]">
            <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[var(--lr-muted)]">
              Usage rules
            </p>
            <ul className="space-y-2">
              {[
                'Never stretch, skew, or rotate. Scale proportionally only.',
                'Minimum height: 24 px for the icon mark.',
                'Maintain clear space equal to 1x the icon height on all sides.',
                "Do not recolor. Use one of the approved variants above.",
                'Do not apply drop shadows, glows, gradients, or extra effects.',
              ].map((rule) => (
                <li key={rule} className="flex items-start gap-2 font-mono text-xs font-bold text-[var(--lr-ink)]">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center border-[2px] border-[var(--lr-red-dark)] font-black text-[8px] text-[var(--lr-red-dark)]">
                    X
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section label="03 / Colors">
          <div className="space-y-8">
            <ColorGroup label="Core brand" swatches={COLORS.core} cols="grid-cols-2 sm:grid-cols-3" />
            <ColorGroup label="Supporting accents" swatches={COLORS.accents} cols="grid-cols-2 sm:grid-cols-3" />
            <ColorGroup label="Semantic darks" swatches={COLORS.difficulty} cols="grid-cols-2 sm:grid-cols-4" />
          </div>
        </Section>

        <Section label="04 / Typography">
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FONTS.map((f) => (
              <div
                key={f.name}
                className="flex min-h-36 flex-col justify-between border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] px-5 py-4 shadow-[3px_3px_0_var(--lr-line)]"
              >
                <p
                  className="text-[2rem] font-bold leading-tight text-[var(--lr-ink)]"
                  style={{ fontFamily: `var(${f.cssVar})` }}
                >
                  {f.sample}
                </p>
                <div className="mt-3 border-t-[3px] border-[var(--lr-line)] pt-3">
                  <p className="text-[12px] font-black text-[var(--lr-ink)]" style={{ fontFamily: `var(${f.cssVar})` }}>
                    {f.name}
                  </p>
                  <p className="font-mono text-[10px] font-bold text-[var(--lr-muted)]">{f.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.name}
                className="grid gap-3 border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] px-5 py-4 shadow-[2px_2px_0_var(--lr-line)] sm:grid-cols-[120px_1fr] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[var(--lr-muted)]">
                    {t.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] font-bold text-[var(--lr-muted)]">{t.meta}</p>
                </div>
                <p className={cn(t.cls, 'min-w-0 break-words text-[var(--lr-ink)]')}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="05 / Voice and tone">
          <div className="grid gap-4 sm:grid-cols-3">
            {VOICE.map((v) => (
              <div
                key={v.adj}
                className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-white)] p-5 shadow-[3px_3px_0_var(--lr-line)]"
              >
                <p className="mb-4 text-lg font-black text-[var(--lr-ink)]">{v.adj}</p>
                <div className="space-y-2">
                  <div className="border-[2px] border-[var(--lr-green-dark)] bg-[var(--lr-green)]/25 px-3 py-2">
                    <p className="mb-1 font-mono text-[9px] font-black uppercase tracking-widest text-[var(--lr-green-dark)]">
                      Do
                    </p>
                    <p className="font-mono text-[11px] font-bold leading-snug text-[var(--lr-ink)]">&ldquo;{v.do}&rdquo;</p>
                  </div>
                  <div className="border-[2px] border-[var(--lr-red-dark)] bg-[var(--lr-red)]/20 px-3 py-2">
                    <p className="mb-1 font-mono text-[9px] font-black uppercase tracking-widest text-[var(--lr-red-dark)]">
                      Do not
                    </p>
                    <p className="font-mono text-[11px] font-bold leading-snug text-[var(--lr-ink)]">&ldquo;{v.dont}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  )
}

function LogoCard({ name, file, bg, wide }: { name: string; file: string; bg: string; wide: boolean }) {
  return (
    <div>
      <div
        className="flex items-center justify-center border-[3px] border-[var(--lr-line)] p-6 shadow-[3px_3px_0_var(--lr-line)]"
        style={{ background: bg, minHeight: wide ? 100 : 120 }}
      >
        <Image
          src={file}
          alt={name}
          width={wide ? 220 : 60}
          height={60}
          className="object-contain"
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="font-mono text-[10px] font-bold text-[var(--lr-muted)]">{name}</p>
        <a
          href={file}
          download
          className="font-mono text-[10px] font-bold text-[var(--lr-ink)] underline decoration-dotted hover:no-underline"
        >
          SVG
        </a>
      </div>
    </div>
  )
}
