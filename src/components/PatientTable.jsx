import { getRiskColor, statusPalette, diagnosisPalette } from '../data/clinicalDemoData'

function PatientTable({ patients }) {
  const recent = patients.slice(0, 8)   // show 8 most recent

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
            🔬 Recent Screening Results
          </p>
          <p style={{ color: '#475569', fontSize: '11px' }}>
            {patients.length === 0
              ? 'Run a screening below to populate this table'
              : `Showing ${recent.length} of ${patients.length} patients this session`}
          </p>
        </div>
        <div style={{
          background: patients.length > 0 ? 'rgba(74,222,128,0.1)' : 'rgba(59,130,246,0.1)',
          border: patients.length > 0 ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(59,130,246,0.2)',
          borderRadius: '20px',
          padding: '4px 12px'
        }}>
          <span style={{
            color: patients.length > 0 ? '#4ade80' : '#60a5fa',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            {patients.length > 0 ? 'LIVE DATA' : 'WAITING'}
          </span>
        </div>
      </div>

      {patients.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          color: '#334155'
        }}>
          <p style={{ fontSize: '36px', marginBottom: '12px' }}>🔬</p>
          <p style={{ fontSize: '13px', marginBottom: '4px', color: '#475569' }}>
            No screenings yet
          </p>
          <p style={{ fontSize: '11px', color: '#334155', textAlign: 'center' }}>
            Use the Patient Form to run your first screening.<br />
            Results appear here instantly.
          </p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Name', 'Age', 'Signal', 'Risk Score', 'Status'].map((h, i) => (
                <th key={i} style={{
                  color: '#334155',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((patient, i) => {
              const diagStyle = diagnosisPalette[patient.diagnosis] || diagnosisPalette['default']
              const statusStyle = statusPalette[patient.status] || statusPalette.CLEAR
              return (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                    {patient.name}
                  </td>
                  <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>
                    {patient.age}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: diagStyle.bg,
                      color: diagStyle.color,
                      border: `1px solid ${diagStyle.border}`,
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {patient.diagnosis}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '50px', height: '4px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px', overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${patient.risk}%`,
                          height: '100%',
                          background: getRiskColor(patient.risk),
                          borderRadius: '2px'
                        }} />
                      </div>
                      <span style={{
                        color: getRiskColor(patient.risk),
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {patient.risk}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`,
                      borderRadius: '20px',
                      padding: '3px 10px',
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '0.05em'
                    }}>
                      {patient.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PatientTable