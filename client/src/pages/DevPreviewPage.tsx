import { ApiStatusPanel } from '../components/dev/ApiStatusPanel'
import { MockSummaryPanel } from '../components/dev/MockSummaryPanel'
import { DiagnosisSmokePanel } from '../components/dev/DiagnosisSmokePanel'
import { SectionHeader } from '../components/ui/SectionHeader'

export function DevPreviewPage() {
  return (
    <div>
      <SectionHeader
        title="开发联调"
        description="用于验证后端 API、Mock 数据和 AI 归因接口。诊断接口仅手动触发。"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ApiStatusPanel />
        <MockSummaryPanel />
        <DiagnosisSmokePanel />
      </div>
    </div>
  )
}
