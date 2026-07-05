'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function SpaceBooking() {
  const { user } = useVynta();
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [spaceRes, bookingRes] = await Promise.all([
        fetch('/api/spaces'),
        fetch('/api/bookings')
      ]);
      const spacesData = await spaceRes.json();
      const bookingsData = await bookingRes.json();
      setSpaces(spacesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to fetch booking data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (spaceId: string) => {
    if (!user) return alert('You must be logged in to book.');
    // Defaulting to booking for the next 1 hour
    const start = new Date();
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId,
          userId: user.id,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        })
      });
      if (res.ok) {
        alert('Space booked successfully!');
        fetchData();
      }
    } catch (e) {
      console.error('Booking failed', e);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Spaces...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Space Booking</h1>
        <p style={{ color: 'var(--text-dim)' }}>Reserve meeting rooms, hot desks, and conference centers.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {spaces.length === 0 ? (
          <div style={{ color: 'var(--text-dim)' }}>No spaces available yet. Contact an administrator to add spaces.</div>
        ) : (
          spaces.map((space: any) => {
            const amenities = space.amenities ? JSON.parse(space.amenities) : [];
            return (
              <div key={space.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{space.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--blue)' }}>{space.type} • Capacity: {space.capacity}</div>
                  </div>
                  <div style={{ 
                    width: '12px', height: '12px', borderRadius: '50%', 
                    background: space.status === 'Available' ? 'var(--emerald-mid)' : 'var(--red)'
                  }} title={space.status} />
                </div>
                
                {amenities.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {amenities.map((a: string) => (
                      <span key={a} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--glass-bg)', borderRadius: '4px', border: '1px solid var(--card-border)' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                )}
                
                <div style={{ marginTop: 'auto' }}>
                  <button 
                    className="glass glass-hover" 
                    style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
                    onClick={() => handleBook(space.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your Recent Bookings</h2>
      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '1rem' }}>Space</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Time</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No bookings found.</td>
              </tr>
            ) : (
              bookings.map((b: any) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{b.space.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{b.space.type}</td>
                  <td style={{ padding: '1rem' }}>{b.user.name}</td>
                  <td style={{ padding: '1rem' }}>
                    {new Date(b.startTime).toLocaleTimeString()} - {new Date(b.endTime).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: 'var(--emerald-light)' }}>{b.status}</span>
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
