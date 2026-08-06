import { useState, useEffect } from 'react'

function Navbar({ activeTab, onTabChange }) {
  const [time, setTime] = useState(new Date().toLocaleString('en-IN'))

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleString('en-IN'))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleTab = (tab) => {
    onTabChange(tab)
  }

  return (
    <nav style={{
      background: 'rgba(2, 8, 23, 0.95)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
      backdropFilter: 'blur(20px)',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>

      {/* LEFT - Logo */}
      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <div style={{
          background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
          boxShadow: '0 0 20px rgba(99,102,241,0.5)',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>🧠</div>
        <div>
          <h1 style={{
            fontSize: '16px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>NeuroScan AI</h1>
          <p style={{color: '#475569', fontSize: '10px'}}>
            Clinical Screening & BI Prototype
          </p>
        </div>
      </div>

      {/* CENTER - Tabs */}
      <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
        {['Dashboard', 'Patients', 'Analytics', 'Reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTab(tab)}
            style={{
              background: activeTab === tab
                ? 'rgba(59,130,246,0.15)'
                : 'transparent',
              border: activeTab === tab
                ? '1px solid rgba(59,130,246,0.3)'
                : '1px solid transparent',
              color: activeTab === tab ? '#60a5fa' : '#475569',
              borderRadius: '8px',
              padding: '6px 16px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '600' : '400',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              if (activeTab !== tab) {
                e.target.style.color = '#94a3b8'
                e.target.style.background = 'rgba(255,255,255,0.03)'
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab) {
                e.target.style.color = '#475569'
                e.target.style.background = 'transparent'
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* RIGHT */}
      <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
        <div style={{textAlign: 'right'}}>
          <p style={{color: '#475569', fontSize: '11px'}}>{time}</p>
          <p style={{color: '#334155', fontSize: '10px'}}>India Standard Time</p>
        </div>
        <div style={{
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px'
        }}>
          <span className="pulse" style={{
            width: '6px', height: '6px',
            background: '#4ade80',
            borderRadius: '50%',
            display: 'inline-block'
          }}></span>
          <span style={{color: '#4ade80', fontSize: '11px', fontWeight: '600'}}>DEMO</span>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '14px'
        }}>👤</div>
      </div>
    </nav>
  )
}

export default Navbar
