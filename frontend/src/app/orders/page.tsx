"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [orderId, setOrderId] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '100px 0 120px', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        
        {/* Tracking Icon */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--primary)',
          margin: '0 auto 28px',
          boxShadow: '0 10px 24px rgba(37,99,235,0.06)',
          border: '1.5px solid #bfdbfe'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Track Your Order
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.5 }}>
          Enter your unique Order ID to track the real-time status and delivery details of your premium subscription account.
        </p>
        
        <div className="glass-card" style={{ 
          padding: '40px 32px', 
          background: 'white',
          borderRadius: '24px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 24px rgba(0,0,0,0.03)'
        }}>
          <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/orders/${orderId.trim()}` }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                Order Identification Number
              </label>
              <input 
                type="text" 
                placeholder="e.g. ORD-123456" 
                value={orderId} 
                onChange={e => setOrderId(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '1.5px solid #cbd5e1', 
                  outline: 'none', 
                  background: 'white', 
                  fontSize: '1.2rem', 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#0f172a',
                  transition: 'border-color 0.2s',
                  letterSpacing: '1px'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                padding: '16px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 8px 20px rgba(37,99,235,0.15)'
              }}
            >
              Track Status →
            </button>
          </form>
        </div>

        <div style={{ marginTop: '32px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Having issues with tracking? </span>
          <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
