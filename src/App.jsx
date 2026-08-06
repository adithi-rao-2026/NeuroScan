import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import StatCards from './components/StatCards'
import Charts from './components/Charts'
import PatientTable from './components/PatientTable'
import AIModelCard from './components/AIModelCard'
import ImpactMetrics from './components/ImpactMetrics'
import PatientForm from './components/PatientForm'
import AnalysisResult from './components/AnalysisResult'
import { computeSessionStats, getRiskColor, statusPalette, diagnosisPalette } from './data/clinicalDemoData'

const cardStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px',
  padding: '20px'
}

const tableHeaderStyle = {
  color: '#334155',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: '8px 12px',
  textAlign: 'left',
  fontWeight: '600'
}

// ── Patients Page ─────────────────────────────
function PatientsPage({ patients, stats }) {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '700' }}>
            Patient Registry
          </h2>
          <p style={{ color: '#475569', fontSize: '12px' }}>
            {patients.length === 0
              ? 'No patients yet — run a screening from the Dashboard'
              : `${patients.length} patient${patients.length > 1 ? 's' : ''} screened this session`}
          </p>
        </div>
      </div>

      {/* Mini stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Total Screened', value: stats.total,          color: '#60a5fa' },
          { label: 'High Priority',  value: stats.urgentOrHigh,   color: '#f87171' },
          { label: 'Moderate Risk',  value: stats.moderate,       color: '#fbbf24' },
          { label: 'Monitor/Clear',  value: stats.monitorOrClear, color: '#4ade80' },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '11px', marginBottom: '8px' }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: '28px', fontWeight: '800' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Full patient table */}
      <div style={cardStyle}>
        {patients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#475569' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>🧠</p>
            <p style={{ fontSize: '14px', marginBottom: '4px' }}>No screenings yet</p>
            <p style={{ fontSize: '12px' }}>Go to Dashboard and run a patient screening to populate this table</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#', 'Name', 'Age', 'Signal', "Park's %", "Alz's %", 'Epilepsy %', 'Risk', 'Status'].map(h => (
                  <th key={h} style={tableHeaderStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => {
                const statusStyle = statusPalette[p.status] || statusPalette.CLEAR
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px', color: '#475569', fontSize: '11px', fontFamily: 'monospace' }}>
                      {String(i + 1).padStart(3, '0')}
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>{p.age}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '11px'
                      }}>{p.diagnosis}</span>
                    </td>
                    <td style={{ padding: '12px', color: getRiskColor(p.risk_scores?.["Parkinson's"] ?? 0), fontSize: '12px', fontWeight: '700' }}>
                      {p.risk_scores?.["Parkinson's"] ?? '—'}%
                    </td>
                    <td style={{ padding: '12px', color: getRiskColor(p.risk_scores?.["Alzheimer's"] ?? 0), fontSize: '12px', fontWeight: '700' }}>
                      {p.risk_scores?.["Alzheimer's"] ?? '—'}%
                    </td>
                    <td style={{ padding: '12px', color: getRiskColor(p.risk_scores?.["Epilepsy"] ?? 0), fontSize: '12px', fontWeight: '700' }}>
                      {p.risk_scores?.["Epilepsy"] ?? '—'}%
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                          <div style={{
                            width: `${p.risk}%`,
                            height: '100%',
                            background: getRiskColor(p.risk),
                            borderRadius: '2px'
                          }} />
                        </div>
                        <span style={{ color: getRiskColor(p.risk), fontSize: '12px', fontWeight: '700' }}>
                          {p.risk}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        color: statusStyle.color,
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.05em'
                      }}>{p.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Analytics Page ────────────────────────────
function AnalyticsPage({ stats, modelInfo }) {
  const park = modelInfo?.models?.parkinsons
  const alz  = modelInfo?.models?.alzheimers

  const pct = (v) => v != null ? `${Math.round(v * 1000) / 10}%` : 'training...'

  const cards = [
    {
      title: "Parkinson's Accuracy",
      value: pct(stats.parkAcc),
      sub: park ? `ROC-AUC ${pct(stats.parkAuc)} · ${stats.parkRows.toLocaleString()} rows` : 'Model loading...',
      color: park ? '#4ade80' : '#fbbf24'
    },
    {
      title: "Alzheimer's Accuracy",
      value: pct(stats.alzAcc),
      sub: alz ? `ROC-AUC ${pct(stats.alzAuc)} · ${stats.alzRows.toLocaleString()} rows` : 'Model loading...',
      color: alz ? '#4ade80' : '#fbbf24'
    },
    {
      title: 'Total ML Training Rows',
      value: stats.mlRows.toLocaleString(),
      sub: 'Parkinson + Alzheimer Kaggle datasets',
      color: '#60a5fa'
    },
    {
      title: 'Epilepsy Method',
      value: 'Rule-based',
      sub: 'No EEG dataset — seizure history scoring only',
      color: '#fbbf24'
    },
    {
      title: 'Patients This Session',
      value: stats.total,
      sub: 'Stored in memory, resets on refresh',
      color: '#c084fc'
    },
    {
      title: 'External Validation',
      value: 'Pending',
      sub: 'Required before any clinical deployment',
      color: '#fb923c'
    },
  ]

  const modelRows = [
    {
      disease: "Parkinson's",
      method: 'Random Forest (n=250)',
      rows: stats.parkRows,
      accuracy: pct(stats.parkAcc),
      auc: pct(stats.parkAuc),
      source: 'rabieelkharoua/parkinsons-disease-dataset-analysis'
    },
    {
      disease: "Alzheimer's",
      method: 'Random Forest (n=250)',
      rows: stats.alzRows,
      accuracy: pct(stats.alzAcc),
      auc: pct(stats.alzAuc),
      source: 'rabieelkharoua/alzheimers-disease-dataset'
    },
    {
      disease: 'Epilepsy',
      method: 'Clinical rule score',
      rows: 0,
      accuracy: 'N/A',
      auc: 'N/A',
      source: 'No dataset — rule-based'
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '700' }}>Analytics</h2>
        <p style={{ color: '#475569', fontSize: '12px' }}>
          Real model metrics from training · session patient stats
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {cards.map((card, i) => (
          <div key={i} style={cardStyle}>
            <p style={{ color: '#475569', fontSize: '11px', marginBottom: '12px' }}>{card.title}</p>
            <p style={{ color: card.color, fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>{card.value}</p>
            <p style={{ color: '#334155', fontSize: '11px' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
          🤖 Model Evidence Table
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Disease', 'Method', 'Training Rows', 'Accuracy', 'ROC-AUC', 'Source'].map(h => (
                <th key={h} style={tableHeaderStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modelRows.map((row) => (
              <tr key={row.disease} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>{row.disease}</td>
                <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>{row.method}</td>
                <td style={{ padding: '12px', color: row.rows ? '#4ade80' : '#fbbf24', fontSize: '13px', fontWeight: '600' }}>
                  {row.rows ? row.rows.toLocaleString() : 'N/A'}
                </td>
                <td style={{ padding: '12px', color: '#60a5fa', fontSize: '13px', fontWeight: '700' }}>{row.accuracy}</td>
                <td style={{ padding: '12px', color: '#c084fc', fontSize: '13px', fontWeight: '700' }}>{row.auc}</td>
                <td style={{ padding: '12px', color: '#475569', fontSize: '11px' }}>{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Reports Page ──────────────────────────────
function ReportsPage({ patients, stats }) {
  const urgentPatients = patients.filter(p => p.status === 'URGENT' || p.status === 'HIGH')

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '700' }}>Reports</h2>
        <p style={{ color: '#475569', fontSize: '12px' }}>
          Generated from your session data · resets on page refresh
        </p>
      </div>

      {/* Session Summary Report */}
      <div style={{ ...cardStyle, marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '700' }}>
            📋 Session Screening Summary
          </p>
          <span style={{
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.2)',
            color: '#4ade80',
            fontSize: '10px',
            fontWeight: '700',
            borderRadius: '20px',
            padding: '3px 10px'
          }}>LIVE</span>
        </div>

        {patients.length === 0 ? (
          <p style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '32px' }}>
            No patients screened yet. Run screenings from the Dashboard to generate this report.
          </p>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {[
                { label: 'Total Screened', value: stats.total, color: '#60a5fa' },
                { label: 'High Priority', value: stats.urgentOrHigh, color: '#f87171' },
                { label: 'Moderate Risk', value: stats.moderate, color: '#fbbf24' },
                { label: 'Monitor/Clear', value: stats.monitorOrClear, color: '#4ade80' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#475569', fontSize: '10px', marginBottom: '6px' }}>{s.label}</p>
                  <p style={{ color: s.color, fontSize: '22px', fontWeight: '800' }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* High priority list */}
            {urgentPatients.length > 0 && (
              <>
                <p style={{ color: '#f87171', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
                  ⚠ High Priority — Requires Clinician Review
                </p>
                {urgentPatients.map((p, i) => (
                  <div key={i} style={{
                    background: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '700' }}>{p.name}</p>
                      <p style={{ color: '#64748b', fontSize: '11px' }}>
                        Age {p.age} · {p.diagnosis}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#f87171', fontSize: '18px', fontWeight: '800' }}>{p.risk}%</p>
                      <p style={{ color: '#f87171', fontSize: '10px', fontWeight: '700' }}>{p.status}</p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* All patients summary */}
            <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginTop: '16px', marginBottom: '10px' }}>
              All Screened Patients
            </p>
            {patients.map((p, i) => {
              const statusStyle = statusPalette[p.status] || statusPalette.CLEAR
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>{p.name}</span>
                    <span style={{ color: '#475569', fontSize: '11px', marginLeft: '10px' }}>Age {p.age}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>{p.diagnosis}</span>
                    <span style={{ color: getRiskColor(p.risk), fontSize: '12px', fontWeight: '700' }}>{p.risk}%</span>
                    <span style={{
                      color: statusStyle.color,
                      background: statusStyle.bg,
                      border: `1px solid ${statusStyle.border}`,
                      borderRadius: '20px',
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: '700'
                    }}>{p.status}</span>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Model Validation Report — always available */}
      <div style={cardStyle}>
        <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>
          🤖 Model Validation Report
        </p>
        <p style={{ color: '#475569', fontSize: '12px', lineHeight: '1.7' }}>
          Parkinson's and Alzheimer's classifiers are Random Forest models (250 estimators, balanced class weights)
          trained on Kaggle clinical datasets. Holdout accuracy and ROC-AUC are computed at backend startup and
          shown live in the Analytics page. Epilepsy scoring is rule-based — no EEG dataset is used.
          These models have not undergone external clinical validation and must not be used for diagnosis.
        </p>
      </div>
    </div>
  )
}

// ── Root App ──────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [patients, setPatients] = useState([])         // SESSION STATE
  const [modelInfo, setModelInfo] = useState(null)     // REAL MODEL METRICS

  // Fetch real model info once on load
  useEffect(() => {
    fetch('http://127.0.0.1:8000/model-info')
      .then(r => r.json())
      .then(setModelInfo)
      .catch(() => {})
  }, [])

  // When a screening comes back, add to session
  const handleResult = (result) => {
    setAnalysisResult(result)
    setPatients(prev => [result, ...prev])   // newest first
  }

  const stats = computeSessionStats(patients, modelInfo)

  const renderPage = () => {
    switch (activeTab) {
      case 'Patients':
        return <PatientsPage patients={patients} stats={stats} />
      case 'Analytics':
        return <AnalyticsPage stats={stats} modelInfo={modelInfo} />
      case 'Reports':
        return <ReportsPage patients={patients} stats={stats} />
      default:
        return (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <StatCards stats={stats} modelInfo={modelInfo} />
            <Charts patients={patients} />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <PatientTable patients={patients} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AIModelCard modelInfo={modelInfo} />
                <PatientForm onResult={handleResult} />
                <AnalysisResult result={analysisResult} />
                <ImpactMetrics stats={stats} />
              </div>
            </div>
          </div>
        )
    }
  }

  const bannerText = modelInfo?.models?.parkinsons
    ? `Parkinson's RF: ${Math.round((modelInfo.models.parkinsons.accuracy ?? 0) * 1000) / 10}% accuracy · Alzheimer's RF: ${Math.round((modelInfo.models.alzheimers?.accuracy ?? 0) * 1000) / 10}% accuracy · Epilepsy rule-based · ${patients.length} patient${patients.length !== 1 ? 's' : ''} screened`
    : `Models loading · Epilepsy rule-based · ${patients.length} patient${patients.length !== 1 ? 's' : ''} screened`

  return (
    <div style={{ minHeight: '100vh', background: '#020817' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{
        background: 'linear-gradient(90deg, #1e293b, #0f172a, #1e293b)',
        borderBottom: '1px solid rgba(96,165,250,0.25)',
        color: '#cbd5e1',
        textAlign: 'center',
        padding: '8px',
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '0.02em'
      }}>
        {bannerText}
      </div>
      {renderPage()}
      <footer style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
        fontSize: '11px',
        padding: '16px',
        color: '#475569'
      }}>
        NeuroScan AI · Screening support only · Not a medical diagnosis
      </footer>
    </div>
  )
}

export default App