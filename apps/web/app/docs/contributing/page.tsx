import { H1, H2, Lead, P, Pre } from '../prose'

export default function ContributingPage() {
  return (
    <>
      <H1>Contributing</H1>
      <Lead>LearnRep is open source and welcomes contributions.</Lead>

      <P>
        LearnRep is MIT licensed. The repo is at{' '}
        <a
          href="https://github.com/ThoBustos/learnrep"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline decoration-2"
        >
          github.com/ThoBustos/learnrep
        </a>.
      </P>

      <H2>Structure</H2>
      <Pre>{`apps/
  cli/       CLI (Node.js, Commander)
  web/       Next.js app
packages/
  core/      Generator, evaluator, types (shared)`}</Pre>

      <H2>Running locally</H2>
      <Pre>{`pnpm install\npnpm dev`}</Pre>

      <H2>Issues and PRs</H2>
      <P>
        Open issues or PRs on GitHub. Bug reports, feature requests, and doc improvements are all welcome.
      </P>
    </>
  )
}
