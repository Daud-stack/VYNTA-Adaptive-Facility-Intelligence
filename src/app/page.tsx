'use client';

import React from 'react';
import { useVynta } from '@/lib/store';

const StatCard = ({ title, value, unit, trend, icon, color }: any) => (
  <div className="glass glass-hover" style={{
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    flex: 1,
    minWidth: '240px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      right: '-10px',
      top: '-10px',
      fontSize: '4rem',
      opacity: 0.05,
      transform: 'rotate(15deg)'
    }}>
      {icon}
    </div>
    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
      <h3 style={{ fontSize: '2rem', fontWeight: '800', color: color }}>{value}</h3>
      <span style={{ marginLeft: '0.3rem', fontSize: '1rem', color: 'var(--text-dim)' }}>{unit}</span>
    </div>
    <div style={{ 
      fontSize: '0.8rem', 
      color: trend > 0 ? '#10b981' : '#f87171',
      display: 'flex',
      alignItems: 'center'
    }}>
      {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last hour
    </div>
  </div>
);

export default function Home() {
  const { sensors, user, tickets } = useVynta();

  // Find the most recent high-priority AI insight
  const latestInsight = tickets
    .filter(t => t.aiResponse && t.priority === 'High')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return (
    <div style={{ width: '100%', padding: '2rem' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Vynta <span className="text-gradient">Core</span></h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Welcome back, {user?.name || 'Commander'}. AI is monitoring 14 facilities.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass" style={{ 
            padding: '0.6rem 1rem', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Search assets, telemetry..." 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white',
                outline: 'none',
                width: '180px'
              }} 
            />
          </div>
          <div className="glass glass-hover" style={{ 
            width: '45px', 
            height: '45px', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'var(--primary-gradient)',
            color: 'black',
            fontWeight: '900'
          }}>
            {user?.avatar || '👤'}
          </div>
        </div>
      </header>

      {/* Stats Grid - Connected to Live Store */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <StatCard title="Live Occupancy" value={sensors.occupancy} unit="pax" trend={2.4} icon="👥" color="#10b981" />
        <StatCard title="System PUE" value={sensors.pue.toFixed(2)} unit="" trend={-0.5} icon="⚡" color="#34d399" />
        <StatCard title="Energy Draw" value={sensors.energyUsage.toFixed(1)} unit="kWh" trend={1.1} icon="🔋" color="#10b981" />
        <StatCard title="Security Alerts" value={sensors.activeAlerts} unit="" trend={0} icon="⚠️" color={sensors.activeAlerts > 0 ? "#f87171" : "#10b981"} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Floor Plan View */}
        <div className="glass" style={{ 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)',
          height: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem' }}>Vynta Live Map</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="glass glass-hover" style={{ padding: '0.4rem 0.8rem', borderRadius: ' var(--radius-md)', color: 'white', fontSize: '0.8rem', cursor: 'pointer' }}>Global</button>
              <button className="glass glass-hover" style={{ padding: '0.4rem 0.8rem', borderRadius: ' var(--radius-md)', color: 'white', fontSize: '0.8rem', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.2)' }}>Level 4</button>
            </div>
          </div>
          
          <div style={{ 
            flex: 1, 
            background: 'rgba(255,255,255,0.01)', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '1px dashed var(--card-border)'
          }}>
            {/* Mock Floor Plan SVG */}
            <svg viewBox="0 0 400 300" width="80%" height="80%" style={{ opacity: 0.6 }}>
              <rect x="50" y="50" width="100" height="80" fill="transparent" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" />
              <rect x="150" y="50" width="200" height="150" fill="transparent" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" />
              <rect x="50" y="130" width="100" height="120" fill="transparent" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" />
              <circle cx="180" cy="180" r="10" fill="#f87171" opacity="0.8">
                 <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="195" y="185" fill="#f87171" fontSize="12" fontWeight="600">INCIDENT #12</text>
            </svg>
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', marginRight: '0.5rem' }}></span>
              Vynta Vision Active
            </div>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid #10b981',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.05)'
          }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', color: '#10b981' }}>
              <span style={{ marginRight: '0.5rem' }}>✨</span> Vynta Vision
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              {latestInsight 
                ? `"${latestInsight.aiResponse}"`
                : `"Live sensors indicate stable operations. Energy PUE is optimal at ${sensors.pue.toFixed(2)}. No critical anomalies detected in the last 4 hours."`}
            </p>
            <button className="glass-hover" style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.8rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              border: 'none',
              color: 'black',
              fontWeight: '800',
              cursor: 'pointer',
              letterSpacing: '0.05em'
            }}>
              OPTIMIZE HVAC
            </button>
          </div>

          <div className="glass" style={{ 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-lg)',
            flex: 1
          }}>
            <h4 style={{ marginBottom: '1rem' }}>Smart SLA Metrics</h4>
            {[
              { label: 'Critical Response', value: 100, color: '#10b981' },
              { label: 'Energy Optimization', value: 88, color: '#34d399' },
              { label: 'Tenant Satisfaction', value: 92, color: '#059669' },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{item.label}</span>
                  <span style={{ fontWeight: '600' }}>{item.value}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${item.value}%`, 
                    background: item.color,
                    borderRadius: '2px',
                    boxShadow: `0 0 10px ${item.color}40`
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
