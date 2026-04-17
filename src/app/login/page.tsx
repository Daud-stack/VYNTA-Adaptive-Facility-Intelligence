'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVynta } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useVynta();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data); // Pass full user object
        router.push('/');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 100%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated Background Glow */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
        filter: 'blur(50px)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0
      }} />

      <div className="glass" style={{
        width: '400px',
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--card-border)',
        zIndex: 1,
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            VYNTA
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Facility OS Access
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: '600' }}>IDENTITY</label>
            <input 
              type="email" 
              placeholder="admin@vynta.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                outline: 'none focus:border-emerald-500',
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: '600' }}>COMMAND KEY</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="glass-hover"
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--primary-gradient)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'black',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Initializing...' : 'Decrypt & Enter'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Restricted access system. All activity is monitored by Vynta Vision.
        </p>
      </div>
    </div>
  );
}
