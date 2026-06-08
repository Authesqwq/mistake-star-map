import type { PracticeResultRecord } from '../types/practice'

const STORAGE_KEY = 'mistake-star-map.practice-results'
const MAX_RECORDS = 100

export function getPracticeResults(): PracticeResultRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as PracticeResultRecord[]
  } catch {
    return []
  }
}

export function savePracticeResult(record: PracticeResultRecord): void {
  const records = getPracticeResults()
  records.push(record)
  if (records.length > MAX_RECORDS) {
    records.splice(0, records.length - MAX_RECORDS)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function clearPracticeResults(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getPracticeResultsByKnowledgePointId(
  knowledgePointId: string
): PracticeResultRecord[] {
  return getPracticeResults().filter((r) => r.knowledgePointId === knowledgePointId)
}
