import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { computeDiseaseDistribution, computeAgeRiskBuckets, getRiskColor } from '../data/clinicalDemoData'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const cardStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px',
  padding: '20px'
}

const tooltipStyle = {
  backgroundColor: 'rgba(2,8,23,0.95)',
  titleColor: '#e2e8f0',
  bodyColor: '#94a3b8',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1
}

function EmptyState({ message }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '160px',
      color: '#334155'
    }}>
      <p style={{ fontSize: '28px', marginBottom: '8px' }}>📊</p>
      <p style={{ fontSize: '12px', textAlign: 'center' }}>{message}</p>
    </div>
  )
}

function Charts({ patients }) {
  const hasPatients = patients.length > 0

  // Disease distribution doughnut
  const diseaseCounts = computeDiseaseDistribution(patients)
  const diseaseData = {
    labels: ["Parkinson's", "Alzheimer's", "Epilepsy", "Cognitive Risk", "Other"],
    datasets: [{
      data: diseaseCounts,
      backgroundColor: ['#dc2626', '#ea580c', '#ca8a04', '#2563eb', '#16a34a'],
      borderWidth: 2,
      borderColor: '#020817'
    }]
  }

  // Age/risk bar chart
  const ageBucketData = computeAgeRiskBuckets(patients)
  const ageData = {
    labels: ['18-30', '31-45', '46-60', '61-75', '75+'],
    datasets: [{
      label: 'Avg Risk %',
      data: ageBucketData,
      backgroundColor: [
        'rgba(74,222,128,0.8)',
        'rgba(163,230,53,0.8)',
        'rgba(251,191,36,0.8)',
        'rgba(249,115,22,0.8)',
        'rgba(239,68,68,0.8)'
      ],
      borderRadius: 6,
      borderWidth: 0
    }]
  }

  // Risk score breakdown — horizontal bar of last 8 patients
  const recentPatients = patients.slice(0, 8).reverse()
  const recentData = {
    labels: recentPatients.map(p => p.name.split(' ')[0]),
    datasets: [
      {
        label: "Parkinson's",
        data: recentPatients.map(p => p.risk_scores?.["Parkinson's"] ?? 0),
        backgroundColor: 'rgba(220,38,38,0.7)',
        borderRadius: 4,
        borderWidth: 0
      },
      {
        label: "Alzheimer's",
        data: recentPatients.map(p => p.risk_scores?.["Alzheimer's"] ?? 0),
        backgroundColor: 'rgba(234,88,12,0.7)',
        borderRadius: 4,
        borderWidth: 0
      },
      {
        label: 'Epilepsy',
        data: recentPatients.map(p => p.risk_scores?.["Epilepsy"] ?? 0),
        backgroundColor: 'rgba(202,138,4,0.7)',
        borderRadius: 4,
        borderWidth: 0
      },
    ]
  }

  const darkPlugin = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          font: { size: 10 },
          padding: 12,
          boxWidth: 10
        }
      },
      tooltip: { ...tooltipStyle }
    }
  }

  const axisOptions = {
    x: {
      ticks: { color: '#475569', font: { size: 10 } },
      grid: { color: 'rgba(255,255,255,0.04)' }
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { color: '#475569', font: { size: 10 } },
      grid: { color: 'rgba(255,255,255,0.04)' }
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>

      {/* Doughnut — disease distribution */}
      <div style={cardStyle}>
        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
          🧠 Disease Distribution
        </p>
        <p style={{ color: '#475569', fontSize: '11px', marginBottom: '16px' }}>
          {hasPatients ? `${patients.length} screened patients` : 'Awaiting screenings'}
        </p>
        {hasPatients
          ? <Doughnut data={diseaseData} options={darkPlugin} />
          : <EmptyState message="Run screenings to see disease distribution" />}
      </div>

      {/* Bar — risk by age group */}
      <div style={cardStyle}>
        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
          👥 Risk by Age Group
        </p>
        <p style={{ color: '#475569', fontSize: '11px', marginBottom: '16px' }}>
          {hasPatients ? 'Average risk score per age bracket' : 'Awaiting screenings'}
        </p>
        {hasPatients
          ? <Bar data={ageData} options={{
              plugins: { legend: { display: false }, tooltip: tooltipStyle },
              scales: axisOptions
            }} />
          : <EmptyState message="Run screenings to see age breakdown" />}
      </div>

      {/* Grouped bar — per-patient risk scores */}
      <div style={cardStyle}>
        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
          📈 Recent Patient Scores
        </p>
        <p style={{ color: '#475569', fontSize: '11px', marginBottom: '16px' }}>
          {hasPatients ? 'Disease scores for last 8 patients' : 'Awaiting screenings'}
        </p>
        {hasPatients
          ? <Bar data={recentData} options={{
              ...darkPlugin,
              scales: {
                ...axisOptions,
                x: { ...axisOptions.x, stacked: false }
              }
            }} />
          : <EmptyState message="Run screenings to see patient scores" />}
      </div>

    </div>
  )
}

export default Charts