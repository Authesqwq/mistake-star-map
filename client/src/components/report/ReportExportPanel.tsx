import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface ReportExportPanelProps {
  savedCount: number
  onDownload: () => void
  onClear: () => void
}

export function ReportExportPanel({ savedCount, onDownload, onClear }: ReportExportPanelProps) {
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <Card title="导出与快照" description={`已保存 ${savedCount} 份报告快照`}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button size="sm" variant="secondary" onClick={onDownload}>导出 JSON</Button>
        {confirmClear ? (
          <>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>再次点击确认清空</span>
            <Button size="sm" variant="danger" onClick={onClear}>确认清空</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>取消</Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setConfirmClear(true)}>清空已保存报告</Button>
        )}
      </div>
    </Card>
  )
}
