"use client";
import React from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
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
            background: '#fff7ed', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#ea580c', 
            fontWeight: 'bold', 
            fontSize: '1.8rem',
            margin: '0 auto 24px',
            boxShadow: '0 10px 20px rgba(234,88,12,0.08)',
            border: '1.5px solid #ffedd5'
          }}>
            🔒
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Reset Password</h1>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            For security reasons, automatic password resets are disabled. Please contact our system administrator directly to verify your identity and reset your credentials.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
            
            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/8801700000000" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                background: '#25D366',
                color: 'white',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37,211,102,0.2)'
              }}
            >
              💬 Contact via WhatsApp
            </a>

            {/* Email Link */}
            <a 
              href="mailto:support@premiumstore.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                background: '#eff6ff',
                color: 'var(--primary)',
                border: '1.5px solid #bfdbfe',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none'
              }}
            >
              ✉️ Contact via Email
            </a>

          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>
              ← Return to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
