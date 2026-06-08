import { useEffect, useState } from 'react'
import { getHealth } from './services/apiClient'
import { AppShell } from './components/layout/AppShell'
import { TodayRepairCenter } from './pages/TodayRepairCenter'
import { MistakeInputPage } from './pages/MistakeInputPage'
import { KnowledgeAtlasPage } from './pages/KnowledgeAtlasPage'
import { PracticePage } from './pages/PracticePage'
import { AchievementCenterPage } from './pages/AchievementCenterPage'
import { LearningReportPage } from './pages/LearningReportPage'
import { MetricsDashboardPage } from './pages/MetricsDashboardPage'
import { DevPreviewPage } from './pages/DevPreviewPage'
import { trackPageView } from './utils/analyticsTracker'
import type { RecommendedPracticeTask } from './types/recommendation'

export type AppActiveView = 'today' | 'mistake-input' | 'atlas' | 'practice' | 'achievements' | 'report' | 'metrics' | 'dev'

function App() {
  const [backendOk, setBackendOk] = useState(false)
  const [activeView, setActiveView] = useState<AppActiveView>('today')
  const [selectedPracticeTask, setSelectedPracticeTask] = useState<RecommendedPracticeTask | null>(null)

  useEffect(() => {
    getHealth()
      .then((data) => setBackendOk(data.status === 'ok'))
      .catch(() => setBackendOk(false))
    trackPageView(activeView === 'mistake-input' ? 'mistake_input' : activeView as any)
  }, [])

  useEffect(() => { trackPageView(activeView === 'mistake-input' ? 'mistake_input' : activeView as any) }, [activeView])

  const nav = (v: string) => setActiveView(v as AppActiveView)

  const handleStartPractice = (task: RecommendedPracticeTask) => {
    setSelectedPracticeTask(task)
    setActiveView('practice')
  }

  const handleBackFromPractice = () => {
    setSelectedPracticeTask(null)
    setActiveView('today')
  }

  return (
    <AppShell backendOk={backendOk} activeView={activeView} onNavigate={nav}>
      {activeView === 'today' && <TodayRepairCenter onNavigate={nav} onStartPractice={handleStartPractice} />}
      {activeView === 'mistake-input' && <MistakeInputPage />}
      {activeView === 'atlas' && <KnowledgeAtlasPage />}
      {activeView === 'practice' && <PracticePage selectedTask={selectedPracticeTask} onBack={handleBackFromPractice} />}
      {activeView === 'achievements' && <AchievementCenterPage />}
      {activeView === 'report' && <LearningReportPage />}
      {activeView === 'metrics' && <MetricsDashboardPage />}
      {activeView === 'dev' && <DevPreviewPage />}
    </AppShell>
  )
}

export default App
