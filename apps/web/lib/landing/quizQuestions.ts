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
    prompt: 'In React, what does the `key` prop on list items primarily help with?',
    options: [
      'Styling list items independently',
      'Reconciling which items changed between renders',
      'Creating unique IDs for form inputs',
      'Registering event handlers on each item',
    ],
    correctIndex: 1,
    feedback:
      "React uses `key` to track list items across re-renders. Without it, React can't tell which items were added, removed, or reordered, leading to subtle bugs and performance issues.",
  },
  {
    id: 2,
    prompt: 'Which Git command shows who last modified each line of a file?',
    options: [
      'git log --lines',
      'git diff --author',
      'git blame',
      'git show --per-line',
    ],
    correctIndex: 2,
    feedback:
      '`git blame <file>` annotates each line with the commit hash, author, and timestamp of the last change. Essential for tracking down when a bug was introduced.',
  },
  {
    id: 3,
    prompt: 'What does `npm ci` do differently from `npm install`?',
    options: [
      'Only installs devDependencies',
      "Installs from package-lock.json without modifying it",
      'Clears the npm cache before installing',
      'Runs install in a temporary directory',
    ],
    correctIndex: 1,
    feedback:
      "`npm ci` reads exactly from package-lock.json and errors if it doesn't match package.json. Reproducible, strict, and faster. The right command for CI/CD.",
  },
]
