"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentMethodPage() {
  const router = useRouter();
  const [appName, setAppName] = useState('');
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      const app = localStorage.getItem('checkout_app') || '';
      const plan = localStorage.getItem('checkout_plan') || '';
      const pr = localStorage.getItem('checkout_price') || '';
      const dur = localStorage.getItem('checkout_duration') || '';

      if (!token) {
        if (app && plan) {
          router.push('/login?redirect=/checkout/payment');
        } else {
          router.push('/store');
        }
        return;
      }

      setAppName(app);
      setPlanName(plan);
      setPrice(pr);
      setDuration(dur);
    }
  }, [router]);
  
  const methods = [
    { id: 'bkash', name: 'bKash', color: '#E2136E', desc: 'Secure payment via bKash Send Money', logo: '/bkash_logo.png' },
    { id: 'nagad', name: 'Nagad', color: '#F05A28', desc: 'Fast payment via Nagad Send Money', logo: '/nagad_logo.png' },
    { id: 'rocket', name: 'Rocket', color: '#8B2FC9', desc: 'Easy payment via Rocket Send Money', logo: '/rocket_logo.png' },
    { id: 'upay', name: 'Upay', color: '#00A651', desc: 'Secure payment via Upay Send Money', logo: '/upay_logo.png' },
    { id: 'cellfin', name: 'Cellfin', color: '#005BAA', desc: 'Bank transfer via Cellfin Send Money', logo: '/cellfin_logo.png' },
  ];

  const handleSelectMethod = (methodId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_method', methodId);
    }
    router.push(`/checkout/${methodId}`);
  };

  if (!appName) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>No Active Session</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Please go back to the store and choose a subscription plan first.</p>
        <Link href="/store" className="btn-primary" style={{ padding: '12px 32px' }}>
          Go to Store
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 0 100px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Step Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>✓</span>
          <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>Select Duration</span>
          <span style={{ width: '40px', height: '1.5px', background: 'var(--primary)' }} />
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>2</span>
          <span style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem' }}>Payment Method</span>
          <span style={{ width: '40px', height: '1.5px', background: '#cbd5e1' }} />
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>3</span>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Payment details</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Select Payment Method</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Choose how you want to pay <strong>৳{price}</strong> for <strong>{appName} ({duration})</strong>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {methods.map(m => (
            <div 
              key={m.id} 
              className="glass-card" 
              style={{ 
                padding: '36px 28px', 
                textAlign: 'center',
                background: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              onClick={() => handleSelectMethod(m.id)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px ${m.color}15`;
                (e.currentTarget as HTMLElement).style.borderColor = `${m.color}30`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9';
              }}
            >
              {/* Colored Brand Icon Container */}
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '20px', 
                background: 'white', 
                border: '1.5px solid #f1f5f9',
                margin: '0 auto 20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                padding: '10px',
                transition: 'border-color 0.2s, transform 0.2s',
              }}>
                <img 
                  src={m.logo} 
                  alt={m.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                  }} 
                />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{m.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5, flex: 1 }}>{m.desc}</p>
              
              <button 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  background: m.color,
                  borderColor: m.color,
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: `0 4px 12px ${m.color}25`,
                  color: 'white'
                }}
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
