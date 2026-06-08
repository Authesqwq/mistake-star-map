import type { DiagnosisEvalCase, DiagnosisEvalCaseResult, DiagnosisEvalSummary, DiagnosisEvalCategory } from './diagnosisEvalTypes'
import { diagnosisEvalCases } from './diagnosisEvalCases'
import { getFixturePrediction } from './diagnosisEvalFixtures'
import { scoreDiagnosisCase, calculateEvalSummary } from './diagnosisEvalScoring'

export async function runDiagnosisEval(options: {
  mode: 'fixture' | 'fallback' | 'live'
  category?: DiagnosisEvalCategory | 'all'
  limit?: number
}): Promise<{ summary: DiagnosisEvalSummary; results: DiagnosisEvalCaseResult[] }> {
  let cases = diagnosisEvalCases
  if (options.category && options.category !== 'all') {
    cases = cases.filter((c) => c.category === options.category)
  }
  if (options.limit && options.limit > 0) {
    cases = cases.slice(0, options.limit)
  }

  const results: DiagnosisEvalCaseResult[] = []

  if (options.mode === 'fixture') {
    for (const c of cases) {
      const prediction = getFixturePrediction(c.id)
      if (!prediction) {
        results.push({
          caseId: c.id, title: c.title, category: c.category,
          passed: false, score: 0, maxScore: 100,
          checks: { schemaValid: false, knowledgePointMatched: false, errorTagMatched: false, practiceTypeMatched: false, needReviewMatched: false, safetyPassed: true },
          expected: c.expected,
          prediction: { knowledgePointId: '', errorTags: [], confidence: 0, explanation: '', suggestedPracticeType: 'same_type', recommendationReason: '', needReview: false, source: 'fixture' },
          messages: ['No fixture prediction available'],
        })
        continue
      }
      results.push(scoreDiagnosisCase({ evalCase: c, prediction }))
    }
  } else if (options.mode === 'fallback') {
    const { buildFallbackDiagnosis } = await import('../services/diagnosis/diagnosisFallback')
    for (const c of cases) {
      const prediction = buildFallbackDiagnosis({
        subjectId: c.subjectId, subjectName: c.subjectName, grade: c.grade,
        question: c.question, wrongAnswer: c.wrongAnswer, correctAnswer: c.correctAnswer,
        candidateKnowledgePoints: c.candidateKnowledgePointIds?.map((id) => ({ id, name: id, chapterId: '', chapterName: '' })) ?? [],
        candidateErrorTags: c.candidateErrorTagIds?.map((id) => ({ id, name: id, category: '', description: '', severity: 3 })) ?? [],
      }, 'eval test')
      const pred = {
        ...prediction,
        suggestedPracticeType: prediction.suggestedPracticeType as 'original' | 'same_type' | 'variant' | 'review',
        source: 'fallback' as const,
        warnings: [],
      }
      results.push(scoreDiagnosisCase({ evalCase: c, prediction: pred }))
    }
  } else if (options.mode === 'live') {
    const { isLLMConfigured } = await import('../config/env')
    if (!isLLMConfigured()) {
      throw new Error('LLM not configured. Set LLM_API_KEY, LLM_BASE_URL, LLM_MODEL to run live eval.')
    }
    const { buildDiagnosisMessages } = await import('../prompts/diagnosisPrompt')
    const { chatCompletion } = await import('../services/llm/llmClient')
    const { parseDiagnosisModelOutput, extractJsonFromLlmContent } = await import('../services/diagnosis/diagnosisParser')

    for (const c of cases) {
      try {
        const messages = buildDiagnosisMessages({
          subjectId: c.subjectId, subjectName: c.subjectName, grade: c.grade,
          question: c.question, wrongAnswer: c.wrongAnswer, correctAnswer: c.correctAnswer,
          candidateKnowledgePoints: c.candidateKnowledgePointIds?.map((id) => ({ id, name: id, chapterId: '', chapterName: '' })) ?? [],
          candidateErrorTags: c.candidateErrorTagIds?.map((id) => ({ id, name: id, category: '', description: '', severity: 3 })) ?? [],
        })
        const llmResponse = await chatCompletion({ messages })
        const parseResult = parseDiagnosisModelOutput(llmResponse.content)
        if (parseResult.valid && parseResult.data) {
          results.push(scoreDiagnosisCase({
            evalCase: c,
            prediction: { ...parseResult.data, source: 'llm', warnings: [] },
          }))
        } else {
          results.push({
            caseId: c.id, title: c.title, category: c.category,
            passed: false, score: 0, maxScore: 100,
            checks: { schemaValid: false, knowledgePointMatched: false, errorTagMatched: false, practiceTypeMatched: false, needReviewMatched: false, safetyPassed: true },
            expected: c.expected,
            prediction: { knowledgePointId: '', errorTags: [], confidence: 0, explanation: 'Parse failed', suggestedPracticeType: 'same_type', recommendationReason: '', needReview: true, source: 'llm', warnings: ['PARSE_FAILED'] },
            messages: ['LLM output parse failure'],
          })
        }
      } catch (err) {
        results.push({
          caseId: c.id, title: c.title, category: c.category,
          passed: false, score: 0, maxScore: 100,
          checks: { schemaValid: false, knowledgePointMatched: false, errorTagMatched: false, practiceTypeMatched: false, needReviewMatched: false, safetyPassed: true },
          expected: c.expected,
          prediction: { knowledgePointId: '', errorTags: [], confidence: 0, explanation: `Error: ${(err as Error).message}`, suggestedPracticeType: 'same_type', recommendationReason: '', needReview: true, source: 'llm', warnings: ['LLM_ERROR'] },
          messages: [`LLM call error: ${(err as Error).message}`],
        })
      }
    }
  }

  const summary = calculateEvalSummary(results, options.mode)
  return { summary, results }
}
