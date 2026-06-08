import { useEffect, useState } from 'react'
import type { DiagnoseResponse, ConfirmedDiagnosisRecord } from '../types/diagnosis'
import type { KnowledgePoint, ErrorTag } from '../types/domain'
import { trackEvent } from "../utils/analyticsTracker"
import { getKnowledgePoints, getErrorTags, diagnoseMistake, ApiError } from '../services/apiClient'
import { saveConfirmedDiagnosis, getConfirmedCount } from '../utils/diagnosisStorage'
import { mapKnowledgePointOptions, mapErrorTagOptions } from '../utils/diagnosisMappers'
import { SectionHeader } from '../components/ui/SectionHeader'
import { LoadingState } from '../components/ui/LoadingState'
import { ErrorState } from '../components/ui/ErrorState'
import { SampleMistakePanel } from '../components/mistake/SampleMistakePanel'
import type { Sample } from '../components/mistake/SampleMistakePanel'
import { MistakeInputForm } from '../components/mistake/MistakeInputForm'
import { CandidateSelector } from '../components/mistake/CandidateSelector'
import { DiagnosisResultCard } from '../components/mistake/DiagnosisResultCard'
import { DiagnosisCorrectionPanel } from '../components/mistake/DiagnosisCorrectionPanel'
import { DiagnosisConfirmCard } from '../components/mistake/DiagnosisConfirmCard'

interface FormData {
  grade: string
  question: string
  wrongAnswer: string
  correctAnswer: string
}

const emptyForm: FormData = { grade: '八年级', question: '', wrongAnswer: '', correctAnswer: '' }

