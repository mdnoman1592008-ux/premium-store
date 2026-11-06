"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('oobCode')) {
        router.replace(`/reset-password${window.location.search}`);
      }
    }
  }, [router]);

  const getFirebaseErrorMessage = (code?: string, fallback?: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please wait a few minutes and try again.';
      default:
        return fallback || 'Failed to send password reset email. Please try again.';
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const actionCodeSettings = typeof window !== 'undefined'
        ? { url: `${window.location.origin}/login`, handleCodeInApp: false }
        : undefined;
      try {
        await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
      } catch {
        await sendPasswordResetEmail(auth, email.trim());
      }
      setSuccess(true);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err?.code, err?.message));
    } finally {
      setLoading(false);
    }
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
          boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
          textAlign: 'center'
        }}>
          {/* Lock Icon */}
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: '#eff6ff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--primary)', 
            fontWeight: 'bold', 
            fontSize: '1.8rem',
            margin: '0 auto 24px',
            boxShadow: '0 10px 20px rgba(37,99,235,0.1)',
            border: '1.5px solid #bfdbfe'
          }}>
            🔒
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>Reset Password</h1>
          <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Enter your account email address below and we&apos;ll send you a password reset link via Firebase.
          </p>

          {error && (
            <div style={{ 
              color: '#b91c1c', 
              marginBottom: '20px', 
              textAlign: 'center', 
              background: '#fef2f2', 
              border: '1px solid #fca5a5',
              padding: '12px 14px', 
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{
              background: '#ecfdf5',
              border: '1.5px solid #6ee7b7',
              borderRadius: '14px',
              padding: '20px 18px',
              marginBottom: '28px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📩</div>
              <h3 style={{ color: '#065f46', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>
                Reset Link Sent!
              </h3>
              <p style={{ color: '#047857', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam/junk folder, click the link to set your new password, and then log in.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                }}
                style={{
                  background: 'white',
                  color: '#059669',
                  border: '1px solid #34d399',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Send Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                    background: 'white',
                    fontSize: '1rem',
                    color: '#0f172a',
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
                  width: '100%',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(37,99,235,0.15)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
              </button>
            </form>
          )}

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
              ← Return to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
