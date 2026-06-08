import type { PriorityBreakdown } from './recommendationTypes'

export function calculateMistakeFrequencyScore(params: {
  relatedMistakeCount: number
  localDiagnosisCount: number
}): number {
  const score = params.relatedMistakeCount * 25 + params.localDiagnosisCount * 30
  return Math.min(100, Math.max(0, Math.round(score)))
}

export function calculateErrorSeverityScore(params: {
  majorErrorTagIds: string[]
  errorTagSeverityMap: Record<string, number>
}): number {
  const scores = params.majorErrorTagIds
    .map((id) => params.errorTagSeverityMap[id] ?? 0)
    .filter((s) => s > 0)
  if (scores.length === 0) return 40
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.min(100, Math.max(0, Math.round(avg * 20)))
}

export function calculateMasteryGapScore(mastery: number): number {
  const m = isNaN(mastery) ? 50 : Math.max(0, Math.min(100, mastery))
  return 100 - m
}

export function calculateReviewDueScore(nextReviewAt?: string | null): number {
  if (!nextReviewAt) return 40
  const now = Date.now()
  const review = new Date(nextReviewAt).getTime()
  if (isNaN(review)) return 40
  const daysUntil = (review - now) / (1000 * 60 * 60 * 24)
  if (daysUntil <= 0) return 100
  if (daysUntil <= 1) return 90
  if (daysUntil <= 3) return 70
  if (daysUntil <= 7) return 40
  return 20
}

const WEIGHTS = {
  mistakeFrequency: 0.3,
  errorSeverity: 0.25,
  masteryGap: 0.25,
  reviewDue: 0.2,
}

export function calculatePriorityBreakdown(params: {
  relatedMistakeCount: number
  localDiagnosisCount: number
  majorErrorTagIds: string[]
  errorTagSeverityMap: Record<string, number>
  mastery: number
  nextReviewAt?: string | null
}): PriorityBreakdown {
  const mistakeFrequencyScore = calculateMistakeFrequencyScore(params)
  const errorSeverityScore = calculateErrorSeverityScore({
    majorErrorTagIds: params.majorErrorTagIds,
    errorTagSeverityMap: params.errorTagSeverityMap,
  })
  const masteryGapScore = calculateMasteryGapScore(params.mastery)
  const reviewDueScore = calculateReviewDueScore(params.nextReviewAt)

  const weightedScore = Math.round(
    mistakeFrequencyScore * WEIGHTS.mistakeFrequency +
    errorSeverityScore * WEIGHTS.errorSeverity +
    masteryGapScore * WEIGHTS.masteryGap +
    reviewDueScore * WEIGHTS.reviewDue
  )

  return {
    mistakeFrequencyScore,
    errorSeverityScore,
    masteryGapScore,
    reviewDueScore,
    weightedScore,
  }
}

export function calculatePriorityScore(
  breakdown: Omit<PriorityBreakdown, 'weightedScore'>
): number {
  return Math.round(
    breakdown.mistakeFrequencyScore * WEIGHTS.mistakeFrequency +
    breakdown.errorSeverityScore * WEIGHTS.errorSeverity +
    breakdown.masteryGapScore * WEIGHTS.masteryGap +
    breakdown.reviewDueScore * WEIGHTS.reviewDue
  )
}
