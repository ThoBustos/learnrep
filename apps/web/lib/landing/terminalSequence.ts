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

export const SEQUENCE: { delay: number; line: TerminalLine }[] = [
  // ── Install ──────────────────────────────────────────────
  { delay: 600,   line: { type: 'shell',   text: 'npm install -g learnrep' } },
  { delay: 2000,  line: { type: 'output',  text: 'added 47 packages in 2.1s' } },
  { delay: 2500,  line: { type: 'gap' } },

  // ── Launch Claude Code ────────────────────────────────────
  { delay: 3500,  line: { type: 'shell',   text: 'claude --dangerously-skip-permissions' } },
  { delay: 4100,  line: { type: 'gap' } },
  { delay: 4300,  line: { type: 'logo',    text: '◆  Claude Code v2.1.123' } },
  { delay: 4600,  line: { type: 'logo',    text: '   Sonnet 4.6 · Claude Team' } },
  { delay: 4900,  line: { type: 'logo',    text: '   ~/projects/openyoko' } },
  { delay: 5200,  line: { type: 'gap' } },
  { delay: 5400,  line: { type: 'separator' } },
  { delay: 5500,  line: { type: 'meta',    text: '  Sonnet 4.6  openyoko  ⎇ main' } },
  { delay: 5700,  line: { type: 'meta',    text: '  ⏵⏵ bypass permissions on' } },
  { delay: 5900,  line: { type: 'separator' } },
  { delay: 6200,  line: { type: 'gap' } },

  // ── Use case 1: quiz on a PR ──────────────────────────────
  { delay: 7200,  line: { type: 'prompt',  text: 'quiz my team on github.com/acme/api/pull/247' } },
  { delay: 7900,  line: { type: 'gap' } },
  { delay: 8200,  line: { type: 'step',    text: '● Reading PR diff… 847 lines changed' } },
  { delay: 9400,  line: { type: 'step',    text: '● Generating 5 questions' } },
  { delay: 10600, line: { type: 'step',    text: '● Publishing quiz' } },
  { delay: 11600, line: { type: 'gap' } },
  { delay: 11900, line: { type: 'success', text: '✓ "Auth Middleware Refactor" — quiz ready' } },
  { delay: 12500, line: { type: 'url',     text: '  → learnrep.ideabench.ai/quiz/x7k2p/take' } },
  // 5s pause
  { delay: 17500, line: { type: 'gap' } },

  // ── Use case 2: quiz from an article ─────────────────────
  { delay: 18500, line: { type: 'prompt',  text: 'quiz my team on thenewstack.io/why-mcp-won' } },
  { delay: 19200, line: { type: 'gap' } },
  { delay: 19500, line: { type: 'step',    text: '● Fetching article…' } },
  { delay: 20700, line: { type: 'step',    text: '● Extracting key concepts' } },
  { delay: 21900, line: { type: 'step',    text: '● Generating 5 questions' } },
  { delay: 22900, line: { type: 'gap' } },
  { delay: 23200, line: { type: 'success', text: '✓ "Why the Model Context Protocol Won" — quiz ready' } },
  { delay: 23800, line: { type: 'url',     text: '  → learnrep.ideabench.ai/quiz/m9n3q/take' } },
  // 5s pause
  { delay: 28800, line: { type: 'gap' } },

  // ── Use case 3: sprint summary ────────────────────────────
  { delay: 29800, line: { type: 'prompt',  text: "quiz my team on what we shipped this sprint" } },
  { delay: 30500, line: { type: 'gap' } },
  { delay: 30800, line: { type: 'step',    text: '● Scanning git log since Monday…' } },
  { delay: 32000, line: { type: 'step',    text: '● Generating 5 questions' } },
  { delay: 33000, line: { type: 'gap' } },
  { delay: 33300, line: { type: 'success', text: '✓ "Sprint 42 — What We Shipped" — quiz ready' } },
  { delay: 33900, line: { type: 'url',     text: '  → learnrep.ideabench.ai/quiz/p4q8r/take' } },
]

export const SEQUENCE_DURATION = 33900
