import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface RepairValueCardProps { value: number }

export function RepairValueCard({ value }: RepairValueCardProps) {
  return (
    <Card title="修复值" description="修复值记录你完成有效复练和错因修复的过程，只和自己的学习记录有关。">
      <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{value}</p>
      <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
        <Badge variant="success">确认归因 +2</Badge>{' '}
        <Badge variant="info">完成复练 +5</Badge>{' '}
        <Badge variant="warning">答对 +5</Badge>{' '}
        <Badge variant="danger">成就 +10~35</Badge>
      </p>
    </Card>
  )
}
