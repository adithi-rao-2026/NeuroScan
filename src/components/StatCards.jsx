function StatCards({ stats, modelInfo }) {
  const pct = (v) => v != null ? `${Math.round(v * 1000) / 10}%` : '—'
  const park = modelInfo?.models?.parkinsons
  const alz  = modelInfo?.models?.alzheimers

  const cards = [
    {
      label: 'Patients Screened',
      value: stats.total,
      change: stats.total === 0 ? 'Run a screening to begin' : 'This session',
      icon: '🏥',
      glow: 'rgba(59,130,246,0.15)',
      border: 'rgba(59,130,246,0.3)',
      valueColor: '#60a5fa',
      changeColor: '#94a3b8'
    },
    {
      label: 'High Priority',
      value: stats.urgentOrHigh,
      change: 'Urgent or high status',
      icon: '🚨',
      glow: 'rgba(220,38,38,0.15)',
      border: 'rgba(220,38,38,0.3)',
      valueColor: '#f87171',
      changeColor: '#f87171'
    },
    {
      label: 'Moderate Risk',
      value: stats.moderate,
      change: 'Follow-up recommended',
      icon: '⚡',
      glow: 'rgba(234,179,8,0.15)',
      border: 'rgba(234,179,8,0.3)',
      valueColor: '#fbbf24',
      changeColor: '#fbbf24'
    },
    {
      label: 'Training Rows',
      value: stats.mlRows > 0 ? stats.mlRows.toLocaleString() : '—',
      change: 'Kaggle Parkinson + Alzheimer',
      icon: '🤖',
      glow: 'rgba(168,85,247,0.15)',
      border: 'rgba(168,85,247,0.3)',
      valueColor: '#c084fc',
      changeColor: '#c084fc'
    },
    {
      label: "Park's Accuracy",
      value: park ? pct(stats.parkAcc) : '—',
      change: park ? `ROC-AUC ${pct(stats.parkAuc)}` : 'Model loading...',
      icon: '📊',
      glow: 'rgba(34,197,94,0.15)',
      border: 'rgba(34,197,94,0.3)',
      valueColor: '#4ade80',
      changeColor: '#4ade80'
    }
  ]

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((stat, index) => (
        <div key={index} style={{
          background: stat.glow,
          border: `1px solid ${stat.border}`,
          borderRadius: '12px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex justify-between items-start mb-3">
            <p style={{
              color: '#64748b',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {stat.label}
            </p>
            <span className="text-lg">{stat.icon}</span>
          </div>
          <p style={{
            color: stat.valueColor,
            fontSize: '32px',
            fontWeight: '800',
            lineHeight: 1,
            marginBottom: '8px'
          }}>
            {stat.value}
          </p>
          <p style={{ color: stat.changeColor, fontSize: '11px' }}>
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  )
}

export default StatCards