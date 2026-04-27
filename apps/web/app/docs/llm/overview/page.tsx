import Link from 'next/link'
import { H1, Lead, P, Ul, Li, Code } from '../../prose'

export default function LlmOverviewPage() {
  return (
    <>
      <H1>Using with LLM Apps</H1>
      <Lead>LearnRep is built to be called by agents, not just humans.</Lead>

      <P>
        The intended flow: the user works with an LLM agent — coding, reading docs, reviewing a PR.
        At a natural pause, the agent calls <Code>lr generate</Code> and drops a quiz link into the
        conversation. The user clicks it, gets scored, builds retention.
      </P>

      <P>The agent needs two things:</P>
      <Ul>
        <Li>The system prompt block from <Link href="/docs/llm/config" className="font-bold underline decoration-2">Copy-paste config</Link> so it knows the commands</Li>
        <Li>The user to have run <Code>lr login</Code> once on their machine</Li>
      </Ul>

      <P>
        After that, the agent calls <Code>lr generate</Code> like any shell command. No API key in
        the harness. No extra auth. The CLI uses the user&apos;s stored token.
      </P>

      <P>
        For harnesses that support MCP, see <Link href="/docs/mcp" className="font-bold underline decoration-2">MCP integration</Link> for
        a zero-shell alternative.
      </P>
    </>
  )
}
