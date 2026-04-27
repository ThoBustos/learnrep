import { H1, H2, Lead, P, Pre, Ul, Li, Code } from '../prose'

export default function McpPage() {
  return (
    <>
      <H1>MCP Integration</H1>
      <Lead>Call LearnRep as a native tool call — no shell required.</Lead>

      <P>
        The <Code>@learnrep/mcp</Code> server exposes the same functionality as the CLI via the
        Model Context Protocol. If your harness supports MCP (Claude Code, Cursor, Windsurf), you
        can call <Code>generate_quiz</Code> as a tool call instead of running a shell command.
      </P>

      <H2>Add to your MCP config</H2>
      <Pre>{`{
  "mcpServers": {
    "learnrep": {
      "command": "npx",
      "args": ["-y", "@learnrep/mcp"]
    }
  }
}`}</Pre>
      <P>For Claude Code, add this to <Code>~/.claude/settings.json</Code> under <Code>mcpServers</Code>.</P>

      <H2>Available tools</H2>
      <Ul>
        <Li><Code>generate_quiz</Code> — generate a quiz from a topic or content string</Li>
        <Li><Code>share_quiz</Code> — make a quiz public and return the share URL</Li>
        <Li><Code>get_stats</Code> — return the user's streak, topics mastered, and avg improvement</Li>
      </Ul>

      <H2>generate_quiz parameters</H2>
      <Pre>{`{
  "topic": "react hooks",           // string, optional if content provided
  "content": "...",                 // string, optional — raw text to quiz on
  "focus": "useCallback vs useMemo",// string, optional
  "difficulty": "medium",           // easy | medium | hard | expert
  "count": 5,                       // number 1-20
  "types": ["multiple-choice"]      // array of question types
}`}</Pre>

      <H2>When to use MCP vs CLI</H2>
      <Ul>
        <Li>MCP — harness already has MCP support; cleaner tool-call interface; no shell dependency</Li>
        <Li>CLI — simpler setup; works in any environment with a shell; easier to script</Li>
      </Ul>

      <P>Both paths produce identical output. Use whichever fits your setup.</P>
    </>
  )
}
