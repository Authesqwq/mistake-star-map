export function getPort(): number {
  return parseInt(process.env.PORT || '3001', 10)
}

export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development'
}

export function isLLMConfigured(): boolean {
  return !!process.env.LLM_API_KEY
}

export function getLLMConfig() {
  return {
    apiKey: process.env.LLM_API_KEY || '',
    baseUrl: process.env.LLM_BASE_URL || 'https://api.example.com/v1',
    model: process.env.LLM_MODEL || '',
    timeoutMs: parseInt(process.env.LLM_TIMEOUT_MS || '8000', 10),
  }
}
