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
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const t = {
    title: lang === 'bn' ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking',
    support: lang === 'bn' ? 'সাপোর্ট' : 'Support',
    info: lang === 'bn' ? 'তথ্যাদি' : 'Info',
    details: lang === 'bn' ? 'বিস্তারিত' : 'Details',
    pay: lang === 'bn' ? 'পে করুন' : 'Pay',
    noSession: lang === 'bn' ? 'কোনো সেশন নেই' : 'No Active Session',
    noSessionMsg: lang === 'bn' ? 'স্টোরে ফিরে একটি প্ল্যান বেছে নিন।' : 'Please go back to the store and choose a plan.',
    goStore: lang === 'bn' ? 'স্টোরে যান' : 'Go to Store',
    selectFirst: lang === 'bn' ? 'প্রথমে একটি পেমেন্ট মেথড বেছে নিন।' : 'Please select a payment method first.',
  };

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
  ];

  const handleSelectMethod = (methodId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_method', methodId);
    }
    router.push(`/checkout/${methodId}`);
  };

  const [selectedMethod, setSelectedMethod] = useState('');

  if (!appName) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>{t.noSession}</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>{t.noSessionMsg}</p>
        <Link href="/store" className="btn-primary" style={{ padding: '12px 32px' }}>
          {t.goStore}
        </Link>
      </div>
    );
  }

  const handleProceed = () => {
    if (!selectedMethod) {
      alert(t.selectFirst);
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_method', selectedMethod);
    }
    router.push(`/checkout/${selectedMethod}`);
  };

  return (
    <div style={{ 
      height: '100dvh', 
      maxHeight: '100dvh',
      overflow: 'hidden',
      background: '#f8fafc', 
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z\' fill=\'%23e2e8f0\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      display: 'flex', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden'
      }}>
        
        {/* Floating Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          margin: '12px 12px 16px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '10px 14px' 
        }}>
          {/* Home Button */}
          <button
            onClick={() => router.push('/')}
            title="Home"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#64748b' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </button>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
              title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, gap: '2px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" /></svg>
              <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => {
                if (!isMobile) {
                  router.push('/checkout/cancel');
                } else {
                  router.push('/store');
                }
              }}
              title="Cancel"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#64748b' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>

        <div style={{ 
          padding: '0 16px', 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {/* Webkit hide scrollbar */}
          <style dangerouslySetInnerHTML={{__html: `
            div::-webkit-scrollbar {
              display: none;
            }
          `}} />

          {/* Store Info Center */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ 
              background: 'black', 
              borderRadius: '50%', 
              width: '80px', 
              height: '80px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '12px', 
              overflow: 'hidden' 
            }}>
              <svg width="48" height="48" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logo-grad1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6"/>
                    <stop offset="1" stopColor="#8b5cf6"/>
                  </linearGradient>
                  <linearGradient id="logo-grad2" x1="44" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60a5fa"/>
                    <stop offset="1" stopColor="#a855f7"/>
                  </linearGradient>
                </defs>
                <path d="M22 2L40 12.3V31.7L22 42L4 31.7V12.3L22 2Z" fill="url(#logo-grad1)" opacity="0.15"/>
                <path d="M22 7L35 14.5V29.5L22 37L9 29.5V14.5L22 7Z" fill="url(#logo-grad2)"/>
                <path d="M22 7L35 14.5V29.5L22 22V7Z" fill="#2563eb" opacity="0.5"/>
                <path d="M22 22L35 14.5L22 7L9 14.5L22 22Z" fill="#ffffff" opacity="0.25"/>
                <path d="M22 22L9 14.5V29.5L22 37V22Z" fill="#7c3aed" opacity="0.7"/>
                <path d="M22 15L23.8 19.2L28 21L23.8 22.8L22 27L20.2 22.8L16 21L20.2 19.2L22 15Z" fill="#ffffff"/>
              </svg>
            </div>
            
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#334155', margin: '0 0 12px 0', textTransform: 'uppercase' }}>PREMIUMACCOUNTSSTORE.COM</h2>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </button>
              <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </button>
              <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </button>
            </div>
          </div>

          {/* Title Bar */}
          <div style={{ background: '#0e55b7', color: 'white', textAlign: 'center', padding: '8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>
            {t.title}
          </div>

          {/* Payment Methods Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {methods.map(m => (
              <div 
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                style={{
                  border: selectedMethod === m.id ? '2px solid #0e55b7' : '1px solid #e8ecf0',
                  borderRadius: '10px',
                  padding: '6px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: 'white',
                  transition: 'all 0.2s ease',
                  height: '65px',
                  boxShadow: selectedMethod === m.id ? '0 2px 8px rgba(14,85,183,0.15)' : '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <img 
                  src={m.logo} 
                  alt={m.name} 
                  style={{ 
                    maxWidth: '85%', 
                    maxHeight: m.id === 'bkash' || m.id === 'nagad' ? '55px' : '42px', 
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
              </div>
            ))}
          </div>

        </div>

        {/* Fixed Bottom Pay Button */}
        <div style={{ marginTop: 'auto', paddingBottom: '0' }}>
          <button 
            onClick={handleProceed}
            style={{ 
              width: '100%', 
              background: selectedMethod ? '#0957d0' : '#dce8fd', 
              color: selectedMethod ? '#ffffff' : '#0957d0', 
              border: 'none', 
              padding: '20px 16px', 
              borderRadius: '20px 20px 0 0', 
              fontSize: '1.2rem', 
              fontWeight: 700, 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.background = selectedMethod ? '#0848a6' : '#cddbf8'}
            onMouseLeave={e => e.currentTarget.style.background = selectedMethod ? '#0957d0' : '#dce8fd'}
          >
            Pay {Number(price || 0).toFixed(2)} BDT
          </button>
        </div>
      </div>
    </div>
  );
}
