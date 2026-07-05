'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function TravelDashboard() {
  const { user } = useVynta();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTravelRequests();
  }, []);

  const fetchTravelRequests = async () => {
    try {
      const res = await fetch('/api/travel');
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch travel requests', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'var(--orange)';
      case 'APPROVED': return 'var(--emerald-mid)';
      case 'REJECTED': return 'var(--red)';
      default: return 'var(--text-dim)';
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Travel Operations...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Travel Requests</h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage and approve corporate travel itineraries.</p>
        </div>
        <button className="glass glass-hover" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', color: 'var(--blue)', fontWeight: 'bold' }}>
          + New Request
        </button>
      </header>

      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '1rem' }}>Employee</th>
              <th style={{ padding: '1rem' }}>Destination</th>
              <th style={{ padding: '1rem' }}>Dates</th>
              <th style={{ padding: '1rem' }}>Est. Cost</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No travel requests found.</td>
              </tr>
            ) : (
              requests.map((r: any) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{r.user.name}</td>
                  <td style={{ padding: '1rem' }}>{r.destination}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>
                    {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>${r.estimatedCost.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: `${getStatusColor(r.status)}20`,
                      color: getStatusColor(r.status),
                      border: `1px solid ${getStatusColor(r.status)}50`
                    }}>
                      {r.status}
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
