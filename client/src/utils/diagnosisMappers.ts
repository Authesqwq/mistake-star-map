import type { KnowledgePoint, ErrorTag } from '../types/domain'

export function mapKnowledgePointOptions(
  knowledgePoints: KnowledgePoint[]
): Array<{ value: string; label: string; chapterId: string }> {
  return knowledgePoints.map((kp) => ({
    value: kp.id,
    label: kp.name,
    chapterId: kp.chapterId,
  }))
}

export function mapErrorTagOptions(
  errorTags: ErrorTag[]
): Array<{ value: string; label: string; description: string; severity: number }> {
  return errorTags.map((t) => ({
    value: t.id,
    label: t.name,
    description: t.description,
    severity: t.severity,
  }))
}

export function getKnowledgePointById(
  knowledgePoints: KnowledgePoint[],
  id: string
): KnowledgePoint | undefined {
  return knowledgePoints.find((kp) => kp.id === id)
}

export function getErrorTagsByIds(
  errorTags: ErrorTag[],
  ids: string[]
): ErrorTag[] {
  const idSet = new Set(ids)
  return errorTags.filter((t) => idSet.has(t.id))
}

export function formatDiagnosisSource(source: string): string {
  if (source === 'llm') return 'AI 模型'
  if (source === 'fallback') return '规则兜底'
  return source
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

export function formatWarning(warning: string): string {
  const map: Record<string, string> = {
    LLM_NOT_CONFIGURED_FALLBACK_USED:
      '当前未配置大模型，已使用规则兜底结果。',
    MODEL_OUTPUT_PARSE_FAILED_FALLBACK_USED:
      '模型输出解析失败，已使用规则兜底结果。',
    MODEL_OUTPUT_CANDIDATE_VALIDATION_FAILED_FALLBACK_USED:
      '模型输出未通过候选校验，已使用规则兜底结果。',
    LOW_CONFIDENCE_NEEDS_REVIEW:
      '当前置信度较低，建议手动确认。',
  }
  return map[warning] ?? warning
}
