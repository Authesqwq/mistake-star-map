import type { AnalyticsEvent } from '../types/analytics'
import type { ConfirmedDiagnosisRecord } from '../types/diagnosis'
import type { PracticeResultRecord } from '../types/practice'
import type { MasterySnapshot } from '../types/mastery'
import type { AchievementRecord, MotivationProfile } from '../types/achievement'
import type { LearningReport } from '../types/report'
import type { MetricsRange, MetricsDateRange, MetricsDashboardData, ProductMetrics, FunnelMetrics, AiDiagnosisMetricsView, RecommendationMetricsView, PracticeMetricsView, AtlasMetricsView, AchievementMetricsView, ReportMetricsView, LocalDataHealth } from '../types/metrics'

export function getMetricsDateRange(range: MetricsRange): MetricsDateRange {
  const now = new Date()
  switch (range) {
    case 'today': { const d = new Date(now); d.setHours(0,0,0,0); return { type: 'today', startAt: d.toISOString(), label: '今日' } }
    case 'last_7_days': return { type: 'last_7_days', startAt: new Date(now.getTime() - 7*86400000).toISOString(), label: '近7天' }
    case 'last_30_days': return { type: 'last_30_days', startAt: new Date(now.getTime() - 30*86400000).toISOString(), label: '近30天' }
    case 'all': return { type: 'all', label: '全部' }
  }
}

export function isEventInRange(event: AnalyticsEvent, range: MetricsDateRange): boolean {
  if (range.type === 'all') return true
  return event.createdAt >= (range.startAt ?? '')
}

export function buildProductMetrics(events: AnalyticsEvent[]): ProductMetrics {
  const sessions = new Set(events.map((e) => e.sessionId))
  return {
    pageViewCount: events.filter((e) => e.name === 'page_view').length,
    uniqueSessionCount: sessions.size,
    quickEntryClickCount: events.filter((e) => e.name === 'quick_entry_click').length,
    diagnosisConfirmedCount: events.filter((e) => e.name === 'diagnosis_confirmed').length,
    practiceStartedCount: events.filter((e) => e.name === 'practice_started').length,
    practiceSubmittedCount: events.filter((e) => e.name === 'practice_submitted').length,
    reportGeneratedCount: events.filter((e) => e.name === 'report_generated').length,
  }
}

export function buildFunnelMetrics(events: AnalyticsEvent[]): FunnelMetrics {
  return {
    diagnosisStarted: events.filter((e) => e.name === 'diagnosis_started').length,
    diagnosisSucceeded: events.filter((e) => e.name === 'diagnosis_succeeded').length,
    diagnosisConfirmed: events.filter((e) => e.name === 'diagnosis_confirmed').length,
    practiceStarted: events.filter((e) => e.name === 'practice_started').length,
    practiceSubmitted: events.filter((e) => e.name === 'practice_submitted').length,
    practiceCorrect: events.filter((e) => e.name === 'practice_feedback_received' && e.properties?.isCorrect === true).length,
  }
}

export function buildAiDiagnosisMetrics(events: AnalyticsEvent[]): AiDiagnosisMetricsView {
  const succeeded = events.filter((e) => e.name === 'diagnosis_succeeded').length
  const fallbackCount = events.filter((e) => e.name === 'diagnosis_succeeded' && e.properties?.source === 'fallback').length
  const confidences = events.filter((e) => e.name === 'diagnosis_succeeded' && e.properties?.confidence != null).map((e) => Number(e.properties!.confidence))
  return {
    diagnosisStarted: events.filter((e) => e.name === 'diagnosis_started').length,
    diagnosisSucceeded: succeeded,
    diagnosisFailed: events.filter((e) => e.name === 'diagnosis_failed').length,
    llmResultCount: events.filter((e) => e.name === 'diagnosis_succeeded' && e.properties?.source === 'llm').length,
    fallbackResultCount: fallbackCount,
    fallbackRate: succeeded > 0 ? fallbackCount / succeeded : 0,
    averageConfidence: confidences.length > 0 ? Math.round((confidences.reduce((a,b) => a+b, 0) / confidences.length) * 100) / 100 : 0,
  }
}

export function buildRecommendationMetrics(events: AnalyticsEvent[]): RecommendationMetricsView {
  return {
    recommendationLoadedCount: events.filter((e) => e.name === 'today_recommendation_loaded').length,
    recommendationFailedCount: events.filter((e) => e.name === 'today_recommendation_failed').length,
    ruleSourceCount: events.filter((e) => e.name === 'today_recommendation_loaded' && e.properties?.source !== 'mock_fallback').length,
    mockFallbackCount: events.filter((e) => e.name === 'today_recommendation_loaded' && e.properties?.source === 'mock_fallback').length,
  }
}

