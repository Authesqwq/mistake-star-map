export function buildRuleBasedRecommendationReason(ctx: {
  knowledgePointName: string
  relatedMistakeCount: number
  localDiagnosisCount: number
  mastery: number
  practiceType: string
  isReviewDue: boolean
}): string {
  const parts: string[] = []

  if (ctx.relatedMistakeCount >= 2 || ctx.localDiagnosisCount >= 1) {
    parts.push(`这个知识点近期关联错题较多`)
  }
  if (ctx.mastery < 60) {
    parts.push(`掌握度还不稳定`)
  }
  if (ctx.isReviewDue) {
    parts.push(`已进入复查时间`)
  }

  const typeMap: Record<string, string> = {
    original: '先做一次原题回看',
    same_type: '适合先做同类题巩固',
    variant: '通过变式题确认方法是否真正掌握',
    review: '用一道短题确认是否保持稳定',
  }

  const reason = parts.length > 0
    ? `${parts.join('，')}。${typeMap[ctx.practiceType] ?? '建议安排复练'}。`
    : `${ctx.knowledgePointName}建议按计划复练。`

  return reason
}

export async function tryBuildAiRecommendationReason(
  _ctx: Record<string, unknown>
): Promise<string | null> {
  // AI reason generation is reserved, not enabled by default.
  // Will be implemented when useAiReason=true and LLM is configured.
  return null
}
