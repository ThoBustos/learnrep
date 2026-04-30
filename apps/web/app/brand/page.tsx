'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

const DESIGN_TOKENS_CSS = `/* LearnRep Design Tokens */
:root {
  /* Brand */
  --brand-yellow: #FDC229;
  --brand-black: #0F0E0D;

  /* Landing accents */
  --accent-sun: #FFD426;
  --accent-lime: #D9FF69;
  --accent-sky: #7BD8EF;
  --accent-lavender: #B995FF;
  --accent-violet: #5735A7;

  /* UI base */
  --background: #F5F4F0;
  --foreground: #1C1C2E;
  --surface: #FFFFFF;
  --secondary: #ECEAE4;
  --muted-foreground: #6B6A7A;
  --border: #E0DED8;
  --destructive: #C0544A;
  --streak: #C0A84A;

  /* Difficulty */
  --difficulty-easy: #4A9E6E;
  --difficulty-medium: #4A7FC0;
  --difficulty-hard: #C0544A;
  --difficulty-expert: #7C5AC0;

  /* Typography */
  --font-sans: "Geist Sans", sans-serif;
  --font-mono: "Geist Mono", monospace;
  --font-display: "Bowlby One SC", sans-serif;

  /* Radius */
  --radius: 0.75rem;
  --radius-sm: 0.45rem;
  --radius-lg: 1.05rem;
  --radius-xl: 1.35rem;
  --radius-2xl: 1.6rem;
}`

// ─── Data ─────────────────────────────────────────────────────────────────────

const LOGO_VARIANTS = [
  { name: 'Default',    file: '/logos/logo.svg',           bg: '#F5F4F0', wide: false },
  { name: 'Dark',       file: '/logos/logo-dark.svg',      bg: '#0F0E0D', wide: false },
  { name: 'Mono Black', file: '/logos/logo-mono-black.svg', bg: '#FFFFFF', wide: false },
  { name: 'Mono White', file: '/logos/logo-mono-white.svg', bg: '#0F0E0D', wide: false },
  { name: 'Wordmark',   file: '/logos/logo-wordmark.svg',  bg: '#F5F4F0', wide: true  },
]

const COLORS = {
  brand: [
    { name: 'Brand Yellow', hex: '#FDC229' },
    { name: 'Brand Black',  hex: '#0F0E0D' },
  ],
  accents: [
    { name: 'Sun',      hex: '#FFD426' },
    { name: 'Lime',     hex: '#D9FF69' },
    { name: 'Sky',      hex: '#7BD8EF' },
    { name: 'Lavender', hex: '#B995FF' },
    { name: 'Violet',   hex: '#5735A7' },
  ],
  ui: [
    { name: 'Background',  hex: '#F5F4F0' },
    { name: 'Foreground',  hex: '#1C1C2E' },
    { name: 'Surface',     hex: '#FFFFFF'  },
    { name: 'Secondary',   hex: '#ECEAE4' },
    { name: 'Muted',       hex: '#6B6A7A' },
    { name: 'Border',      hex: '#E0DED8' },
    { name: 'Destructive', hex: '#C0544A' },
    { name: 'Streak',      hex: '#C0A84A' },
  ],
  difficulty: [
    { name: 'Easy',   hex: '#4A9E6E' },
    { name: 'Medium', hex: '#4A7FC0' },
    { name: 'Hard',   hex: '#C0544A' },
    { name: 'Expert', hex: '#7C5AC0' },
  ],
}

const FONTS = [
  { name: 'Geist Sans',    cssVar: '--font-geist-sans',    role: 'UI · body text',           sample: 'Aa Bb Gg Qq 01' },
  { name: 'Geist Mono',    cssVar: '--font-geist-mono',    role: 'Code · terminal · labels', sample: 'lr generate "hooks"' },
  { name: 'Space Grotesk', cssVar: '--font-space-grotesk', role: 'Headings (alt)',            sample: 'Rr Oo Uu 0123' },
  { name: 'Space Mono',    cssVar: '--font-space-mono',    role: 'Monospace (alt)',           sample: '$ npm install -g' },
  { name: 'Bowlby One SC', cssVar: '--font-bowlby',        role: 'Display · hero',           sample: 'LearnRep' },
]

