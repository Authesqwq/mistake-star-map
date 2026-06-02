import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

const variantBg: Record<ButtonVariant, string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-surface-soft)',
  ghost: 'transparent',
  danger: 'var(--color-danger)',
}

const variantColor: Record<ButtonVariant, string> = {
  primary: '#fff',
  secondary: 'var(--color-text)',
  ghost: 'var(--color-text)',
  danger: '#fff',
}

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string }> = {
  sm: { padding: '6px 14px', fontSize: '0.82rem' },
  md: { padding: '10px 24px', fontSize: '0.92rem' },
  lg: { padding: '14px 32px', fontSize: '1rem' },
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const s = sizeStyles[size]
  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        border: variant === 'ghost' ? '1px solid var(--color-border)' : 'none',
        borderRadius: 'var(--radius-sm)',
        background: variantBg[variant],
        color: variantColor[variant],
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.55 : 1,
        transition: 'opacity 0.15s, box-shadow 0.15s',
        ...style,
      }}
      {...rest}
    >
      {loading && <span style={{ fontSize: '0.85rem' }}>...</span>}
      {children}
    </button>
  )
}
