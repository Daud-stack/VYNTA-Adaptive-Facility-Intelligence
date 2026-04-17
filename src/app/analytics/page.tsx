import React from 'react';
import TrendChart from '@/components/TrendChart';

export default function Analytics() {
  const metrics = [
    { title: 'Operational Up-time', value: '99.98%', trend: [99.9, 99.95, 99.96, 99.98, 99.98, 99.99, 99.98], color: '#10b981' },
    { title: 'Work Order Closure Rate', value: '92.4%', trend: [85, 88, 86, 90, 92, 91, 92], color: '#34d399' },
    { title: 'Mean Time to Repair', value: '4.2h', trend: [5.1, 4.8, 4.5, 4.3, 4.2, 4.1, 4.2], color: '#059669' },
  ];

  return (
    <div style={{ width: '100%' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Analytics Deep-Dive</h2>
        <p style={{ color: 'var(--text-dim)' }}>Cross-module system performance and historical trends.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {metrics.map(m => (
          <div key={m.title} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>{m.title}</p>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{m.value}</h3>
            <TrendChart data={m.trend} color={m.color} />
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: '400px' }}>
         <h4 style={{ marginBottom: '1.5rem' }}>Resource Allocation Efficiency</h4>
         <div style={{ display: 'flex', alignItems: 'flex-end', height: '250px', gap: '2rem', paddingBottom: '2rem' }}>
            {['Facility A', 'Facility B', 'Facility C', 'Regional HQ', 'Data Center'].map((lab, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: `${[40, 70, 55, 90, 85][i]}%`, 
                  background: 'var(--primary-gradient)', 
                  borderRadius: '4px',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                }} />
                <span style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{lab}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
