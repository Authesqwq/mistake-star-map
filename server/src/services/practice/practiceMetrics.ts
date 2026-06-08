const metrics = {
  totalEvaluateRequests: 0,
  correctCount: 0,
  incorrectCount: 0,
  needsReviewCount: 0,
  totalLatencyMs: 0,
}

export function recordEvaluateRequest(status: string, latencyMs: number): void {
  metrics.totalEvaluateRequests++
  metrics.totalLatencyMs += latencyMs
  if (status === 'correct') metrics.correctCount++
  else if (status === 'incorrect') metrics.incorrectCount++
  else metrics.needsReviewCount++
}

export function getPracticeMetrics() {
  const total = metrics.totalEvaluateRequests
  return {
    totalEvaluateRequests: total,
    correctCount: metrics.correctCount,
    incorrectCount: metrics.incorrectCount,
    needsReviewCount: metrics.needsReviewCount,
    averageLatencyMs: total > 0 ? Math.round(metrics.totalLatencyMs / total) : 0,
  }
}
