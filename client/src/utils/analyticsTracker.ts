import type { AnalyticsEventName, AnalyticsPageName, AnalyticsEvent } from '../types/analytics'
import { saveAnalyticsEvent, updateAnalyticsSession } from './analyticsStorage'

const SENSITIVE_KEYS = [
  'question', 'wronganswer', 'correctanswer', 'useranswer', 'expectedanswer',
  'raw', 'rawresponse', 'apikey', 'authorization', 'token', 'password', 'secret', 'stack',
]

export function sanitizeAnalyticsProperties(
  properties?: AnalyticsEvent['properties']
): AnalyticsEvent['properties'] {
  if (!properties) return undefined
  const safe: Record<string, string | number | boolean | null | undefined> = {}
  for (const [k, v] of Object.entries(properties)) {
    if (SENSITIVE_KEYS.some((sk) => k.toLowerCase().includes(sk))) continue
    safe[k] = v
  }
  return Object.keys(safe).length > 0 ? safe : undefined
}

export function trackEvent(
  name: AnalyticsEventName,
  page: AnalyticsPageName,
  properties?: AnalyticsEvent['properties']
): AnalyticsEvent | null {
  try {
    const session = updateAnalyticsSession()
    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name, page, createdAt: new Date().toISOString(),
      sessionId: session.sessionId,
      properties: sanitizeAnalyticsProperties(properties),
    }
    saveAnalyticsEvent(event)
    return event
  } catch (e) {
    console.warn('[analytics] failed to track event', e)
    return null
  }
}

export function trackPageView(page: AnalyticsPageName): void {
  trackEvent('page_view', page)
}
