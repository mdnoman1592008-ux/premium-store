"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  
  const router = useRouter();

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

    try {
      // Note: Backend currently only uses phone and password for auth/register.
      // We pass phone as identifier.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }) 
      });
      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userPhone', data.phone);
          window.dispatchEvent(new Event('storage'));
        }
        
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please ensure backend is running.');
    }
    setLoading(false);
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
        <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '32px', lineHeight: '1.5' }}>
          Welcome! Please enter your details to create an account.
        </p>
        
        {error && (
          <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '0.9rem', padding: '10px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

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
              <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Terms & Conditions</a> and our{' '}
              <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</a>
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
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '16px',
              background: '#0066ff',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '12px',
              transition: 'background 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
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
