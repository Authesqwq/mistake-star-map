import type { MasterySnapshot } from '../types/mastery'

const STORAGE_KEY = 'mistake-star-map.mastery-snapshots'

export function getSavedMasterySnapshots(): MasterySnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as MasterySnapshot[]
  } catch {
    return []
  }
}

export function saveMasterySnapshots(snapshots: MasterySnapshot[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots))
}

export function clearMasterySnapshots(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getSavedMasterySnapshotByKnowledgePointId(
  id: string
): MasterySnapshot | null {
  return getSavedMasterySnapshots().find((s) => s.knowledgePointId === id) ?? null
}
