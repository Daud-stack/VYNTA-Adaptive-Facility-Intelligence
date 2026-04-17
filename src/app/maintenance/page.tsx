import React from 'react';

const TimelineBar = ({ asset, start, width, color, status }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
    <div style={{ width: '150px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>{asset}</div>
    <div style={{ flex: 1, position: 'relative', height: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
      <div className="glass-hover" style={{
        position: 'absolute',
        left: `${start}%`,
        width: `${width}%`,
        height: '100%',
        background: color,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 0.8rem',
        fontSize: '0.7rem',
        color: 'white',
        fontWeight: '600',
        boxShadow: `0 0 15px ${color}30`,
        cursor: 'pointer'
      }}>
        {status}
      </div>
    </div>
  </div>
);

export default function Maintenance() {
  const schedule = [
    { asset: 'Chiller-04', start: 10, width: 20, color: '#10b981', status: 'Preventive' },
    { asset: 'Elevator-A1', start: 40, width: 15, color: '#fbbf24', status: 'Inspection' },
    { asset: 'GenSet-02', start: 5, width: 30, color: '#10b981', status: 'Overhaul' },
    { asset: 'HVAC-01', start: 60, width: 25, color: '#f87171', status: 'Repair' },
    { asset: 'FireSys-B', start: 20, width: 10, color: '#059669', status: 'Testing' },
  ];

  return (
    <div style={{ width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>Maintenance Timeline</h2>
          <p style={{ color: 'var(--text-dim)' }}>Chronological view of scheduled asset interventions.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass glass-hover" style={{ padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', color: 'white', cursor: 'pointer' }}>Calendar View</button>
          <button className="glass-hover" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-gradient)', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer' }}>+ Schedule Task</button>
        </div>
      </header>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
          <div style={{ width: '150px' }}></div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            <span>Week 15</span>
            <span>Week 16</span>
            <span>Week 17</span>
            <span>Week 18</span>
          </div>
        </div>
        <div>
          {schedule.map((item, i) => <TimelineBar key={i} {...item} />)}
        </div>
      </div>
    </div>
  );
}
