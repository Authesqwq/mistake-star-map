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

export function formatRiskLevel(level: string): string {
  const map: Record<string, string> = {
    low: '稳定',
    medium: '需关注',
    high: '优先修复',
  }
  return map[level] ?? level
}

export function formatSourceBadge(source: string): string {
  return source === 'mock' ? 'Mock' : source === 'local' ? '本地确认' : source
}

export function formatChapterName(chapterId: string): string {
  const map: Record<string, string> = {
    'ch-linear-function': '一次函数',
    'ch-fractional-eq': '分式方程',
    'ch-congruent-tri': '全等三角形',
  }
  return map[chapterId] ?? chapterId
}

export function formatNextReviewAt(value: string | null | undefined): string {
  if (!value) return '暂无'
  return new Date(value).toLocaleDateString('zh-CN')
}

export function formatErrorTagNames(
  errorTagIds: string[],
  errorTags: Array<{ id: string; name: string }>
): string[] {
  const map: Record<string, string> = {}
  for (const t of errorTags) map[t.id] = t.name
  return errorTagIds.map((id) => map[id] ?? id).filter(Boolean)
}
