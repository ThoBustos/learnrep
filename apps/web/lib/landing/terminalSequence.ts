export type TerminalLine =
  | { type: 'shell'; text: string }
  | { type: 'output'; text: string }
  | { type: 'logo'; text: string }
  | { type: 'meta'; text: string }
  | { type: 'separator' }
  | { type: 'prompt'; text: string }
  | { type: 'step'; text: string }
  | { type: 'success'; text: string }
  | { type: 'url'; text: string }
  | { type: 'gap' }

const SEP = '─'.repeat(54)

export const SEQUENCE: { delay: number; line: TerminalLine }[] = [
  // ── Install ──────────────────────────────────────────────
  { delay: 400,  line: { type: 'shell',   text: 'npm install -g learnrep' } },
  { delay: 1100, line: { type: 'output',  text: 'added 47 packages in 2.1s' } },
  { delay: 1400, line: { type: 'gap' } },

  // ── Launch Claude Code ────────────────────────────────────
  { delay: 1800, line: { type: 'shell',   text: 'claude --dangerously-skip-permissions' } },
  { delay: 2200, line: { type: 'gap' } },
  { delay: 2300, line: { type: 'logo',    text: ' ▐▛███▜▌   Claude Code v2.1.123' } },
  { delay: 2380, line: { type: 'logo',    text: '▝▜█████▛▘  Sonnet 4.6 · Claude Team' } },
  { delay: 2460, line: { type: 'logo',    text: '  ▘▘ ▝▝    ~/projects/openyoko' } },
  { delay: 2600, line: { type: 'gap' } },
  { delay: 2700, line: { type: 'separator' } },
  { delay: 2750, line: { type: 'meta',    text: '  Sonnet 4.6  openyoko  ⎇ main' } },
  { delay: 2800, line: { type: 'meta',    text: '  ⏵⏵ bypass permissions on' } },
  { delay: 2850, line: { type: 'separator' } },
  { delay: 2950, line: { type: 'gap' } },

  // ── Use case 1: quiz on a PR ──────────────────────────────
  { delay: 3400, line: { type: 'prompt',  text: 'quiz my team on github.com/acme/api/pull/247' } },
  { delay: 3900, line: { type: 'gap' } },
  { delay: 4100, line: { type: 'step',    text: '● Reading PR diff… 847 lines changed' } },
  { delay: 4800, line: { type: 'step',    text: '● Generating 5 questions' } },
  { delay: 5400, line: { type: 'step',    text: '● Publishing quiz' } },
  { delay: 6000, line: { type: 'gap' } },
  { delay: 6100, line: { type: 'success', text: '✓ "Auth Middleware Refactor" — quiz ready' } },
  { delay: 6350, line: { type: 'url',     text: '  → learnrep.ai/quiz/x7k2p/take' } },
  { delay: 6800, line: { type: 'gap' } },

  // ── Use case 2: quiz from an article ─────────────────────
  { delay: 7300, line: { type: 'prompt',  text: 'quiz my team on thenewstack.io/why-mcp-won' } },
  { delay: 7800, line: { type: 'gap' } },
  { delay: 8000, line: { type: 'step',    text: '● Fetching article…' } },
  { delay: 8600, line: { type: 'step',    text: '● Extracting key concepts' } },
  { delay: 9100, line: { type: 'step',    text: '● Generating 5 questions' } },
  { delay: 9700, line: { type: 'gap' } },
  { delay: 9800, line: { type: 'success', text: '✓ "Why the Model Context Protocol Won" — quiz ready' } },
  { delay: 10050, line: { type: 'url',    text: '  → learnrep.ai/quiz/m9n3q/take' } },
  { delay: 10500, line: { type: 'gap' } },

  // ── Use case 3: sprint summary ────────────────────────────
  { delay: 11000, line: { type: 'prompt', text: "quiz my team on what we shipped this sprint" } },
  { delay: 11500, line: { type: 'gap' } },
  { delay: 11700, line: { type: 'step',   text: '● Scanning git log since Monday…' } },
  { delay: 12200, line: { type: 'step',   text: '● Generating 5 questions' } },
  { delay: 12700, line: { type: 'gap' } },
  { delay: 12800, line: { type: 'success', text: '✓ "Sprint 42 — What We Shipped" — quiz ready' } },
  { delay: 13050, line: { type: 'url',    text: '  → learnrep.ai/quiz/p4q8r/take' } },
]

export const SEQUENCE_DURATION = 13050
