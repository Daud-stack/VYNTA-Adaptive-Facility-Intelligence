'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function VisitorManagement() {
  const { user } = useVynta();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await fetch('/api/visitors');
      const data = await res.json();
      setVisitors(data);
    } catch (error) {
      console.error('Failed to fetch visitors', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'EXPECTED': return 'var(--blue)';
      case 'CHECKED_IN': return 'var(--emerald-mid)';
      case 'CHECKED_OUT': return 'var(--text-dim)';
      case 'OVERSTAYED': return 'var(--red)';
      default: return 'var(--text-dim)';
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Visitors...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Visitor Management</h1>
          <p style={{ color: 'var(--text-dim)' }}>Monitor and track facility guests across all sites.</p>
        </div>
        <button className="glass glass-hover" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', color: 'var(--emerald-light)', fontWeight: 'bold' }}>
          + Register Visitor
        </button>
      </header>

      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '1rem' }}>Visitor</th>
              <th style={{ padding: '1rem' }}>Company</th>
              <th style={{ padding: '1rem' }}>Host</th>
              <th style={{ padding: '1rem' }}>Expected At</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No visitors expected today.</td>
              </tr>
            ) : (
              visitors.map((v: any) => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600' }}>{v.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{v.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{v.company || '-'}</td>
                  <td style={{ padding: '1rem' }}>{v.host?.name || 'Unknown'}</td>
                  <td style={{ padding: '1rem' }}>{new Date(v.expectedAt).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: `${getStatusColor(v.status)}20`,
                      color: getStatusColor(v.status),
                      border: `1px solid ${getStatusColor(v.status)}50`
                    }}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
