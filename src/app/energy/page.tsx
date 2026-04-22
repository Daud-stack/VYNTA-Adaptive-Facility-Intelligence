'use client';

import React, { useState, useEffect } from 'react';
import { useVynta } from '@/lib/store';
import { readJsonResponse } from '@/lib/http';
import type { EnergyPoint } from '@/lib/types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import GlowGauge from '@/components/GlowGauge';

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass" style={{ padding: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>{label}</p>
        <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#10b981' }}>{payload[0].value} kWh</p>
      </div>
    );
  }
  return null;
};

export default function EnergyHub() {
  const { sensors } = useVynta();
  const [chartData, setChartData] = useState<EnergyPoint[]>([]);

  useEffect(() => {
    fetch('/api/energy')
      .then(res => readJsonResponse<EnergyPoint[]>(res))
      .then(data => {
        setChartData(data.reverse()); // Show chronological order
      });
  }, []);

  const forecastData = [
    { name: '12:00', value: 120, type: 'actual' },
    { name: '13:00', value: 125, type: 'actual' },
    { name: '14:00', value: 180, type: 'forecast' },
    { name: '15:00', value: 210, type: 'forecast' },
    { name: '16:00', value: 195, type: 'forecast' },
  ];

  return (
    <div style={{ width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Energy <span className="text-gradient">Intelligence</span></h2>
        <p style={{ color: 'var(--text-dim)' }}>AI-optimized power distribution and PUE efficiency tracking.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Efficiency Gauge */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--text-dim)' }}>LIVE PUE RATIO</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowGauge value={sensors.pue} min={1.0} max={2.0} label="SYSTEM PUE" />
          </div>
          <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.05)' }}>
            <p style={{ fontSize: '0.8rem', color: '#10b981' }}>✨ OPTIMAL PERFORMANCE</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>Power Usage Effectiveness is within target range.</p>
          </div>
        </div>

        {/* Energy Consumption Trend */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Consumption Trend (kWh)</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>REAL-TIME FEED ACTIVE</span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            </div>
          </div>
          
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="usage" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* AI Forecasting */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Predictive Load Forecasting</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {forecastData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'forecast' ? '#34d39960' : '#10b981'} stroke={entry.type === 'forecast' ? '#34d399' : 'none'} strokeDasharray={entry.type === 'forecast' ? '4 2' : '0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
             <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>⚠️ AI ADVISORY:</span> Anticipated load spike at 14:00 due to external ambient temperature increase. Recommending pre-cooling cycle for Server Room B.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #10b981' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Carbon Offset</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>14.2 <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>tons</span></div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>Optimized reduction vs. baseline.</p>
          </div>
          <button className="glass-hover" style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--primary-gradient)',
            border: 'none',
            color: 'black',
            fontWeight: '900',
            cursor: 'pointer',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '1.1rem' }}>DEPLOY ECO-MODE</div>
            <p style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.2rem' }}>Adjust setpoints for 12% savings.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
