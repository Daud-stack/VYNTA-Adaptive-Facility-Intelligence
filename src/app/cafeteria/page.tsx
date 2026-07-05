'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function CafeteriaManagement() {
  const { user } = useVynta();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/cafeteria');
      const data = await res.json();
      if (Array.isArray(data)) { setMenuItems(data); } else { setMenuItems([]); console.error('API Error:', data); }
    } catch (error) {
      console.error('Failed to fetch menu', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (menuItemId: string) => {
    if (!user) return alert('Please log in to order.');
    try {
      const res = await fetch('/api/cafeteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, menuItemId, quantity: 1 })
      });
      if (res.ok) {
        alert('Order placed successfully! Please check the pickup counter in 15 minutes.');
      }
    } catch (e) {
      console.error('Ordering failed', e);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Today's Menu...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>The Cafe</h1>
        <p style={{ color: 'var(--text-dim)' }}>Pre-order your subsidized meals and reduce food waste.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {menuItems.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-dim)', padding: '3rem' }}>
            The menu hasn't been posted yet today. Check back later!
          </div>
        ) : (
          menuItems.map((item: any) => {
            const allergens = item.allergens ? JSON.parse(item.allergens) : [];
            return (
              <div key={item.id} className="glass glass-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{item.name}</h3>
                  <span style={{ fontWeight: '800', color: 'var(--emerald-light)', fontSize: '1.2rem' }}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                  {item.description || 'Delicious freshly prepared meal.'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                  {item.calories && <span style={{ color: 'var(--orange)' }}>🔥 {item.calories} kcal</span>}
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {allergens.map((a: string) => (
                      <span key={a} style={{ padding: '0.2rem 0.4rem', background: 'var(--red)', color: 'white', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleOrder(item.id)}
                  style={{ 
                    width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', 
                    background: 'linear-gradient(135deg, var(--blue) 0%, #1e40af 100%)', 
                    color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  Order Now
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


