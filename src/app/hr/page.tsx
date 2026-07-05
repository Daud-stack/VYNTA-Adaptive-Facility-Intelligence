'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function HRDashboard() {
  const { user } = useVynta();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/hr');
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        setErrorMsg(data.error || 'Failed to load employee data');
        setEmployees([]);
      } else {
        setEmployees(data);
      }
    } catch (error) {
      console.error('Failed to fetch HR data', error);
      setErrorMsg('Network error while fetching HR data');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading HR System...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Human Resources</h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage employee profiles and payroll.</p>
        </div>
        <button className="glass glass-hover" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', color: 'var(--blue)', fontWeight: 'bold' }}>
          + Add Employee
        </button>
      </header>

      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '1rem' }}>Employee Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Department</th>
              <th style={{ padding: '1rem' }}>Job Title</th>
              <th style={{ padding: '1rem' }}>Hire Date</th>
            </tr>
          </thead>
          <tbody>
            {errorMsg ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--red)' }}>{errorMsg}</td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No HR profiles found.</td>
              </tr>
            ) : (
              employees.map((e: any) => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{e.user.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{e.user.email}</td>
                  <td style={{ padding: '1rem' }}>{e.department}</td>
                  <td style={{ padding: '1rem' }}>{e.jobTitle}</td>
                  <td style={{ padding: '1rem' }}>{new Date(e.hireDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
