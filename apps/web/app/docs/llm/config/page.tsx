import { H1, H2, Lead, P, Pre, Code } from '../../prose'

export default function LlmConfigPage() {
  return (
    <>
      <H1>Copy-paste Config</H1>
      <Lead>Drop this into your system prompt and the agent knows what to do.</Lead>

      <H2>System prompt block</H2>
      <Pre>{`LearnRep CLI is available as \`lr\`. Use it to generate quizzes after learning sessions.

WHEN TO USE
- After explaining a concept, architecture, or debugging fix in depth
- When the user has just read or worked through unfamiliar material
- When the user asks to be quizzed or wants to retain something

HOW TO USE
Generate from a topic:
  lr generate "<topic>" [flags]

Generate from session content (preferred — better questions):
  cat <file> | lr generate --focus "<topic>" [flags]

Flags:
  --focus <string>      The specific aspect to focus on
  --difficulty <level>  easy | medium | hard | expert  (default: medium)
  --count <n>           Questions 1-20  (default: 5)
  --types <list>        multiple-choice,multi-select,open-ended,code-writing

After generating, share with the user:
  lr share <quiz-id>

PHRASING
Offer before generating: "Want me to make a quick quiz on [topic] to lock this in?"
After generating: "Quiz ready — test yourself: [url]"`}</Pre>

      <H2>Where to add it</H2>
      <P><strong>Claude Code</strong> — add to your project <Code>CLAUDE.md</Code> or global <Code>~/.claude/CLAUDE.md</Code>. A file called <Code>AGENTS.md</Code> at the repo root is also picked up automatically.</P>
      <P><strong>Cursor</strong> — add to <Code>.cursorrules</Code> in the project root or your global rules in Settings.</P>
      <P><strong>Windsurf</strong> — add to <Code>.windsurfrules</Code> or global rules in Settings.</P>

      <H2>Machine-readable schema</H2>
      <P>For programmatic discovery, run:</P>
      <Pre>{`lr help-json`}</Pre>
      <P>Returns a JSON object with every command, its flags, types, and default values.</P>
    </>
  )
}
