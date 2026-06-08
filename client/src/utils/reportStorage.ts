import type { LearningReport } from '../types/report'

const STORAGE_KEY = 'mistake-star-map.learning-reports'
const MAX = 10

export function getSavedReports(): LearningReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as LearningReport[]
  } catch { return [] }
}

export function saveLearningReport(report: LearningReport): void {
  const reports = getSavedReports()
  reports.push(report)
  if (reports.length > MAX) reports.splice(0, reports.length - MAX)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export function clearSavedReports(): void {
  localStorage.removeItem(STORAGE_KEY)
}
