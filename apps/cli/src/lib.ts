import * as fs from 'node:fs'
import * as path from 'node:path'

export const VALID_DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'] as const

export function clampQuestionCount(value: string): number {
  return Math.min(20, Math.max(1, parseInt(value, 10) || 5))
}

export function normalizeDifficulty(value: string): string {
  return VALID_DIFFICULTIES.includes(value as (typeof VALID_DIFFICULTIES)[number]) ? value : 'medium'
}

export function parseTypes(value: string): string[] {
  return value.split(',').map((type) => type.trim()).filter(Boolean)
}

export function readContentInput(contentPath?: string): string | undefined {
  if (!contentPath) return undefined

  if (contentPath === '-') {
    return fs.readFileSync('/dev/stdin', 'utf-8')
  }

  const resolved = path.resolve(contentPath)
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`)
  }

  return fs.readFileSync(resolved, 'utf-8')
}

export function validateGenerateInput(topic: string | undefined, content: string | undefined): void {
  if (!topic && !content) {
    throw new Error('Provide a topic or use --content <file>')
  }
}
