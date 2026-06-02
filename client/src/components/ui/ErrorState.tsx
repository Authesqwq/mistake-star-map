interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message = '加载失败，请稍后重试' }: ErrorStateProps) {
  return (
    <div style={{
      padding: 'var(--space-5)',
      textAlign: 'center',
      color: 'var(--color-danger)',
      fontSize: '0.9rem',
      background: '#fee2e2',
      borderRadius: 'var(--radius-sm)',
    }}>
      {message}
    </div>
  )
}
