import { useEffect, useState } from 'react'
import {
  getStudentProfile,
  getTodayPracticeTasks,
  getAtlasProgress,
  getKnowledgePoints,
  getMistakes,
  getErrorTags,
  getLlmStatus,
  ApiError,
} from '../services/apiClient'
import { WelcomeHero } from '../components/today/WelcomeHero'
import { StudentStatsGrid } from '../components/today/StudentStatsGrid'
import { TodayTaskList } from '../components/today/TodayTaskList'
import { AtlasProgressCard } from '../components/today/AtlasProgressCard'
import { HighRiskKnowledgeList } from '../components/today/HighRiskKnowledgeList'
import { AiStatusCard } from '../components/today/AiStatusCard'
import { QuickEntryGrid } from '../components/today/QuickEntryGrid'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import {
  getKnowledgePointNameMap,
  getMistakeTitleMap,
  mapErrorTagNames,
} from '../utils/dashboardSelectors'
import type { KnowledgePoint, PracticeTask, ErrorTag } from '../types/domain'

interface TodayRepairCenterProps {
  onNavigate?: (view: string) => void
}

export function TodayRepairCenter({ onNavigate }: TodayRepairCenterProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [student, setStudent] = useState<{ id: string; name: string; grade: string; streakDays: number; repairValue: number; totalMistakes: number; completedPracticeCount: number } | null>(null)
  const [tasks, setTasks] = useState<PracticeTask[]>([])
  const [atlas, setAtlas] = useState<{ total: number; undiscovered: number; discovered: number; toRepair: number; repairing: number; mastered: number } | null>(null)
  const [kps, setKps] = useState<KnowledgePoint[]>([])
  const [mistakes, setMistakes] = useState<{ id: string; title: string }[]>([])
  const [errorTags, setErrorTags] = useState<ErrorTag[]>([])
  const [llmConfigured, setLlmConfigured] = useState(false)
  const [llmModelConfig, setLlmModelConfig] = useState(false)
  const [llmUrlConfig, setLlmUrlConfig] = useState(false)

  useEffect(() => {
    Promise.all([
      getStudentProfile(),
      getTodayPracticeTasks(),
      getAtlasProgress(),
      getKnowledgePoints(),
      getMistakes(),
      getErrorTags(),
      getLlmStatus(),
    ])
      .then(
        ([studentData, tasksData, atlasData, kpData, mistakeData, tagData, llmData]) => {
          setStudent(studentData as unknown as typeof student)
          setTasks(tasksData as unknown as PracticeTask[])
          setAtlas(atlasData)
          setKps(kpData as unknown as KnowledgePoint[])
          setMistakes(mistakeData.map((m: { id: string; title: string }) => ({ id: m.id, title: m.title })))
          setErrorTags(tagData as unknown as ErrorTag[])
          setLlmConfigured(llmData.configured)
          setLlmModelConfig(llmData.modelConfigured)
          setLlmUrlConfig(llmData.baseUrlConfigured)
          setLoading(false)
        }
      )
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : '加载数据失败')
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingState text="正在加载今日修复中心..." />
  if (error) return <ErrorState message={error} />
  if (!student || !atlas) return <ErrorState message="核心数据加载失败" />

  const kpNameMap = getKnowledgePointNameMap(kps)
  const mistakeTitleMap = getMistakeTitleMap(mistakes)
  const tagNameMapper = (ids: string[]) => mapErrorTagNames(ids, errorTags)

  return (
    <div>
      <WelcomeHero name={student.name} grade={student.grade} streakDays={student.streakDays} />

      <StudentStatsGrid
        streakDays={student.streakDays}
        repairValue={student.repairValue}
        totalMistakes={student.totalMistakes}
        completedPracticeCount={student.completedPracticeCount}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
        marginBottom: 24,
      }}>
        <TodayTaskList
          tasks={tasks}
          knowledgePointNameMap={kpNameMap}
          mistakeTitleMap={mistakeTitleMap}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AtlasProgressCard {...atlas} />
          <AiStatusCard
            configured={llmConfigured}
            modelConfigured={llmModelConfig}
            baseUrlConfigured={llmUrlConfig}
          />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <HighRiskKnowledgeList
          knowledgePoints={kps}
          errorTagNameMap={tagNameMapper}
        />
      </div>

      <QuickEntryGrid
        onOpenMistakeInput={onNavigate ? () => onNavigate('mistake-input') : undefined}
        onOpenAtlas={onNavigate ? () => onNavigate('atlas') : undefined}
      />
    </div>
  )
}
