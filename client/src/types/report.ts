export type ReportRange = 'this_week' | 'last_7_days' | 'last_30_days' | 'all'

export interface ReportDateRange {
  type: ReportRange; startAt?: string; endAt?: string; label: string
}

export interface PracticeReportSummary {
  totalPracticeCount: number; correctCount: number; incorrectCount: number
  needsReviewCount: number; accuracyRate: number; practicedKnowledgePointCount: number
}

export interface ErrorTagReportItem {
  errorTagId: string; errorTagName: string; count: number; severity?: number
}

export interface MasteryImprovementItem {
  knowledgePointId: string; knowledgePointName: string
  baseMastery: number; currentMastery: number; delta: number; displayStatus: string
}

export interface HighRiskReportItem {
  knowledgePointId: string; knowledgePointName: string
  currentMastery: number; displayStatus: string; reason: string; suggestion: string
}

export interface AchievementReportSummary {
  repairValue: number; streakDays: number; unlockedAchievementCount: number
  recentAchievementTitles: string[]
}

export interface LearningSuggestion {
  id: string; title: string; description: string
  priority: 'high' | 'medium' | 'low'; relatedKnowledgePointId?: string
}

export interface LearningReport {
  id: string; generatedAt: string; range: ReportDateRange
  practiceSummary: PracticeReportSummary
  errorTagDistribution: ErrorTagReportItem[]
  masteryImprovements: MasteryImprovementItem[]
  highRiskKnowledgePoints: HighRiskReportItem[]
  achievementSummary: AchievementReportSummary
  suggestions: LearningSuggestion[]
  markdownSummary: string
}
