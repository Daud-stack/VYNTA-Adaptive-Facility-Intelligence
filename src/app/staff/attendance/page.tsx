'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function StaffAttendance() {
  const { user } = useVynta();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);

  useEffect(() => {
    if (user) fetchAttendance();
  }, [user]);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/attendance?userId=${user?.id}`);
      const data = await res.json();
      setRecords(data);
      
      // Determine if currently clocked in (most recent record has no clockOut)
      if (data.length > 0 && !data[0].clockOut) {
        setIsClockedIn(true);
      } else {
        setIsClockedIn(false);
      }
    } catch (error) {
      console.error('Failed to fetch attendance', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockToggle = async () => {
    const type = isClockedIn ? 'CLOCK_OUT' : 'CLOCK_IN';
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          type,
          location: 'Main Office' // In a real app, this could use Geolocation API
        })
      });
      
      if (res.ok) {
        fetchAttendance();
      }
    } catch (e) {
      console.error('Clock toggle failed', e);
    }
  };

  if (!user) return <div style={{ padding: '2rem' }}>Please log in to view attendance.</div>;
  if (loading) return <div style={{ padding: '2rem' }}>Loading Attendance...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Time & Attendance</h1>
        <p style={{ color: 'var(--text-dim)' }}>Manage your shifts and leave requests.</p>
      </header>

      <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: isClockedIn ? 'var(--emerald-mid)' : 'var(--text)' }}>
          {isClockedIn ? 'Status: Clocked In' : 'Status: Clocked Out'}
        </h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <button 
          onClick={handleClockToggle}
          style={{ 
            padding: '1.5rem 4rem', 
            fontSize: '1.5rem',
            borderRadius: '100px',
            border: 'none',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: isClockedIn ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, var(--emerald-mid) 0%, var(--emerald-dark) 100%)',
            boxShadow: isClockedIn ? '0 10px 25px -5px rgba(239, 68, 68, 0.4)' : '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          {isClockedIn ? 'Clock Out' : 'Clock In'}
        </button>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Shifts</h3>
      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Clock In</th>
              <th style={{ padding: '1rem' }}>Clock Out</th>
              <th style={{ padding: '1rem' }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No attendance records found.</td>
              </tr>
            ) : (
              records.map((r: any) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{new Date(r.clockIn).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--emerald-light)' }}>{new Date(r.clockIn).toLocaleTimeString()}</td>
                  <td style={{ padding: '1rem', color: r.clockOut ? 'var(--text-dim)' : 'var(--blue)' }}>
                    {r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : 'Active'}
                  </td>
                  <td style={{ padding: '1rem' }}>{r.location || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
