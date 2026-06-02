import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'

export type ActiveView = 'today' | 'mistake-input' | 'dev'

interface AppShellProps {
  children: ReactNode
  backendOk: boolean
  activeView: ActiveView
  onNavigate: (view: string) => void
}

export function AppShell({ children, backendOk, activeView, onNavigate }: AppShellProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--color-bg)',
    }}>
      <Header backendOk={backendOk} />
      <div style={{ display: 'flex', flex: 1 }}>
        <div className="sidebar-container">
          <Sidebar active={activeView} onNavigate={onNavigate} />
        </div>
        <MainContent>{children}</MainContent>
      </div>
    </div>
  )
}
