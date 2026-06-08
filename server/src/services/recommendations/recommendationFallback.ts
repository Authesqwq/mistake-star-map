import type { RecommendationResponse, RecommendedPracticeTask } from './recommendationTypes'
import { mockPracticeTasks } from '../../data/mockData'
import { mockKnowledgePoints, mockChapters } from '../../data/mockData'

export function buildMockFallbackRecommendations(limit: number): RecommendationResponse {
  const tasks: RecommendedPracticeTask[] = mockPracticeTasks
    .slice(0, limit)
    .map((t, i) => {
      const kp = mockKnowledgePoints.find((k) => k.id === t.knowledgePointId)
      const ch = mockChapters.find((c) => c.knowledgePointIds.includes(t.knowledgePointId))
      const role: 'core_repair' | 'same_type_reinforce' | 'spaced_review' =
        i === 0 ? 'core_repair' : i === 1 ? 'same_type_reinforce' : 'spaced_review'

      return {
        id: t.id,
        taskRole: role,
        mistakeId: t.mistakeId,
        knowledgePointId: t.knowledgePointId,
        knowledgePointName: kp?.name ?? t.knowledgePointId,
        chapterId: ch?.id ?? '',
        chapterName: ch?.name ?? '',
        practiceType: t.type as RecommendedPracticeTask['practiceType'],
        title: t.title,
        question: t.question,
        expectedAnswer: t.expectedAnswer,
        recommendationReason: t.recommendationReason,
        priorityScore: t.priorityScore,
        priorityBreakdown: {
          mistakeFrequencyScore: 60,
          errorSeverityScore: 60,
          masteryGapScore: 60,
          reviewDueScore: 60,
          weightedScore: 60,
        },
        sourceSignals: {
          relatedMistakeCount: 1,
          localDiagnosisCount: 0,
          majorErrorTagIds: [],
          mastery: kp?.mastery ?? 50,
          nextReviewAt: kp?.nextReviewAt ?? null,
        },
        status: 'pending' as const,
      }
    })

  return {
    source: 'mock_fallback',
    tasks,
    summary: {
      candidateCount: tasks.length,
      returnedCount: tasks.length,
      localSignalCount: 0,
      scoringVersion: 'fallback',
      generatedAt: new Date().toISOString(),
      aiReasonUsed: false,
    },
    warnings: ['RECOMMENDATION_MOCK_FALLBACK_USED'],
  }
}
