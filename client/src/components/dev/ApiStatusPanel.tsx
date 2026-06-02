import { useEffect, useState } from 'react'
import { getHealth, getLlmStatus, ApiError } from '../../services/apiClient'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Tag } from '../ui/Tag'
import { LoadingState } from '../ui/LoadingState'
import { ErrorState } from '../ui/ErrorState'

interface HealthData { status: string; service: string; version: string; environment: string; llmConfigured: boolean; uptime: number }
interface LlmStatus { configured: boolean; modelConfigured: boolean; baseUrlConfigured: boolean; apiKeyConfigured: boolean; model: string; timeoutMs: number; maxRetries: number }

export function ApiStatusPanel() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [llmStatus, setLlmStatus] = useState<LlmStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getHealth(), getLlmStatus()])
      .then(([h, l]) => { setHealth(h); setLlmStatus(l); setLoading(false) })
      .catch((e) => { setError(e instanceof ApiError ? e.message : 'Failed to load'); setLoading(false) })
  }, [])

  return (
    <Card title="API 状态">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {health && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <Badge variant="success">{health.status}</Badge>
          <Badge variant="info">v{health.version}</Badge>
          <Badge variant={health.llmConfigured ? 'success' : 'warning'}>
            LLM {health.llmConfigured ? 'OK' : 'No'}
          </Badge>
          <Tag label={`${health.uptime}s uptime`} />
        </div>
      )}
      {health && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Service</span>
          <span>{health.service}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>Environment</span>
          <span>{health.environment}</span>
          {llmStatus && (
            <>
              <span style={{ color: 'var(--color-text-muted)' }}>URL configured</span>
              <Badge variant={llmStatus.baseUrlConfigured ? 'success' : 'warning'}>
                {llmStatus.baseUrlConfigured ? 'Yes' : 'No'}
              </Badge>
              <span style={{ color: 'var(--color-text-muted)' }}>Timeout / Retries</span>
              <span>{llmStatus.timeoutMs}ms / {llmStatus.maxRetries}</span>
            </>
          )}
        </div>
      )}
    </Card>
  )
}
