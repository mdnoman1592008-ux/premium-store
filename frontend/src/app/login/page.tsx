"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLoginPage() {
  const [identifier, setIdentifier] = useState(''); // can be email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: identifier, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userPhone', data.phone);
          // Dispatch storage event to notify Navbar of state changes
          window.dispatchEvent(new Event('storage'));
        }
        
        // Handle post-login redirection
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
      } else {
        setError(data.message || 'Invalid email/phone or password');
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
            borderRadius: '50%', 
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
            👤
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center', color: '#0f172a' }}>Sign In</h1>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '36px', fontSize: '0.95rem' }}>Access your premium subscriptions and orders</p>
          
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>Email or Phone Number</label>
              <input 
                type="text" 
                placeholder="Enter email or phone number" 
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)} 
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>Password</label>
                <Link href="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600 }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    paddingRight: '48px',
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
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
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link href={`/signup${typeof window !== 'undefined' ? window.location.search : ''}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
