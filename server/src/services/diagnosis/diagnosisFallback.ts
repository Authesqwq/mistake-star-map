import type { DiagnosisPromptInput, DiagnosisModelOutput } from '../../prompts/promptTypes'

export function buildFallbackDiagnosis(
  input: DiagnosisPromptInput,
  reason: string
): DiagnosisModelOutput {
  const q = input.question + input.wrongAnswer + input.correctAnswer
  const text = q.toLowerCase()

  let knowledgePointId = input.candidateKnowledgePoints[0]?.id ?? ''

  // Keyword-based priority
  if (
    text.includes('一次函数') ||
    text.includes('函数图像') ||
    text.includes('斜率') ||
    text.includes('y=')
  ) {
    const matched = input.candidateKnowledgePoints.find(
      (kp) =>
        kp.id.includes('func') ||
        kp.name.includes('函数') ||
        kp.name.includes('图像')
    )
    if (matched) knowledgePointId = matched.id
  }

  if (
    text.includes('分式方程') ||
    text.includes('去分母') ||
    text.includes('增根') ||
    text.includes('分母')
  ) {
    const matched = input.candidateKnowledgePoints.find(
      (kp) =>
        kp.id.includes('frac') ||
        kp.id.includes('denom') ||
        kp.id.includes('extraneous') ||
        kp.name.includes('分式')
    )
    if (matched) knowledgePointId = matched.id
  }

  if (
    text.includes('全等') ||
    text.includes('三角形') ||
    text.includes('证明') ||
    text.includes('判定')
  ) {
    const matched = input.candidateKnowledgePoints.find(
      (kp) =>
        kp.id.includes('ct-') ||
        kp.id.includes('congruent') ||
        kp.name.includes('全等') ||
        kp.name.includes('证明')
    )
    if (matched) knowledgePointId = matched.id
  }

  let errorTags: string[] = [input.candidateErrorTags[0]?.id ?? '']

  const wrongNum = input.wrongAnswer.replace(/[^0-9.\-+]/g, '')
  const correctNum = input.correctAnswer.replace(/[^0-9.\-+]/g, '')
  if (
    wrongNum &&
    correctNum &&
    wrongNum !== correctNum &&
    Math.abs(parseFloat(wrongNum) - parseFloat(correctNum)) < 100
  ) {
    if (input.candidateErrorTags.some((t) => t.id === 'careless_calculation')) {
      errorTags = ['careless_calculation']
    }
  }

  if (text.includes('证明') && text.includes('因为')) {
    const logicTag = input.candidateErrorTags.find(
      (t) => t.id === 'logic_gap' || t.id === 'incomplete_expression'
    )
    if (logicTag) {
      errorTags = [logicTag.id]
      if (input.candidateErrorTags.length > 1) {
        const second = input.candidateErrorTags.find((t) => t.id !== logicTag.id)
        if (second) errorTags.push(second.id)
      }
    }
  }

  if (errorTags.length === 1 && errorTags[0] === input.candidateErrorTags[0]?.id) {
    const conceptConfusionTag = input.candidateErrorTags.find(
      (t) => t.id === 'concept_confusion'
    )
    if (conceptConfusionTag && errorTags[0] !== 'concept_confusion') {
      errorTags = ['concept_confusion']
    }
  }

  return {
    knowledgePointId,
    errorTags,
    confidence: 0.62,
    explanation: `系统根据题目信息做了初步判断（${reason}），建议确认知识点和错因是否准确。`,
    suggestedPracticeType: 'same_type',
    recommendationReason: '该题涉及基础概念理解，适合先做同类题巩固',
    needReview: true,
  }
}
