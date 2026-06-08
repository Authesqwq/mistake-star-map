import { useEffect, useState } from 'react'
import {
  getStudentProfile, getAtlasProgress, getKnowledgePoints,
  getErrorTags, getLlmStatus, getTodayRecommendations,
  ApiError,
} from '../services/apiClient'
import type { RecommendationResponse } from '../types/recommendation'
import { WelcomeHero } from '../components/today/WelcomeHero'
import { StudentStatsGrid } from '../components/today/StudentStatsGrid'
import { TodayTaskList } from '../components/today/TodayTaskList'
import { AtlasProgressCard } from '../components/today/AtlasProgressCard'
import { HighRiskKnowledgeList } from '../components/today/HighRiskKnowledgeList'
import { AiStatusCard } from '../components/today/AiStatusCard'
import { QuickEntryGrid } from '../components/today/QuickEntryGrid'
import { RecommendationSummaryCard } from '../components/today/RecommendationSummaryCard'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { mapErrorTagNames } from '../utils/dashboardSelectors'
import { evaluateAndPersistAchievements } from '../utils/achievementSignals'
import type { MotivationProfile } from '../types/achievement'
import type { KnowledgePoint, ErrorTag } from '../types/domain'

import type { RecommendedPracticeTask } from '../types/recommendation'

interface TodayRepairCenterProps {
  onNavigate?: (view: string) => void
  onStartPractice?: (task: RecommendedPracticeTask) => void
}

export function TodayRepairCenter({ onNavigate, onStartPractice }: TodayRepairCenterProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<{ id: string; name: string; grade: string; streakDays: number; repairValue: number; totalMistakes: number; completedPracticeCount: number } | null>(null)
  const [recResponse, setRecResponse] = useState<RecommendationResponse | null>(null)
  const [atlas, setAtlas] = useState<{ total: number; undiscovered: number; discovered: number; toRepair: number; repairing: number; mastered: number } | null>(null)
  const [kps, setKps] = useState<KnowledgePoint[]>([])
  const [errorTags, setErrorTags] = useState<ErrorTag[]>([])
  const [llmConfigured, setLlmConfigured] = useState(false)
  const [llmModelConfig, setLlmModelConfig] = useState(false)
  const [llmUrlConfig, setLlmUrlConfig] = useState(false)
  const [motivationProfile, setMotivationProfile] = useState<MotivationProfile | null>(null)

  useEffect(() => {
    Promise.all([
      getStudentProfile(),
      getAtlasProgress(),
      getKnowledgePoints(),
      getErrorTags(),
      getLlmStatus(),
      getTodayRecommendations(),
    ])
      .then(([s, a, kpData, tagData, llmData, recData]) => {
        setStudent(s as unknown as typeof student)
        setAtlas(a)
        setKps(kpData as unknown as KnowledgePoint[])
        setErrorTags(tagData as unknown as ErrorTag[])
        setLlmConfigured(llmData.configured)
        setLlmModelConfig(llmData.modelConfigured)
        setLlmUrlConfig(llmData.baseUrlConfigured)
        setRecResponse(recData)
        const achievementResult = evaluateAndPersistAchievements()
        setMotivationProfile(achievementResult.profile)
        setLoading(false)
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : '加载数据失败')
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingState text="正在加载今日修复中心..." />
  if (error) return <ErrorState message={error} />
  if (!student || !atlas) return <ErrorState message="核心数据加载失败" />

  const tagNameMapper = (ids: string[]) => mapErrorTagNames(ids, errorTags)

  return (
    <div>
      <WelcomeHero name={student.name} grade={student.grade} streakDays={student.streakDays} />
      <StudentStatsGrid
        streakDays={motivationProfile?.streakDays ?? student.streakDays}
        repairValue={motivationProfile?.repairValue ?? student.repairValue}
        totalMistakes={student.totalMistakes} completedPracticeCount={student.completedPracticeCount}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        <TodayTaskList tasks={recResponse?.tasks ?? []} onStartPractice={onStartPractice} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AtlasProgressCard {...atlas} />
          <AiStatusCard configured={llmConfigured} modelConfigured={llmModelConfig} baseUrlConfigured={llmUrlConfig} />
        </div>
      </div>

      {recResponse && (
        <div style={{ marginBottom: 24 }}>
          <RecommendationSummaryCard response={recResponse} />
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <HighRiskKnowledgeList knowledgePoints={kps} errorTagNameMap={tagNameMapper} />
      </div>

      <QuickEntryGrid
        onOpenMistakeInput={onNavigate ? () => onNavigate('mistake-input') : undefined}
        onOpenAtlas={onNavigate ? () => onNavigate('atlas') : undefined}
        onOpenAchievements={onNavigate ? () => onNavigate('achievements') : undefined}
        onOpenReport={onNavigate ? () => onNavigate('report') : undefined}
      />
    </div>
  )
}
