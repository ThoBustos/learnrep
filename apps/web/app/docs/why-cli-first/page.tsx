import { H1, Lead, P } from '../prose'

export default function WhyCliFirstPage() {
  return (
    <>
      <H1>Why CLI-first</H1>
      <Lead>The terminal is where agents already live.</Lead>

      <P>
        LLM harnesses like Claude Code, Cursor, and Windsurf all have shell access. A CLI command
        is the lowest-friction integration possible — no SDK, no API key in the harness config, no
        extra auth flow. The agent just runs <code className="font-mono text-xs font-bold">lr generate</code> and gets back a URL.
      </P>
      <P>
        The CLI is also composable. Pipe in any text, script it, or call it from a post-session
        hook. Because it reads from stdin, session transcripts, docs, and code files all work as
        input with zero preprocessing.
      </P>
      <P>
        The web app and MCP server extend the CLI — they don't replace it. The MCP path is cleaner
        for harnesses that support tool calls natively, but the CLI works everywhere.
      </P>
    </>
  )
}
