export function formatTaskRole(role: string): string {
  const map: Record<string, string> = {
    core_repair: '核心修复',
    same_type_reinforce: '同类巩固',
    spaced_review: '间隔复查',
  }
  return map[role] ?? role
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

export function formatRecommendationSource(source: string): string {
  const map: Record<string, string> = {
    rule: '规则推荐',
    rule_with_ai_reason: '规则推荐 + AI 理由',
    mock_fallback: '兜底任务',
  }
  return map[source] ?? source
}

export function formatWarning(warning: string): string {
  const map: Record<string, string> = {
    RECOMMENDATION_MOCK_FALLBACK_USED: '推荐服务异常，已使用默认任务。',
  }
  return map[warning] ?? warning
}
