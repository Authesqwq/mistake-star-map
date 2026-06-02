import { useEffect, useState } from 'react'
import { getHealth } from './services/apiClient'
import { AppShell } from './components/layout/AppShell'
import { TodayRepairCenter } from './pages/TodayRepairCenter'
import { MistakeInputPage } from './pages/MistakeInputPage'
import { DevPreviewPage } from './pages/DevPreviewPage'

export type ActiveView = 'today' | 'mistake-input' | 'dev'

function App() {
  const [backendOk, setBackendOk] = useState(false)
  const [activeView, setActiveView] = useState<ActiveView>('today')

  useEffect(() => {
    getHealth()
      .then((data) => setBackendOk(data.status === 'ok'))
      .catch(() => setBackendOk(false))
  }, [])

  return (
    <AppShell backendOk={backendOk} activeView={activeView} onNavigate={(v) => setActiveView(v as ActiveView)}>
      {activeView === 'today' && <TodayRepairCenter onNavigate={(v) => setActiveView(v as ActiveView)} />}
      {activeView === 'mistake-input' && <MistakeInputPage />}
      {activeView === 'dev' && <DevPreviewPage />}
    </AppShell>
  )
}

export default App
