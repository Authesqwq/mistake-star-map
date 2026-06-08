import type { KnowledgePoint, KnowledgeStatus } from '../types/domain'
import type { ConfirmedDiagnosisRecord } from '../types/diagnosis'
import type { PracticeResultRecord } from '../types/practice'
import type { MasterySnapshot, MasteryChange, MasteryOverview } from '../types/mastery'

export function clampMastery(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function getPracticeTypeWeight(type: string): number {
  const map: Record<string, number> = {
    original: 0.8,
    same_type: 1.0,
    variant: 1.2,
    review: 1.1,
  }
  return map[type] ?? 1.0
}

export function getTimeDecayWeight(createdAt: string): number {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  if (isNaN(days)) return 1.0
  if (days <= 7) return 1.0
  if (days <= 14) return 0.7
  return 0.5
}

export function calculateMasterySnapshot(params: {
  knowledgePoint: KnowledgePoint
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]
  practiceResults: PracticeResultRecord[]
}): MasterySnapshot {
  const { knowledgePoint, confirmedDiagnoses, practiceResults } = params
  const changes: MasteryChange[] = []
  let mastery = knowledgePoint.mastery ?? 50

  // Apply local diagnosis records
  const kpDiagnoses = confirmedDiagnoses
    .filter((d) => d.correctedKnowledgePointId === knowledgePoint.id)
    .slice(0, 3)

  for (const diag of kpDiagnoses) {
    let delta = -6
    if (diag.needReview) delta -= 3
    mastery += delta
    changes.push({
      id: `diag-${diag.id}`,
      knowledgePointId: knowledgePoint.id,
      createdAt: diag.createdAt,
      reason: 'local_diagnosis',
      delta,
      sourceRecordId: diag.id,
      description: `新增错题归因${diag.needReview ? '（需复核）' : ''}`,
    })
  }

  // Apply practice results (recent 10)
  const kpPractices = practiceResults
    .filter((r) => r.knowledgePointId === knowledgePoint.id)
    .slice(-10)

  let correctCount = 0
  let incorrectCount = 0
  let needsReviewCount = 0

  for (const pr of kpPractices) {
    const weight = getPracticeTypeWeight(pr.practiceType) * getTimeDecayWeight(pr.createdAt)
    let delta = 0
    let reason: MasteryChange['reason']

    if (pr.status === 'correct') {
      delta = Math.round(10 * weight)
      reason = 'practice_correct'
      correctCount++
    } else if (pr.status === 'incorrect') {
      delta = Math.round(-8 * weight)
      reason = 'practice_incorrect'
      incorrectCount++
    } else {
      delta = 0
      reason = 'practice_needs_review'
      needsReviewCount++
    }

    mastery += delta
    changes.push({
      id: `prac-${pr.id}`,
      knowledgePointId: knowledgePoint.id,
      createdAt: pr.createdAt,
      reason,
      delta,
      sourceRecordId: pr.id,
      description: reason === 'practice_correct'
        ? '复练答对' : reason === 'practice_incorrect'
        ? '复练未通过' : '需对照确认',
    })
  }

  const currentMastery = clampMastery(mastery)
  const hasLocalDiagnosis = kpDiagnoses.length > 0
  const hasPracticeResult = kpPractices.length > 0
  const displayStatus = getDisplayStatusFromMastery({
    baseStatus: knowledgePoint.status,
    currentMastery,
    hasLocalDiagnosis,
    hasPracticeResult,
  })

  return {
    knowledgePointId: knowledgePoint.id,
    baseMastery: knowledgePoint.mastery ?? 50,
    currentMastery,
    displayStatus,
    changes,
    localDiagnosisCount: kpDiagnoses.length,
    practiceResultCount: kpPractices.length,
    correctCount,
    incorrectCount,
    needsReviewCount,
    lastPracticedAt: kpPractices[kpPractices.length - 1]?.createdAt,
    nextReviewAt: knowledgePoint.nextReviewAt,
  }
}

export function calculateMasterySnapshots(params: {
  knowledgePoints: KnowledgePoint[]
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]
  practiceResults: PracticeResultRecord[]
}): MasterySnapshot[] {
  return params.knowledgePoints.map((kp) =>
    calculateMasterySnapshot({
      knowledgePoint: kp,
      confirmedDiagnoses: params.confirmedDiagnoses,
      practiceResults: params.practiceResults,
    })
  )
}

export function getMasteryOverview(snapshots: MasterySnapshot[]): MasteryOverview {
  const total = snapshots.length
  const mastered = snapshots.filter((s) => s.displayStatus === 'mastered').length
  const repairing = snapshots.filter((s) => s.displayStatus === 'repairing').length
  const toRepair = snapshots.filter((s) => s.displayStatus === 'to_repair').length
  const discovered = snapshots.filter((s) => s.displayStatus === 'discovered').length
  const avg = total > 0
    ? Math.round(snapshots.reduce((s, v) => s + v.currentMastery, 0) / total)
    : 0
  const highRiskCount = snapshots.filter(isHighRisk).length

  return { total, discovered, toRepair, repairing, mastered, averageMastery: avg, highRiskCount }
}

function isHighRisk(s: MasterySnapshot): boolean {
  if (s.displayStatus === 'to_repair') return true
  if (s.currentMastery < 60) return true
  if (s.incorrectCount >= 2) return true
  return false
}

export function getDisplayStatusFromMastery(params: {
  baseStatus: KnowledgeStatus
  currentMastery: number
  hasLocalDiagnosis: boolean
  hasPracticeResult: boolean
}): KnowledgeStatus {
  const { baseStatus, currentMastery, hasLocalDiagnosis, hasPracticeResult } = params
  const noActivity = !hasLocalDiagnosis && !hasPracticeResult
  if (noActivity) return baseStatus
  if (hasLocalDiagnosis && !hasPracticeResult) return 'to_repair' as KnowledgeStatus
  if (currentMastery >= 85) return 'mastered' as KnowledgeStatus
  if (currentMastery >= 70) return 'repairing' as KnowledgeStatus
  return 'to_repair' as KnowledgeStatus
}
