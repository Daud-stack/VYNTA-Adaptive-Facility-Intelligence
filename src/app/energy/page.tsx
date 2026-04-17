import React from 'react';
import GlowGauge from '@/components/GlowGauge';
import TrendChart from '@/components/TrendChart';

const EnergyCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="glass" style={{
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
    {children}
  </div>
);

export default function EnergyHub() {
  return (
    <div style={{ width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Vynta <span className="text-gradient">Energy Hub</span></h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Sustainabilty intelligence and power distribution metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass glass-hover" style={{ padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', color: 'white', cursor: 'pointer' }}>Download ESG Report</button>
          <button className="glass-hover" style={{
            padding: '0.8rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-gradient)',
            border: 'none',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Optimization Settings
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Sustainability Score */}
        <div className="glass" style={{ 
          padding: '2.5rem', 
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%)'
        }}>
          <GlowGauge value={92} label="Eco Score" size={240} />
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#10b981', fontWeight: '700', fontSize: '1.1rem' }}>Platinum Status</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Top 5% of enterprise facilities globally.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <EnergyCard title="Power Usage Effectiveness (PUE)">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>1.24</span>
              <span style={{ color: '#10b981', fontSize: '0.9rem' }}>↓ 0.02</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Ideal: 1.10 | Current sector average: 1.62</p>
            <TrendChart data={[1.28, 1.27, 1.26, 1.25, 1.24, 1.24, 1.24]} />
          </EnergyCard>

          <EnergyCard title="Carbon Footprint (MT CO2e)">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>42.8</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>MT</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Scope 1</div>
                <div style={{ fontWeight: '600' }}>8.2</div>
              </div>
              <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Scope 2</div>
                <div style={{ fontWeight: '600', color: '#10b981' }}>34.6</div>
              </div>
            </div>
          </EnergyCard>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Load Profile (Real-time)</h3>
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
               {/* Mock Visualization */}
               <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '150px', width: '80%' }}>
                  {[40, 60, 45, 80, 55, 90, 70, 85, 45, 60, 75, 50, 65, 80, 40].map((h, i) => (
                    <div key={i} style={{ 
                      flex: 1, 
                      height: `${h}%`, 
                      background: i === 5 || i === 7 ? 'var(--secondary-gradient)' : 'var(--primary-gradient)',
                      borderRadius: '4px 4px 0 0',
                      opacity: 0.6 + (h/200),
                      boxShadow: '0 -4px 10px rgba(16, 185, 129, 0.1)'
                    }} />
                  ))}
               </div>
            </div>
          </div>

          <div className="glass" style={{ 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid #10b981'
          }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', color: '#10b981' }}>
              <span style={{ marginRight: '0.5rem' }}>♻️</span> Vynta Vision
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
              "Ghost Loads confirmed in North Wing B. Non-critical systems remain active outside occupancy hours. Scheduled shutdown could save **$420/month** in standby power."
            </p>
            <button className="glass-hover" style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.7rem',
              borderRadius: '8px',
              border: '1px solid #10b981',
              color: '#10b981',
              background: 'transparent',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Execute Automated Shutdown
            </button>
          </div>
      </div>
    </div>
  );
}
