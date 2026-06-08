const metrics = {
  totalRequests: 0,
  ruleSuccessCount: 0,
  mockFallbackCount: 0,
  aiReasonAttemptCount: 0,
  aiReasonSuccessCount: 0,
  aiReasonFallbackCount: 0,
  totalLatencyMs: 0,
}

export function recordRecommendationRequest(): void {
  metrics.totalRequests++
}

export function recordRuleSuccess(latencyMs: number): void {
  metrics.ruleSuccessCount++
  metrics.totalLatencyMs += latencyMs
}

export function recordMockFallback(): void {
  metrics.mockFallbackCount++
}

export function recordAiReasonAttempt(): void {
  metrics.aiReasonAttemptCount++
}

export function recordAiReasonSuccess(latencyMs: number): void {
  metrics.aiReasonSuccessCount++
  metrics.totalLatencyMs += latencyMs
}

export function recordAiReasonFallback(): void {
  metrics.aiReasonFallbackCount++
}

export function getRecommendationMetrics() {
  const total = metrics.totalRequests
  return {
    totalRequests: total,
    ruleSuccessCount: metrics.ruleSuccessCount,
    mockFallbackCount: metrics.mockFallbackCount,
    aiReasonAttemptCount: metrics.aiReasonAttemptCount,
    aiReasonSuccessCount: metrics.aiReasonSuccessCount,
    aiReasonFallbackCount: metrics.aiReasonFallbackCount,
    averageLatencyMs: total > 0 ? Math.round(metrics.totalLatencyMs / total) : 0,
  }
}
