"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';

export default function UserLoginPage() {
  const [identifier, setIdentifier] = useState(''); // can be email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmedIdentifier = identifier.trim();
    const isEmail = trimmedIdentifier.includes('@');

    try {
      let firebaseUid: string | undefined = undefined;
      let displayName: string | undefined = undefined;

      // If logging in with email, authenticate against Firebase Email/Password first
      if (isEmail) {
        try {
          const userCred = await signInWithEmailAndPassword(auth, trimmedIdentifier, password);
          firebaseUid = userCred.user.uid;
          displayName = userCred.user.displayName || undefined;
        } catch (fbErr: any) {
          // Allow fallback to backend login for legacy accounts created prior to Firebase
          if (fbErr?.code === 'auth/wrong-password' || fbErr?.code === 'auth/invalid-credential') {
            // Will verify against backend below
          }
        }
      }

      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: trimmedIdentifier,
          email: isEmail ? trimmedIdentifier : undefined,
          password,
          firebaseUid,
          name: displayName
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userPhone', data.phone || trimmedIdentifier);
          window.dispatchEvent(new Event('storage'));
        }
        
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

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName || '',
          email: user.email || '',
          photo: user.photoURL || '',
          firebaseUid: user.uid
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userPhone', data.phone || data.email || '');
          window.dispatchEvent(new Event('storage'));
        }
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
      } else {
        setError(data.message || 'Google sign-in failed');
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completing.');
      } else {
        setError(err?.message || 'Google sign-in failed.');
      }
    }
    setGoogleLoading(false);
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
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '28px', fontSize: '0.95rem' }}>Access your premium subscriptions and orders</p>
          
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

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            style={{
              width: '100%',
              padding: '13px 16px',
              background: 'white',
              color: '#1e293b',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              fontSize: '0.98rem',
              fontWeight: 600,
              cursor: (googleLoading || loading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              transition: 'all 0.2s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>or sign in with email / phone</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>
          
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
              disabled={loading || googleLoading}
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
