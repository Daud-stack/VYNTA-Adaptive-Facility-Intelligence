'use client';

import React, { useState, useEffect } from 'react';
import { useVynta } from '@/lib/store';

type SettingGroupProps = {
  title: string;
  children: React.ReactNode;
};

type SettingItemProps = {
  label: string;
  description: string;
  type?: 'toggle' | 'select';
  checked?: boolean;
  value?: string;
  onChange?: (val: any) => void;
};

const SettingGroup = ({ title, children }: SettingGroupProps) => (
  <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--emerald-light)' }}>{title}</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {children}
    </div>
  </div>
);

const SettingItem = ({ label, description, type = 'toggle', checked = false, value = '', onChange }: SettingItemProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ flex: 1 }}>
      <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.1rem' }}>{label}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{description}</p>
    </div>
    {type === 'toggle' && (
      <div 
        onClick={() => onChange && onChange(!checked)}
        style={{ 
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
      <select 
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{ 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid var(--card-border)', 
        color: 'white',
        padding: '0.5rem',
        borderRadius: '6px',
        fontSize: '0.85rem'
      }}>
        <option value="Standard">Standard</option>
        <option value="Aggressive">Aggressive</option>
        <option value="Eco-Focus">Eco-Focus</option>
      </select>
    )}
  </div>
);

export default function SettingsPage() {
  const { user } = useVynta();
  const [settings, setSettings] = useState<Record<string, any>>({
    autonomousHvac: true,
    predictiveAlerts: true,
    genieResponse: 'Standard',
    strictCarbon: false,
    renewablePriority: true,
    realtimeWebhooks: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/settings?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings(prev => ({ ...prev, ...data }));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch settings', err);
        setIsLoading(false);
      });
  }, [user]);

  const handleUpdate = async (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (user) {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...newSettings })
      });
    }
  };

  if (!user) return <div style={{ padding: '2rem' }}>Please log in to view settings.</div>;
  if (isLoading) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

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
          checked={settings.autonomousHvac}
          onChange={(val) => handleUpdate('autonomousHvac', val)}
        />
        <SettingItem 
          label="Predictive Alerts" 
          description="Surface maintenance warnings before equipment failure."
          checked={settings.predictiveAlerts}
          onChange={(val) => handleUpdate('predictiveAlerts', val)}
        />
        <SettingItem 
          label="Genie Response Optimization" 
          description="Model behavior for automated tenant communications."
          type="select"
          value={settings.genieResponse}
          onChange={(val) => handleUpdate('genieResponse', val)}
        />
      </SettingGroup>

      <SettingGroup title="Sustainability Targets">
        <SettingItem 
          label="Strict Carbon Compliance" 
          description="Enforce energy caps during peak grid demand."
          checked={settings.strictCarbon}
          onChange={(val) => handleUpdate('strictCarbon', val)}
        />
        <SettingItem 
          label="Renewable Priority" 
          description="Maximize solar battery usage over grid supply."
          checked={settings.renewablePriority}
          onChange={(val) => handleUpdate('renewablePriority', val)}
        />
      </SettingGroup>

      <SettingGroup title="Security & API">
        <SettingItem 
          label="Real-time Webhooks" 
          description="Stream system events to external facility software."
          checked={settings.realtimeWebhooks}
          onChange={(val) => handleUpdate('realtimeWebhooks', val)}
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
