'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVynta } from '@/lib/store';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useVynta();
  
  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/', roles: ['Admin'] },
    { name: 'Service Intelligence', icon: '🎧', path: '/service-desk', roles: ['Admin'] },
    { name: 'Asset Registry', icon: '🏗️', path: '/assets', roles: ['Admin'] },
    { name: 'Energy Hub', icon: '⚡', path: '/energy', roles: ['Admin'] },
    { name: 'Maintenance', icon: '🛠️', path: '/maintenance', roles: ['Admin'] },
    { name: 'Systems Analytics', icon: '📈', path: '/analytics', roles: ['Admin'] },
    { name: 'Tenant Portal', icon: '🏢', path: '/portal', roles: ['Admin', 'Tenant'] },
    { name: 'Settings', icon: '⚙️', path: '/settings', roles: ['Admin', 'Tenant'] },
  ];

  const filteredItems = menuItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <aside className="glass" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.2rem',
      borderRight: '1px solid var(--card-border)',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '0.1em' }}>
          VYNTA
        </h1>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem', textTransform: 'uppercase', fontWeight: '600' }}>
          Facility Intelligence
        </p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {filteredItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }}>
              <div className={isActive ? 'glass-active' : 'glass-hover'} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.7rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: isActive ? 'var(--emerald-light)' : 'var(--text-dim)',
                background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'
              }}>
                <span style={{ fontSize: '1.2rem', marginRight: '1rem', filter: isActive ? 'drop-shadow(0 0 5px var(--emerald-mid))' : 'none' }}>
                  {item.icon}
                </span>
                <span style={{ fontWeight: isActive ? '700' : '500', fontSize: '0.9rem' }}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass" style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ marginRight: '0.5rem' }}>✨</span>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--emerald-light)' }}>Vynta Vision</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
            AI Engine is active. Performance optimized.
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.8rem', 
          padding: '0.5rem',
          borderTop: '1px solid var(--card-border)',
          paddingTop: '1.5rem'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: 'black'
          }}>{user ? getInitials(user.name) : '??'}</div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Vynta User'}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{user?.role || 'Access Restricted'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
