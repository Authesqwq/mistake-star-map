import { useEffect, useState } from 'react'
import { getHealth } from './services/apiClient'
import { AppShell } from './components/layout/AppShell'
import { TodayRepairCenter } from './pages/TodayRepairCenter'
import { MistakeInputPage } from './pages/MistakeInputPage'
import { KnowledgeAtlasPage } from './pages/KnowledgeAtlasPage'
import { DevPreviewPage } from './pages/DevPreviewPage'

export type ActiveView = 'today' | 'mistake-input' | 'atlas' | 'dev'

function App() {
  const [backendOk, setBackendOk] = useState(false)
  const [activeView, setActiveView] = useState<ActiveView>('today')

  useEffect(() => {
    getHealth()
      .then((data) => setBackendOk(data.status === 'ok'))
      .catch(() => setBackendOk(false))
  }, [])

  const nav = (v: string) => setActiveView(v as ActiveView)

  return (
    <AppShell backendOk={backendOk} activeView={activeView} onNavigate={nav}>
      {activeView === 'today' && <TodayRepairCenter onNavigate={nav} />}
      {activeView === 'mistake-input' && <MistakeInputPage />}
      {activeView === 'atlas' && <KnowledgeAtlasPage />}
      {activeView === 'dev' && <DevPreviewPage />}
    </AppShell>
  )
}

export default App
