import type { LocalDataHealth } from '../../types/metrics'
import { Card } from '../ui/Card'

interface Props { health: LocalDataHealth }
export function LocalDataHealthCard({ health }: Props) {
  return (
    <Card title="本地数据健康" description="这些数据只保存在当前浏览器，用于本地演示和调试。">
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',fontSize:'0.82rem' }}>
        <span style={{color:'var(--color-text-muted)'}}>埋点事件</span><span>{health.analyticsEventCount}</span>
        <span style={{color:'var(--color-text-muted)'}}>确认记录</span><span>{health.confirmedDiagnosisCount}</span>
        <span style={{color:'var(--color-text-muted)'}}>复练结果</span><span>{health.practiceResultCount}</span>
        <span style={{color:'var(--color-text-muted)'}}>掌握度快照</span><span>{health.masterySnapshotCount}</span>
        <span style={{color:'var(--color-text-muted)'}}>成就记录</span><span>{health.achievementRecordCount}</span>
        <span style={{color:'var(--color-text-muted)'}}>报告快照</span><span>{health.savedReportCount}</span>
      </div>
    </Card>)
}
