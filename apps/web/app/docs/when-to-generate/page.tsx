import { H1, H2, Lead, P, Pre, Ul, Li, Code } from '../prose'

export default function WhenToGeneratePage() {
  return (
    <>
      <H1>When to Generate a Quiz</H1>
      <Lead>Trigger conditions for LLM agents.</Lead>

      <P>
        An agent should offer to generate a quiz whenever the user has just absorbed new information.
        The goal is to strike while the context is hot — right after learning, not hours later.
      </P>

      <H2>Strong triggers</H2>
      <Ul>
        <Li>Session ends after working through an unfamiliar codebase or API</Li>
        <Li>User reads or is walked through a technical doc or README</Li>
        <Li>Agent explains a concept, pattern, or debug fix in depth</Li>
        <Li>User completes a code review with significant feedback</Li>
        <Li>User asks "can you quiz me on this?" or "help me retain this"</Li>
      </Ul>

      <H2>Weaker signals (offer, don't auto-generate)</H2>
      <Ul>
        <Li>Short Q&A with no clear learning arc</Li>
        <Li>Refactoring or mechanical changes with no new concepts</Li>
        <Li>User seems in a hurry or signals they want to move on</Li>
      </Ul>

      <H2>Suggested agent phrasing</H2>
      <Pre>{`"Want me to generate a quick quiz on [topic] to lock this in?"`}</Pre>
      <Pre>{`"I can quiz you on what we just covered — 5 questions, takes ~3 minutes."`}</Pre>

      <H2>Using session content as input</H2>
      <P>
        If the harness has access to the session transcript, pipe it directly. This produces better
        questions than a bare topic string because the generator sees the exact material covered.
      </P>
      <Pre>{`cat session-transcript.md | lr generate --focus "<specific topic>" --difficulty medium`}</Pre>

      <H2>Setting difficulty</H2>
      <Ul>
        <Li><Code>easy</Code> — user is new to the topic</Li>
        <Li><Code>medium</Code> — user has some context, default for most sessions</Li>
        <Li><Code>hard</Code> — user is experienced, just going deeper</Li>
        <Li><Code>expert</Code> — advanced practitioner, edge cases and internals</Li>
      </Ul>
    </>
  )
}
