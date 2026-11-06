"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [oobCode, setOobCode] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [invalidCodeError, setInvalidCodeError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('oobCode') || '';
      setOobCode(code);

      if (!code) {
        setInvalidCodeError('Invalid or missing password reset token. Please request a new password reset link.');
        setVerifying(false);
        return;
      }

      verifyPasswordResetCode(auth, code)
        .then((email) => {
          setVerifiedEmail(email);
          setVerifying(false);
        })
        .catch((err) => {
          console.error(err);
          setInvalidCodeError('This password reset link has expired or has already been used. Please request a new one.');
          setVerifying(false);
        });
    }
  }, []);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const strengthScore = [hasMinLength, hasNumber, hasLetter, hasSpecial].filter(Boolean).length;
  const strengthLabels = ['Too Short', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#cbd5e1', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hasMinLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Confirm password reset in Firebase Auth
      await confirmPasswordReset(auth, oobCode, password);

      // 2. Sync new password with Backend MongoDB
      if (verifiedEmail) {
        await fetch(`${apiUrl}/api/auth/reset-password-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: verifiedEmail, newPassword: password }),
        }).catch(() => {});
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3500);
    } catch (err: any) {
      if (err?.code === 'auth/expired-action-code' || err?.code === 'auth/invalid-action-code') {
        setError('This reset link has expired or already been used. Please request a new link.');
      } else if (err?.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError(err?.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f1f5f9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card" style={{
          padding: '48px 40px',
          width: '100%',
          maxWidth: '470px',
          background: 'white',
          borderRadius: '28px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top Accent Gradient Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #3b82f6 100%)'
          }} />

          {/* Glowing Shield / Key Icon */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 22px',
            boxShadow: '0 12px 28px rgba(37, 99, 235, 0.25)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center', color: '#0f172a', letterSpacing: '-0.4px' }}>
            Set New Password
          </h1>

          {verifying ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3.5px solid #e2e8f0',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 0.8s linear infinite'
              }} />
              <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
                Verifying your security link...
              </p>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
            </div>
          ) : invalidCodeError ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
                Security token verification failed
              </p>
              <div style={{
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: '16px',
                padding: '20px',
                color: '#b91c1c',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                fontWeight: 500,
                marginBottom: '28px'
              }}>
                ⚠️ {invalidCodeError}
              </div>
              <Link
                href="/forgot-password"
                className="btn-primary"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.18)'
                }}
              >
                Request New Reset Link →
              </Link>
            </div>
          ) : success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1.5px solid #6ee7b7',
                borderRadius: '18px',
                padding: '28px 20px',
                marginTop: '16px',
                marginBottom: '28px'
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  margin: '0 auto 14px',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)'
                }}>
                  ✓
                </div>
                <h3 style={{ color: '#065f46', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0' }}>
                  Password Reset Complete!
                </h3>
                <p style={{ color: '#047857', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                  Your password for <strong>{verifiedEmail}</strong> has been updated. Redirecting you to Sign In...
                </p>
              </div>

              <Link
                href="/login"
                className="btn-primary"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.18)'
                }}
              >
                Continue to Sign In →
              </Link>
            </div>
          ) : (
            <>
              {/* Verified Account Pill */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  color: '#1e40af',
                  fontWeight: 600
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                  {verifiedEmail}
                </div>
              </div>

              {error && (
                <div style={{
                  color: '#b91c1c',
                  marginBottom: '20px',
                  textAlign: 'center',
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* New Password Input */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '13px 46px 13px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        outline: 'none',
                        background: '#f8fafc',
                        fontSize: '0.98rem',
                        color: '#0f172a',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        display: 'flex',
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

                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            style={{
                              flex: 1,
                              height: '5px',
                              borderRadius: '999px',
                              background: strengthScore >= level ? strengthColors[strengthScore] : '#e2e8f0',
                              transition: 'background 0.25s'
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600 }}>
                        <span style={{ color: '#64748b' }}>Password strength</span>
                        <span style={{ color: strengthColors[strengthScore] }}>{strengthLabels[strengthScore]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '13px 46px 13px 16px',
                        borderRadius: '12px',
                        border: `1.5px solid ${confirmPassword.length > 0 ? (passwordsMatch ? '#10b981' : '#ef4444') : '#cbd5e1'}`,
                        outline: 'none',
                        background: '#f8fafc',
                        fontSize: '0.98rem',
                        color: '#0f172a',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.background = 'white'; }}
                      onBlur={(e) => { e.target.style.background = '#f8fafc'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        display: 'flex',
                        padding: 0
                      }}
                    >
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: hasMinLength ? '#059669' : '#64748b', fontWeight: 600 }}>
                    <span>{hasMinLength ? '✓' : '○'}</span> At least 8 characters
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: (hasLetter && hasNumber) ? '#059669' : '#64748b', fontWeight: 600 }}>
                    <span>{(hasLetter && hasNumber) ? '✓' : '○'}</span> Letters & numbers included
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: passwordsMatch ? '#059669' : '#64748b', fontWeight: 600 }}>
                    <span>{passwordsMatch ? '✓' : '○'}</span> Both passwords match
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    padding: '15px',
                    width: '100%',
                    borderRadius: '12px',
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    boxShadow: '0 10px 24px rgba(37, 99, 235, 0.2)',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    marginTop: '4px'
                  }}
                >
                  {submitting ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            </>
          )}

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '26px', textAlign: 'center' }}>
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
              ← Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
