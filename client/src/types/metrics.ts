export type MetricsRange = 'today' | 'last_7_days' | 'last_30_days' | 'all'

export interface MetricsDateRange { type: MetricsRange; startAt?: string; endAt?: string; label: string }

export interface ProductMetrics {
  pageViewCount: number; uniqueSessionCount: number; quickEntryClickCount: number
  diagnosisConfirmedCount: number; practiceStartedCount: number
  practiceSubmittedCount: number; reportGeneratedCount: number
}

export interface FunnelMetrics {
  diagnosisStarted: number; diagnosisSucceeded: number; diagnosisConfirmed: number
  practiceStarted: number; practiceSubmitted: number; practiceCorrect: number
}

export interface AiDiagnosisMetricsView {
  diagnosisStarted: number; diagnosisSucceeded: number; diagnosisFailed: number
  llmResultCount: number; fallbackResultCount: number; fallbackRate: number; averageConfidence: number
}

export interface RecommendationMetricsView {
  recommendationLoadedCount: number; recommendationFailedCount: number
  ruleSourceCount: number; mockFallbackCount: number
}

export interface PracticeMetricsView {
  practiceStartedCount: number; practiceSubmittedCount: number
  correctCount: number; incorrectCount: number; needsReviewCount: number
  completionRate: number; accuracyRate: number
}

export interface AtlasMetricsView {
  atlasViewCount: number; filterChangeCount: number
  localDiagnosisCount: number; masterySnapshotCount: number
}

export interface AchievementMetricsView {
  achievementUnlockedEventCount: number; unlockedAchievementCount: number
  repairValue: number; streakDays: number
}

export interface ReportMetricsView {
  reportGeneratedCount: number; markdownCopiedCount: number
  jsonExportedCount: number; savedReportCount: number
}

export interface LocalDataHealth {
  analyticsEventCount: number; confirmedDiagnosisCount: number
  practiceResultCount: number; masterySnapshotCount: number
  achievementRecordCount: number; savedReportCount: number
}

export interface MetricsDashboardData {
  generatedAt: string; range: MetricsDateRange; product: ProductMetrics
  funnel: FunnelMetrics; aiDiagnosis: AiDiagnosisMetricsView
  recommendation: RecommendationMetricsView; practice: PracticeMetricsView
  atlas: AtlasMetricsView; achievement: AchievementMetricsView
  report: ReportMetricsView; localDataHealth: LocalDataHealth
}
