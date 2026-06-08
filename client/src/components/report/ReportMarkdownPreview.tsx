import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface ReportMarkdownPreviewProps {
  markdown: string
  onCopy: () => void
  copied: boolean
}

export function ReportMarkdownPreview({ markdown, onCopy, copied }: ReportMarkdownPreviewProps) {
  return (
    <Card
      title="Markdown 摘要"
      footer={<Button size="sm" onClick={onCopy}>{copied ? '已复制' : '复制 Markdown'}</Button>}
    >
      <pre style={{
        margin: 0, padding: 12, background: 'var(--color-surface-soft)',
        borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', whiteSpace: 'pre-wrap',
        maxHeight: 300, overflow: 'auto', color: 'var(--color-text)',
      }}>
        {markdown}
      </pre>
    </Card>
  )
}
