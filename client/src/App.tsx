import { useEffect, useState } from 'react'
import { getHealth } from './services/apiClient'
import { AppShell } from './components/layout/AppShell'
import { TodayRepairCenter } from './pages/TodayRepairCenter'
import { MistakeInputPage } from './pages/MistakeInputPage'
import { KnowledgeAtlasPage } from './pages/KnowledgeAtlasPage'
import { PracticePage } from './pages/PracticePage'
import { AchievementCenterPage } from './pages/AchievementCenterPage'
import { DevPreviewPage } from './pages/DevPreviewPage'
import type { RecommendedPracticeTask } from './types/recommendation'

export type ActiveView = 'today' | 'mistake-input' | 'atlas' | 'practice' | 'achievements' | 'dev'

function App() {
  const [backendOk, setBackendOk] = useState(false)
  const [activeView, setActiveView] = useState<ActiveView>('today')
  const [selectedPracticeTask, setSelectedPracticeTask] = useState<RecommendedPracticeTask | null>(null)

  useEffect(() => {
    getHealth()
      .then((data) => setBackendOk(data.status === 'ok'))
      .catch(() => setBackendOk(false))
  }, [])

  const nav = (v: string) => setActiveView(v as ActiveView)

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
      {activeView === 'today' && (
        <TodayRepairCenter onNavigate={nav} onStartPractice={handleStartPractice} />
      )}
      {activeView === 'mistake-input' && <MistakeInputPage />}
      {activeView === 'atlas' && <KnowledgeAtlasPage />}
      {activeView === 'practice' && (
        <PracticePage selectedTask={selectedPracticeTask} onBack={handleBackFromPractice} />
      )}
      {activeView === 'achievements' && <AchievementCenterPage />}
      {activeView === 'dev' && <DevPreviewPage />}
    </AppShell>
  )
}

export default App
