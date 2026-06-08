export function buildPracticeFeedback(params: {
  status: 'correct' | 'incorrect' | 'needs_review'
  practiceType: 'original' | 'same_type' | 'variant' | 'review'
  knowledgePointName?: string
}): { feedback: string; suggestion: string; shouldRetry: boolean } {
  const kp = params.knowledgePointName ?? '这个知识点'

  switch (params.status) {
    case 'correct':
      return {
        feedback: `这次答案与参考答案一致，说明你对${kp}的处理更稳定了。`,
        suggestion: suggestNext(params.practiceType),
        shouldRetry: false,
      }
    case 'incorrect':
      return {
        feedback: `这次答案还没有对上参考答案，可以先回看题目条件，再尝试做一遍同类题。`,
        suggestion: '建议先确认题目条件，再完成一次同类巩固。',
        shouldRetry: true,
      }
    case 'needs_review':
      return {
        feedback: `${kp}这道题的答案不适合用简单规则判断，建议先对照参考答案和解题过程确认。`,
        suggestion: '请自行对照参考答案，判断是否答对。',
        shouldRetry: false,
      }
  }
}

function suggestNext(type: string): string {
  const map: Record<string, string> = {
    original: '建议进入同类巩固，确认理解稳定。',
    same_type: '可以挑战一道变式题，检验方法迁移能力。',
    variant: '建议安排一次间隔复查，保持长期记忆。',
    review: '已稳定掌握，可按计划进入下一个知识点。',
  }
  return map[type] ?? '建议继续复练下一个任务。'
}
