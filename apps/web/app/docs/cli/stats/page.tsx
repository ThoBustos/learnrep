import { H1, H2, Lead, P, Pre, Ul, Li } from '../../prose'

export default function StatsPage() {
  return (
    <>
      <H1>lr stats</H1>
      <Lead>Print your learning stats to the terminal.</Lead>

      <H2>Usage</H2>
      <Pre>{`lr stats`}</Pre>

      <H2>Output</H2>
      <Pre>{`Streak:          12 days
Topics mastered: 4
Avg improvement: +14%
Quizzes taken:   23`}</Pre>

      <H2>Definitions</H2>
      <Ul>
        <Li><strong>Streak</strong> — consecutive days with at least one completed quiz attempt.</Li>
        <Li><strong>Topics mastered</strong> — topics where you scored 80% or above on at least one attempt.</Li>
        <Li><strong>Avg improvement</strong> — average of (latest score minus first score) across quizzes with two or more attempts.</Li>
        <Li><strong>Quizzes taken</strong> — distinct quizzes attempted, not total attempt count.</Li>
      </Ul>
    </>
  )
}
