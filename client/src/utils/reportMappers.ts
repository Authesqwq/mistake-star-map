import type { ReportRange } from '../types/report'

export function formatReportRange(range: ReportRange): string {
  const map: Record<ReportRange, string> = {
    this_week: '本周', last_7_days: '近 7 天', last_30_days: '近 30 天', all: '全部记录',
  }
  return map[range] ?? range
}

export function formatAccuracyRate(value: number): string { return `${value}%` }

export function formatReportDate(value: string): string {
  return new Date(value).toLocaleDateString('zh-CN')
}

export function formatSuggestionPriority(
  priority: 'high' | 'medium' | 'low'
): string {
  const map = { high: '优先处理', medium: '保持关注', low: '稳定推进' }
  return map[priority]
}

export function getSuggestionPriorityBadgeVariant(
  priority: string
): 'success' | 'warning' | 'danger' | 'info' {
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warning'
  return 'success'
}
