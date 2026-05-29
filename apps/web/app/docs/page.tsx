import Link from 'next/link'
import { H1, Lead, P, Ul, Li, Code } from './prose'

export default function DocsIntroPage() {
  return (
    <>
      <H1>LearnRep Docs</H1>
      <Lead>Documentation for LLM agents and developers integrating LearnRep.</Lead>

      <P>
        LearnRep is a quiz generation tool designed to be called by LLM harnesses. After a coding
        session, a doc review, or any learning moment, an agent calls <Code>lr generate</Code> and
        returns a quiz link to the user. No context switch. No manual steps.
      </P>

      <P>
        There are two integration paths:
      </P>
      <Ul>
        <Li><strong>CLI</strong> — shell commands via <Code>lr</Code>, usable from any agent that can run bash</Li>
        <Li><strong>MCP</strong> — native tool calls via the <Code>@learnrep/mcp</Code> server, no shell required</Li>
      </Ul>

      <P>
        The web app at learnrep.ai is where users take quizzes, track streaks, and review results.
        The agent generates; the human plays.
      </P>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/docs/agent-quickstart"
          className="border-[3px] border-[var(--lr-line)] bg-[var(--lr-ink)] px-5 py-2.5 text-sm font-black text-[var(--lr-yolk)] shadow-[3px_3px_0_var(--lr-tomato)] transition-transform hover:-translate-y-0.5"
        >
          Agent quickstart
        </Link>
        <Link
          href="/docs/when-to-generate"
          className="border-[3px] border-[var(--lr-line)] bg-white px-5 py-2.5 text-sm font-black shadow-[var(--lr-shadow-sm)] transition-transform hover:-translate-y-0.5"
        >
          When to generate
        </Link>
      </div>
    </>
  )
}
