import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function Card({ title, description, children, footer }: CardProps) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
    }}>
      {(title || description) && (
        <div style={{
          padding: 'var(--space-4) var(--space-5)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          {title && <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{title}</h3>}
          {description && <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{description}</p>}
        </div>
      )}
      <div style={{ padding: 'var(--space-5)' }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: 'var(--space-3) var(--space-5)',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface-soft)',
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}
