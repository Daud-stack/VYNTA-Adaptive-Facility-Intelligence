import React from 'react';

const TrendChart = ({ data, color = '#10b981' }: { data: number[], color?: string }) => {
  const max = Math.max(...data);
  const height = 100;
  const width = 300;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d / max) * height}`).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div style={{ width: '100%', height: '120px', position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area */}
        <polygon points={areaPoints} fill="url(#chartGradient)" />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 5px ${color}50)` }}
        />
      </svg>
      
      {/* Grid Lines mockup */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.02)', height: '0' }}></div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.02)', height: '0' }}></div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.02)', height: '0' }}></div>
      </div>
    </div>
  );
};

export default TrendChart;
