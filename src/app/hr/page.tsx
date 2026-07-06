'use client';

import React, { useEffect, useState } from 'react';
import { useVynta } from '@/lib/store';

export default function HRDashboard() {
  const { user } = useVynta();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    jobTitle: '',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0]
  });

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

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewEmployee({
          name: '',
          email: '',
          department: '',
          jobTitle: '',
          salary: '',
          hireDate: new Date().toISOString().split('T')[0]
        });
        await fetchEmployees();
      } else {
        const errorData = await res.json();
        console.error('Failed to add employee', errorData);
      }
    } catch (error) {
      console.error('Network error during employee creation', error);
    } finally {
      setIsSubmitting(false);
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
        <button 
          className="glass glass-hover" 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', color: 'var(--blue)', fontWeight: 'bold' }}>
          + Add Employee
        </button>
      </header>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass" style={{
            padding: '2rem', borderRadius: 'var(--radius-lg)', width: '400px',
            border: '1px solid var(--card-border)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--blue)' }}>Register New Employee</h3>
            <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                placeholder="Full Name (e.g. Jane Doe)" 
                required 
                value={newEmployee.name}
                onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              />
              <input 
                type="email"
                placeholder="Corporate Email" 
                required 
                value={newEmployee.email}
                onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              />
              <input 
                placeholder="Department (e.g. Engineering)" 
                required 
                value={newEmployee.department}
                onChange={e => setNewEmployee({...newEmployee, department: e.target.value})}
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              />
              <input 
                placeholder="Job Title" 
                required 
                value={newEmployee.jobTitle}
                onChange={e => setNewEmployee({...newEmployee, jobTitle: e.target.value})}
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              />
              <input 
                type="number"
                placeholder="Annual Salary (e.g. 85000)" 
                required 
                value={newEmployee.salary}
                onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})}
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              />
              <input 
                type="date"
                required 
                value={newEmployee.hireDate}
                onChange={e => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px' }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '0.8rem', background: 'var(--primary-gradient)', border: 'none', color: 'black', fontWeight: 'bold', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Saving...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

