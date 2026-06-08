import { getSavedMasterySnapshots } from './masteryStorage'

export interface LocalMasterySignal {
  knowledgePointId: string
  currentMastery: number
  displayStatus: string
  correctCount: number
  incorrectCount: number
  lastPracticedAt?: string
}

export function getLocalMasterySignals(): LocalMasterySignal[] {
  try {
    const snapshots = getSavedMasterySnapshots()
    return snapshots.slice(0, 50).map((s) => ({
      knowledgePointId: s.knowledgePointId,
      currentMastery: s.currentMastery,
      displayStatus: s.displayStatus,
      correctCount: s.correctCount,
      incorrectCount: s.incorrectCount,
      lastPracticedAt: s.lastPracticedAt,
    }))
  } catch {
    return []
  }
}
