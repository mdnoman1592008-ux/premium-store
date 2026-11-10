"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

type AuthActionMode = 'verifyEmail' | 'resetPassword' | 'recoverEmail' | 'hub';

export default function UnifiedFirebaseAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthActionMode>('resetPassword');
  const [oobCode, setOobCode] = useState('');
  const [continueUrl, setContinueUrl] = useState('/login');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [invalidCodeError, setInvalidCodeError] = useState('');

  // Password reset state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const rawMode = params.get('mode') || '';
    const code = params.get('oobCode') || '';
    const rawContinue = params.get('continueUrl') || '';

    setOobCode(code);

    if (rawContinue) {
      try {
        const parsed = new URL(rawContinue);
        setContinueUrl(parsed.pathname + parsed.search || '/login');
      } catch {
        setContinueUrl('/login');
      }
    }

    // If no oobCode is present, show the clean Auth Portal Hub
    if (!code) {
      setMode('hub');
      setVerifying(false);
      return;
    }

    // Determine mode (default to resetPassword if not specified)
    const detectedMode: AuthActionMode =
      rawMode === 'verifyEmail'
        ? 'verifyEmail'
        : rawMode === 'recoverEmail'
        ? 'recoverEmail'
        : 'resetPassword';

    setMode(detectedMode);

    if (detectedMode === 'verifyEmail') {
      // 1. Check action code to retrieve email, then apply email verification
      checkActionCode(auth, code)
        .then(async (info) => {
          if (info?.data?.email) {
            setVerifiedEmail(info.data.email);
          }
          await applyActionCode(auth, code);
          setSuccess(true);
          setVerifying(false);
        })
        .catch(async (err) => {
          console.error('verifyEmail error:', err);
          // Fallback: try applyActionCode directly in case checkActionCode failed
          try {
            await applyActionCode(auth, code);
            setSuccess(true);
            setVerifying(false);
          } catch {
            setInvalidCodeError(
              'This email verification link has expired or has already been used. If you already clicked it, your email is verified and you can sign in now!'
            );
            setVerifying(false);
          }
        });
    } else if (detectedMode === 'recoverEmail') {
      let recoveredEmail = '';
      checkActionCode(auth, code)
        .then((info) => {
          recoveredEmail = info?.data?.email || '';
          setVerifiedEmail(recoveredEmail);
          return applyActionCode(auth, code);
        })
        .then(() => {
          setSuccess(true);
          setVerifying(false);
          if (recoveredEmail) {
            sendPasswordResetEmail(auth, recoveredEmail).catch(() => {});
          }
        })
        .catch(() => {
          setInvalidCodeError('This email recovery link has expired or has already been used.');
          setVerifying(false);
        });
    } else {
      // resetPassword mode
      verifyPasswordResetCode(auth, code)
        .then((email) => {
          setVerifiedEmail(email);
          setVerifying(false);
        })
        .catch((err) => {
          console.error('resetPassword verify error:', err);
          setInvalidCodeError(
            'This password reset link has expired or has already been used. Please request a new reset link below.'
          );
          setVerifying(false);
        });
    }
  }, []);

  // Auto-redirect countdown when verification or password reset succeeds
  useEffect(() => {
    if (!success) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(continueUrl || '/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [success, continueUrl, router]);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const strengthScore = [hasMinLength, hasNumber, hasLetter, hasSpecial].filter(Boolean).length;
  const strengthLabels = ['Too Short', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#cbd5e1', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
      await confirmPasswordReset(auth, oobCode, password);

      if (verifiedEmail) {
        await fetch(`${apiUrl}/api/auth/reset-password-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: verifiedEmail, newPassword: password }),
        }).catch(() => {});
      }

      setCountdown(4);
      setSuccess(true);
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
      background: 'radial-gradient(circle at top right, #dbeafe 0%, #f8fafc 45%, #ede9fe 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '50px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Ambient Decorative Blobs */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '-120px',
        width: '340px',
        height: '340px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        right: '-120px',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          padding: '44px 38px',
          width: '100%',
          maxWidth: '485px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderRadius: '28px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 25px 65px rgba(15, 23, 42, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'authCardFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Top Accent Gradient Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #10b981 100%)'
          }} />

          {/* Official Brand Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#475569',
              letterSpacing: '0.3px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }} />
              PREMIUMACCOUNTSBD.STORE • OFFICIAL AUTH
            </div>
          </div>

          {/* Dynamic Icon Based on Mode */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '22px',
            background:
              mode === 'verifyEmail'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 20px',
            boxShadow:
              mode === 'verifyEmail'
                ? '0 14px 30px rgba(16, 185, 129, 0.28)'
                : '0 14px 30px rgba(37, 99, 235, 0.26)'
          }}>
            {mode === 'verifyEmail' ? (
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                <path d="m16 19 2 2 4-4" />
              </svg>
            ) : (
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            )}
          </div>

          {/* Dynamic Heading */}
          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            marginBottom: '8px',
            textAlign: 'center',
            color: '#0f172a',
            letterSpacing: '-0.4px'
          }}>
            {mode === 'verifyEmail'
              ? 'Email Verification'
              : mode === 'recoverEmail'
              ? 'Account Email Recovery'
              : mode === 'hub'
              ? 'Security & Auth Center'
              : 'Set New Password'}
          </h1>

          {/* 1. LOADING / VERIFYING STATE */}
          {verifying ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{
                width: '44px',
                height: '44px',
                border: '3.5px solid #e2e8f0',
                borderTopColor: mode === 'verifyEmail' ? '#10b981' : '#2563eb',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 0.8s linear infinite'
              }} />
              <p style={{ color: '#475569', fontSize: '0.96rem', fontWeight: 600, margin: 0 }}>
                {mode === 'verifyEmail'
                  ? 'Verifying your email address with Firebase...'
                  : 'Verifying your security token...'}
              </p>
            </div>
          ) : mode === 'hub' ? (
            /* 2. DIRECT VISIT HUB (When visited without ?oobCode=...) */
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '26px' }}>
                Welcome to the official authentication portal of <strong>Premium Account Store</strong>. Choose an action below to continue:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                <Link
                  href="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 18px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.96rem',
                    boxShadow: '0 10px 24px rgba(37, 99, 235, 0.22)'
                  }}
                >
                  <span>🔐 Sign In to Your Account</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/signup"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 18px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                >
                  <span>✨ Create a New Account</span>
                  <span style={{ color: '#2563eb' }}>→</span>
                </Link>

                <Link
                  href="/forgot-password"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 18px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                >
                  <span>🔑 Reset Forgotten Password</span>
                  <span style={{ color: '#2563eb' }}>→</span>
                </Link>
              </div>
            </div>
          ) : invalidCodeError ? (
            /* 3. EXPIRED OR INVALID LINK STATE */
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '20px' }}>
                {mode === 'verifyEmail' ? 'Verification Link Notice' : 'Security Link Expired'}
              </p>
              <div style={{
                background: mode === 'verifyEmail' ? '#fffbeb' : '#fef2f2',
                border: `1.5px solid ${mode === 'verifyEmail' ? '#fde68a' : '#fecaca'}`,
                borderRadius: '16px',
                padding: '20px',
                color: mode === 'verifyEmail' ? '#92400e' : '#b91c1c',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                fontWeight: 500,
                marginBottom: '24px'
              }}>
                {mode === 'verifyEmail' ? 'ℹ️ ' : '⚠️ '}
                {invalidCodeError}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mode === 'resetPassword' ? (
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
                ) : (
                  <Link
                    href="/login"
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
                    Continue to Sign In →
                  </Link>
                )}
              </div>
            </div>
          ) : success ? (
            /* 4. SUCCESS STATE (Email Verified OR Password Reset Complete OR Email Recovered) */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1.5px solid #6ee7b7',
                borderRadius: '20px',
                padding: '28px 22px',
                marginTop: '14px',
                marginBottom: '26px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  margin: '0 auto 14px',
                  boxShadow: '0 10px 24px rgba(16, 185, 129, 0.3)'
                }}>
                  ✓
                </div>

                <h3 style={{ color: '#065f46', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px 0' }}>
                  {mode === 'verifyEmail'
                    ? 'Email Verified Successfully!'
                    : mode === 'recoverEmail'
                    ? 'Email Address Restored!'
                    : 'Password Reset Complete!'}
                </h3>

                {verifiedEmail && (
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.85)',
                    border: '1px solid #a7f3d0',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#047857',
                    marginBottom: '10px'
                  }}>
                    {verifiedEmail}
                  </div>
                )}

                <p style={{ color: '#047857', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                  {mode === 'verifyEmail'
                    ? `Your account email is now officially verified on Premium Account Store. Redirecting in ${countdown}s...`
                    : mode === 'recoverEmail'
                    ? `Your email address has been restored. Redirecting in ${countdown}s...`
                    : `Your new password has been saved and synced. Redirecting to Sign In in ${countdown}s...`}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href={continueUrl || '/login'}
                  className="btn-primary"
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    padding: '15px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 10px 24px rgba(37,99,235,0.2)'
                  }}
                >
                  Continue to Account →
                </Link>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#475569',
                    textDecoration: 'none',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  Browse Store Catalog
                </Link>
              </div>
            </div>
          ) : (
            /* 5. SET NEW PASSWORD FORM (mode === 'resetPassword') */
            <>
              <p style={{ color: '#64748b', textAlign: 'center', fontSize: '0.92rem', marginBottom: '14px' }}>
                Create a strong new password for your account
              </p>

              {/* Verified Account Pill */}
              {verifiedEmail && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
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
              )}

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

              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px', marginTop: '24px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
              ← Back to Login
            </Link>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
              🔒 Secured by Firebase
            </span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes authCardFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      ` }} />
    </div>
  );
}
