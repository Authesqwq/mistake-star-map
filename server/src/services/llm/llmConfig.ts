import type { LlmProviderStatus, LlmConfig } from './llmTypes'
import { LlmConfigurationError } from './llmErrors'

export function getLlmProviderStatus(): LlmProviderStatus {
  const apiKeyConfigured = !!process.env.LLM_API_KEY
  const baseUrlConfigured = !!process.env.LLM_BASE_URL
  const modelConfigured = !!process.env.LLM_MODEL
  const configured = apiKeyConfigured && baseUrlConfigured && modelConfigured

  return {
    configured,
    baseUrlConfigured,
    modelConfigured,
    apiKeyConfigured,
    model: process.env.LLM_MODEL || '',
    timeoutMs: parseInt(process.env.LLM_TIMEOUT_MS || '8000', 10),
    maxRetries: parseInt(process.env.LLM_MAX_RETRIES || '1', 10),
  }
}

export function getLlmConfig(): LlmConfig {
  return {
    apiKey: process.env.LLM_API_KEY || '',
    baseUrl: (process.env.LLM_BASE_URL || 'https://api.example.com/v1').replace(
      /\/+$/,
      ''
    ),
    model: process.env.LLM_MODEL || '',
    timeoutMs: parseInt(process.env.LLM_TIMEOUT_MS || '8000', 10),
    maxRetries: parseInt(process.env.LLM_MAX_RETRIES || '1', 10),
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.2'),
  }
}

export function assertLlmConfigured(): LlmConfig {
  const status = getLlmProviderStatus()
  if (!status.configured) {
    const missing: string[] = []
    if (!status.apiKeyConfigured) missing.push('LLM_API_KEY')
    if (!status.baseUrlConfigured) missing.push('LLM_BASE_URL')
    if (!status.modelConfigured) missing.push('LLM_MODEL')
    throw new LlmConfigurationError(
      `LLM not fully configured. Missing: ${missing.join(', ')}`
    )
  }
  return getLlmConfig()
}
