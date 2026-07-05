'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function TenantBilling() {
  const { user } = useVynta();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    try {
      // If admin, fetch all, otherwise fetch user's
      const url = user?.role === 'Admin' ? '/api/billing' : `/api/billing?userId=${user?.id}`;
      const res = await fetch(url);
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'var(--blue)';
      case 'PAID': return 'var(--emerald-mid)';
      case 'OVERDUE': return 'var(--red)';
      default: return 'var(--text-dim)';
    }
  };

  const totalDue = invoices
    .filter((i: any) => i.status === 'PENDING' || i.status === 'OVERDUE')
    .reduce((sum, i: any) => sum + i.amount, 0);

  if (!user) return <div style={{ padding: '2rem' }}>Please log in to view billing.</div>;
  if (loading) return <div style={{ padding: '2rem' }}>Loading Invoices...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Billing & Invoices</h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage your property lease, utility, and service charges.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>Total Outstanding</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: totalDue > 0 ? 'var(--red)' : 'var(--emerald-mid)' }}>
            ${totalDue.toFixed(2)}
          </div>
        </div>
      </header>

      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '1rem' }}>Invoice ID</th>
              {user?.role === 'Admin' && <th style={{ padding: '1rem' }}>Tenant</th>}
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Due Date</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={user?.role === 'Admin' ? 7 : 6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No invoices found.</td>
              </tr>
            ) : (
              invoices.map((i: any) => (
                <tr key={i.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>{i.id.slice(-8).toUpperCase()}</td>
                  {user?.role === 'Admin' && <td style={{ padding: '1rem', fontWeight: 'bold' }}>{i.user?.name}</td>}
                  <td style={{ padding: '1rem' }}>{i.description}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>${i.amount.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>{new Date(i.dueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: `${getStatusColor(i.status)}20`,
                      color: getStatusColor(i.status),
                      border: `1px solid ${getStatusColor(i.status)}50`
                    }}>
                      {i.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {i.status !== 'PAID' && user?.role !== 'Admin' && (
                      <button style={{ 
                        background: 'var(--emerald-mid)', color: 'white', border: 'none', 
                        padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                      }}>
                        Pay Now
                      </button>
                    )}
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
