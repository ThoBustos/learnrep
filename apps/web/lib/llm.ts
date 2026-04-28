import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import type { z } from 'zod'

const anthropic = new Anthropic()

const MODEL = 'claude-sonnet-4-6'

export async function callStructured<T>(
  schema: z.ZodType<T>,
  system: string,
  prompt: string,
  maxTokens = 8192,
): Promise<T> {
  const res = await anthropic.beta.messages.parse({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
    output_config: { format: zodOutputFormat(schema) },
  })
  if (res.parsed_output === null) {
    throw new Error('Structured output parsing returned null')
  }
  return res.parsed_output
}