const TYPE_SCALE = [
  { name: 'Display',  cls: 'text-display', meta: '48 · 700 · −0.02em', sample: 'Learn Fast' },
  { name: 'Heading',  cls: 'text-heading', meta: '24 · 700',            sample: 'React Hooks Deep Dive' },
  { name: 'Subhead',  cls: 'text-subhead', meta: '16 · 700',            sample: 'Generated 5 questions' },
  { name: 'Body',     cls: 'text-body',    meta: '14 · 400 · 1.6lh',    sample: 'Paste the URL in your browser to start the quiz.' },
  { name: 'Caption',  cls: 'text-caption', meta: '12 · 400',            sample: 'TOPIC · MEDIUM · 5 QUESTIONS' },
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
    adj: 'No-hype',
    do: 'A live quiz URL in seconds.',
    dont: 'Revolutionary AI-powered learning transformation engine',
  },
]

// ─── Components ───────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t-[3px] border-[#151515]/8 py-12">
      <p className="mb-8 font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#67606a]">{label}</p>
      {children}
    </section>
  )
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className="group flex flex-col overflow-hidden rounded-[0.85rem] border-[2.5px] border-[#151515] shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5 active:translate-y-0 text-left"
    >
      <div className="h-14" style={{ background: hex }} />
      <div className="border-t-[2.5px] border-[#151515] bg-white px-3 py-2">
        <p className="text-[11px] font-black text-[#151515]">{name}</p>
        <p className="flex items-center gap-1 font-mono text-[10px] text-[#67606a]">
          {hex.toLowerCase()}
          {copied
            ? <Check size={9} className="shrink-0 text-[#4A9E6E]" />
            : <Copy size={9} className="shrink-0 opacity-0 group-hover:opacity-60" />}
        </p>
      </div>
    </button>
  )
}

