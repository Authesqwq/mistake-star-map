import type { KnowledgeStatus } from './domain'

export interface AtlasKnowledgePointViewModel {
  id: string
  subjectId: string
  chapterId: string
  chapterName: string
  name: string
  description?: string
  status: KnowledgeStatus
  displayStatus: KnowledgeStatus
  mastery: number
  relatedMistakeIds: string[]
  majorErrorTagIds: string[]
  nextReviewAt?: string | null
  localDiagnosisCount: number
  localErrorTagIds: string[]
  riskLevel: 'low' | 'medium' | 'high'
  sourceBadges: Array<'mock' | 'local'>
}

export interface AtlasFilters {
  keyword: string
  chapterId: string
  status: 'all' | KnowledgeStatus
  riskLevel: 'all' | 'low' | 'medium' | 'high'
  localOnly: boolean
}

export const defaultAtlasFilters: AtlasFilters = {
  keyword: '',
  chapterId: 'all',
  status: 'all',
  riskLevel: 'all',
  localOnly: false,
}
