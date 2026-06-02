export type LlmRole = 'system' | 'user' | 'assistant'

export interface LlmMessage {
  role: LlmRole
  content: string
}

export interface LlmChatRequest {
  messages: LlmMessage[]
  temperature?: number
  maxTokens?: number
  timeoutMs?: number
}

export interface LlmChatResponse {
  content: string
  model: string
  latencyMs: number
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
  raw?: unknown
}

export interface LlmProviderStatus {
  configured: boolean
  baseUrlConfigured: boolean
  modelConfigured: boolean
  apiKeyConfigured: boolean
  model?: string
  timeoutMs: number
  maxRetries: number
}

export interface LlmConfig {
  apiKey: string
  baseUrl: string
  model: string
  timeoutMs: number
  maxRetries: number
  temperature: number
}
