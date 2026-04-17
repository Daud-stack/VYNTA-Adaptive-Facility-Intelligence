'use client';

import React from 'react';

interface GlowGaugeProps {
  value: number;
  label: string;
  min?: number;
  max?: number;
  size?: number;
}

const GlowGauge: React.FC<GlowGaugeProps> = ({ value, label, min = 0, max = 100, size = 200 }) => {
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--primary-gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))',
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        >
          <linearGradient id="gaugeGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
        </circle>
      </svg>
      
      <div style={{
        position: 'absolute',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      </div>
      
      {/* Pulse Effect */}
      <div style={{
        position: 'absolute',
        width: size - 20,
        height: size - 20,
        borderRadius: '50%',
        border: '2px solid rgba(16, 185, 129, 0.1)',
        animation: 'pulse 2s infinite ease-in-out'
      }} />

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default GlowGauge;
