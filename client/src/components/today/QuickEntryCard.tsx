interface QuickEntryCardProps {
  title: string
  description: string
  pr: string
  icon: string
}

export function QuickEntryCard({ title, description, pr, icon }: QuickEntryCardProps) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border)',
      padding: 'var(--space-5)',
      textAlign: 'center',
      opacity: 0.7,
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{icon}</div>
      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text)' }}>
        {title}
      </h4>
      <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
        {description}
      </p>
      <span style={{
        display: 'inline-block',
        marginTop: 8,
        fontSize: '0.7rem',
        padding: '2px 8px',
        borderRadius: 99,
        background: 'var(--color-surface-soft)',
        color: 'var(--color-text-muted)',
      }}>
        {pr}
      </span>
    </div>
  )
}
