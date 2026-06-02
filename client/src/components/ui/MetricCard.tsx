interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: string
}

export function MetricCard({ title, value, description, trend }: MetricCardProps) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border)',
      padding: 'var(--space-5)',
    }}>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
        {title}
      </p>
      <p style={{
        margin: '6px 0 0',
        fontSize: '1.6rem',
        fontWeight: 700,
        color: 'var(--color-text)',
      }}>
        {value}
      </p>
      {(description || trend) && (
        <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {description}
          {trend && <span style={{ marginLeft: 6, fontWeight: 500 }}>{trend}</span>}
        </p>
      )}
    </div>
  )
}
