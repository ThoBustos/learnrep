import { H1, H2, Lead, P, Pre } from '../../prose'

export default function SharePage() {
  return (
    <>
      <H1>lr share</H1>
      <Lead>Make a quiz public and get the share link.</Lead>

      <H2>Usage</H2>
      <Pre>{`lr share <quiz-id>`}</Pre>
      <P>Makes the quiz public and prints the share link. Use this after <code className="font-mono text-xs font-bold">lr generate</code>.</P>

      <H2>Example</H2>
      <Pre>{`lr share abc123\n# https://learnrep.ai/quiz/abc123`}</Pre>
    </>
  )
}
