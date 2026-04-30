export type TerminalLine =
  | { type: 'prompt'; text: string }
  | { type: 'agent'; text: string }
  | { type: 'info'; text: string }
  | { type: 'success'; text: string }
  | { type: 'url'; text: string }
  | { type: 'gap' }

export const SEQUENCE: { delay: number; line: TerminalLine }[] = [
  { delay: 400,  line: { type: 'prompt',  text: '$ claude "quiz my team on react hooks"' } },
  { delay: 1000, line: { type: 'info',    text: 'Running learnrep...' } },
  { delay: 1600, line: { type: 'agent',   text: '> lr generate "react hooks" --questions 5' } },
  { delay: 2400, line: { type: 'gap' } },
  { delay: 2500, line: { type: 'success', text: '✓ React Hooks: State, Effects, and Closures' } },
  { delay: 3000, line: { type: 'url',     text: 'https://learnrep.ai/quiz/abc123/take' } },
  { delay: 3600, line: { type: 'gap' } },
  { delay: 3700, line: { type: 'info',    text: "Share with your team -> they'll see who scored highest" } },
]
