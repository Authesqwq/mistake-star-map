interface TagProps {
  label: string
  severity?: number
}

const severityColors: Record<number, string> = {
  1: '#dcfce7',
  2: '#f0fdf4',
  3: '#fef3c7',
  4: '#fee2e2',
  5: '#fce7f3',
}

export function Tag({ label, severity }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.8rem',
        fontWeight: 500,
        background: severity ? (severityColors[severity] ?? 'var(--color-surface-soft)') : 'var(--color-surface-soft)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
      }}
    >
      {label}
      {severity !== undefined && (
        <span style={{ marginLeft: 4, fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
          Lv{severity}
        </span>
      )}
    </span>
  )
}
