'use client';

import React, { useState, useEffect } from 'react';

interface DigitalTwinProps {
  id: string;
  health: number;
}

const DigitalTwin = ({ id, health }: DigitalTwinProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const healthColor = health > 90 ? '#10b981' : health > 70 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{
      width: '100%',
      height: '350px',
      perspective: '1000px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 80%)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--card-border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 3D Wireframe Scene */}
      <div style={{
        width: '150px',
        height: '150px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateX(-20deg) rotateY(${rotation}deg)`,
        transition: 'none'
      }}>
        {/* Main Cube Body - Representing the Asset */}
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '120px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: `2px solid ${healthColor}`,
          boxShadow: `0 0 20px ${healthColor}40`,
          transform: 'translate3d(25px, 15px, 50px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6rem',
          color: healthColor,
          fontWeight: 'bold'
        }}>
          {id}
        </div>
        
        {/* Outer Wireframe Box */}
        {[0, 90, 180, 270].map(deg => (
          <div key={deg} style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            border: '1px solid rgba(255,255,255,0.1)',
            transform: `rotateY(${deg}deg) translateZ(75px)`
          }} />
        ))}

        {/* Intelligence Pulse */}
        <div style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          background: healthColor,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate3d(-10px, -10px, 60px)',
          boxShadow: `0 0 30px ${healthColor}`,
          animation: 'pulse 2s infinite ease-in-out'
        }} />
      </div>

      {/* Overlay Information */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', textAlign: 'left' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>Digital Twin Stream</p>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: healthColor }}>HEALTH: {health}%</h4>
      </div>

      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', textAlign: 'right' }}>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>SYSTEM ACTIVE: 100%</p>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>COORDINATES: 40.7128° N, 74.0060° W</p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: translate3d(-10px, -10px, 60px) scale(1); opacity: 1; }
          50% { transform: translate3d(-10px, -10px, 60px) scale(1.5); opacity: 0.5; }
          100% { transform: translate3d(-10px, -10px, 60px) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DigitalTwin;
