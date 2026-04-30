export type QuestionDef = {
  id: number
  prompt: string
  options: string[]
  correctIndex: number
  feedback: string
}

export const QUESTIONS: QuestionDef[] = [
  {
    id: 1,
    prompt: "In AI development, what is an 'agent harness'?",
    options: [
      'A safety vest for robot arms',
      'The repo where you store your .env',
      'Everything around the model: tools, prompts, context, evals',
      "The PM's Jira board for sprint planning",
    ],
    correctIndex: 2,
    feedback:
      "The harness is everything except the model itself. Tools, system prompts, context management, eval loops. That's what actually ships. \"2025 was agents. 2026 is agent harnesses.\"",
  },
  {
    id: 2,
    prompt: "Your AI initiative is 6 months in. Leadership asks for ROI. Which metric goes on the slide?",
    options: [
      'Revenue unlocked by AI features',
      'New customers retained by the product',
      'Customer problems eliminated per week',
      'Tokens consumed',
    ],
    correctIndex: 3,
    feedback:
      "Tokens consumed. Not revenue, not retained users, not problems solved — tokens. It's the only number that goes up automatically while you figure out if any of this actually works.",
  },
  {
    id: 3,
    prompt: 'Claude Code lets agents run commands without asking. The flag is called...',
    options: [
      '--trust-me-bro',
      '--dangerously-skip-permissions',
      '--no-confirm',
      '--yolo',
    ],
    correctIndex: 1,
    feedback:
      'Real flag, real name. --dangerously-skip-permissions ships in production Claude Code. Anthropic named it that on purpose. You can see it in the terminal above.',
  },
]
