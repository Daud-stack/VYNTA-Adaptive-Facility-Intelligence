'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';
import { readJsonResponse } from '@/lib/http';

type Metrics = {
  temperature: number;
  co2: number;
  energy: number;
};

type Ticket = {
  id: string;
  ticketId: string;
  title: string;
  user: string;
  priority: string;
  status: string;
  timestamp: string;
};

type TenantRequest = {
  id: string;
  requestId: string;
  category: 'Space Booking' | 'Access Key' | 'Catering';
  title: string;
  requester: string;
  details: string;
  status: string;
  timestamp: string;
  meta?: Record<string, string>;
};

type RequestType = 'repair' | 'space' | 'access' | 'catering';

type RequestDraft = {
  title: string;
  details: string;
  requestedFor: string;
  metaOne: string;
  metaTwo: string;
};

const emptyDraft: RequestDraft = {
  title: '',
  details: '',
  requestedFor: '',
  metaOne: '',
  metaTwo: '',
};

const quickActionMeta: Record<
  RequestType,
  {
    heading: string;
    button: string;
    accent: string;
    category?: TenantRequest['category'];
    metaOneLabel: string;
    metaTwoLabel: string;
    placeholder: string;
    detailPlaceholder: string;
  }
> = {
  repair: {
    heading: 'Report Facility Issue',
    button: 'SUBMIT REQUEST',
    accent: '#10b981',
    metaOneLabel: 'Priority',
    metaTwoLabel: 'Location',
    placeholder: 'Broken light in Suite 405',
    detailPlaceholder: 'Add details that will help the service desk arrive prepared.',
  },
  space: {
    heading: 'Reserve A Shared Space',
    button: 'BOOK SPACE',
    accent: '#34d399',
    category: 'Space Booking',
    metaOneLabel: 'Room / Zone',
    metaTwoLabel: 'Attendees',
    placeholder: 'Boardroom, focus pod, event lounge...',
    detailPlaceholder: 'What is the room needed for and what setup should the team prepare?',
  },
  access: {
    heading: 'Request Access Support',
    button: 'REQUEST ACCESS',
    accent: '#60a5fa',
    category: 'Access Key',
    metaOneLabel: 'Access Type',
    metaTwoLabel: 'Needed For',
    placeholder: 'Mobile pass, visitor QR, after-hours badge...',
    detailPlaceholder: 'Tell us who needs access and any security notes we should respect.',
  },
  catering: {
    heading: 'Arrange Catering',
    button: 'ORDER CATERING',
    accent: '#fbbf24',
    category: 'Catering',
    metaOneLabel: 'Servings',
    metaTwoLabel: 'Dietary Notes',
    placeholder: 'Breakfast spread, coffee service, lunch trays...',
    detailPlaceholder: 'Share delivery location, preferred menu, and any timing expectations.',
  },
};

type QuickActionProps = {
  icon: string;
  label: string;
  color: string;
  onClick: () => void;
};

const QuickAction = ({ icon, label, color, onClick }: QuickActionProps) => (
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
      color: 'white',
    }}
  >
    <span style={{ fontSize: '2rem' }}>{icon}</span>
    <span style={{ fontSize: '0.9rem', fontWeight: '600', textAlign: 'center', background: 'none' }}>{label}</span>
  </button>
);

