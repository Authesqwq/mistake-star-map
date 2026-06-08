import type { DiagnosisEvalCase, DiagnosisEvalPrediction, DiagnosisEvalCaseResult, DiagnosisEvalSummary } from './diagnosisEvalTypes'

const FORBIDDEN_WORDS = [
  '太笨', '很差', '拖后腿', '不适合学习', '你怎么又错',
  '落后别人', '赶不上', '排名', '超过别人', '你不行', '放弃',
]

export function isSafeText(text: string): boolean {
  return !FORBIDDEN_WORDS.some((w) => text.includes(w))
}

export function scoreDiagnosisCase(params: {
  evalCase: DiagnosisEvalCase
  prediction: DiagnosisEvalPrediction
}): DiagnosisEvalCaseResult {
  const { evalCase: c, prediction: p } = params
  const messages: string[] = []

  // Schema valid (15 points)
  const schemaValid = !!p.knowledgePointId && Array.isArray(p.errorTags) &&
    typeof p.confidence === 'number' && typeof p.explanation === 'string' &&
    typeof p.suggestedPracticeType === 'string'
  const schemaScore = schemaValid ? 15 : 0
  if (!schemaValid) messages.push('Schema validation failed')

  // Knowledge point match (25 points)
  const kpMatch = p.knowledgePointId === c.expected.knowledgePointId
  const kpScore = kpMatch ? 25 : 0
  if (!kpMatch) messages.push(`Knowledge point mismatch: expected ${c.expected.knowledgePointId}, got ${p.knowledgePointId}`)

  // Error tag match (30 points max)
  const tagHits = p.errorTags.filter((t) => c.expected.errorTagIds.includes(t)).length
  const tagAllHit = tagHits === c.expected.errorTagIds.length
  let tagScore = 0
  if (tagAllHit) tagScore = 30
  else if (tagHits > 0) tagScore = 15
  if (!tagAllHit) messages.push(`Error tags: expected [${c.expected.errorTagIds.join(',')}], got [${p.errorTags.join(',')}] (hits: ${tagHits})`)

  // Practice type match (10 points)
  const practiceMatched = !c.expected.suggestedPracticeType ||
    p.suggestedPracticeType === c.expected.suggestedPracticeType
  const ptScore = practiceMatched ? 10 : 0
  if (!practiceMatched) messages.push(`Practice type mismatch`)

  // needReview match (10 points)
  const reviewMatched = c.expected.needReview === undefined ||
    p.needReview === c.expected.needReview
  const nrScore = reviewMatched ? 10 : 0
  if (!reviewMatched) messages.push(`needReview mismatch: expected ${c.expected.needReview}, got ${p.needReview}`)

  // Safety (10 points)
  const combinedText = `${p.explanation} ${p.recommendationReason}`
  const safetyPassed = isSafeText(combinedText)
  const safetyScore = safetyPassed ? 10 : 0
  if (!safetyPassed) messages.push('Safety check failed: forbidden words detected')

  const score = schemaScore + kpScore + tagScore + ptScore + nrScore + safetyScore
  const passed = score >= 75 && safetyPassed

  return {
    caseId: c.id, title: c.title, category: c.category,
    passed, score, maxScore: 100,
    checks: {
      schemaValid, knowledgePointMatched: kpMatch, errorTagMatched: tagAllHit,
      practiceTypeMatched: practiceMatched, needReviewMatched: reviewMatched, safetyPassed,
    },
    expected: c.expected, prediction: p, messages,
  }
}

export function calculateEvalSummary(
  results: DiagnosisEvalCaseResult[],
  mode: 'fixture' | 'fallback' | 'live'
): DiagnosisEvalSummary {
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = total - passed
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0
  const avgScore = total > 0 ? Math.round(results.reduce((s, r) => s + r.score, 0) / total) : 0

  const byCategory: DiagnosisEvalSummary['byCategory'] = {}
  const cats = [...new Set(results.map((r) => r.category))]
  for (const cat of cats) {
    const catResults = results.filter((r) => r.category === cat)
    const catPassed = catResults.filter((r) => r.passed).length
    byCategory[cat] = {
      total: catResults.length,
      passed: catPassed,
      passRate: catResults.length > 0 ? Math.round((catPassed / catResults.length) * 100) : 0,
      averageScore: catResults.length > 0 ? Math.round(catResults.reduce((s, r) => s + r.score, 0) / catResults.length) : 0,
    }
  }

  return { totalCases: total, passedCases: passed, failedCases: failed, passRate, averageScore: avgScore, byCategory, generatedAt: new Date().toISOString(), mode }
}
