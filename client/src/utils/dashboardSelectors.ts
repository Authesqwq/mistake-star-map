import type { KnowledgePoint, PracticeTask, ErrorTag } from '../types/domain'

export function getHighRiskKnowledgePoints(knowledgePoints: KnowledgePoint[]): KnowledgePoint[] {
  return knowledgePoints
    .filter((kp) => {
      const lowMastery = kp.mastery < 60
      const needsRepair = kp.status === 'to_repair'
      const highErrorRisk =
        kp.majorErrorTagIds.length > 0 && kp.relatedMistakeIds.length >= 2
      return lowMastery || needsRepair || highErrorRisk
    })
    .sort((a, b) => {
      if (a.status === 'to_repair' && b.status !== 'to_repair') return -1
      if (b.status === 'to_repair' && a.status !== 'to_repair') return 1
      if (a.mastery !== b.mastery) return a.mastery - b.mastery
      return b.relatedMistakeIds.length - a.relatedMistakeIds.length
    })
    .slice(0, 5)
}

export function sortTodayTasks(tasks: PracticeTask[]): PracticeTask[] {
  return [...tasks].sort((a, b) => b.priorityScore - a.priorityScore)
}

export function getKnowledgePointNameMap(
  knowledgePoints: KnowledgePoint[]
): Record<string, string> {
  const map: Record<string, string> = {}
  for (const kp of knowledgePoints) {
    map[kp.id] = kp.name
  }
  return map
}

export function getMistakeTitleMap(
  mistakes: { id: string; title: string }[]
): Record<string, string> {
  const map: Record<string, string> = {}
  for (const m of mistakes) {
    map[m.id] = m.title
  }
  return map
}

export function mapErrorTagNames(
  errorTagIds: string[],
  errorTags: ErrorTag[]
): string[] {
  const map: Record<string, string> = {}
  for (const t of errorTags) {
    map[t.id] = t.name
  }
  return errorTagIds.map((id) => map[id] ?? id).filter(Boolean)
}

export function formatKnowledgeStatus(status: string): string {
  const map: Record<string, string> = {
    undiscovered: '未发现',
    discovered: '已发现',
    to_repair: '待修复',
    repairing: '修复中',
    mastered: '已掌握',
  }
  return map[status] ?? status
}

export function formatPracticeType(type: string): string {
  const map: Record<string, string> = {
    original: '原题回看',
    same_type: '同类巩固',
    variant: '变式迁移',
    review: '间隔复查',
  }
  return map[type] ?? type
}
