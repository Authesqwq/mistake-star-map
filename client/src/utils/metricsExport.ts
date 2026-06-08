import type { MetricsDashboardData } from '../types/metrics'

export function downloadMetricsJson(data: MetricsDashboardData): void {
  const safe = { ...data }
  const json = JSON.stringify(safe, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mistake-star-map-metrics-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
