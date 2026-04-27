import { H1, H2, Lead, P, Pre, Table, Th, Td } from '../../prose'

export default function GeneratePage() {
  return (
    <>
      <H1>lr generate</H1>
      <Lead>Generate a quiz from a topic or file content.</Lead>

      <H2>Usage</H2>
      <Pre>{`lr generate [topic] [flags]`}</Pre>

      <H2>Flags</H2>
      <Table>
        <thead>
          <tr>
            <Th>Flag</Th>
            <Th>Type</Th>
            <Th>Default</Th>
            <Th>Description</Th>
          </tr>
        </thead>
        <tbody>
          {[
            ['--focus', 'string', '--', 'Specific aspect to focus on'],
            ['--difficulty', 'enum', 'medium', 'easy, medium, hard, expert'],
            ['--count', 'number', '5', 'Questions to generate (1-20)'],
            ['--types', 'list', 'multiple-choice', 'Comma-separated question types'],
            ['--content', 'file/stdin', '--', 'File path or - for stdin'],
          ].map(([flag, type, def, desc]) => (
            <tr key={flag}>
              <Td><code className="font-mono text-xs font-bold">{flag}</code></Td>
              <Td>{type}</Td>
              <Td>{def}</Td>
              <Td>{desc}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <P>Question types: <code className="font-mono text-xs font-bold">multiple-choice</code>, <code className="font-mono text-xs font-bold">multi-select</code>, <code className="font-mono text-xs font-bold">open-ended</code>, <code className="font-mono text-xs font-bold">code-writing</code></P>

      <H2>Examples</H2>
      <Pre>{`lr generate "react hooks"
lr generate "typescript generics" --difficulty hard --count 10
lr generate --focus "useCallback vs useMemo" --difficulty hard
lr generate --content session.md --types multiple-choice,open-ended
cat transcript.md | lr generate --focus "error handling"`}</Pre>

      <H2>Output</H2>
      <Pre>{`Quiz created: https://learnrep.ai/quiz/abc123
Share: lr share abc123`}</Pre>
    </>
  )
}
