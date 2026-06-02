interface ProgressBarProps {
  value: number
  max?: number
  showPercent?: boolean
}

export function ProgressBar({ value, max = 100, showPercent = false }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max))
  const pct = max > 0 ? Math.round((clamped / max) * 100) : 0

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1,
        height: 8,
        borderRadius: 4,
        background: 'var(--color-border)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 4,
          background: pct >= 80 ? 'var(--color-success)' : pct >= 40 ? 'var(--color-primary)' : 'var(--color-warning)',
          transition: 'width 0.3s',
        }} />
      </div>
      {showPercent && (
        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', minWidth: 36, textAlign: 'right' }}>
          {pct}%
        </span>
      )}
    </div>
  )
}
