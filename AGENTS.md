LearnRep CLI - LLM Usage Guide

Install: npm install -g learnrep
Auth: lr login (opens browser OAuth, stores token at ~/.learnrep/config.json)

---

COMMANDS

lr generate <topic> [flags]
  Generate a quiz on a topic or from file content. Saves to the user's LearnRep account.
  Returns: quiz URL

  Flags:
    --focus <string>      Specific aspect to focus on within the topic or content
    --difficulty <level>  easy | medium | hard | expert (default: medium)
    --count <n>           Number of questions 1-20 (default: 5)
    --types <list>        Comma-separated question types (default: multiple-choice)
                          Options: multiple-choice, multi-select, open-ended, code-writing
    --content <file>      Path to file, or - to read from stdin

lr share <quiz-id>
  Make a quiz public and output the share link.

lr stats
  Print streak, topics mastered, avg improvement, and quizzes taken to stdout.

lr login
  Open browser OAuth flow and store token at ~/.learnrep/config.json.

lr logout
  Clear stored token.

lr help-json
  Output structured JSON of all commands, params, and descriptions. Use this to
  programmatically discover the CLI schema.

---

EXAMPLES

lr generate "react hooks"
lr generate "typescript generics" --difficulty hard --count 10
lr generate --focus "useCallback vs useMemo" --difficulty hard
lr generate --content session.md --types multiple-choice,open-ended
cat transcript.md | lr generate --focus "error handling" --types code-writing
lr share abc123
lr stats

---

PIPING CONTENT

The --content flag accepts a file path or - for stdin. Use this to quiz on
session transcripts, documentation, code files, or any text content.

Example with Claude Code context:
  cat my-notes.md | lr generate --difficulty medium --count 8

---

QUESTION TYPES

multiple-choice   Single correct answer from 4 options. Binary scoring.
multi-select      Multiple correct answers. Partial credit: penalizes wrong selections.
open-ended        Free-text answer graded by AI. Returns score 0-100.
code-writing      User writes code graded by AI. Returns score 0-100 with feedback.

---

SCORE FORMAT

All commands that produce output write to stdout. Errors go to stderr.
Exit code 0 on success, 1 on error.
