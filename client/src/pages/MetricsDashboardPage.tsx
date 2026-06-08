import { useEffect, useState, useCallback } from 'react'
import type { MetricsRange, MetricsDashboardData } from '../types/metrics'
import { getAnalyticsEvents, clearAnalyticsEvents } from '../utils/analyticsStorage'
import { buildMetricsDashboardData } from '../utils/metricsBuilder'
import { downloadMetricsJson } from '../utils/metricsExport'
import { getConfirmedDiagnoses } from '../utils/diagnosisStorage'
import { getPracticeResults } from '../utils/practiceStorage'
import { getSavedMasterySnapshots } from '../utils/masteryStorage'
import { getAchievementRecords, getMotivationProfile } from '../utils/achievementStorage'
import { getSavedReports } from '../utils/reportStorage'
import { MetricsHeader } from '../components/metrics/MetricsHeader'
import { MetricsSummaryGrid } from '../components/metrics/MetricsSummaryGrid'
import { FunnelCard } from '../components/metrics/FunnelCard'
import { ProductMetricsCard } from '../components/metrics/ProductMetricsCard'
import { AiMetricsCard } from '../components/metrics/AiMetricsCard'
import { RecommendationMetricsCard } from '../components/metrics/RecommendationMetricsCard'
import { PracticeMetricsCard } from '../components/metrics/PracticeMetricsCard'
import { AtlasMetricsCard } from '../components/metrics/AtlasMetricsCard'
import { AchievementMetricsCard } from '../components/metrics/AchievementMetricsCard'
import { ReportMetricsCard } from '../components/metrics/ReportMetricsCard'
import { LocalDataHealthCard } from '../components/metrics/LocalDataHealthCard'
import { EventLogTable } from '../components/metrics/EventLogTable'
import { MetricsExportPanel } from '../components/metrics/MetricsExportPanel'
import { trackPageView } from '../utils/analyticsTracker'

export function MetricsDashboardPage() {
  const [range, setRange] = useState<MetricsRange>('last_7_days')
  const [data, setData] = useState<MetricsDashboardData | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => { trackPageView('metrics') }, [])

  const build = useCallback(() => {
    const events = getAnalyticsEvents()
    const diagnoses = getConfirmedDiagnoses()
    const practices = getPracticeResults()
    const snapshots = getSavedMasterySnapshots()
    const achievements = getAchievementRecords()
    const profile = getMotivationProfile()
    const reports = getSavedReports()

    setData(buildMetricsDashboardData({
      range, analyticsEvents: events, confirmedDiagnoses: diagnoses,
      practiceResults: practices, masterySnapshots: snapshots,
      achievementRecords: achievements, motivationProfile: profile,
      savedReports: reports,
    }))
  }, [range, refreshKey])

  useEffect(() => { build() }, [build])

  const eventCount = getAnalyticsEvents().length

  return (
    <div>
      <MetricsHeader range={range} onRangeChange={setRange} onRefresh={() => setRefreshKey((n) => n + 1)} />

      {data && (
        <>
          <MetricsSummaryGrid data={data} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
            <FunnelCard funnel={data.funnel} />
            <ProductMetricsCard metrics={data.product} />
            <AiMetricsCard metrics={data.aiDiagnosis} />
            <RecommendationMetricsCard metrics={data.recommendation} />
            <PracticeMetricsCard metrics={data.practice} />
            <AtlasMetricsCard metrics={data.atlas} />
            <AchievementMetricsCard metrics={data.achievement} />
            <ReportMetricsCard metrics={data.report} />
            <LocalDataHealthCard health={data.localDataHealth} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <EventLogTable events={getAnalyticsEvents()} />
          </div>
          <MetricsExportPanel
            eventCount={eventCount}
            onDownload={() => data && downloadMetricsJson(data)}
            onClear={() => { clearAnalyticsEvents(); setRefreshKey((n) => n + 1) }}
          />
        </>
      )}
    </div>
  )
}
