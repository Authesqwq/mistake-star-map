import type { MasteryChangeReason } from '../types/mastery'

export function formatMasteryChangeReason(reason: MasteryChangeReason): string {
  const map: Record<MasteryChangeReason, string> = {
    local_diagnosis: '新增错题归因',
    practice_correct: '复练答对',
    practice_incorrect: '复练未通过',
    practice_needs_review: '需对照确认',
    time_decay: '时间衰减',
  }
  return map[reason] ?? reason
}

export function formatMasteryDelta(delta: number): string {
  if (delta > 0) return `+${delta}`
  return `${delta}`
}

export function formatMasteryStatus(status: string): string {
  const map: Record<string, string> = {
    undiscovered: '未发现', discovered: '已发现', to_repair: '待修复',
    repairing: '修复中', mastered: '已掌握',
  }
  return map[status] ?? status
}

export function getMasteryLevelText(mastery: number): string {
  if (mastery >= 85) return '已掌握'
  if (mastery >= 70) return '修复中'
  if (mastery >= 40) return '待修复'
  return '高风险'
}

export function getMasteryBadgeVariant(
  mastery: number
): 'success' | 'warning' | 'danger' | 'info' {
  if (mastery >= 85) return 'success'
  if (mastery >= 70) return 'info'
  if (mastery >= 40) return 'warning'
  return 'danger'
}
