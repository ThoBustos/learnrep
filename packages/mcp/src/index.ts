#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { z } from 'zod'

const API_BASE = (process.env.LEARNREP_API_URL ?? 'https://learnrep.ideabench.ai').replace(/\/$/, '')
const CONFIG_DIR = path.join(os.homedir(), '.learnrep')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')
const LEGACY_CONFIG_FILE = path.join(os.homedir(), '.config', 'learnrep', 'config.json')

const DifficultySchema = z.enum(['easy', 'medium', 'hard', 'expert'])
const QuestionTypeSchema = z.enum(['multiple-choice', 'multi-select', 'open-ended', 'code-writing'])
const GenerateQuizOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  shareCode: z.string().optional(),
  shareUrl: z.string(),
})
const ShareQuizOutputSchema = z.object({
  id: z.string(),
  isPublic: z.boolean(),
  shareUrl: z.string(),
})
const StatsOutputSchema = z.object({
  quizzesTaken: z.number(),
  topicsExplored: z.number(),
  quizzesGenerated: z.number(),
  avgScore: z.number().nullable(),
  streak: z.number(),
  avgImprovement: z.number().nullable(),
})

type AuthConfig = {
  access_token: string
  refresh_token: string
  expires_at: number
  user: { id: string; email: string }
  supabaseUrl?: string
  supabaseAnonKey?: string
}

type JsonObject = Record<string, unknown>

function readConfig(): AuthConfig | null {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) as AuthConfig
  } catch {}

  try {
    return JSON.parse(fs.readFileSync(LEGACY_CONFIG_FILE, 'utf8')) as AuthConfig
  } catch {
    return null
  }
}

function writeConfig(config: AuthConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 })
}

async function fetchSupabaseConfig(): Promise<{ supabaseUrl: string; supabaseAnonKey: string }> {
  const res = await fetch(`${API_BASE}/api/config`)
  if (!res.ok) {
    throw new Error(`Could not fetch LearnRep config from ${API_BASE}`)
  }
  return res.json() as Promise<{ supabaseUrl: string; supabaseAnonKey: string }>
}

async function getValidToken(): Promise<string> {
  const config = readConfig()
  if (!config) {
    throw new Error('Not logged in. Run: lr login')
  }

  if (Date.now() / 1000 < config.expires_at - 60) {
    return config.access_token
  }

  let supabaseUrl = config.supabaseUrl
  let supabaseAnonKey = config.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    const fetched = await fetchSupabaseConfig()
    supabaseUrl = fetched.supabaseUrl
    supabaseAnonKey = fetched.supabaseAnonKey
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession: false },
  })
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: config.refresh_token })
  if (error || !data.session) {
    throw new Error('Session expired. Run: lr login')
  }

  const updated: AuthConfig = {
    ...config,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at ?? 0,
    supabaseUrl,
    supabaseAnonKey,
  }
  writeConfig(updated)
  return updated.access_token
}

async function apiRequest<T>(pathName: string, init: RequestInit = {}): Promise<T> {
  const token = await getValidToken()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_BASE}${pathName}`, { ...init, headers })
  if (res.status === 401) {
    throw new Error('Session expired. Run: lr login')
  }
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text || res.statusText)
  }
  return res.json() as Promise<T>
}

function toolText(text: string) {
  return { content: [{ type: 'text' as const, text }] }
}

function toolJson(value: JsonObject) {
  return {
    structuredContent: value,
    content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
  }
}

function toolError(error: unknown) {
  return {
    isError: true,
    content: [{ type: 'text' as const, text: error instanceof Error ? error.message : 'Tool failed' }],
  }
}

const server = new McpServer({
  name: 'learnrep',
  version: '0.1.0',
})

server.registerTool(
  'generate_quiz',
  {
    title: 'Generate Quiz',
    description: 'Generate a LearnRep quiz from a topic or content string.',
    inputSchema: {
      topic: z.string().optional(),
      content: z.string().optional(),
      focus: z.string().optional(),
      difficulty: DifficultySchema.default('medium'),
      count: z.number().int().min(1).max(20).default(5),
      types: z.array(QuestionTypeSchema).default(['multiple-choice']),
    },
    outputSchema: GenerateQuizOutputSchema,
  },
  async ({ topic, content, focus, difficulty, count, types }) => {
    try {
      if (!topic?.trim() && !focus?.trim() && !content?.trim()) {
        throw new Error('topic, focus, or content is required')
      }

      const data = await apiRequest<z.infer<typeof GenerateQuizOutputSchema>>('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic?.trim() || undefined,
          content: content?.trim() || undefined,
          focus: focus?.trim() || undefined,
          difficulty,
          count,
          types,
          source: 'mcp',
        }),
      })
      return toolJson(data)
    } catch (error) {
      return toolError(error)
    }
  },
)

server.registerTool(
  'share_quiz',
  {
    title: 'Share Quiz',
    description: 'Make a quiz public and return its share URL.',
    inputSchema: {
      quizId: z.string().min(1),
    },
    outputSchema: ShareQuizOutputSchema,
  },
  async ({ quizId }) => {
    try {
      const data = await apiRequest<{ id: string; is_public: boolean }>(`/api/quiz/${encodeURIComponent(quizId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_public: true }),
      })
      return toolJson({
        id: data.id,
        isPublic: data.is_public,
        shareUrl: `${API_BASE}/quiz/${data.id}/take`,
      })
    } catch (error) {
      return toolError(error)
    }
  },
)

server.registerTool(
  'get_stats',
  {
    title: 'Get Stats',
    description: 'Return the current user LearnRep stats.',
    outputSchema: StatsOutputSchema,
  },
  async () => {
    try {
      const data = await apiRequest<z.infer<typeof StatsOutputSchema>>('/api/user/stats')
      return toolJson(data)
    } catch (error) {
      return toolError(error)
    }
  },
)

await server.connect(new StdioServerTransport())
