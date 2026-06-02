import { useEffect, useState } from 'react'
import { getHealth } from './services/apiClient'
import { AppShell } from './components/layout/AppShell'
import { TodayRepairCenter } from './pages/TodayRepairCenter'
import { DevPreviewPage } from './pages/DevPreviewPage'

type ActiveView = 'today' | 'dev'

function App() {
  const [backendOk, setBackendOk] = useState(false)
  const [activeView, setActiveView] = useState<ActiveView>('today')

  useEffect(() => {
    getHealth()
      .then((data) => setBackendOk(data.status === 'ok'))
      .catch(() => setBackendOk(false))
  }, [])

  return (
    <AppShell backendOk={backendOk} activeView={activeView} onNavigate={setActiveView}>
      {activeView === 'today' ? <TodayRepairCenter /> : <DevPreviewPage />}
    </AppShell>
  )
}

export default App
