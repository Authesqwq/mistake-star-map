import type {
  RecommendationRequest,
  RecommendationResponse,
  RecommendedPracticeTask,
  TaskRole,
  PracticeType,
} from './recommendationTypes'
import { getKnowledgePoints, getMistakes, getErrorTags } from '../mockDataService'
import { calculatePriorityBreakdown } from './recommendationScoring'
import { buildRuleBasedRecommendationReason } from './recommendationReason'
import { buildMockFallbackRecommendations } from './recommendationFallback'
import {
  recordRecommendationRequest,
  recordRuleSuccess,
  recordMockFallback,
} from './recommendationMetrics'
import { mockChapters } from '../../data/mockData'

export async function getTodayRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const startTime = Date.now()
  recordRecommendationRequest()

  try {
    const knowledgePoints = getKnowledgePoints()
    const mistakes = getMistakes()
    const errorTags = getErrorTags()

    const localSignals = request.localDiagnosisSignals ?? []
    const limit = request.limit ?? 3

    // Build severity map
    const severityMap: Record<string, number> = {}
    for (const t of errorTags) severityMap[t.id] = t.severity

    // Aggregate local signals per knowledge point
    const localByKp: Record<string, number> = {}
    for (const s of localSignals) {
      localByKp[s.knowledgePointId] = (localByKp[s.knowledgePointId] ?? 0) + 1
    }

    // Apply local mastery signals
    const masteryByKp: Record<string, { mastery: number; status: string }> = {}
    for (const ms of (request as any).localMasterySignals ?? []) {
      masteryByKp[ms.knowledgePointId] = { mastery: ms.currentMastery, status: ms.displayStatus }
    }

    // Generate candidates
    const candidates: RecommendedPracticeTask[] = knowledgePoints
      .map((kp) => {
        const localCount = localByKp[kp.id] ?? 0
        // Filter out empty undiscovered with no related mistakes
        if (kp.status === 'undiscovered' && kp.relatedMistakeIds.length === 0 && localCount === 0) {
          return null
        }

        const chapter = mockChapters.find((c) => c.knowledgePointIds.includes(kp.id))
        const localM = masteryByKp[kp.id]
        const effectiveMastery = localM?.mastery ?? kp.mastery
        const breakdown = calculatePriorityBreakdown({
          relatedMistakeCount: kp.relatedMistakeIds.length,
          localDiagnosisCount: localCount,
          majorErrorTagIds: kp.majorErrorTagIds,
          errorTagSeverityMap: severityMap,
          mastery: effectiveMastery,
          nextReviewAt: kp.nextReviewAt,
        })

        const practiceType = determinePracticeType(kp, localCount)
        const isReviewDue = kp.nextReviewAt ? new Date(kp.nextReviewAt).getTime() <= Date.now() : false

        const reason = buildRuleBasedRecommendationReason({
          knowledgePointName: kp.name,
          relatedMistakeCount: kp.relatedMistakeIds.length,
          localDiagnosisCount: localCount,
          mastery: effectiveMastery,
          practiceType,
          isReviewDue,
        })

        // Find representative mistake
        let repMistake = mistakes.find((m) => kp.relatedMistakeIds.includes(m.id))
        if (!repMistake && chapter) {
          repMistake = mistakes.find((m) => chapter.knowledgePointIds.includes(m.knowledgePointId))
        }

        return {
          id: `rec-${kp.id}`,
          taskRole: 'core_repair' as TaskRole,
          mistakeId: repMistake?.id,
          knowledgePointId: kp.id,
          knowledgePointName: kp.name,
          chapterId: chapter?.id ?? kp.chapterId,
          chapterName: chapter?.name ?? kp.chapterId,
          practiceType,
          title: repMistake?.title ?? `${kp.name} - 复练任务`,
          question: repMistake?.question,
          expectedAnswer: repMistake?.correctAnswer,
          recommendationReason: reason,
          priorityScore: breakdown.weightedScore,
          priorityBreakdown: breakdown,
          sourceSignals: {
            relatedMistakeCount: kp.relatedMistakeIds.length,
            localDiagnosisCount: localCount,
            majorErrorTagIds: kp.majorErrorTagIds,
            mastery: effectiveMastery,
            nextReviewAt: kp.nextReviewAt,
          },
          status: 'pending' as const,
        }
      })
      .filter(Boolean) as RecommendedPracticeTask[]

    if (candidates.length === 0) {
      recordMockFallback()
      return buildMockFallbackRecommendations(limit)
    }

    // Sort by priority
    candidates.sort((a, b) => b.priorityScore - a.priorityScore)

    // Assign task roles
    const top = candidates.slice(0, limit)
    if (top.length >= 1) top[0].taskRole = 'core_repair'
    if (top.length >= 2) top[1].taskRole = 'same_type_reinforce'
    if (top.length >= 3) top[2].taskRole = 'spaced_review'

    recordRuleSuccess(Date.now() - startTime)

    return {
      source: 'rule',
      tasks: top,
      summary: {
        candidateCount: candidates.length,
        returnedCount: top.length,
        localSignalCount: localSignals.length,
        scoringVersion: 'v1',
        generatedAt: new Date().toISOString(),
        aiReasonUsed: false,
      },
      warnings: [],
    }
  } catch {
    recordMockFallback()
    return buildMockFallbackRecommendations(request.limit ?? 3)
  }
}

function determinePracticeType(
  kp: { status: string; mastery: number },
  localCount: number
): PracticeType {
  if (kp.mastery < 60) return 'same_type'
  if (kp.status === 'to_repair') return 'same_type'
  if (kp.status === 'mastered') return 'review'
  if (localCount > 0) return 'same_type'
  return 'same_type' as PracticeType
}
