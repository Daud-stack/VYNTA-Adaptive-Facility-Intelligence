'use client';

import React from 'react';

type SettingGroupProps = {
  title: string;
  children: React.ReactNode;
};

type SettingItemProps = {
  label: string;
  description: string;
  type?: 'toggle' | 'select';
  checked?: boolean;
};

const SettingGroup = ({ title, children }: SettingGroupProps) => (
  <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--emerald-light)' }}>{title}</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {children}
    </div>
  </div>
);

const SettingItem = ({ label, description, type = 'toggle', checked = false }: SettingItemProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ flex: 1 }}>
      <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.1rem' }}>{label}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{description}</p>
    </div>
    {type === 'toggle' && (
      <div style={{ 
        width: '44px', 
        height: '24px', 
        background: checked ? 'var(--emerald-mid)' : 'rgba(255,255,255,0.1)', 
        borderRadius: '12px',
        position: 'relative',
        cursor: 'pointer',
        border: '1px solid var(--card-border)'
      }}>
        <div style={{ 
          width: '18px', 
          height: '18px', 
          background: 'white', 
          borderRadius: '50%', 
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'all 0.2s ease'
        }} />
      </div>
    )}
    {type === 'select' && (
      <select style={{ 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid var(--card-border)', 
        color: 'white',
        padding: '0.5rem',
        borderRadius: '6px',
        fontSize: '0.85rem'
      }}>
        <option>Standard</option>
        <option>Aggressive</option>
        <option>Eco-Focus</option>
      </select>
    )}
  </div>
);

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Control <span className="text-gradient">Center</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>Configure Vynta Vision and System-wide Preferences</p>
      </header>

      <SettingGroup title="Vynta Vision AI">
        <SettingItem 
          label="Autonomous HVAC" 
          description="Allow Vynta to adjust building temperature based on occupancy prediction."
          checked={true}
        />
        <SettingItem 
          label="Predictive Alerts" 
          description="Surface maintenance warnings before equipment failure."
          checked={true}
        />
        <SettingItem 
          label="Genie Response Optimization" 
          description="Model behavior for automated tenant communications."
          type="select"
        />
      </SettingGroup>

      <SettingGroup title="Sustainability Targets">
        <SettingItem 
          label="Strict Carbon Compliance" 
          description="Enforce energy caps during peak grid demand."
          checked={false}
        />
        <SettingItem 
          label="Renewable Priority" 
          description="Maximize solar battery usage over grid supply."
          checked={true}
        />
      </SettingGroup>

      <SettingGroup title="Security & API">
        <SettingItem 
          label="Real-time Webhooks" 
          description="Stream system events to external facility software."
          checked={true}
        />
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px dashed var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <code>API_KEY: vynta_live_sk_.......8fb2</code>
          <button style={{ 
            background: 'var(--emerald-mid)', 
            border: 'none', 
            color: 'white', 
            padding: '0.4rem 0.8rem', 
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>Regenerate</button>
        </div>
      </SettingGroup>
    </div>
  );
}
