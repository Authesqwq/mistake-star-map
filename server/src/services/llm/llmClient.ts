import type { LlmChatRequest, LlmChatResponse } from './llmTypes'
import { getLlmConfig } from './llmConfig'
import {
  LlmTimeoutError,
  LlmProviderError,
  LlmResponseParseError,
} from './llmErrors'
import { withTimeout } from '../../utils/timeout'

export async function chatCompletion(
  request: LlmChatRequest
): Promise<LlmChatResponse> {
  const config = getLlmConfig()
  const startTime = Date.now()

  const timeoutMs = request.timeoutMs ?? config.timeoutMs
  const temperature = request.temperature ?? config.temperature
  const maxRetries = config.maxRetries

  const body = JSON.stringify({
    model: config.model,
    messages: request.messages,
    temperature,
    ...(request.maxTokens && { max_tokens: request.maxTokens }),
  })

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await makeRequest(config.baseUrl, config.apiKey, body, timeoutMs)
      return await parseResponse(response, config.model, startTime)
    } catch (err) {
      lastError = err as Error
      if (!isRetryable(err) || attempt === maxRetries) throw err
      const delay = Math.min(1000 * Math.pow(2, attempt), 4000)
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[llm] retry ${attempt + 1}/${maxRetries} after ${delay}ms (${(err as Error).message})`
        )
      }
      await sleep(delay)
    }
  }

  throw lastError ?? new LlmProviderError('Unexpected error in LLM request')
}

async function makeRequest(
  baseUrl: string,
  apiKey: string,
  body: string,
  timeoutMs: number
): Promise<Response> {
  const url = `${baseUrl}/chat/completions`

  return withTimeout(
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    }),
    timeoutMs,
    () => new LlmTimeoutError(timeoutMs)
  )
}

async function parseResponse(
  response: Response,
  model: string,
  startTime: number
): Promise<LlmChatResponse> {
  if (!response.ok) {
    throw new LlmProviderError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    )
  }

  let data: Record<string, unknown>
  try {
    data = (await response.json()) as Record<string, unknown>
  } catch {
    throw new LlmResponseParseError('Failed to parse response JSON')
  }

  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined
  if (!choices || choices.length === 0) {
    throw new LlmResponseParseError('No choices in response')
  }

  const content = choices[0]?.message?.content
  if (typeof content !== 'string') {
    throw new LlmResponseParseError('Empty or invalid message content')
  }

  const usageData = data.usage as
    | { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
    | undefined

  return {
    content,
    model: (data.model as string) || model,
    latencyMs: Date.now() - startTime,
    usage: usageData
      ? {
          promptTokens: usageData.prompt_tokens,
          completionTokens: usageData.completion_tokens,
          totalTokens: usageData.total_tokens,
        }
      : undefined,
    raw: data,
  }
}

function isRetryable(err: unknown): boolean {
  if (err instanceof LlmTimeoutError) return true
  if (err instanceof LlmProviderError) {
    const status = err.status
    if (status && (status === 429 || (status >= 500 && status < 600))) return true
    return false
  }
  return true // network errors, etc.
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
