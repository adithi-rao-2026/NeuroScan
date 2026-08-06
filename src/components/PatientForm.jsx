import { useState } from 'react'

const initialForm = {
  name: '',
  age: '',
  gender: 'Female',
  bmi: 24,
  smoking: false,
  alcohol_consumption: 0,
  physical_activity: 4,
  sleep_quality: 7,
  hypertension: false,
  diabetes: false,
  depression: false,
  stroke: false,
  cardiovascular_disease: false,
  head_injury: false,
  family_history_parkinsons: false,
  family_history_alzheimers: false,
  tremors: false,
  rigidity: false,
  bradykinesia: false,
  postural_instability: false,
  speech_problems: false,
  sleep_disorders: false,
  constipation: false,
  updrs: 18,
  moca: 24,
  functional_assessment: 7,
  memory_loss: false,
  confusion: false,
  disorientation: false,
  behavioral_problems: false,
  personality_changes: false,
  difficulty_completing_tasks: false,
  forgetfulness: false,
  mmse: 24,
  adl: 7,
  seizures: false,
  seizure_type: 'none',
  seizure_count_30d: 0,
  seizure_duration_min: 0,
  first_seizure_age: 0,
  postictal_confusion: false,
  aura: false,
  nocturnal_seizures: false,
  family_history_epilepsy: false,
  seizure_triggers: []
}

const numericFields = [
  'age',
  'bmi',
  'alcohol_consumption',
  'physical_activity',
  'sleep_quality',
  'updrs',
  'moca',
  'functional_assessment',
  'mmse',
  'adl',
  'seizure_count_30d',
  'seizure_duration_min',
  'first_seizure_age'
]

const seizureTriggerOptions = ['sleep_deprivation', 'stress', 'flashing_lights', 'missed_medication']

