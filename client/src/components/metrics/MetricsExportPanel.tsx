import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface Props { eventCount: number; onDownload: () => void; onClear: () => void }
export function MetricsExportPanel({ eventCount, onDownload, onClear }: Props) {
  const [confirmClear, setConfirmClear] = useState(false)
  return (
    <Card title="数据管理" description={`已记录 ${eventCount} 条本地埋点事件`}>
      <p style={{fontSize:'0.78rem',color:'var(--color-text-muted)',marginBottom:12}}>
        这些数据仅保存在浏览器中。导出只包含聚合指标，不含完整题目、答案或 API Key。
      </p>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
        <Button size="sm" variant="secondary" onClick={onDownload}>导出指标 JSON</Button>
        {confirmClear ? (<>
          <span style={{fontSize:'0.8rem',color:'var(--color-danger)'}}>再次点击确认清空</span>
          <Button size="sm" variant="danger" onClick={onClear}>确认清空</Button>
          <Button size="sm" variant="ghost" onClick={()=>setConfirmClear(false)}>取消</Button>
        </>) : (
          <Button size="sm" variant="ghost" onClick={()=>setConfirmClear(true)}>清空埋点事件</Button>
        )}
      </div>
    </Card>)
}
