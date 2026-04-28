#!/usr/bin/env node
import { Command } from 'commander'
import {
  clampQuestionCount,
  normalizeDifficulty,
  parseTypes,
  readContentInput,
  validateGenerateInput,
} from './lib.js'
import { login, readConfig, writeConfig, clearConfig, openBrowser, getValidToken } from './auth.js'

const API_BASE = process.env.LEARNREP_API_URL ?? 'https://learnrep.ideabench.ai'

async function requireAuth(): Promise<string> {
  try {
    return await getValidToken(API_BASE)
  } catch (err) {
    console.error(err instanceof Error ? err.message : 'Not logged in. Run: lr login')
    process.exit(1)
  }
}

const program = new Command()

program
  .name('learnrep')
  .description('LearnRep CLI — generate and share quizzes from the terminal')
  .version('0.1.0')

program
  .command('generate [topic]')
  .description('Generate a quiz from a topic or file content')
  .option('--focus <string>', 'Specific aspect to focus on within the topic')
  .option('--difficulty <level>', 'easy | medium | hard | expert (default: medium)', 'medium')
  .option('--count <n>', 'Number of questions 1-20 (default: 5)', '5')
  .option('--types <list>', 'Question types: multiple-choice,multi-select,open-ended,code-writing', 'multiple-choice')
  .option('--content <file>', 'Path to file, or - to read from stdin')
  .action(async (topic: string | undefined, opts: {
    focus?: string
    difficulty: string
    count: string
    types: string
    content?: string
  }) => {
    let content: string | undefined

    try {
      content = readContentInput(opts.content)
      validateGenerateInput(topic, content)
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Generate failed')
      process.exit(1)
    }

    const count = clampQuestionCount(opts.count)
    const types = parseTypes(opts.types)
    const difficulty = normalizeDifficulty(opts.difficulty)

    const token = await requireAuth()

    process.stdout.write(`Generating ${count} ${difficulty} question(s) on "${topic ?? 'content'}"...\n`)

    let res: Response
    try {
      res = await fetch(`${API_BASE}/api/quiz/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: (topic ?? '').trim() || undefined,
          difficulty,
          source: 'cli',
        }),
      })
    } catch {
      console.error(`Could not reach ${API_BASE}. Is LEARNREP_API_URL set correctly?`)
      process.exit(1)
    }

    if (res.status === 401) {
      console.error('Session expired. Run: lr login')
      process.exit(1)
    }

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      console.error(`Generation failed: ${text}`)
      process.exit(1)
    }

    const data = await res.json() as { id: string; title: string; shareUrl: string }
    console.log(`\n${data.title}`)
    console.log(data.shareUrl)
    openBrowser(data.shareUrl)
  })

program
  .command('share <quiz-id>')
  .description('Print the share link for a quiz and open it in the browser')
  .action((quizId: string) => {
    const url = `${API_BASE}/quiz/${quizId}/take`
    console.log(url)
    openBrowser(url)
  })


program
  .command('stats')
  .description('Print your streak, topics mastered, and avg improvement')
  .action(async () => {
    const token = await requireAuth()

    let res: Response
    try {
      res = await fetch(`${API_BASE}/api/user/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      console.error(`Could not reach ${API_BASE}.`)
      process.exit(1)
    }

    if (res.status === 401) {
      console.error('Session expired. Run: lr login')
      process.exit(1)
    }

    if (!res.ok) {
      console.error('Stats not available yet.')
      process.exit(1)
    }

    const data = await res.json() as {
      streak: number
      topicsExplored: number
      quizzesTaken: number
      avgImprovement: string
    }
    console.log(`Streak:           ${data.streak} day${data.streak !== 1 ? 's' : ''}`)
    console.log(`Topics explored:  ${data.topicsExplored}`)
    console.log(`Quizzes taken:    ${data.quizzesTaken}`)
    console.log(`Avg improvement:  ${data.avgImprovement}`)
  })

program
  .command('login')
  .description('Authenticate via Google in the browser — stores token at ~/.config/learnrep/config.json')
  .action(async () => {
    const apiBase = process.env.LEARNREP_API_URL ?? 'http://localhost:3000'
    try {
      process.stdout.write(`Connecting to ${apiBase}...\n`)
      const config = await login(apiBase)
      writeConfig(config)
      console.log(`Logged in as ${config.user.email}`)
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Login failed')
      process.exit(1)
    }
  })

program
  .command('logout')
  .description('Clear stored credentials')
  .action(() => {
    clearConfig()
    console.log('Logged out.')
  })

program
  .command('whoami')
  .description('Show the currently authenticated user')
  .action(() => {
    const config = readConfig()
    if (!config) {
      console.log('Not logged in. Run: lr login')
      process.exit(1)
    }
    console.log(config.user.email)
  })

program
  .command('help-json')
  .description('Output structured JSON of all commands, params, and descriptions')
  .action(() => {
    const schema = {
      commands: program.commands.map((cmd) => ({
        name: cmd.name(),
        description: cmd.description(),
        arguments: cmd.registeredArguments?.map((a) => ({ name: a.name(), description: a.description })) ?? [],
        options: cmd.options.map((o) => ({
          flags: o.flags,
          description: o.description,
          defaultValue: o.defaultValue ?? null,
        })),
      })),
    }
    console.log(JSON.stringify(schema, null, 2))
  })

program.parse(process.argv)
