interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = '暂无数据',
  description = '当前没有可展示的内容',
}: EmptyStateProps) {
  return (
    <div style={{
      padding: 'var(--space-6)',
      textAlign: 'center',
      color: 'var(--color-text-muted)',
    }}>
      <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: '0.85rem' }}>{description}</p>
    </div>
  )
}
