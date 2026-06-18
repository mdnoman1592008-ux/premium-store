"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminToken', data.token);
        }
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Connection error. Please ensure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card" style={{ 
          padding: '50px 40px', 
          width: '100%', 
          maxWidth: '450px',
          background: 'white',
          borderRadius: '28px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }}>
          {/* Logo/Icon */}
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '18px', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '1.8rem',
            margin: '0 auto 24px',
            boxShadow: '0 10px 20px rgba(37,99,235,0.2)'
          }}>
            A
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center', color: '#0f172a' }}>Admin Portal</h1>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '36px', fontSize: '0.95rem' }}>Sign in to manage transactions and accounts</p>
          
          {error && (
            <div style={{ 
              color: '#b91c1c', 
              marginBottom: '24px', 
              textAlign: 'center', 
              background: '#fef2f2', 
              border: '1px solid #fca5a5',
              padding: '12px', 
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>Username</label>
              <input 
                type="text" 
                placeholder="Enter admin username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '10px', 
                  border: '1.5px solid #cbd5e1', 
                  outline: 'none', 
                  background: 'white', 
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }} 
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>Password</label>
              <input 
                type="password" 
                placeholder="Enter account password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '10px', 
                  border: '1.5px solid #cbd5e1', 
                  outline: 'none', 
                  background: 'white', 
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }} 
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ 
                padding: '14px', 
                marginTop: '10px', 
                width: '100%',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 8px 20px rgba(37,99,235,0.15)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
