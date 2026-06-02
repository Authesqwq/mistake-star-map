import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'

interface AppShellProps {
  children: ReactNode
  backendOk: boolean
}

export function AppShell({ children, backendOk }: AppShellProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--color-bg)',
    }}>
      <Header backendOk={backendOk} />
      <div style={{
        display: 'flex',
        flex: 1,
        '@media (maxWidth: 768)': {
          flexDirection: 'column',
        },
      } as React.CSSProperties}>
        <div className="sidebar-container">
          <Sidebar active="dev" />
        </div>
        <MainContent>{children}</MainContent>
      </div>
    </div>
  )
}
