import type { LocalDiagnosisSignal } from '../types/recommendation'
import { getConfirmedDiagnoses } from './diagnosisStorage'

export function getLocalDiagnosisSignals(): LocalDiagnosisSignal[] {
  const records = getConfirmedDiagnoses()
  return records.slice(0, 50).map((r) => ({
    knowledgePointId: r.correctedKnowledgePointId,
    errorTagIds: r.correctedErrorTags.map((t) => t.id),
    createdAt: r.createdAt,
    source: r.source as 'llm' | 'fallback',
    needReview: r.needReview,
  }))
}
