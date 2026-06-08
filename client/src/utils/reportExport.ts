import type { LearningReport } from '../types/report'

export async function copyReportMarkdown(markdown: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(markdown)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = markdown
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

export function downloadReportJson(report: LearningReport): void {
  const safe: Record<string, unknown> = {
    id: report.id,
    generatedAt: report.generatedAt,
    range: report.range,
    practiceSummary: report.practiceSummary,
    errorTagDistribution: report.errorTagDistribution,
    masteryImprovements: report.masteryImprovements,
    highRiskKnowledgePoints: report.highRiskKnowledgePoints,
    achievementSummary: report.achievementSummary,
    suggestions: report.suggestions,
  }
  const json = JSON.stringify(safe, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mistake-star-map-report-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
