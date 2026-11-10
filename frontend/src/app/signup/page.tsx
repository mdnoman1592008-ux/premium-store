"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';

export default function UserSignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const getFirebaseErrorMessage = (code?: string, fallback?: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before completing.';
      default:
        return fallback || 'Registration failed. Please try again.';
    }
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must have at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    if (!recaptchaChecked) {
      setError('Please verify that you are not a robot');
      return;
    }

    setLoading(true);
    const fullName = `${firstName} ${lastName}`.trim();

    try {
      // 1. Create live account in Firebase Auth with Email & Password
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // Send official verification email via Firebase (from support@premiumaccountsbd.store)
      sendEmailVerification(firebaseUser, {
        url: 'https://premiumaccountsbd.store/login',
        handleCodeInApp: false
      }).catch(() => {});

      // 2. Sync user account with Backend MongoDB & receive backend JWT
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: email.trim(),
          phone: phone.trim(),
          password,
          firebaseUid: firebaseUser.uid
        })
      });
      const data = await res.json();

      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userPhone', data.phone || email.trim());
          window.dispatchEvent(new Event('storage'));
        }
        
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err?.code, err?.message));
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
      setError(getFirebaseErrorMessage(err?.code, err?.message));
    }
    setGoogleLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px 14px 44px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    background: '#f8fafc',
    fontSize: '0.95rem',
    color: '#334155',
    transition: 'border-color 0.2s, background 0.2s'
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          Sign Up to your Account
        </h1>
        <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '24px', lineHeight: '1.5' }}>
          Welcome! Please enter your details to create an account.
        </p>
        
        {error && (
          <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '0.9rem', padding: '12px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca', fontWeight: 500 }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>or sign up with email</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Row 1: First Name & Last Name */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <svg style={iconStyle} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <input 
                type="text" 
                placeholder="First Name" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
                required
              />
            </div>
            <div style={{ position: 'relative', flex: 1 }}>
              <svg style={iconStyle} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <input 
                type="text" 
                placeholder="Last Name" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
                required
              />
            </div>
          </div>

          {/* Row 2: Email */}
          <div style={{ position: 'relative' }}>
            <svg style={iconStyle} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
              required
            />
          </div>

          {/* Row 3: Mobile Number */}
          <div style={{ position: 'relative' }}>
            <svg style={iconStyle} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <input 
              type="tel" 
              placeholder="Mobile Number" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
              required
            />
          </div>

          {/* Row 4: Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <svg style={iconStyle} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '44px' }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: 0,
                  display: 'flex'
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', marginLeft: '4px' }}>
              Your password must have at least 8 characters
            </div>
          </div>

          {/* Row 5: Confirm Password */}
          <div style={{ position: 'relative' }}>
            <svg style={iconStyle} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
              required
            />
          </div>

          {/* Terms Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              style={{ marginTop: '4px', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
              By creating an account means you agree to the{' '}
              <Link href="/terms" style={{ color: '#2563eb', textDecoration: 'none' }}>Terms & Conditions</Link> and our{' '}
              <Link href="/privacy-policy" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</Link>
            </label>
          </div>

          {/* reCAPTCHA Mockup */}
          <div 
            onClick={() => setRecaptchaChecked(!recaptchaChecked)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: '#f9f9f9', 
              border: '1px solid #d3d3d3', 
              borderRadius: '3px', 
              padding: '10px 14px',
              cursor: 'pointer',
              marginTop: '4px',
              maxWidth: '300px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '28px', 
                height: '28px', 
                background: 'white', 
                border: recaptchaChecked ? 'none' : '2px solid #c1c1c1', 
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {recaptchaChecked && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009e55" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                )}
              </div>
              <span style={{ fontSize: '0.9rem', color: '#333' }}>I'm not a robot</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              <span style={{ fontSize: '0.5rem', color: '#555', marginTop: '2px' }}>reCAPTCHA</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || googleLoading}
            style={{ 
              width: '100%',
              padding: '16px',
              background: '#0066ff',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: 600,
              cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer',
              marginTop: '12px',
              transition: 'background 0.2s',
              opacity: (loading || googleLoading) ? 0.7 : 1
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link href={`/login${typeof window !== 'undefined' ? window.location.search : ''}`} style={{ color: '#0066ff', fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
