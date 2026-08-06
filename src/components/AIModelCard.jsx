function pct(value) {
  if (value === undefined || value === null) return '—'
  return `${Math.round(value * 1000) / 10}%`
}

function AIModelCard({ modelInfo }) {
  const apiOnline = modelInfo !== null
  const parkinsons = modelInfo?.models?.parkinsons
  const alzheimers = modelInfo?.models?.alzheimers

  const stats = [
    {
      label: "Parkinson's Model",
      value: parkinsons
        ? `${pct(parkinsons.accuracy)} accuracy · AUC ${pct(parkinsons.roc_auc)}`
        : 'Loading...',
      color: parkinsons ? '#4ade80' : '#94a3b8'
    },
    {
      label: "Alzheimer's Model",
      value: alzheimers
        ? `${pct(alzheimers.accuracy)} accuracy · AUC ${pct(alzheimers.roc_auc)}`
        : 'Loading...',
      color: alzheimers ? '#4ade80' : '#94a3b8'
    },
    {
      label: 'Training Rows',
      value: parkinsons && alzheimers
        ? `${(parkinsons.rows + alzheimers.rows).toLocaleString()} total`
        : '—',
      color: '#60a5fa'
    },
    {
      label: 'Epilepsy',
      value: 'Rule score · no EEG model',
      color: '#fbbf24'
    },
    {
      label: 'Backend',
      value: apiOnline ? 'Connected' : 'Offline',
      color: apiOnline ? '#4ade80' : '#f87171'
    }
  ]

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(29,78,216,0.15), rgba(124,58,237,0.15))',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>🤖 Model Status</p>
        <div style={{
          background: apiOnline ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)',
          border: apiOnline ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(248,113,113,0.2)',
          borderRadius: '20px',
          padding: '2px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span className={apiOnline ? 'pulse' : ''} style={{
            width: '6px', height: '6px',
            background: apiOnline ? '#4ade80' : '#f87171',
            borderRadius: '50%',
            display: 'inline-block'
          }} />
          <span style={{
            color: apiOnline ? '#4ade80' : '#f87171',
            fontSize: '10px',
            fontWeight: '700'
          }}>
            {apiOnline ? 'TRAINED' : 'API OFFLINE'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '10px',
            borderBottom: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            gap: '16px'
          }}>
            <span style={{ color: '#475569', fontSize: '11px' }}>{s.label}</span>
            <span style={{ color: s.color, fontSize: '11px', fontWeight: '600', textAlign: 'right' }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: '10px',
        marginTop: '16px'
      }}>
        <p style={{ color: '#334155', fontSize: '10px', marginBottom: '4px' }}>EVIDENCE LIMIT</p>
        <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: '1.5' }}>
          Parkinson and Alzheimer scores use Kaggle-trained classifiers.
          Epilepsy is rule-based. No external clinical validation has been performed.
        </p>
      </div>
    </div>
  )
}

export default AIModelCard