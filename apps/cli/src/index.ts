#!/usr/bin/env node
import { Command } from 'commander'
import * as fs from 'fs'
import * as path from 'path'

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

    if (opts.content) {
      if (opts.content === '-') {
        content = fs.readFileSync('/dev/stdin', 'utf-8')
      } else {
        const resolved = path.resolve(opts.content)
        if (!fs.existsSync(resolved)) {
          console.error(`File not found: ${resolved}`)
          process.exit(1)
        }
        content = fs.readFileSync(resolved, 'utf-8')
      }
    }

    if (!topic && !content) {
      console.error('Provide a topic or use --content <file>')
      process.exit(1)
    }

    const count = Math.min(20, Math.max(1, parseInt(opts.count, 10) || 5))
    const types = opts.types.split(',').map((t) => t.trim())
    const difficulty = ['easy', 'medium', 'hard', 'expert'].includes(opts.difficulty)
      ? opts.difficulty
      : 'medium'

    console.log(`Generating ${count} ${difficulty} question(s) on "${topic ?? 'content'}"...`)
    if (opts.focus) console.log(`Focus: ${opts.focus}`)
    if (types.length > 1 || types[0] !== 'multiple-choice') console.log(`Types: ${types.join(', ')}`)

    // TODO: call API once auth is wired
    console.log('\nQuiz created: https://learnrep.ai/quiz/mock-id')
    console.log('Share: lr share mock-id')
  })

program
  .command('share <quiz-id>')
  .description('Make a quiz public and copy the share link to clipboard')
  .action((quizId: string) => {
    const url = `https://learnrep.ai/quiz/${quizId}`
    console.log(`Share link: ${url}`)
    // clipboard copy requires platform-specific tooling; skip in initial release
    console.log('Link ready to share.')
  })

program
  .command('stats')
  .description('Print your streak, topics mastered, and avg improvement')
  .action(() => {
    // TODO: fetch from API once auth is wired
    console.log('Streak:         12 days')
    console.log('Topics mastered: 4')
    console.log('Avg improvement: +14%')
    console.log('Quizzes taken:  23')
  })

program
  .command('login')
  .description('Log in via browser OAuth and store token at ~/.learnrep/config.json')
  .action(() => {
    console.log('Opening browser for login...')
    // TODO: open OAuth URL and poll for token
  })

program
  .command('logout')
  .description('Clear stored token')
  .action(() => {
    const configPath = `${process.env.HOME}/.learnrep/config.json`
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath)
      console.log('Logged out.')
    } else {
      console.log('Not logged in.')
    }
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
