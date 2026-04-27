import { H1, H2, Lead, P, Pre } from '../../prose'

export default function LoginPage() {
  return (
    <>
      <H1>lr login / logout</H1>
      <Lead>Authenticate the CLI with your LearnRep account.</Lead>

      <H2>Login</H2>
      <Pre>{`lr login`}</Pre>
      <P>Opens a browser OAuth flow. On completion, stores your token at <code className="font-mono text-xs font-bold">~/.learnrep/config.json</code>.</P>

      <H2>Logout</H2>
      <Pre>{`lr logout`}</Pre>
      <P>Removes the stored token.</P>
    </>
  )
}