export default function TenantPortal() {
  const { user, tickets, refreshData } = useVynta();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [tenantRequests, setTenantRequests] = useState<TenantRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<RequestType | null>(null);
  const [draft, setDraft] = useState<RequestDraft>(emptyDraft);
  const [submitting, setSubmitting] = useState(false);

  const loadTenantRequests = async () => {
    try {
      const response = await fetch('/api/tenant-requests', {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Tenant requests endpoint returned ${response.status}`);
      }

      const data = await readJsonResponse<TenantRequest[]>(response);
      setTenantRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn('Tenant requests unavailable, falling back to empty state.', error);
      setTenantRequests([]);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/sensors?zone=Suite-405').then((res) =>
        readJsonResponse<{ metrics: Metrics }>(res)
      ),
      loadTenantRequests(),
    ])
      .then(([data]) => setMetrics(data.metrics))
      .catch((error) => {
        console.error('Failed to load portal data:', error);
      });
  }, []);

  const openComposer = (type: RequestType) => {
    setActiveRequest(type);
    setDraft(emptyDraft);
  };

  const closeComposer = () => {
    setActiveRequest(null);
    setDraft(emptyDraft);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeRequest) {
      return;
    }

    setSubmitting(true);

    try {
      if (activeRequest === 'repair') {
        await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            title: draft.title,
            user: user?.name || 'Anonymous Tenant',
            priority: draft.metaOne || 'Medium',
            status: 'Unassigned',
            timestamp: draft.requestedFor || 'Just now',
            details: draft.details,
            location: draft.metaTwo,
          }),
        });
        await refreshData();
      } else {
        const config = quickActionMeta[activeRequest];
        await fetch('/api/tenant-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: config.category,
            title: draft.title,
            requester: user?.name || 'Anonymous Tenant',
            details: draft.details,
            requestedFor: draft.requestedFor,
            meta: {
              [config.metaOneLabel]: draft.metaOne,
              [config.metaTwoLabel]: draft.metaTwo,
            },
          }),
        });
        await loadTenantRequests();
      }

      closeComposer();
    } catch (error) {
      console.error('Failed to submit tenant request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const tenantTickets = tickets.filter(
    (ticket: Ticket) =>
      ticket.user === user?.name ||
      ticket.user === 'Sarah Jenkins' ||
      user?.role === 'Admin'
  );

  const visibleRequests = tenantRequests.filter(
    (request) => request.requester === user?.name || user?.role === 'Admin'
  );

  const activityFeed = [
    ...tenantTickets.map((ticket) => ({
      id: ticket.id,
      code: ticket.ticketId,
      title: ticket.title,
      timestamp: ticket.timestamp,
      status: ticket.status,
      category: 'Repair',
      tone:
        ticket.status === 'Completed' || ticket.status === 'Resolved'
          ? '#10b981'
          : '#fbbf24',
    })),
    ...visibleRequests.map((request) => ({
      id: request.id,
      code: request.requestId,
      title: request.title,
      timestamp: request.timestamp,
      status: request.status,
      category: request.category,
      tone:
        request.status === 'Confirmed' || request.status === 'Delivered'
          ? '#10b981'
          : request.category === 'Access Key'
            ? '#60a5fa'
            : request.category === 'Catering'
              ? '#fbbf24'
              : '#34d399',
    })),
  ];

  const zoneHealthLabel =
    metrics && metrics.co2 > 550
      ? 'ATTENTION'
      : metrics && metrics.temperature > 24
        ? 'WARM'
        : 'OPTIMAL';

  const conciergeMessage =
    visibleRequests[0]?.category === 'Access Key'
      ? 'Your latest access request is in queue. Security usually issues temporary credentials within 15 minutes.'
      : visibleRequests[0]?.category === 'Space Booking'
        ? 'Your room booking is synced with building operations, so space setup and climate presets can be prepared ahead of arrival.'
        : visibleRequests[0]?.category === 'Catering'
          ? 'Catering coordination is active. Dietary notes and delivery timing have been attached to your request.'
          : metrics?.co2 && metrics.co2 > 500
            ? "CO2 levels are slightly elevated. I've increased fresh air intake for your zone."
            : 'Everything in your suite looks balanced right now. If you need a room, badge, or refreshments, I can route it instantly.';

  const currentAction = activeRequest ? quickActionMeta[activeRequest] : null;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', padding: '2rem', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Resident <span className="text-gradient">Experience</span>
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
          Vynta Portal: Welcome back, {user?.name}
        </p>
      </header>

      <section
        className="glass"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>TEMPERATURE</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
            {metrics?.temperature.toFixed(1) || '--'}°C
          </p>
        </div>
        <div style={{ width: '1px', height: '30px', background: 'var(--card-border)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>AIR QUALITY (CO2)</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
            {metrics?.co2.toFixed(0) || '--'} ppm
          </p>
        </div>
        <div style={{ width: '1px', height: '30px', background: 'var(--card-border)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>ZONE HEALTH</p>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: zoneHealthLabel === 'OPTIMAL' ? '#10b981' : '#fbbf24',
            }}
          >
            {zoneHealthLabel}
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <QuickAction icon="🛠️" label="New Repair" color="#10b981" onClick={() => openComposer('repair')} />
          <QuickAction icon="🏢" label="Book Space" color="#34d399" onClick={() => openComposer('space')} />
          <QuickAction icon="💳" label="Access Key" color="#60a5fa" onClick={() => openComposer('access')} />
          <QuickAction icon="🍱" label="Catering" color="#fbbf24" onClick={() => openComposer('catering')} />
        </div>
      </section>

      {currentAction && (
        <div
          className="glass"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            border: `1px solid ${currentAction.accent}50`,
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>{currentAction.heading}</h3>
          <form onSubmit={handleSubmitRequest}>
            <input
              autoFocus
              className="glass"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                marginBottom: '1rem',
              }}
              placeholder={currentAction.placeholder}
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <textarea
              className="glass"
              style={{
                width: '100%',
                minHeight: '110px',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                marginBottom: '1rem',
                resize: 'vertical',
              }}
              placeholder={currentAction.detailPlaceholder}
              value={draft.details}
              onChange={(e) => setDraft((prev) => ({ ...prev, details: e.target.value }))}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                className="glass"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                }}
                placeholder="Requested for"
                value={draft.requestedFor}
                onChange={(e) => setDraft((prev) => ({ ...prev, requestedFor: e.target.value }))}
              />
              <input
                className="glass"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                }}
                placeholder={currentAction.metaOneLabel}
                value={draft.metaOne}
                onChange={(e) => setDraft((prev) => ({ ...prev, metaOne: e.target.value }))}
              />
              <input
                className="glass"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                }}
                placeholder={currentAction.metaTwoLabel}
                value={draft.metaTwo}
                onChange={(e) => setDraft((prev) => ({ ...prev, metaTwo: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                disabled={submitting}
                type="submit"
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-gradient)',
                  border: 'none',
                  color: 'black',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {submitting ? 'Submitting...' : currentAction.button}
              </button>
              <button
                disabled={submitting}
                type="button"
                onClick={closeComposer}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'transparent',
                  border: '1px solid var(--card-border)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
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
            {activityFeed.length > 0 ? (
              activityFeed.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--card-border)',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.title}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {item.code} • {item.category} • {item.timestamp}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      background: `${item.tone}20`,
                      color: item.tone,
                      border: `1px solid ${item.tone}40`,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No active requests.</p>
            )}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="glass"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary-gradient)',
              color: 'white',
            }}
          >
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'black' }}>Vynta Concierge</h4>
            <p style={{ fontSize: '0.85rem', color: 'black', opacity: 0.8 }}>{conciergeMessage}</p>
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Building Health</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: '0.85rem' }}>
                Air quality: {metrics?.co2 && metrics.co2 > 500 ? 'Fresh-air boost active' : 'Balanced'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: visibleRequests.length > 0 ? '#34d399' : '#10b981',
                  borderRadius: '50%',
                  boxShadow: `0 0 8px ${visibleRequests.length > 0 ? '#34d399' : '#10b981'}`,
                }}
              />
              <span style={{ fontSize: '0.85rem' }}>
                Service queue: {visibleRequests.length} live tenant request{visibleRequests.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
