interface LoadingStateProps {
  text?: string
}

export function LoadingState({ text = '加载中...' }: LoadingStateProps) {
  return (
    <div style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
      {text}
    </div>
  )
}