function PatientForm({ onResult }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const toPayload = () => {
    const payload = { ...form }
    numericFields.forEach((key) => {
      payload[key] = Number(payload[key] || 0)
    })
    payload.seizures = form.seizures || payload.seizure_count_30d > 0 || form.seizure_type !== 'none'
    return payload
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.age) {
      setError('Enter patient name and age.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload())
      })

      if (!response.ok) {
        throw new Error('Analysis request failed')
      }

      const result = await response.json()
      onResult(result)
    } catch {
      setError('Backend is not running. Start it with: uvicorn main:app --reload from the backend folder.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#e2e8f0',
    fontSize: '13px',
    width: '100%',
    outline: 'none'
  }

  const sectionStyle = {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '14px',
    marginTop: '16px'
  }

  const labelStyle = {
    color: '#475569',
    fontSize: '11px',
    marginBottom: '6px'
  }

  const field = (label, key, props = {}) => (
    <div style={{ marginBottom: '12px' }}>
      <p style={labelStyle}>{label}</p>
      <input
        style={inputStyle}
        value={form[key]}
        onChange={e => setField(key, e.target.value)}
        {...props}
      />
    </div>
  )

  const selectField = (label, key, options) => (
    <div style={{ marginBottom: '12px' }}>
      <p style={labelStyle}>{label}</p>
      <select
        style={inputStyle}
        value={form[key]}
        onChange={e => setField(key, e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )

  const checkboxRow = (label, key) => (
    <label style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '9px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      cursor: 'pointer'
    }}>
      <span style={{ color: '#94a3b8', fontSize: '12px' }}>{label}</span>
      <input
        type="checkbox"
        checked={form[key]}
        onChange={e => setField(key, e.target.checked)}
        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
      />
    </label>
  )

  const triggerChip = (trigger) => {
    const active = form.seizure_triggers.includes(trigger)
    return (
      <button
        type="button"
        key={trigger}
        onClick={() => {
          setField(
            'seizure_triggers',
            active
              ? form.seizure_triggers.filter((item) => item !== trigger)
              : [...form.seizure_triggers, trigger]
          )
        }}
        style={{
          background: active ? 'rgba(96,165,250,0.18)' : 'rgba(255,255,255,0.04)',
          border: active ? '1px solid rgba(96,165,250,0.35)' : '1px solid rgba(255,255,255,0.08)',
          color: active ? '#60a5fa' : '#64748b',
          borderRadius: '20px',
          padding: '5px 9px',
          fontSize: '10px',
          cursor: 'pointer'
        }}
      >
        {trigger.replace('_', ' ')}
      </button>
    )
  }

  const sectionTitle = (title) => (
    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
      {title}
    </p>
  )

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
        🧠 New Patient Screening
      </p>
      <p style={{ color: '#475569', fontSize: '11px', marginBottom: '18px', lineHeight: '1.5' }}>
        Parkinson and Alzheimer fields map to the Kaggle-trained models; epilepsy uses seizure-history rules.
      </p>

      {sectionTitle('Patient')}
      {field('Patient Name', 'name', { placeholder: 'e.g. Anita Mehra' })}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {field('Age', 'age', { type: 'number', min: 1, max: 110, placeholder: '65' })}
        {selectField('Gender', 'gender', [
          { label: 'Female', value: 'Female' },
          { label: 'Male', value: 'Male' }
        ])}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {field('BMI', 'bmi', { type: 'number', min: 10, max: 60, step: 0.1 })}
        {field('Sleep Quality', 'sleep_quality', { type: 'number', min: 0, max: 10, step: 0.5 })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {field('Activity', 'physical_activity', { type: 'number', min: 0, max: 10, step: 0.5 })}
        {field('Alcohol', 'alcohol_consumption', { type: 'number', min: 0, max: 25, step: 0.5 })}
      </div>

      <div style={sectionStyle}>
        {sectionTitle('History')}
        {checkboxRow('Smoking', 'smoking')}
        {checkboxRow('Hypertension', 'hypertension')}
        {checkboxRow('Diabetes', 'diabetes')}
        {checkboxRow('Depression', 'depression')}
        {checkboxRow('Stroke', 'stroke')}
        {checkboxRow('Cardiovascular disease', 'cardiovascular_disease')}
        {checkboxRow('Head injury', 'head_injury')}
        {checkboxRow("Family history: Parkinson's", 'family_history_parkinsons')}
        {checkboxRow("Family history: Alzheimer's", 'family_history_alzheimers')}
      </div>

      <div style={sectionStyle}>
        {sectionTitle("Parkinson's Features")}
        {checkboxRow('Tremor', 'tremors')}
        {checkboxRow('Rigidity', 'rigidity')}
        {checkboxRow('Bradykinesia', 'bradykinesia')}
        {checkboxRow('Postural instability', 'postural_instability')}
        {checkboxRow('Speech problems', 'speech_problems')}
        {checkboxRow('Sleep disorder', 'sleep_disorders')}
        {checkboxRow('Constipation', 'constipation')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
          {field('UPDRS', 'updrs', { type: 'number', min: 0, max: 100, step: 1 })}
          {field('MoCA', 'moca', { type: 'number', min: 0, max: 30, step: 1 })}
        </div>
      </div>

      <div style={sectionStyle}>
        {sectionTitle("Alzheimer's Features")}
        {checkboxRow('Memory complaints', 'memory_loss')}
        {checkboxRow('Confusion', 'confusion')}
        {checkboxRow('Disorientation', 'disorientation')}
        {checkboxRow('Behavioral problems', 'behavioral_problems')}
        {checkboxRow('Personality changes', 'personality_changes')}
        {checkboxRow('Difficulty completing tasks', 'difficulty_completing_tasks')}
        {checkboxRow('Forgetfulness', 'forgetfulness')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
          {field('MMSE', 'mmse', { type: 'number', min: 0, max: 30, step: 1 })}
          {field('ADL', 'adl', { type: 'number', min: 0, max: 10, step: 0.5 })}
        </div>
        {field('Functional Score', 'functional_assessment', { type: 'number', min: 0, max: 10, step: 0.5 })}
      </div>

      <div style={sectionStyle}>
        {sectionTitle('Epilepsy Rule Score')}
        {selectField('Seizure Type', 'seizure_type', [
          { label: 'None reported', value: 'none' },
          { label: 'Focal', value: 'focal' },
          { label: 'Tonic-clonic', value: 'tonic_clonic' },
          { label: 'Absence', value: 'absence' },
          { label: 'Unknown', value: 'unknown' }
        ])}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {field('Events / 30d', 'seizure_count_30d', { type: 'number', min: 0, max: 100, step: 1 })}
          {field('Duration min', 'seizure_duration_min', { type: 'number', min: 0, max: 60, step: 0.5 })}
        </div>
        {field('First seizure age', 'first_seizure_age', { type: 'number', min: 0, max: 110, step: 1 })}
        {checkboxRow('Post-event confusion', 'postictal_confusion')}
        {checkboxRow('Aura before event', 'aura')}
        {checkboxRow('Nocturnal events', 'nocturnal_seizures')}
        {checkboxRow('Family history of epilepsy', 'family_history_epilepsy')}
        <p style={{ ...labelStyle, marginTop: '12px' }}>Triggers</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {seizureTriggerOptions.map(triggerChip)}
        </div>
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: '11px', marginTop: '14px', lineHeight: '1.5' }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: '20px',
          background: loading ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.8)',
          border: '1px solid rgba(99,102,241,0.5)',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
          color: '#fff',
          fontSize: '13px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {loading ? 'Analysing...' : 'Run Screening'}
      </button>
    </div>
  )
}

export default PatientForm
