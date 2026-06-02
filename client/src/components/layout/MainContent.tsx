import type { ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main style={{
      flex: 1,
      padding: 'var(--space-6)',
      maxWidth: 960,
      width: '100%',
      margin: '0 auto',
      minHeight: 0,
    }}>
      {children}
    </main>
  )
}
