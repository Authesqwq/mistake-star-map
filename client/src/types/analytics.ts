export type AnalyticsEventName =
  | 'page_view' | 'quick_entry_click' | 'today_recommendation_loaded'
  | 'today_recommendation_failed' | 'diagnosis_started' | 'diagnosis_succeeded'
  | 'diagnosis_failed' | 'diagnosis_confirmed' | 'atlas_viewed'
  | 'atlas_filter_changed' | 'practice_started' | 'practice_submitted'
  | 'practice_feedback_received' | 'mastery_snapshot_updated'
  | 'achievement_unlocked' | 'achievement_center_viewed'
  | 'report_generated' | 'report_markdown_copied' | 'report_json_exported'
  | 'eval_panel_opened' | 'eval_run_completed'

export type AnalyticsPageName =
  | 'today' | 'mistake_input' | 'atlas' | 'practice'
  | 'achievements' | 'report' | 'metrics' | 'dev'

export interface AnalyticsEvent {
  id: string; name: AnalyticsEventName; page: AnalyticsPageName
  createdAt: string; sessionId: string
  properties?: Record<string, string | number | boolean | null | undefined>
}

export interface AnalyticsSession { sessionId: string; startedAt: string; lastSeenAt: string }
