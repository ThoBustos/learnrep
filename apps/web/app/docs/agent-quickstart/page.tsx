import { H1, H2, Lead, P, Pre, Code } from '../prose'

export default function AgentQuickstartPage() {
  return (
    <>
      <H1>Agent Quickstart</H1>
      <Lead>How to wire LearnRep into Claude Code or any LLM harness in 3 steps.</Lead>

      <H2>1. Add to your system prompt</H2>
      <P>
        Copy the block from <a href="/docs/llm/config" className="font-bold underline decoration-2">Copy-paste config</a> into
        your <Code>CLAUDE.md</Code>, <Code>.cursorrules</Code>, or global system prompt.
        This tells the agent what commands are available and when to use them.
      </P>

      <H2>2. The user installs the CLI</H2>
      <Pre>{`npm install -g learnrep
lr login`}</Pre>
      <P>
        The user runs this once. After that, <Code>lr</Code> is available in any shell the agent can access.
      </P>

      <H2>3. The agent generates a quiz</H2>
      <P>At the end of a session, the agent calls:</P>
      <Pre>{`lr generate --focus "useCallback vs useMemo" --difficulty medium --count 5`}</Pre>
      <P>Or pipes session content directly:</P>
      <Pre>{`cat session.md | lr generate --difficulty hard --types multiple-choice,open-ended`}</Pre>
      <P>
        LearnRep returns a URL. The agent surfaces it to the user: <em>"Quiz ready — test yourself: [url]"</em>
      </P>

      <H2>That's it</H2>
      <P>
        No auth step in the agent. No API key needed in the harness. The CLI handles auth via the
        user's stored token. The agent just calls <Code>lr generate</Code> like any shell command.
      </P>
      <P>
        For a zero-shell path, see <a href="/docs/mcp" className="font-bold underline decoration-2">MCP integration</a>.
      </P>
    </>
  )
}
