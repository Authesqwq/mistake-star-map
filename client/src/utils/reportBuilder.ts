import type { ConfirmedDiagnosisRecord } from '../types/diagnosis'
import type { PracticeResultRecord } from '../types/practice'
import type { MasterySnapshot } from '../types/mastery'
import type { AchievementRecord, MotivationProfile } from '../types/achievement'
import type { ReportRange, ReportDateRange, PracticeReportSummary, ErrorTagReportItem, MasteryImprovementItem, HighRiskReportItem, AchievementReportSummary, LearningSuggestion, LearningReport } from '../types/report'

export function getReportDateRange(range: ReportRange): ReportDateRange {
  const now = new Date()
  switch (range) {
    case 'this_week': {
      const day = now.getDay()
      const monday = new Date(now)
      monday.setDate(now.getDate() - ((day + 6) % 7))
      monday.setHours(0, 0, 0, 0)
      return { type: 'this_week', startAt: monday.toISOString(), label: '本周' }
    }
    case 'last_7_days': {
      const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return { type: 'last_7_days', startAt: d.toISOString(), label: '近 7 天' }
    }
    case 'last_30_days': {
      const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return { type: 'last_30_days', startAt: d.toISOString(), label: '近 30 天' }
    }
    case 'all':
      return { type: 'all', label: '全部记录' }
  }
}

export function isRecordInRange(createdAt: string, range: ReportDateRange): boolean {
  if (range.type === 'all') return true
  if (!range.startAt) return true
  return createdAt >= range.startAt
}

function filterByRange<T extends { createdAt: string }>(items: T[], range: ReportDateRange): T[] {
  return items.filter((i) => isRecordInRange(i.createdAt, range))
}

export function buildPracticeSummary(practiceResults: PracticeResultRecord[], range: ReportDateRange): PracticeReportSummary {
  const filtered = filterByRange(practiceResults, range)
  const correct = filtered.filter((p) => p.status === 'correct').length
  const incorrect = filtered.filter((p) => p.status === 'incorrect').length
  const needsReview = filtered.filter((p) => p.status === 'needs_review').length
  const total = correct + incorrect
  const kpIds = new Set(filtered.map((p) => p.knowledgePointId))
  return {
    totalPracticeCount: filtered.length,
    correctCount: correct,
    incorrectCount: incorrect,
    needsReviewCount: needsReview,
    accuracyRate: total > 0 ? Math.round((correct / total) * 100) : 0,
    practicedKnowledgePointCount: kpIds.size,
  }
}

