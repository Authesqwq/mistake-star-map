import type { DiagnosisEvalPrediction } from './diagnosisEvalTypes'
import { diagnosisEvalCases } from './diagnosisEvalCases'

const fixtureMap: Record<string, DiagnosisEvalPrediction> = {}

// Build fixtures from eval cases - mostly correct
for (const c of diagnosisEvalCases) {
  const shouldFail = c.id === 'core-06' || c.id === 'core-15' || c.id === 'boundary-02'
  fixtureMap[c.id] = {
    knowledgePointId: shouldFail && c.id === 'core-15'
      ? 'kp-func-expression'
      : c.expected.knowledgePointId,
    errorTags: shouldFail && c.id === 'core-06'
      ? ['concept_confusion']
      : shouldFail && c.id === 'boundary-02'
        ? []
        : c.expected.errorTagIds,
    confidence: shouldFail ? 0.45 : 0.82,
    explanation: shouldFail
      ? '系统判断可能存在偏差。'
      : `这是对${c.id.includes('func') ? '函数' : c.id.includes('frac') || c.id.includes('clear') ? '分式' : '几何'}知识点的分析。`,
    suggestedPracticeType: c.expected.suggestedPracticeType ?? 'same_type',
    recommendationReason: `建议做一道${c.expected.suggestedPracticeType ?? '同类'}题巩固。`,
    needReview: shouldFail ? false : (c.expected.needReview ?? false),
    source: 'fixture',
    warnings: shouldFail ? undefined : [],
  }
}

export function getFixturePrediction(caseId: string): DiagnosisEvalPrediction | null {
  return fixtureMap[caseId] ?? null
}
