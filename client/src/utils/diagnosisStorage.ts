import type { ConfirmedDiagnosisRecord } from '../types/diagnosis'

const STORAGE_KEY = 'mistake-star-map.confirmed-diagnoses'
const MAX_RECORDS = 50

export function getConfirmedDiagnoses(): ConfirmedDiagnosisRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as ConfirmedDiagnosisRecord[]
  } catch {
    return []
  }
}

export function saveConfirmedDiagnosis(record: ConfirmedDiagnosisRecord): void {
  const records = getConfirmedDiagnoses()
  records.push(record)
  if (records.length > MAX_RECORDS) {
    records.splice(0, records.length - MAX_RECORDS)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function clearConfirmedDiagnoses(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getConfirmedCount(): number {
  return getConfirmedDiagnoses().length
}
