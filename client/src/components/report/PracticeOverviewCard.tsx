import type { PracticeReportSummary } from '../../types/report'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { Badge } from '../ui/Badge'

interface PracticeOverviewCardProps { summary: PracticeReportSummary }

export function PracticeOverviewCard({ summary }: PracticeOverviewCardProps) {
  return (
    <Card title="复练概况">
      <ProgressBar value={summary.accuracyRate} max={100} showPercent />
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <Badge variant="info">总数 {summary.totalPracticeCount}</Badge>
        <Badge variant="success">答对 {summary.correctCount}</Badge>
        <Badge variant="danger">待重试 {summary.incorrectCount}</Badge>
        <Badge variant="warning">需确认 {summary.needsReviewCount}</Badge>
      </div>
    </Card>
  )
}
