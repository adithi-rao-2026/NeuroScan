import { getRiskColor, statusPalette } from '../data/clinicalDemoData'

function AnalysisResult({ result }) {
  if (!result) return null

  const statusStyle = statusPalette[result.status] || statusPalette.CLEAR
  const color = statusStyle.color || getRiskColor(result.risk)
  const riskScores = result.risk_scores || {}

  return (
    <div style={{
      background: `${statusStyle.bg}`,
      border: `1px solid ${statusStyle.border}`,
      borderRadius: '12px',
      padding: '24px',
      marginTop: '16px'
    }}>
      <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
        📋 Screening Result
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '16px' }}>
        <div>
          <p style={{ color: '#475569', fontSize: '11px' }}>Patient</p>
          <p style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: '700' }}>{result.name}</p>
          <p style={{ color: '#475569', fontSize: '12px' }}>Age {result.age}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#475569', fontSize: '11px' }}>Status</p>
          <p style={{ color, fontSize: '20px', fontWeight: '800' }}>{result.status}</p>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#475569', fontSize: '11px' }}>Primary Risk</span>
          <span style={{ color, fontSize: '13px', fontWeight: '700' }}>{result.risk}%</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
          <div style={{
            width: `${result.risk}%`,
            height: '100%',
            background: color,
            borderRadius: '3px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px'
      }}>
        <p style={{ color: '#475569', fontSize: '11px', marginBottom: '4px' }}>Screening Signal</p>
        <p style={{ color, fontSize: '15px', fontWeight: '700' }}>{result.diagnosis}</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '14px'
      }}>
        {Object.entries(riskScores).map(([label, score]) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '10px'
          }}>
            <p style={{ color: '#475569', fontSize: '10px', marginBottom: '4px' }}>{label}</p>
            <p style={{ color: getRiskColor(score), fontSize: '17px', fontWeight: '800' }}>{score}%</p>
          </div>
        ))}
      </div>

      <p style={{ color: '#475569', fontSize: '11px', marginBottom: '8px' }}>Risk Factors</p>
      {(result.reasons || []).map((reason, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 0',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <span style={{ color, fontSize: '10px' }}>▸</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>{reason}</span>
        </div>
      ))}

      {result.recommendation && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '10px',
          marginTop: '14px'
        }}>
          <p style={{ color: '#475569', fontSize: '10px', marginBottom: '4px' }}>Recommendation</p>
          <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>{result.recommendation}</p>
        </div>
      )}

      {result.evidence_basis && (
        <div style={{ marginTop: '14px' }}>
          <p style={{ color: '#475569', fontSize: '11px', marginBottom: '8px' }}>Evidence Basis</p>
          {Object.entries(result.evidence_basis).map(([label, basis]) => (
            <p key={label} style={{ color: '#64748b', fontSize: '11px', lineHeight: '1.5', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8', fontWeight: '700' }}>{label}:</span> {basis}
            </p>
          ))}
        </div>
      )}

      {result.disclaimer && (
        <p style={{ color: '#64748b', fontSize: '11px', marginTop: '14px', lineHeight: '1.5' }}>
          {result.disclaimer}
        </p>
      )}
    </div>
  )
}

export default AnalysisResult
