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

  const [selectedMethod, setSelectedMethod] = useState('');

  const handleProceed = () => {
    if (!selectedMethod) {
      alert('Please select a payment method first.');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_method', selectedMethod);
    }
    router.push(`/checkout/${selectedMethod}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ 
        background: 'white', 
        width: '100%', 
        maxWidth: '500px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Browser-like Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '12px 16px', 
          borderBottom: '1px solid #f1f5f9' 
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          <div style={{ display: 'flex', gap: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" /></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Store Info Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              width: '60px', height: '60px', 
              background: '#000', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '1.2rem',
              overflow: 'hidden'
            }}>
              <span style={{ color: '#ef4444' }}>U</span>
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', margin: '0 0 8px 0' }}>UIDTOPUP.COM</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> সাপোর্ট
                </button>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> তথ্যাদি
                </button>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> বিস্তারিত
                </button>
              </div>
            </div>
          </div>

          {/* Title Bar */}
          <div style={{ background: '#0e55b7', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.95rem', marginBottom: '24px' }}>
            মোবাইল ব্যাংকিং
          </div>

          {/* Payment Methods Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {methods.map(m => (
              <div 
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                style={{
                  border: `2px solid ${selectedMethod === m.id ? '#0e55b7' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: selectedMethod === m.id ? '#f8fafc' : 'white',
                  transition: 'all 0.2s ease',
                  height: '70px'
                }}
              >
                <img src={m.logo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>

          {/* Pay Button */}
          <button 
            onClick={handleProceed}
            style={{ 
              width: '100%', 
              background: '#dce8fd', 
              color: '#0e55b7', 
              border: 'none', 
              padding: '16px', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#c2d6fc'}
            onMouseLeave={e => e.currentTarget.style.background = '#dce8fd'}
          >
            Pay {price} BDT
          </button>
        </div>
      </div>
    </div>
  );
}
