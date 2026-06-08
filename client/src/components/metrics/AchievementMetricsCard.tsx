import type { AchievementMetricsView } from '../../types/metrics'
import { Card } from '../ui/Card'

interface Props { metrics: AchievementMetricsView }
export function AchievementMetricsCard({ metrics }: Props) {
  return (
    <Card title="成就系统"><div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',fontSize:'0.82rem' }}>
      <span style={{color:'var(--color-text-muted)'}}>解锁事件</span><span>{metrics.achievementUnlockedEventCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>已解锁</span><span>{metrics.unlockedAchievementCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>修复值</span><span>{metrics.repairValue}</span>
      <span style={{color:'var(--color-text-muted)'}}>连续修复</span><span>{metrics.streakDays}天</span>
    </div></Card>)
}
