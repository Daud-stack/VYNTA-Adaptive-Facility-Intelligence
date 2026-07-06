'use client';

import React, { useState, useEffect } from 'react';

type TimelineItem = {
  asset: string;
  start: number;
  width: number;
  color: string;
  status: string;
};

const TimelineBar = ({ asset, start, width, color, status }: TimelineItem) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
    <div style={{ width: '150px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>{asset}</div>
    <div style={{ flex: 1, position: 'relative', height: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
      <div className="glass-hover" style={{
        position: 'absolute',
        left: `${start}%`,
        width: `${width}%`,
        height: '100%',
        background: color,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 0.8rem',
        fontSize: '0.7rem',
        color: 'white',
        fontWeight: '600',
        boxShadow: `0 0 15px ${color}30`,
        cursor: 'pointer'
      }}>
        {status}
      </div>
    </div>
  </div>
);

export default function Maintenance() {
  const [schedule, setSchedule] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assetId: '', nextRunAt: '' });
  
  // We'll dynamically fetch assets to populate the dropdown
  const [assetsList, setAssetsList] = useState<{id: string, name: string}[]>([]);

  const fetchSchedule = () => {
    fetch('/api/maintenance')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSchedule(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load maintenance schedule', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSchedule();
    fetch('/api/assets').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setAssetsList(data);
    }).catch(console.error);
  }, []);

  const handleScheduleTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewTask({ title: '', assetId: '', nextRunAt: '' });
        fetchSchedule(); // refresh timeline
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading live maintenance timeline...</div>;

  return (
    <div style={{ width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>Maintenance Timeline</h2>
          <p style={{ color: 'var(--text-dim)' }}>Chronological view of scheduled asset interventions.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass glass-hover" onClick={() => alert('Calendar view is coming soon!')} style={{ padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', color: 'white', cursor: 'pointer' }}>Calendar View</button>
          <button className="glass-hover" onClick={() => setIsModalOpen(true)} style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-gradient)', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer' }}>+ Schedule Task</button>
        </div>
      </header>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass" style={{
            padding: '2rem', borderRadius: 'var(--radius-lg)', width: '400px',
            border: '1px solid var(--card-border)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--emerald-light)' }}>Schedule Maintenance</h3>
            <form onSubmit={handleScheduleTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                placeholder="Task Title (e.g. Filter Replacement)" 
                required 
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              />
              <select 
                value={newTask.assetId}
                onChange={e => setNewTask({...newTask, assetId: e.target.value})}
                required
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              >
                <option value="" disabled>Select Asset</option>
                {assetsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input 
                type="date"
                required 
                value={newTask.nextRunAt}
                onChange={e => setNewTask({...newTask, nextRunAt: e.target.value})}
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '0.8rem', background: 'var(--primary-gradient)', border: 'none', color: 'black', fontWeight: 'bold', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Scheduling...' : 'Schedule Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
          <div style={{ width: '150px' }}></div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            <span>Week 15</span>
            <span>Week 16</span>
            <span>Week 17</span>
            <span>Week 18</span>
          </div>
        </div>
        <div>
          {schedule.map((item, i) => <TimelineBar key={i} {...item} />)}
        </div>
      </div>
    </div>
  );
}
