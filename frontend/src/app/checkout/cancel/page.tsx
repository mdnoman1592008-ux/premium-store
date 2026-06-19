"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const pinkContainer = (
    <div style={{
      border: '1px solid #fecaca',
      background: '#fef2f2',
      borderRadius: '8px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%'
    }}>
      {/* Red Alert Banner */}
      <div style={{
        background: '#bd2c2d',
        color: 'white',
        width: '100%',
        padding: '12px 18px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: 700,
        fontSize: '1rem',
        boxShadow: '0 2px 4px rgba(189,44,45,0.05)'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ background: 'white', color: '#bd2c2d', borderRadius: '50%', padding: '2px', flexShrink: 0 }}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span>পেমেন্ট বাতিল!</span>
      </div>

      {/* Subtext */}
      <div style={{
        color: '#475569',
        fontSize: '0.95rem',
        fontWeight: 500,
        textAlign: 'center'
      }}>
        আপনি পেমেন্ট বাতিল করেছেন।
      </div>
    </div>
  );

  const backButton = (
    <button
      onClick={() => router.push('/store')}
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        color: '#64748b',
        fontSize: '0.95rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#f8fafc';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'white';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span>ওয়েবসাইটে ফিরে যান!</span>
    </button>
  );

  if (isMobile) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8fafc', 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z\' fill=\'%23e2e8f0\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}>
        {/* Top pink alert */}
        <div style={{ width: '100%', maxWidth: '450px', marginTop: '8px' }}>
          {pinkContainer}
        </div>

        {/* Center illustration */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flex: 1,
          margin: '24px 0',
          width: '100%',
          maxWidth: '320px'
        }}>
          <img 
            src="/oops_cancel_illustration.png" 
            alt="Cancellation Illustration" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '260px',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Bottom button */}
        <div style={{ width: '100%', maxWidth: '450px', marginBottom: '8px' }}>
          {backButton}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z\' fill=\'%23e2e8f0\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        background: 'white', 
        width: '100%', 
        maxWidth: '680px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {pinkContainer}
        {backButton}
      </div>
    </div>
  );
}
