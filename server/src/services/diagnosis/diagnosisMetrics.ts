export interface DiagnosisMetrics {
  totalRequests: number
  llmSuccessCount: number
  fallbackCount: number
  llmNotConfiguredCount: number
  parseFailureCount: number
  candidateValidationFailureCount: number
  averageLatencyMs: number
}

const metrics: DiagnosisMetrics = {
  totalRequests: 0,
  llmSuccessCount: 0,
  fallbackCount: 0,
  llmNotConfiguredCount: 0,
  parseFailureCount: 0,
  candidateValidationFailureCount: 0,
  averageLatencyMs: 0,
}

let totalLatencyMs = 0

export function recordRequest(): void {
  metrics.totalRequests++
}

export function recordLlmSuccess(latencyMs: number): void {
  metrics.llmSuccessCount++
  totalLatencyMs += latencyMs
  metrics.averageLatencyMs =
    metrics.llmSuccessCount > 0
      ? Math.round(totalLatencyMs / metrics.llmSuccessCount)
      : 0
}

export function recordFallback(): void {
  metrics.fallbackCount++
}

export function recordLlmNotConfigured(): void {
  metrics.llmNotConfiguredCount++
}

export function recordParseFailure(): void {
  metrics.parseFailureCount++
}

export function recordCandidateValidationFailure(): void {
  metrics.candidateValidationFailureCount++
}

export function getMetrics(): DiagnosisMetrics {
  return { ...metrics }
}
