'use client';

import React, { useState } from 'react';

const QuickAction = ({ icon, label, color }: any) => (
  <div className="glass glass-hover" style={{
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
    cursor: 'pointer',
    flex: 1,
    minWidth: '120px',
    borderBottom: `3px solid ${color}`,
    transition: 'transform 0.2s ease'
  }}>
    <span style={{ fontSize: '2rem' }}>{icon}</span>
    <span style={{ fontSize: '0.9rem', fontWeight: '600', textAlign: 'center' }}>{label}</span>
  </div>
);

export default function TenantPortal() {
  const requests = [
    { id: '402', title: 'AC Filter Cleaning', status: 'Scheduled', time: 'Tomorrow' },
    { id: '398', title: 'Lobby Access Card', status: 'In Process', time: 'Today' },
    { id: '395', title: 'Light Flicker - Suite 405', status: 'Completed', time: 'Yesterday' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Resident <span className="text-gradient">Experience</span></h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Vynta Portal for TechCorp HQ Tenants</p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <QuickAction icon="🛠️" label="New Repair" color="#10b981" />
          <QuickAction icon="🏢" label="Book Space" color="#34d399" />
          <QuickAction icon="💳" label="Access Key" color="#60a5fa" />
          <QuickAction icon="🍱" label="Catering" color="#fbbf24" />
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {requests.map(req => (
              <div key={req.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--card-border)'
              }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{req.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>#{req.id} • {req.time}</p>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  background: req.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                  color: req.status === 'Completed' ? '#10b981' : '#fbbf24',
                  border: `1px solid ${req.status === 'Completed' ? '#10b98140' : '#fbbf2440'}`
                }}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-lg)', 
            background: 'var(--primary-gradient)',
            color: 'white'
          }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Quick Tip</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              You can now use your Vynta mobile app to unlock Suite 405 automatically via Bluetooth.
            </p>
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Building Status</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: '0.85rem' }}>Lobby Elevators: Normal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: '0.85rem' }}>HVAC System: Optimized</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
