import type {
  KnowledgePoint,
  Mistake,
  DiagnosisResult,
  ErrorTag,
  PracticeTask,
  KnowledgeAtlasProgress,
} from '../types/domain'
import { allKnowledgePoints } from '../data/mockKnowledge'
import { mockMistakes } from '../data/mockMistakes'
import { mockDiagnoses } from '../data/mockDiagnosis'
import { mockErrorTags } from '../data/mockErrorTags'
import { mockPracticeTasks } from '../data/mockPracticeTasks'

export function getKnowledgePointById(id: string): KnowledgePoint | undefined {
  return allKnowledgePoints.find((kp) => kp.id === id)
}

export function getMistakesByKnowledgePointId(knowledgePointId: string): Mistake[] {
  return mockMistakes.filter((m) => m.knowledgePointId === knowledgePointId)
}

export function getDiagnosisByMistakeId(mistakeId: string): DiagnosisResult | undefined {
  return mockDiagnoses.find((d) => d.mistakeId === mistakeId)
}

export function getErrorTagsByIds(ids: string[]): ErrorTag[] {
  return mockErrorTags.filter((t) => ids.includes(t.id))
}

export function getTodayPracticeTasks(): PracticeTask[] {
  return mockPracticeTasks.filter((t) => t.status === 'pending')
}

export function getKnowledgeAtlasProgress(): KnowledgeAtlasProgress {
  const total = allKnowledgePoints.length
  const undiscovered = allKnowledgePoints.filter((kp) => kp.status === 'undiscovered').length
  const discovered = allKnowledgePoints.filter((kp) => kp.status === 'discovered').length
  const toRepair = allKnowledgePoints.filter((kp) => kp.status === 'to_repair').length
  const repairing = allKnowledgePoints.filter((kp) => kp.status === 'repairing').length
  const mastered = allKnowledgePoints.filter((kp) => kp.status === 'mastered').length

  return { total, undiscovered, discovered, toRepair, repairing, mastered }
}

export function getHighRiskKnowledgePoints(): KnowledgePoint[] {
  return allKnowledgePoints.filter((kp) => {
    const lowMastery = kp.mastery < 60
    const needsRepair = kp.status === 'to_repair'
    const highErrorRisk =
      kp.majorErrorTagIds.length > 0 &&
      kp.relatedMistakeIds.length >= 2
    return lowMastery || needsRepair || highErrorRisk
  })
}