export function buildErrorTagDistribution(
  confirmedDiagnoses: ConfirmedDiagnosisRecord[],
  range: ReportDateRange
): ErrorTagReportItem[] {
  const filtered = filterByRange(confirmedDiagnoses, range)
  const counts: Record<string, { name: string; count: number; severity: number }> = {}
  for (const d of filtered) {
    for (const tag of d.correctedErrorTags) {
      if (!counts[tag.id]) counts[tag.id] = { name: tag.name, count: 0, severity: tag.severity }
      counts[tag.id].count++
    }
  }
  return Object.entries(counts)
    .map(([id, v]) => ({ errorTagId: id, errorTagName: v.name, count: v.count, severity: v.severity }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
}

export function buildMasteryImprovements(snapshots: MasterySnapshot[]): MasteryImprovementItem[] {
  return snapshots
    .filter((s) => s.currentMastery > s.baseMastery)
    .map((s) => ({
      knowledgePointId: s.knowledgePointId,
      knowledgePointName: s.knowledgePointId,
      baseMastery: s.baseMastery,
      currentMastery: s.currentMastery,
      delta: s.currentMastery - s.baseMastery,
      displayStatus: s.displayStatus,
    }))
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 5)
}

export function buildHighRiskKnowledgePoints(snapshots: MasterySnapshot[]): HighRiskReportItem[] {
  return snapshots
    .filter((s) =>
      s.currentMastery < 60 ||
      s.displayStatus === 'to_repair' ||
      (s.incorrectCount > 0 && s.incorrectCount >= s.correctCount && s.practiceResultCount > 0)
    )
    .sort((a, b) => a.currentMastery - b.currentMastery || b.incorrectCount - a.incorrectCount)
    .slice(0, 5)
    .map((s) => ({
      knowledgePointId: s.knowledgePointId,
      knowledgePointName: s.knowledgePointId,
      currentMastery: s.currentMastery,
      displayStatus: s.displayStatus,
      reason: s.currentMastery < 60 ? '掌握度偏低' : s.displayStatus === 'to_repair' ? '状态待修复' : '复练正确率偏低',
      suggestion: '建议先完成 1 次同类巩固，再安排一次间隔复查。',
    }))
}

export function buildLearningSuggestions(params: {
  highRisk: HighRiskReportItem[]
  errorDistribution: ErrorTagReportItem[]
  practiceSummary: PracticeReportSummary
  streakDays: number
}): LearningSuggestion[] {
  const suggestions: LearningSuggestion[] = []
  let id = 0

  for (const hr of params.highRisk.slice(0, 2)) {
    suggestions.push({
      id: `sug-${id++}`,
      title: `优先修复${hr.knowledgePointName}`,
      description: `当前掌握度 ${hr.currentMastery}，建议先做 1 道同类巩固题。`,
      priority: 'high',
      relatedKnowledgePointId: hr.knowledgePointId,
    })
  }

  if (params.errorDistribution.length > 0) {
    const top = params.errorDistribution[0]
    suggestions.push({
      id: `sug-${id++}`,
      title: `关注「${top.errorTagName}」错因`,
      description: `该错因出现最多，复练前可以先回看定义和适用条件。`,
      priority: 'medium',
    })
  }

  if (params.streakDays >= 3) {
    suggestions.push({
      id: `sug-${id++}`,
      title: '保持每日复练节奏',
      description: `已连续修复 ${params.streakDays} 天，继续保持每天 1 道高优先级任务。`,
      priority: 'low',
    })
  } else {
    suggestions.push({
      id: `sug-${id++}`,
      title: '开始建立复练节奏',
      description: '每天完成少量高优先级任务，逐步形成稳定的修复习惯。',
      priority: 'medium',
    })
  }

  if (params.practiceSummary.needsReviewCount > 0) {
    suggestions.push({
      id: `sug-${id++}`,
      title: '确认需对照的复练结果',
      description: `${params.practiceSummary.needsReviewCount} 次复练需要对照确认，建议抽时间核对。`,
      priority: 'medium',
    })
  }

  return suggestions.slice(0, 5)
}

export function buildMarkdownSummary(report: LearningReport): string {
  const p = report.practiceSummary
  const lines = [
    '# 错题星图学习报告',
    '',
    `生成时间：${new Date(report.generatedAt).toLocaleString('zh-CN')}`,
    `统计范围：${report.range.label}`,
    '',
    '## 本周复练概况',
    `- 完成复练：${p.totalPracticeCount} 次`,
    `- 答对：${p.correctCount} 次`,
    `- 待重试：${p.incorrectCount} 次`,
    `- 需对照确认：${p.needsReviewCount} 次`,
    `- 复练正确率：${p.accuracyRate}%`,
    '',
  ]
  if (report.masteryImprovements.length > 0) {
    lines.push('## 掌握度变化')
    for (const m of report.masteryImprovements) {
      lines.push(`- ${m.knowledgePointName}：+${m.delta}，当前 ${m.currentMastery}`)
    }
    lines.push('')
  }
  if (report.highRiskKnowledgePoints.length > 0) {
    lines.push('## 需要优先关注')
    for (const h of report.highRiskKnowledgePoints) {
      lines.push(`- ${h.knowledgePointName}：当前掌握度 ${h.currentMastery}，${h.suggestion}`)
    }
    lines.push('')
  }
  if (report.suggestions.length > 0) {
    lines.push('## 下周建议')
    report.suggestions.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.title}：${s.description}`)
    })
    lines.push('')
  }
  lines.push(`- 成就：${report.achievementSummary.unlockedAchievementCount} 个已解锁 · 修复值 ${report.achievementSummary.repairValue}`)
  return lines.join('\n')
}

export function buildLearningReport(params: {
  range: ReportRange
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]
  practiceResults: PracticeResultRecord[]
  masterySnapshots: MasterySnapshot[]
  achievementRecords: AchievementRecord[]
  motivationProfile: MotivationProfile | null
}): LearningReport {
  const dateRange = getReportDateRange(params.range)
  const practiceSummary = buildPracticeSummary(params.practiceResults, dateRange)
  const errorTagDistribution = buildErrorTagDistribution(params.confirmedDiagnoses, dateRange)
  const masteryImprovements = buildMasteryImprovements(params.masterySnapshots)
  const highRisk = buildHighRiskKnowledgePoints(params.masterySnapshots)
  const achievementSummary: AchievementReportSummary = {
    repairValue: params.motivationProfile?.repairValue ?? 0,
    streakDays: params.motivationProfile?.streakDays ?? 0,
    unlockedAchievementCount: params.motivationProfile?.unlockedAchievementCount ?? params.achievementRecords.length,
    recentAchievementTitles: params.motivationProfile?.recentAchievements.map((a) => a.title) ?? [],
  }
  const suggestions = buildLearningSuggestions({
    highRisk, errorDistribution: errorTagDistribution, practiceSummary, streakDays: params.motivationProfile?.streakDays ?? 0,
  })

  const report: LearningReport = {
    id: `report-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    range: dateRange,
    practiceSummary,
    errorTagDistribution,
    masteryImprovements,
    highRiskKnowledgePoints: highRisk,
    achievementSummary,
    suggestions,
    markdownSummary: '',
  }
  report.markdownSummary = buildMarkdownSummary(report)
  return report
}
