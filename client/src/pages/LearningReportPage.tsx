import { useEffect, useState, useCallback } from 'react'
import type { ReportRange, LearningReport } from '../types/report'
import { getConfirmedDiagnoses } from '../utils/diagnosisStorage'
import { trackEvent } from "../utils/analyticsTracker"
import { getPracticeResults } from '../utils/practiceStorage'
import { getSavedMasterySnapshots } from '../utils/masteryStorage'
import { getAchievementRecords, getMotivationProfile } from '../utils/achievementStorage'
import { buildLearningReport } from '../utils/reportBuilder'
import { saveLearningReport, getSavedReports, clearSavedReports } from '../utils/reportStorage'
import { copyReportMarkdown, downloadReportJson } from '../utils/reportExport'
import { LoadingState } from '../components/ui/LoadingState'
import { ReportHeader } from '../components/report/ReportHeader'
import { ReportSummaryGrid } from '../components/report/ReportSummaryGrid'
import { PracticeOverviewCard } from '../components/report/PracticeOverviewCard'
import { ErrorTagDistributionCard } from '../components/report/ErrorTagDistributionCard'
import { MasteryImprovementCard } from '../components/report/MasteryImprovementCard'
import { HighRiskReportCard } from '../components/report/HighRiskReportCard'
import { AchievementReportCard } from '../components/report/AchievementReportCard'
import { WeeklySuggestionCard } from '../components/report/WeeklySuggestionCard'
import { ReportMarkdownPreview } from '../components/report/ReportMarkdownPreview'
import { ReportExportPanel } from '../components/report/ReportExportPanel'

export function LearningReportPage() {
  const [range, setRange] = useState<ReportRange>('last_7_days')
  const [report, setReport] = useState<LearningReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [savedCount, setSavedCount] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)

  const buildReport = useCallback(() => {
    const diagnoses = getConfirmedDiagnoses()
    const practices = getPracticeResults()
    const masterySnapshots = getSavedMasterySnapshots()
    const achievementRecords = getAchievementRecords()
    const motivationProfile = getMotivationProfile()

    const r = buildLearningReport({
      range, confirmedDiagnoses: diagnoses, practiceResults: practices,
      masterySnapshots, achievementRecords, motivationProfile,
    })
    setReport(r)
    setSavedCount(getSavedReports().length)
  }, [range, refreshKey])

  useEffect(() => {
    setLoading(true)
    buildReport()
    setLoading(false)
trackEvent("report_generated", "report", { practiceCount: summary?.totalPracticeCount ?? 0 })
  }, [buildReport])

  const handleCopy = async () => {
trackEvent("report_markdown_copied", "report")
    if (!report) return
    await copyReportMarkdown(report.markdownSummary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    if (!report) return
    saveLearningReport(report)
    setSavedCount(getSavedReports().length)
  }

  const handleDownload = () => {
trackEvent("report_json_exported", "report")
    if (!report) return
    downloadReportJson(report)
  }

  const handleClear = () => {
    clearSavedReports()
    setSavedCount(0)
  }

  if (loading) return <LoadingState text="生成学习报告..." />

  const summary = report?.practiceSummary
  if (!summary || summary.totalPracticeCount === 0) {
    return (
      <div>
        <ReportHeader range={range} onRangeChange={setRange} onRefresh={() => setRefreshKey((n) => n + 1)} onSave={handleSave} />
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-muted)' }}>
          暂无足够数据生成报告。完成错题录入和复练后，报告会自动显示。
        </div>
      </div>
    )
  }

  return (
    <div>
      <ReportHeader range={range} onRangeChange={setRange} onRefresh={() => setRefreshKey((n) => n + 1)} onSave={handleSave} />

      <ReportSummaryGrid
        practiceCount={summary.totalPracticeCount} accuracyRate={summary.accuracyRate}
        kpCount={summary.practicedKnowledgePointCount}
        improvementCount={report!.masteryImprovements.length}
        highRiskCount={report!.highRiskKnowledgePoints.length}
        achievementCount={report!.achievementSummary.unlockedAchievementCount}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        <PracticeOverviewCard summary={summary} />
        <ErrorTagDistributionCard items={report!.errorTagDistribution} />
        <MasteryImprovementCard items={report!.masteryImprovements} />
        <HighRiskReportCard items={report!.highRiskKnowledgePoints} />
        <AchievementReportCard summary={report!.achievementSummary} />
        <WeeklySuggestionCard suggestions={report!.suggestions} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <ReportMarkdownPreview markdown={report!.markdownSummary} onCopy={handleCopy} copied={copied} />
trackEvent("report_markdown_copied", "report")
      </div>

      <ReportExportPanel savedCount={savedCount} onDownload={handleDownload} onClear={handleClear} />
trackEvent("report_json_exported", "report")
    </div>
  )
}
