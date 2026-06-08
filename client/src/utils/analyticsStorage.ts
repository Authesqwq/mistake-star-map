import type { AnalyticsEvent, AnalyticsSession } from '../types/analytics'

const EVENTS_KEY = 'mistake-star-map.analytics-events'
const SESSION_KEY = 'mistake-star-map.analytics-session'
const MAX_EVENTS = 1000

function rndId() { return Math.random().toString(36).slice(2, 10) }

export function getAnalyticsEvents(): AnalyticsEvent[] {
  try { const raw = localStorage.getItem(EVENTS_KEY); if (!raw) return []; const p = JSON.parse(raw); return Array.isArray(p) ? p : [] }
  catch { return [] }
}

export function saveAnalyticsEvent(event: AnalyticsEvent): void {
  const events = getAnalyticsEvents(); events.push(event)
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS)
  try { localStorage.setItem(EVENTS_KEY, JSON.stringify(events)) } catch {}
}

export function saveAnalyticsEvents(events: AnalyticsEvent[]): void {
  try { localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS))) } catch {}
}

export function clearAnalyticsEvents(): void { localStorage.removeItem(EVENTS_KEY) }

export function getOrCreateAnalyticsSession(): AnalyticsSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw) as AnalyticsSession
  } catch {}
  const s: AnalyticsSession = { sessionId: rndId(), startedAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() }
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)) } catch {}
  return s
}

export function updateAnalyticsSession(): AnalyticsSession {
  const s = getOrCreateAnalyticsSession(); s.lastSeenAt = new Date().toISOString()
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)) } catch {}
  return s
}
