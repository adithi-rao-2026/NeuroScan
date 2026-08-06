function ImpactMetrics({ stats }) {
  const pct = (v) => v != null ? `${Math.round(v * 1000) / 10}%` : '—'

  const metrics = [
    {
      label: 'ML datasets loaded',
      value: stats.mlRows > 0 ? '2 / 2' : '0 / 2',
      pct: stats.mlRows > 0 ? 100 : 0,
      color: '#4ade80'
    },
    {
      label: "Parkinson's accuracy",
      value: pct(stats.parkAcc),
      pct: stats.parkAcc != null ? Math.round(stats.parkAcc * 100) : 0,
      color: '#60a5fa'
    },
    {
      label: "Alzheimer's accuracy",
      value: pct(stats.alzAcc),
      pct: stats.alzAcc != null ? Math.round(stats.alzAcc * 100) : 0,
      color: '#c084fc'
    },
    {
      label: 'Epilepsy transparency',
      value: 'Rule-based',
      pct: 65,
      color: '#fbbf24'
    },
    {
      label: 'External validation',
      value: 'Pending',
      pct: 0,
      color: '#fb923c'
    },
  ]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
        📊 Evidence Readiness
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {metrics.map((m, i) => (
          <div key={i}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
              gap: '10px'
            }}>
              <span style={{ color: '#475569', fontSize: '11px' }}>{m.label}</span>
              <span style={{ color: m.color, fontSize: '11px', fontWeight: '700' }}>{m.value}</span>
            </div>
            <div style={{
              width: '100%', height: '3px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '2px'
            }}>
              <div style={{
                width: `${m.pct}%`, height: '100%',
                background: m.color,
                borderRadius: '2px',
                boxShadow: `0 0 6px ${m.color}`,
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginTop: '16px'
      }}>
        {[
          { label: 'Training Rows', value: stats.mlRows > 0 ? stats.mlRows.toLocaleString() : '—', color: '#4ade80' },
          { label: 'Session Patients', value: stats.total, color: '#60a5fa' }
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#334155', fontSize: '10px', marginBottom: '4px' }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: '16px', fontWeight: '800' }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImpactMetrics