import { H1, H2, Lead, P, Pre } from '../prose'

export default function QuickstartPage() {
  return (
    <>
      <H1>Getting Started</H1>
      <Lead>Install LearnRep and generate your first quiz in under a minute.</Lead>

      <H2>Install</H2>
      <Pre>{`npm install -g learnrep`}</Pre>

      <H2>Log in</H2>
      <Pre>{`lr login`}</Pre>
      <P>Opens a browser OAuth flow and stores your token at <code className="font-mono text-xs font-bold">~/.learnrep/config.json</code>.</P>

      <H2>Generate your first quiz</H2>
      <Pre>{`lr generate "react hooks"`}</Pre>
      <P>LearnRep generates 5 multiple-choice questions and returns a link you can open or share.</P>

      <H2>Try it with your own content</H2>
      <Pre>{`cat my-notes.md | lr generate --focus "async patterns" --difficulty hard`}</Pre>

      <H2>Share a quiz</H2>
      <Pre>{`lr share <quiz-id>`}</Pre>
      <P>Makes the quiz public and outputs the share link.</P>
    </>
  )
}
