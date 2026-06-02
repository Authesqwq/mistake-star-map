export class LlmConfigurationError extends Error {
  constructor(message: string) {
    super(`[LLM Configuration] ${message}`)
    this.name = 'LlmConfigurationError'
  }
}

export class LlmTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`[LLM Timeout] Request timed out after ${timeoutMs}ms`)
    this.name = 'LlmTimeoutError'
  }
}

export class LlmProviderError extends Error {
  public readonly status?: number

  constructor(message: string, status?: number) {
    super(`[LLM Provider] ${message}`)
    this.name = 'LlmProviderError'
    this.status = status
  }
}

export class LlmResponseParseError extends Error {
  constructor(message: string) {
    super(`[LLM Response Parse] ${message}`)
    this.name = 'LlmResponseParseError'
  }
}