function ColorGroup({ label, swatches, cols }: { label: string; swatches: { name: string; hex: string }[]; cols: string }) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#67606a]">{label}</p>
      <div className={cn('grid gap-3', cols)}>
        {swatches.map((s) => <ColorSwatch key={s.hex} {...s} />)}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrandPage() {
  const [tokensCopied, setTokensCopied] = useState(false)

  function copyTokens() {
    navigator.clipboard.writeText(DESIGN_TOKENS_CSS).catch(() => {})
    setTokensCopied(true)
    setTimeout(() => setTokensCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>

      {/* ── NAV — same as landing ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#151515]/10 bg-[#fafaf8]/90 px-6 py-4 backdrop-blur-sm sm:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logos/logo.svg" alt="LearnRep" width={44} height={44} className="size-11" />
          <span className="text-lg font-black tracking-[-0.03em]">LearnRep</span>
        </Link>
        <nav className="flex items-center gap-5">
          <span className="hidden font-mono text-[11px] font-bold uppercase tracking-widest text-[#151515]/40 sm:block">
            Brand
          </span>
          <Link
            href="/docs"
            className="hidden font-mono text-[11px] font-bold uppercase tracking-widest text-[#151515]/50 hover:text-[#151515] sm:block"
          >
            Docs
          </Link>
          <button
            onClick={copyTokens}
            className="flex items-center gap-1.5 rounded-[0.6rem] border-[2.5px] border-[#151515] bg-[#ffd426] px-4 py-1.5 font-mono text-[11px] font-black uppercase tracking-widest text-[#151515] shadow-[3px_3px_0_#151515] transition-transform hover:-translate-y-0.5"
          >
            {tokensCopied
              ? <><Check className="size-3" /> Copied</>
              : <><Copy className="size-3" /> Copy tokens</>}
          </button>
        </nav>
      </header>

      {/* ── PAGE TITLE ────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-8 pt-10 pb-2">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-[#151515]">Brand</h1>
        <p className="mt-1 font-mono text-sm text-[#67606a]">
          Logos, colors, type, and voice — for contributors, press, and AI assistants.
        </p>
      </div>

      <main className="mx-auto max-w-4xl px-8 pb-24">

        {/* ── LOGOS ─────────────────────────────────────────────────────────── */}
        <Section label="01 · Logo system">
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

          <div className="mt-6 rounded-[1rem] border-[2px] border-[#E0DED8] bg-white p-5">
            <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#67606a]">
              Usage rules
            </p>
            <ul className="space-y-2">
              {[
                'Never stretch, skew, or rotate — scale proportionally only',
                'Minimum height: 24 px for the icon mark',
                'Maintain clear space equal to 1× the icon height on all sides',
                "Don't recolor — use one of the four approved variants above",
                "Don't apply drop-shadows, glows, gradients, or effects",
              ].map((rule) => (
                <li key={rule} className="flex items-start gap-2 font-mono text-xs text-[#1C1C2E]">
                  <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border border-[#C0544A] font-black text-[7px] text-[#C0544A]">
                    ✕
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ── COLORS ────────────────────────────────────────────────────────── */}
        <Section label="02 · Colors">
          <div className="space-y-8">
            <ColorGroup label="Brand core"       swatches={COLORS.brand}      cols="grid-cols-2 sm:grid-cols-4" />
            <ColorGroup label="Landing accents"  swatches={COLORS.accents}    cols="grid-cols-2 sm:grid-cols-5" />
            <ColorGroup label="UI tokens · light" swatches={COLORS.ui}         cols="grid-cols-2 sm:grid-cols-4" />
            <ColorGroup label="Difficulty scale" swatches={COLORS.difficulty} cols="grid-cols-2 sm:grid-cols-4" />
          </div>
        </Section>

        {/* ── TYPOGRAPHY ────────────────────────────────────────────────────── */}
        <Section label="03 · Typography">
          {/* Fonts */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FONTS.map((f) => (
              <div
                key={f.name}
                className="flex flex-col justify-between rounded-[0.85rem] border-[2px] border-[#E0DED8] bg-white px-5 py-4"
              >
                <p
                  className="text-[2rem] font-bold leading-tight text-[#1C1C2E]"
                  style={{ fontFamily: `var(${f.cssVar})` }}
                >
                  {f.sample}
                </p>
                <div className="mt-3 border-t border-[#E0DED8] pt-3">
                  <p className="text-[12px] font-black text-[#1C1C2E]" style={{ fontFamily: `var(${f.cssVar})` }}>
                    {f.name}
                  </p>
                  <p className="font-mono text-[10px] text-[#67606a]">{f.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Type scale */}
          <div className="space-y-2">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-5 rounded-[0.85rem] border-[2px] border-[#E0DED8] bg-white px-5 py-4"
              >
                <div className="w-24 shrink-0">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#67606a]">
                    {t.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] text-[#67606a]/60">{t.meta}</p>
                </div>
                <p className={cn(t.cls, 'text-[#1C1C2E] min-w-0')}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── VOICE & TONE ──────────────────────────────────────────────────── */}
        <Section label="04 · Voice &amp; tone">
          <div className="grid gap-4 sm:grid-cols-3">
            {VOICE.map((v) => (
              <div
                key={v.adj}
                className="rounded-[1.1rem] border-[2.5px] border-[#151515] bg-white p-5 shadow-[3px_3px_0_#151515]"
              >
                <p className="mb-4 text-lg font-black text-[#1C1C2E]">{v.adj}</p>
                <div className="space-y-2">
                  <div className="rounded-lg border border-[#4A9E6E]/40 bg-[#4A9E6E]/8 px-3 py-2">
                    <p className="mb-1 font-mono text-[9px] font-black uppercase tracking-widest text-[#4A9E6E]">
                      Do
                    </p>
                    <p className="font-mono text-[11px] leading-snug text-[#1C1C2E]">&ldquo;{v.do}&rdquo;</p>
                  </div>
                  <div className="rounded-lg border border-[#C0544A]/40 bg-[#C0544A]/8 px-3 py-2">
                    <p className="mb-1 font-mono text-[9px] font-black uppercase tracking-widest text-[#C0544A]">
                      Don&apos;t
                    </p>
                    <p className="font-mono text-[11px] leading-snug text-[#1C1C2E]">&ldquo;{v.dont}&rdquo;</p>
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

// ─── Logo card ────────────────────────────────────────────────────────────────

function LogoCard({ name, file, bg, wide }: { name: string; file: string; bg: string; wide: boolean }) {
  return (
    <div>
      <div
        className="flex items-center justify-center rounded-[1.1rem] border-[2.5px] border-[#151515] p-6 shadow-[3px_3px_0_#151515]"
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
        <p className="font-mono text-[10px] font-bold text-[#67606a]">{name}</p>
        <a
          href={file}
          download
          className="font-mono text-[10px] font-bold text-[#151515] underline decoration-dotted hover:no-underline"
        >
          SVG ↓
        </a>
      </div>
    </div>
  )
}