export function buildPracticeMetrics(events: AnalyticsEvent[], practiceResults: PracticeResultRecord[]): PracticeMetricsView {
  const started = events.filter((e) => e.name === 'practice_started').length
  const submitted = events.filter((e) => e.name === 'practice_submitted').length
  const correct = practiceResults.filter((r) => r.status === 'correct').length
  const incorrect = practiceResults.filter((r) => r.status === 'incorrect').length
  return {
    practiceStartedCount: started,
    practiceSubmittedCount: submitted,
    correctCount: correct,
    incorrectCount: incorrect,
    needsReviewCount: practiceResults.filter((r) => r.status === 'needs_review').length,
    completionRate: started > 0 ? submitted / started : 0,
    accuracyRate: (correct + incorrect) > 0 ? correct / (correct + incorrect) : 0,
  }
}

export function buildAtlasMetrics(events: AnalyticsEvent[], confirmedDiagnoses: ConfirmedDiagnosisRecord[], masterySnapshots: MasterySnapshot[]): AtlasMetricsView {
  return {
    atlasViewCount: events.filter((e) => e.name === 'atlas_viewed').length,
    filterChangeCount: events.filter((e) => e.name === 'atlas_filter_changed').length,
    localDiagnosisCount: confirmedDiagnoses.length,
    masterySnapshotCount: masterySnapshots.length,
  }
}

export function buildAchievementMetrics(events: AnalyticsEvent[], achievementRecords: AchievementRecord[], profile: MotivationProfile | null): AchievementMetricsView {
  return {
    achievementUnlockedEventCount: events.filter((e) => e.name === 'achievement_unlocked').length,
    unlockedAchievementCount: achievementRecords.length,
    repairValue: profile?.repairValue ?? 0,
    streakDays: profile?.streakDays ?? 0,
  }
}

export function buildReportMetrics(events: AnalyticsEvent[], savedReports: LearningReport[]): ReportMetricsView {
  return {
    reportGeneratedCount: events.filter((e) => e.name === 'report_generated').length,
    markdownCopiedCount: events.filter((e) => e.name === 'report_markdown_copied').length,
    jsonExportedCount: events.filter((e) => e.name === 'report_json_exported').length,
    savedReportCount: savedReports.length,
  }
}

export function buildLocalDataHealth(params: {
  analyticsEvents: AnalyticsEvent[]; confirmedDiagnoses: ConfirmedDiagnosisRecord[]
  practiceResults: PracticeResultRecord[]; masterySnapshots: MasterySnapshot[]
  achievementRecords: AchievementRecord[]; savedReports: LearningReport[]
}): LocalDataHealth {
  return {
    analyticsEventCount: params.analyticsEvents.length,
    confirmedDiagnosisCount: params.confirmedDiagnoses.length,
    practiceResultCount: params.practiceResults.length,
    masterySnapshotCount: params.masterySnapshots.length,
    achievementRecordCount: params.achievementRecords.length,
    savedReportCount: params.savedReports.length,
  }
}

export function buildMetricsDashboardData(params: {
  range: MetricsRange; analyticsEvents: AnalyticsEvent[]
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]; practiceResults: PracticeResultRecord[]
  masterySnapshots: MasterySnapshot[]; achievementRecords: AchievementRecord[]
  motivationProfile: MotivationProfile | null; savedReports: LearningReport[]
}): MetricsDashboardData {
  const dateRange = getMetricsDateRange(params.range)
  const events = params.analyticsEvents.filter((e) => isEventInRange(e, dateRange))
  return {
    generatedAt: new Date().toISOString(), range: dateRange,
    product: buildProductMetrics(events),
    funnel: buildFunnelMetrics(events),
    aiDiagnosis: buildAiDiagnosisMetrics(events),
    recommendation: buildRecommendationMetrics(events),
    practice: buildPracticeMetrics(events, params.practiceResults),
    atlas: buildAtlasMetrics(events, params.confirmedDiagnoses, params.masterySnapshots),
    achievement: buildAchievementMetrics(events, params.achievementRecords, params.motivationProfile),
    report: buildReportMetrics(events, params.savedReports),
    localDataHealth: buildLocalDataHealth({ ...params, analyticsEvents: params.analyticsEvents }),
  }
}
