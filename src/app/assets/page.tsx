'use client';

import React from 'react';
import { useVynta } from '@/lib/store';
import DigitalTwin from '@/components/DigitalTwin';
import type { Asset } from '@/lib/types';

export default function AssetsPage() {
  const { assets } = useVynta();

  return (
    <div style={{ width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Asset <span className="text-gradient">Intelligence</span></h2>
          <p style={{ color: 'var(--text-dim)' }}>Digital twin mapping and autonomous condition monitoring.</p>
        </div>
        <button className="glass-hover" style={{ 
          padding: '0.8rem 1.5rem', 
          borderRadius: 'var(--radius-md)', 
          background: 'var(--primary-gradient)', 
          border: 'none', 
          color: 'black', 
          fontWeight: '800', 
          cursor: 'pointer' 
        }}>
          + ADD ASSET
        </button>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '2rem' 
      }}>
        {assets.map((asset: Asset) => (
          <div key={asset.id} className="glass glass-hover" style={{ 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* 3D Visualization Header */}
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <DigitalTwin id={asset.label ?? asset.id} health={asset.health} />
            </div>

            {/* Asset Details */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{asset.name}</h3>
                <span style={{ 
                  fontSize: '0.7rem', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '10px', 
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid #10b98130'
                }}>
                  {asset.type}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>LOCATION</p>
                  <p style={{ fontSize: '0.9rem' }}>{asset.location}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>UPTIME</p>
                  <p style={{ fontSize: '0.9rem', color: '#10b981' }}>{asset.uptime}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: asset.status === 'Active' ? '#10b981' : asset.status === 'Warning' ? '#f87171' : '#fbbf24' 
                  }} />
                  <span style={{ fontSize: '0.85rem' }}>{asset.status}</span>
                </div>
                <button style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-dim)', 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}>
                  View Telemetry
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
