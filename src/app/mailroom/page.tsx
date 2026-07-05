'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function MailroomDashboard() {
  const { user } = useVynta();
  const [consignments, setConsignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      const res = await fetch('/api/mailroom');
      const data = await res.json();
      setConsignments(data);
    } catch (error) {
      console.error('Failed to fetch consignments', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'RECEIVED': return 'var(--blue)';
      case 'READY_FOR_PICKUP': return 'var(--orange)';
      case 'DELIVERED': return 'var(--emerald-mid)';
      default: return 'var(--text-dim)';
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Mailroom...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Mailroom Management</h1>
          <p style={{ color: 'var(--text-dim)' }}>Log incoming tenant packages and track deliveries.</p>
        </div>
        <button className="glass glass-hover" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', color: 'var(--blue)', fontWeight: 'bold' }}>
          + Log Package
        </button>
      </header>

      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '1rem' }}>Tracking #</th>
              <th style={{ padding: '1rem' }}>Carrier</th>
              <th style={{ padding: '1rem' }}>Recipient (Tenant)</th>
              <th style={{ padding: '1rem' }}>Received At</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {consignments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No packages in the mailroom.</td>
              </tr>
            ) : (
              consignments.map((c: any) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.trackingNumber}</td>
                  <td style={{ padding: '1rem' }}>{c.carrier}</td>
                  <td style={{ padding: '1rem' }}>{c.recipient?.name || 'Unknown'}</td>
                  <td style={{ padding: '1rem' }}>{new Date(c.receivedAt).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: `${getStatusColor(c.status)}20`,
                      color: getStatusColor(c.status),
                      border: `1px solid ${getStatusColor(c.status)}50`
                    }}>
                      {c.status.replace(/_/g, ' ')}
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