export function MistakeInputPage() {
  const [kps, setKps] = useState<KnowledgePoint[]>([])
  const [tags, setTags] = useState<ErrorTag[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [dataError, setDataError] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>(emptyForm)
  const [selKps, setSelKps] = useState<string[]>([])
  const [selTags, setSelTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [candidateError, setCandidateError] = useState('')

  const [diagResult, setDiagResult] = useState<DiagnoseResponse | null>(null)
  const [correctedKpId, setCorrectedKpId] = useState('')
  const [correctedTagIds, setCorrectedTagIds] = useState<string[]>([])
  const [correctionError, setCorrectionError] = useState('')
  const [confirmedRecord, setConfirmedRecord] = useState<ConfirmedDiagnosisRecord | null>(null)
  const [recordCount, setRecordCount] = useState(0)

  useEffect(() => {
    Promise.all([getKnowledgePoints(), getErrorTags()])
      .then(([kpData, tagData]) => {
        setKps(kpData as unknown as KnowledgePoint[])
        setTags(tagData as unknown as ErrorTag[])
        setSelKps((kpData as unknown as KnowledgePoint[]).map((k) => k.id))
        setSelTags((tagData as unknown as ErrorTag[]).map((t) => t.id))
        setLoadingData(false)
      })
      .catch((e) => {
        setDataError(e instanceof ApiError ? e.message : '加载数据失败')
        setLoadingData(false)
      })
  }, [])

  const validateForm = (): boolean => {
    const errs: string[] = []
    if (!form.grade.trim() || form.grade.length > 20) errs.push('年级不能为空且不超过 20 字')
    if (form.question.length < 5) errs.push('题目至少 5 字')
    if (form.question.length > 2000) errs.push('题目不超过 2000 字')
    if (!form.wrongAnswer.trim() || form.wrongAnswer.length > 1000) errs.push('错误答案不能为空且不超过 1000 字')
    if (!form.correctAnswer.trim() || form.correctAnswer.length > 1000) errs.push('正确答案不能为空且不超过 1000 字')
    if (selKps.length === 0) {
      setCandidateError('至少选择 1 个知识点')
      errs.push('至少选择 1 个知识点')
    } else setCandidateError('')
    if (selTags.length === 0) {
      setCandidateError((p) => p ? p + '; 至少选择 1 个错因标签' : '至少选择 1 个错因标签')
      errs.push('至少选择 1 个错因标签')
    }
    setFormErrors(errs)
    return errs.length === 0 && selKps.length > 0 && selTags.length > 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setSubmitting(true)
trackEvent("diagnosis_started", "mistake_input")
    setDiagResult(null)
    setConfirmedRecord(null)
    try {
      const result = await diagnoseMistake({
        subjectId: 'math',
        subjectName: '数学',
        grade: form.grade,
        question: form.question,
        wrongAnswer: form.wrongAnswer,
        correctAnswer: form.correctAnswer,
        candidateKnowledgePointIds: selKps,
        candidateErrorTagIds: selTags,
      })
      setDiagResult(result)
trackEvent("diagnosis_succeeded", "mistake_input", { source: result.source, confidence: result.confidence, needReview: result.needReview })
      setCorrectedKpId(result.knowledgePointId)
      setCorrectedTagIds(result.errorTags.map((t) => t.id))
    } catch (e) {
      setFormErrors([e instanceof ApiError ? `${e.code}: ${e.message}` : '请求失败'])
trackEvent("diagnosis_failed", "mistake_input")
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = () => {
    setCorrectionError('')
    if (!correctedKpId) { setCorrectionError('请选择知识点'); return }
    if (correctedTagIds.length === 0) { setCorrectionError('请选择至少 1 个错因标签'); return }

    const kp = kps.find((k) => k.id === correctedKpId)
    const record: ConfirmedDiagnosisRecord = {
      id: `diag-${Date.now()}`,
      createdAt: new Date().toISOString(),
      subjectId: 'math',
      grade: form.grade,
      question: form.question,
      wrongAnswer: form.wrongAnswer,
      correctAnswer: form.correctAnswer,
      originalDiagnosis: diagResult!,
      correctedKnowledgePointId: correctedKpId,
      correctedKnowledgePointName: kp?.name ?? correctedKpId,
      correctedErrorTags: correctedTagIds.map((id) => {
        const t = tags.find((tag) => tag.id === id)
        return t ? { id: t.id, name: t.name, severity: t.severity } : { id, name: id, severity: 0 }
      }),
      source: diagResult!.source,
      needReview: diagResult!.needReview,
    }
    saveConfirmedDiagnosis(record)
    setConfirmedRecord(record)
trackEvent("diagnosis_confirmed", "mistake_input")
    setRecordCount(getConfirmedCount())
  }

  const handleSample = (sample: Sample) => {
    setForm({
      grade: sample.grade,
      question: sample.question,
      wrongAnswer: sample.wrongAnswer,
      correctAnswer: sample.correctAnswer,
    })
    setSelKps(sample.candidateKnowledgePointIds.filter((id) => kps.some((k) => k.id === id)))
    setSelTags(sample.candidateErrorTagIds.filter((id) => tags.some((t) => t.id === id)))
    setDiagResult(null)
    setConfirmedRecord(null)
  }

  const handleClear = () => {
    setForm(emptyForm)
    setFormErrors([])
    setDiagResult(null)
    setConfirmedRecord(null)
    setSelKps(kps.map((k) => k.id))
    setSelTags(tags.map((t) => t.id))
  }

  const handleNext = () => {
    handleClear()
  }

  if (loadingData) return <LoadingState text="加载知识点和错因标签..." />
  if (dataError) return <ErrorState message={dataError} />

  const kpOptions = mapKnowledgePointOptions(kps)
  const tagOptions = mapErrorTagOptions(tags)

  return (
    <div>
      <SectionHeader
        title="错题录入"
        description="录入题目、错误答案和正确答案后，系统会调用 AI 归因接口，识别可能的知识点和错因。"
      />

      <SampleMistakePanel onSelect={handleSample} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 24,
        marginBottom: 24,
      }}>
        <MistakeInputForm
          data={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClear={handleClear}
          loading={submitting}
          errors={formErrors}
        />
        <CandidateSelector
          knowledgePointOptions={kpOptions}
          errorTagOptions={tagOptions}
          selectedKpIds={selKps}
          selectedTagIds={selTags}
          onKpChange={setSelKps}
          onTagChange={setSelTags}
          error={candidateError}
        />
      </div>

      {diagResult && !confirmedRecord && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
          <DiagnosisResultCard result={diagResult} />
          <DiagnosisCorrectionPanel
            diagnosisResult={diagResult}
            knowledgePoints={kps}
            errorTags={tags}
            correctedKpId={correctedKpId}
            correctedTagIds={correctedTagIds}
            onKpChange={setCorrectedKpId}
            onTagChange={setCorrectedTagIds}
            onConfirm={handleConfirm}
            error={correctionError}
          />
        </div>
      )}

      {confirmedRecord && (
        <DiagnosisConfirmCard
          record={confirmedRecord}
          recordCount={recordCount}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
