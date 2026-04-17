'use client';

import React, { useState, useEffect } from 'react';
import { useVynta } from '@/lib/store';

const QuickAction = ({ icon, label, color, onClick }: any) => (
  <button 
    className="glass glass-hover" 
    onClick={onClick}
    style={{
      padding: '1.5rem',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.8rem',
      cursor: 'pointer',
      flex: 1,
      minWidth: '120px',
      border: 'none',
      borderBottom: `3px solid ${color}`,
      transition: 'transform 0.2s ease',
      color: 'white'
    }}
  >
    <span style={{ fontSize: '2rem' }}>{icon}</span>
    <span style={{ fontSize: '0.9rem', fontWeight: '600', textAlign: 'center', background: 'none' }}>{label}</span>
  </button>
);

export default function TenantPortal() {
  const { user, tickets, refreshData } = useVynta();
  const [metrics, setMetrics] = useState<any>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/sensors?zone=Suite-405')
      .then(res => res.json())
      .then(data => setMetrics(data.metrics));
  }, []);

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/tickets', {
        method: 'POST', // I'll need to ensure POST works in the tickets api
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
          title: reportTitle,
          user: user?.name || 'Anonymous Tenant',
          priority: 'Medium',
          status: 'Unassigned',
          timestamp: 'Just now'
        })
      });
      setReportTitle('');
      setIsReporting(false);
      await refreshData();
    } catch (error) {
      console.error('Failed to report issue:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const tenantTickets = tickets.filter((t: any) => 
    t.user === user?.name || 
    t.user === 'Sarah Jenkins' || // Allow seeded tickets for demo
    user?.role === 'Admin'
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '2rem', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Resident <span className="text-gradient">Experience</span></h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Vynta Portal: Welcome back, {user?.name}</p>
      </header>

      {/* Wellness Feed */}
      <section className="glass" style={{ 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-lg)', 
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>TEMPERATURE</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{metrics?.temperature.toFixed(1) || '--'}°C</p>
        </div>
        <div style={{ width: '1px', height: '30px', background: 'var(--card-border)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>AIR QUALITY (CO2)</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{metrics?.co2.toFixed(0) || '--'} ppm</p>
        </div>
        <div style={{ width: '1px', height: '30px', background: 'var(--card-border)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>ZONE HEALTH</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>OPTIMAL</p>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <QuickAction icon="🛠️" label="New Repair" color="#10b981" onClick={() => setIsReporting(true)} />
          <QuickAction icon="🏢" label="Book Space" color="#34d399" />
          <QuickAction icon="💳" label="Access Key" color="#60a5fa" />
          <QuickAction icon="🍱" label="Catering" color="#fbbf24" />
        </div>
      </section>

      {isReporting && (
        <div className="glass" style={{ 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)', 
          marginBottom: '2rem',
          border: '1px solid #10b98150'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Report Facility Issue</h3>
          <form onSubmit={handleReportIssue}>
            <input 
              autoFocus
              className="glass"
              style={{ 
                width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', color: 'white', marginBottom: '1rem'
              }}
              placeholder="Describe the issue (e.g. Broken light in Suite 405)"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              required
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button disabled={submitting} type="submit" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-gradient)', border: 'none', color: 'black', fontWeight: '800', cursor: 'pointer' }}>
                {submitting ? 'Submitting...' : 'SUBMIT REQUEST'}
              </button>
              <button disabled={submitting} type="button" onClick={() => setIsReporting(false)} style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'transparent', border: '1px solid var(--card-border)', color: 'white', cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {tenantTickets.length > 0 ? tenantTickets.map((req: any) => (
              <div key={req.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--card-border)'
              }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{req.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{req.ticketId} • {req.timestamp}</p>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  background: req.status === 'Completed' || req.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                  color: req.status === 'Completed' || req.status === 'Resolved' ? '#10b981' : '#fbbf24',
                  border: `1px solid ${req.status === 'Completed' || req.status === 'Resolved' ? '#10b98140' : '#fbbf2440'}`
                }}>
                  {req.status}
                </span>
              </div>
            )) : <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No active requests.</p>}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-lg)', 
            background: 'var(--primary-gradient)',
            color: 'white'
          }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'black' }}>Vynta Concierge</h4>
            <p style={{ fontSize: '0.85rem', color: 'black', opacity: 0.8 }}>
              {metrics?.co2 > 500 
                ? "CO2 levels are slightly elevated. I've increased fresh air intake for your zone."
                : "The environmental conditions in your suite are currently perfect for productivity."}
            </p>
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Building Health</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: '0.85rem' }}>Lobby Elevators: Normal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: '0.85rem' }}>Air Scrubbers: Active</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
