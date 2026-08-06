// clinicalDemoData.js
// ─────────────────────────────────────────────
// Static constants only. All live numbers come
// from the API or from session state in App.jsx.
// ─────────────────────────────────────────────

export const statusPalette = {
  URGENT: {
    bg: 'rgba(220,38,38,0.12)',
    border: 'rgba(220,38,38,0.3)',
    color: '#f87171'
  },
  HIGH: {
    bg: 'rgba(234,88,12,0.12)',
    border: 'rgba(234,88,12,0.3)',
    color: '#fb923c'
  },
  MODERATE: {
    bg: 'rgba(202,138,4,0.12)',
    border: 'rgba(202,138,4,0.3)',
    color: '#fbbf24'
  },
  MONITOR: {
    bg: 'rgba(37,99,235,0.12)',
    border: 'rgba(37,99,235,0.3)',
    color: '#60a5fa'
  },
  CLEAR: {
    bg: 'rgba(22,163,74,0.12)',
    border: 'rgba(22,163,74,0.3)',
    color: '#4ade80'
  }
}

export const diagnosisPalette = {
  "Parkinson's": {
    bg: 'rgba(220,38,38,0.15)',
    color: '#f87171',
    border: 'rgba(220,38,38,0.3)'
  },
  "Alzheimer's": {
    bg: 'rgba(234,88,12,0.15)',
    color: '#fb923c',
    border: 'rgba(234,88,12,0.3)'
  },
  'Epilepsy': {
    bg: 'rgba(202,138,4,0.15)',
    color: '#fbbf24',
    border: 'rgba(202,138,4,0.3)'
  },
  'Cognitive impairment risk': {
    bg: 'rgba(37,99,235,0.15)',
    color: '#60a5fa',
    border: 'rgba(37,99,235,0.3)'
  },
  'No high-risk pattern detected': {
    bg: 'rgba(22,163,74,0.15)',
    color: '#4ade80',
    border: 'rgba(22,163,74,0.3)'
  },
  'default': {
    bg: 'rgba(37,99,235,0.12)',
    color: '#60a5fa',
    border: 'rgba(37,99,235,0.25)'
  }
}

export function getRiskColor(risk) {
  if (risk >= 80) return '#f87171'
  if (risk >= 60) return '#fb923c'
  if (risk >= 40) return '#fbbf24'
  if (risk >= 20) return '#60a5fa'
  return '#4ade80'
}

// Age bucket helper — used by Charts
// Takes an array of session patients, returns 5 bucket averages
export function computeAgeRiskBuckets(patients) {
  const buckets = [
    { label: '18-30', min: 18, max: 30, risks: [] },
    { label: '31-45', min: 31, max: 45, risks: [] },
    { label: '46-60', min: 46, max: 60, risks: [] },
    { label: '61-75', min: 61, max: 75, risks: [] },
    { label: '75+',   min: 76, max: 200, risks: [] },
  ]
  patients.forEach(p => {
    const bucket = buckets.find(b => p.age >= b.min && p.age <= b.max)
    if (bucket) bucket.risks.push(p.risk)
  })
  return buckets.map(b =>
    b.risks.length > 0
      ? Math.round(b.risks.reduce((a, c) => a + c, 0) / b.risks.length)
      : 0
  )
}

// Disease distribution — computed from session patients
export function computeDiseaseDistribution(patients) {
  const counts = {
    "Parkinson's": 0,
    "Alzheimer's": 0,
    "Epilepsy": 0,
    "Cognitive impairment risk": 0,
    "Other": 0
  }
  patients.forEach(p => {
    if (counts[p.diagnosis] !== undefined) {
      counts[p.diagnosis]++
    } else {
      counts["Other"]++
    }
  })
  return Object.values(counts)
}

// Stats computed from session patients
export function computeSessionStats(patients, modelInfo) {
  const urgentOrHigh = patients.filter(
    p => p.status === 'URGENT' || p.status === 'HIGH'
  ).length

  const moderate = patients.filter(p => p.status === 'MODERATE').length
  const monitorOrClear = patients.filter(
    p => p.status === 'MONITOR' || p.status === 'CLEAR'
  ).length

  // Pull real training rows from model-info API response
  const parkRows = modelInfo?.models?.parkinsons?.rows ?? 0
  const alzRows  = modelInfo?.models?.alzheimers?.rows ?? 0
  const mlRows   = parkRows + alzRows

  // Real accuracy from trained models
  const parkAcc = modelInfo?.models?.parkinsons?.accuracy ?? null
  const alzAcc  = modelInfo?.models?.alzheimers?.accuracy ?? null
  const parkAuc = modelInfo?.models?.parkinsons?.roc_auc ?? null
  const alzAuc  = modelInfo?.models?.alzheimers?.roc_auc ?? null

  return {
    total: patients.length,
    urgentOrHigh,
    moderate,
    monitorOrClear,
    mlRows,
    parkRows,
    alzRows,
    parkAcc,
    alzAcc,
    parkAuc,
    alzAuc
  }
}