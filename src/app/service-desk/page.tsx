'use client';

import React, { useState } from 'react';
import { useVynta } from '@/lib/store';
import type { Ticket } from '@/lib/types';

export default function ServiceDesk() {
  const { tickets, refreshData } = useVynta();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsUpdating(true);
    try {
      await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      await refreshData();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Service <span className="text-gradient">Desk</span></h2>
        <p style={{ color: 'var(--text-dim)' }}>Manage facility tickets and AI-driven advisory logs.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Ticket List */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Active Tickets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tickets.map((ticket: Ticket) => (
              <div 
                key={ticket.id} 
                className={`glass glass-hover ${selectedTicket?.id === ticket.id ? 'active-item' : ''}`}
                onClick={() => setSelectedTicket(ticket)}
                style={{ 
                  padding: '1.2rem', 
                  borderRadius: 'var(--radius-md)', 
                  cursor: 'pointer',
                  borderLeft: `4px solid ${ticket.priority === 'High' ? '#f87171' : '#fbbf24'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{ticket.ticketId}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    background: 'rgba(255,255,255,0.05)',
                    color: ticket.status === 'Completed' ? '#10b981' : 'white'
                  }}>
                    {ticket.status}
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{ticket.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <span>{ticket.user}</span>
                  <span>{ticket.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Genie Hub */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ 
            padding: '2rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid #10b98130',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'var(--primary-gradient)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                🧞
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#10b981' }}>Vynta Genie</h3>
            </div>

            {selectedTicket ? (
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                  Analyzing: {selectedTicket.ticketId}
                </p>
                <div className="glass" style={{ padding: '1.2rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '1.5rem' }}>
                  <p style={{ lineHeight: '1.6', fontSize: '1rem' }}>
                    {selectedTicket.aiResponse || "I am currently analyzing this ticket. Please wait for telemetry patterns to stabilize."}
                  </p>
                </div>

                {selectedTicket.aiReasoning && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>AI Reasoning Chain:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {(JSON.parse(selectedTicket.aiReasoning) as string[]).map((step: string, i: number) => (
                        <div key={i} style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ opacity: 0.5 }}>•</span> {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button 
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'Resolved')}
                    style={{ 
                      flex: 1, 
                      padding: '0.8rem', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--primary-gradient)', 
                      border: 'none', 
                      color: 'black', 
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    APPROVE SOLUTION
                  </button>
                  <button style={{ 
                    padding: '0.8rem 1.2rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--card-border)', 
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    ESCALATE
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
                <p>Select a ticket to activate Vynta Genie&apos;s advisory layer.</p>
              </div>
            )}
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>SYSTEM HEALTH</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <div style={{ width: '94%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>94%</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .active-item {
          border: 1px solid #10b98140 !important;
          background: rgba(16, 185, 129, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
