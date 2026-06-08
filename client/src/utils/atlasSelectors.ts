import type { KnowledgePoint, KnowledgeStatus, ErrorTag } from '../types/domain'
import type { AtlasKnowledgePointViewModel, AtlasFilters } from '../types/atlas'
import type { ConfirmedDiagnosisRecord } from '../types/diagnosis'

const chapterNames: Record<string, string> = {
  'ch-linear-function': '一次函数',
  'ch-fractional-eq': '分式方程',
  'ch-congruent-tri': '全等三角形',
}

export function buildAtlasViewModels(
  knowledgePoints: KnowledgePoint[],
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]
): AtlasKnowledgePointViewModel[] {
  const diagByKp = aggregateDiagnosesByKp(confirmedDiagnoses)

  return knowledgePoints.map((kp) => {
    const local = diagByKp[kp.id]
    const hasLocal = local && local.count > 0
    const displayStatus = hasLocal && kp.status === 'undiscovered' ? 'to_repair' as const : kp.status

    return {
      id: kp.id,
      subjectId: kp.subjectId,
      chapterId: kp.chapterId,
      chapterName: chapterNames[kp.chapterId] ?? kp.chapterId,
      name: kp.name,
      description: kp.description,
      status: kp.status,
      displayStatus,
      mastery: kp.mastery,
      relatedMistakeIds: kp.relatedMistakeIds,
      majorErrorTagIds: kp.majorErrorTagIds,
      nextReviewAt: kp.nextReviewAt,
      localDiagnosisCount: local?.count ?? 0,
      localErrorTagIds: local?.errorTagIds ?? [],
      riskLevel: calculateRiskLevel(displayStatus, kp.mastery, local?.count ?? 0),
      sourceBadges: hasLocal ? (['mock', 'local'] as const) : (['mock'] as const),
    }
  })
}

function aggregateDiagnosesByKp(
  records: ConfirmedDiagnosisRecord[]
): Record<string, { count: number; errorTagIds: string[] }> {
  const map: Record<string, { count: number; errorTagIds: string[] }> = {}
  for (const r of records) {
    const kpId = r.correctedKnowledgePointId
    if (!map[kpId]) map[kpId] = { count: 0, errorTagIds: [] }
    map[kpId].count++
    for (const tag of r.correctedErrorTags) {
      if (!map[kpId].errorTagIds.includes(tag.id)) {
        map[kpId].errorTagIds.push(tag.id)
      }
    }
  }
  return map
}

export function groupKnowledgePointsByChapter(
  viewModels: AtlasKnowledgePointViewModel[]
): Record<string, AtlasKnowledgePointViewModel[]> {
  const groups: Record<string, AtlasKnowledgePointViewModel[]> = {}
  for (const vm of viewModels) {
    if (!groups[vm.chapterId]) groups[vm.chapterId] = []
    groups[vm.chapterId].push(vm)
  }
  return groups
}

export function filterKnowledgePoints(
  viewModels: AtlasKnowledgePointViewModel[],
  filters: AtlasFilters
): AtlasKnowledgePointViewModel[] {
  return viewModels.filter((vm) => {
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      if (!vm.name.toLowerCase().includes(kw) && !(vm.description ?? '').toLowerCase().includes(kw)) {
        return false
      }
    }
    if (filters.chapterId !== 'all' && vm.chapterId !== filters.chapterId) return false
    if (filters.status !== 'all' && vm.displayStatus !== filters.status) return false
    if (filters.riskLevel !== 'all' && vm.riskLevel !== filters.riskLevel) return false
    if (filters.localOnly && vm.localDiagnosisCount === 0) return false
    return true
  })
}

export function getAtlasStats(viewModels: AtlasKnowledgePointViewModel[]) {
  return {
    total: viewModels.length,
    undiscovered: viewModels.filter((v) => v.displayStatus === 'undiscovered').length,
    discovered: viewModels.filter((v) => v.displayStatus === 'discovered').length,
    toRepair: viewModels.filter((v) => v.displayStatus === 'to_repair').length,
    repairing: viewModels.filter((v) => v.displayStatus === 'repairing').length,
    mastered: viewModels.filter((v) => v.displayStatus === 'mastered').length,
    localCount: viewModels.reduce((s, v) => s + v.localDiagnosisCount, 0),
  }
}

export function calculateRiskLevel(
  status: KnowledgeStatus,
  mastery: number,
  localCount: number
): 'low' | 'medium' | 'high' {
  if (status === 'to_repair' || mastery < 50 || localCount >= 2) return 'high'
  if (status === 'repairing' || (mastery >= 50 && mastery < 75) || localCount === 1) return 'medium'
  return 'low'
}

export function sortKnowledgePoints(
  viewModels: AtlasKnowledgePointViewModel[]
): AtlasKnowledgePointViewModel[] {
  const riskOrder = { high: 0, medium: 1, low: 2 }
  const statusOrder: Record<string, number> = {
    to_repair: 0, repairing: 1, discovered: 2, undiscovered: 3, mastered: 4,
  }
  return [...viewModels].sort((a, b) => {
    if (a.riskLevel !== b.riskLevel) return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
    if (a.displayStatus !== b.displayStatus) return (statusOrder[a.displayStatus] ?? 5) - (statusOrder[b.displayStatus] ?? 5)
    if (a.mastery !== b.mastery) return a.mastery - b.mastery
    if (a.localDiagnosisCount !== b.localDiagnosisCount) return b.localDiagnosisCount - a.localDiagnosisCount
    return a.name.localeCompare(b.name, 'zh-CN')
  })
}

export function getLocalDiagnosesByKnowledgePointId(
  records: ConfirmedDiagnosisRecord[],
  knowledgePointId: string
): ConfirmedDiagnosisRecord[] {
  return records.filter((r) => r.correctedKnowledgePointId === knowledgePointId)
}

export function getTopErrorTagsForKnowledgePoint(
  viewModel: AtlasKnowledgePointViewModel,
  _errorTags: ErrorTag[]
): string[] {
  return viewModel.majorErrorTagIds.slice(0, 3)
}
