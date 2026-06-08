export { getTodayRecommendations } from './recommendationService'
export { buildMockFallbackRecommendations } from './recommendationFallback'
export { calculatePriorityBreakdown } from './recommendationScoring'
export { getRecommendationMetrics } from './recommendationMetrics'
export type {
  RecommendationRequest,
  RecommendationResponse,
  RecommendedPracticeTask,
  PriorityBreakdown,
  LocalDiagnosisSignal,
  TaskRole,
  PracticeType,
  RecommendationSource,
} from './recommendationTypes'
