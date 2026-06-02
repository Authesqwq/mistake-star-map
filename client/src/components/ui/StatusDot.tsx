type Status = 'ok' | 'error' | 'warning' | 'neutral'

interface StatusDotProps {
  status: Status
  label?: string
}

const colors: Record<Status, string> = {
  ok: 'var(--color-success)',
  error: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  neutral: 'var(--color-text-muted)',
}

export function StatusDot({ status, label }: StatusDotProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: colors[status],
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {label && <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>}
    </span>
  )
}
