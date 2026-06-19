"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mockup QR Code SVG Component
const QRCodeSVG = ({ color, letter, size = 200 }: { color: string; letter: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ background: '#fff', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
    {/* QR Corner Markers */}
    <rect x="2" y="2" width="22" height="22" rx="3" fill="#1e293b" />
    <rect x="6" y="6" width="14" height="14" rx="1.5" fill="#fff" />
    <rect x="9" y="9" width="8" height="8" rx="0.5" fill="#1e293b" />

    <rect x="76" y="2" width="22" height="22" rx="3" fill="#1e293b" />
    <rect x="80" y="6" width="14" height="14" rx="1.5" fill="#fff" />
    <rect x="83" y="9" width="8" height="8" rx="0.5" fill="#1e293b" />

    <rect x="2" y="76" width="22" height="22" rx="3" fill="#1e293b" />
    <rect x="6" y="80" width="14" height="14" rx="1.5" fill="#fff" />
    <rect x="9" y="83" width="8" height="8" rx="0.5" fill="#1e293b" />

    {/* QR Random Noise Blocks */}
    <g fill="#1e293b">
      <rect x="30" y="4" width="6" height="10" rx="1" />
      <rect x="42" y="2" width="8" height="6" rx="1" />
      <rect x="56" y="6" width="12" height="6" rx="1" />
      <rect x="30" y="18" width="10" height="6" rx="1" />
      <rect x="46" y="14" width="6" height="12" rx="1" />
      <rect x="58" y="16" width="14" height="6" rx="1" />
      
      <rect x="4" y="30" width="10" height="6" rx="1" />
      <rect x="18" y="32" width="6" height="12" rx="1" />
      <rect x="2" y="44" width="8" height="6" rx="1" />
      
      <rect x="76" y="30" width="6" height="12" rx="1" />
      <rect x="88" y="34" width="8" height="6" rx="1" />
      <rect x="82" y="44" width="14" height="8" rx="1" />

      <rect x="30" y="76" width="6" height="10" rx="1" />
      <rect x="42" y="82" width="12" height="6" rx="1" />
      <rect x="58" y="78" width="6" height="12" rx="1" />
      <rect x="34" y="90" width="18" height="6" rx="1" />
      <rect x="62" y="92" width="8" height="6" rx="1" />

      {/* Other small dots */}
      <rect x="56" y="30" width="6" height="6" rx="1" />
      <rect x="30" y="42" width="6" height="6" rx="1" />
      <rect x="62" y="44" width="6" height="8" rx="1" />
      <rect x="50" y="56" width="8" height="6" rx="1" />
      <rect x="14" y="62" width="10" height="6" rx="1" />
      <rect x="76" y="60" width="12" height="6" rx="1" />
    </g>

    {/* Center Logo Area */}
    <rect x="36" y="36" width="28" height="28" rx="8" fill={color} />
    <text x="50" y="55" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">{letter}</text>
  </svg>
);

export default function PaymentDetailsPage({ params }: { params: { method: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>({});
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const translations = {
    bn: {
      transactionIdLabel: "ট্রানজেকশন আইডি দিন",
      instruction1: (ussd: string, method: string) => `${ussd} ডায়াল করে আপনার ${method} মোবাইল মেনুতে যান অথবা ${method} অ্যাপে যান।`,
      instruction2: '"Send Money" -এ ক্লিক করুন।',
      instruction3: 'প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ',
      instruction4: 'টাকার পরিমাণঃ',
      instruction5: (method: string) => `নিশ্চিত করতে এখন আপনার ${method} মোবাইল মেনু পিন লিখুন।`,
      instruction6: (method: string) => `সবকিছু ঠিক থাকলে, আপনি ${method} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।`,
      instruction71: 'এখন উপরের বক্সে আপনার',
      instruction72: 'দিন এবং নিচের',
      instruction73: 'বাটনে ক্লিক করুন।',
      invoice: 'ইনভয়েস আইডিঃ',
      verify: 'VERIFY',
      verifying: 'VERIFYING...'
    },
    en: {
      transactionIdLabel: "Enter Transaction ID",
      instruction1: (ussd: string, method: string) => `Dial ${ussd} to go to your ${method} mobile menu or go to the ${method} app.`,
      instruction2: 'Click on "Send Money".',
      instruction3: 'Enter this number as receiver:',
      instruction4: 'Amount:',
      instruction5: (method: string) => `Now enter your ${method} mobile menu PIN to confirm.`,
      instruction6: (method: string) => `If everything is okay, you will receive a confirmation message from ${method}.`,
      instruction71: 'Now enter your',
      instruction72: 'in the box above and click the',
      instruction73: 'button below.',
      invoice: 'Invoice ID:',
      verify: 'VERIFY',
      verifying: 'VERIFYING...'
    }
  };

  const t = translations[lang];
  const [invoiceId, setInvoiceId] = useState('');

  useEffect(() => {
    // Generate a random invoice ID
    setInvoiceId('sn' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).substring(4));
  }, []);
  const [paymentSetting, setPaymentSetting] = useState<{ number: string, qrCodeUrl: string }>({ number: '', qrCodeUrl: '' });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      const app = localStorage.getItem('checkout_app') || '';
      const plan = localStorage.getItem('checkout_plan') || '';
      const price = localStorage.getItem('checkout_price') || '';
      const duration = localStorage.getItem('checkout_duration') || '';
      const method = localStorage.getItem('checkout_method') || params.method;

      if (!token) {
        if (app && plan) {
          router.push(`/login?redirect=/checkout/${params.method}`);
        } else {
          router.push('/store');
        }
        return;
      }

      setData({
        appName: app || 'Subscription',
        planName: plan || 'Premium Plan',
        duration: duration || '1 Month',
        price: price || '500',
        method: method || 'bkash',
      });
    }
  }, [params.method, router]);

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment-settings`);
        const settings = await res.json();
        const currentSetting = settings.find((s: any) => s.method === params.method.toLowerCase());
        if (currentSetting) {
          setPaymentSetting({ number: currentSetting.number, qrCodeUrl: currentSetting.qrCodeUrl });
        }
      } catch (err) {
        console.error('Failed to fetch payment settings', err);
      }
    };
    fetchPaymentSettings();
  }, [params.method]);

  const methodColors: Record<string, string> = {
    bkash: '#E2136E',
    nagad: '#F05A28',
    rocket: '#8B2FC9',
    upay: '#00A651',
    cellfin: '#005BAA',
  };

  const number = paymentSetting.number || '01700000000';
  const brandColor = methodColors[params.method.toLowerCase()] || 'var(--primary)';

  const handleCopy = () => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const basePrice = Number(data.price) || 0;
  const finalPrice = basePrice;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('appName', data.appName);
      formData.append('planName', data.planName);
      formData.append('duration', data.duration);
      formData.append('price', String(finalPrice));
      formData.append('paymentMethod', params.method);
      formData.append('senderNumber', 'hidden_in_ui'); // Dummy sender number for backend
      formData.append('transactionId', transactionId);
      
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        router.push(`/orders/${result.orderId}`);
      } else {
        alert(result.message || 'Error submitting payment');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting payment');
    }
    setSubmitting(false);
  };

  const methodUpper = params.method.toUpperCase();
  const getUSSDCode = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bkash': return '*247#';
      case 'nagad': return '*167#';
      case 'rocket': return '*322#';
      case 'upay': return '*268#';
      default: return '*000#';
    }
  };

  const getMethodLogo = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bkash': return '/bkash_logo.png';
      case 'nagad': return '/nagad_logo.png';
      case 'rocket': return '/rocket_logo.png';
      case 'upay': return '/upay_logo.png';
      case 'cellfin': return '/cellfin_logo.png';
      default: return '';
    }
  };

  if (isMobile) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8fafc', 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z\' fill=\'%23e2e8f0\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        display: 'flex', 
        justifyContent: 'center',
        padding: '12px 16px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px', 
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Floating Header */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            margin: '0 0 16px 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '10px 14px' 
          }}>
            <button
              onClick={() => router.push('/checkout/payment')}
              title="Back"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#64748b' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/>
              </svg>
            </button>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button onClick={() => setLang(l => l === 'bn' ? 'en' : 'bn')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" /></svg>
                <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
              </button>
              <button onClick={() => router.push('/store')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>

          {/* Method Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 16px 0' }}>
            <img src={getMethodLogo(params.method)} alt={params.method} style={{ height: '48px', objectFit: 'contain' }} />
          </div>

          {/* Invoice Summary Box */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '12px 16px', 
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            marginBottom: '16px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                background: '#000', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid #334155',
                marginRight: '12px',
                flexShrink: 0
              }}>
                <svg width="28" height="28" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logo-grad-mob1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6"/>
                      <stop offset="1" stopColor="#8b5cf6"/>
                    </linearGradient>
                    <linearGradient id="logo-grad-mob2" x1="44" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#60a5fa"/>
                      <stop offset="1" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                  <path d="M22 2L40 12.3V31.7L22 42L4 31.7V12.3L22 2Z" fill="url(#logo-grad-mob1)" opacity="0.15"/>
                  <path d="M22 7L35 14.5V29.5L22 37L9 29.5V14.5L22 7Z" fill="url(#logo-grad-mob2)"/>
                  <path d="M22 7L35 14.5V29.5L22 22V7Z" fill="#2563eb" opacity="0.5"/>
                  <path d="M22 22L35 14.5L22 7L9 14.5L22 22Z" fill="#ffffff" opacity="0.25"/>
                  <path d="M22 22L9 14.5V29.5L22 37V22Z" fill="#7c3aed" opacity="0.7"/>
                  <path d="M22 15L23.8 19.2L28 21L23.8 22.8L22 27L20.2 22.8L16 21L20.2 19.2L22 15Z" fill="#ffffff"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6d7f9a', margin: '0 0 2px 0' }}>PREMIUMACCOUNTSSTORE.COM</h3>
                <div style={{ fontSize: '0.75rem', color: '#94a9c7', marginTop: '2px' }}>
                  {t.invoice}{' '}
                  <span style={{ fontSize: '0.8rem', color: '#6d7f9a', fontWeight: 600 }}>
                    {invoiceId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Box */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            padding: '12px 16px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#475569' }}>
              ৳ {finalPrice}
            </div>
          </div>

          {/* Instruction Block */}
          <div style={{ background: brandColor, borderRadius: '12px', padding: '16px 20px', color: 'white', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0' }}>{t.transactionIdLabel}</h3>
            
            <form id="payment-form-mobile" onSubmit={handleSubmit}>
              <input 
                type="text" 
                required 
                value={transactionId} 
                onChange={e => setTransactionId(e.target.value)} 
                placeholder={t.transactionIdLabel}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(255,255,255,0.3)', 
                  outline: 'none', 
                  fontSize: '0.95rem',
                  marginBottom: '16px',
                  color: '#334155'
                }} 
              />
            </form>
              
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.95 }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '6px 10px 0 0' }}></span>
                <span>{t.instruction1(getUSSDCode(params.method), methodUpper)}</span>
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '6px 10px 0 0' }}></span>
                <span><strong style={{ color: '#facc15' }}>{t.instruction2}</strong></span>
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '6px 10px 0 0' }}></span>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 10px' }}>
                  <span>{t.instruction3}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ color: '#facc15', fontSize: '1.05rem', letterSpacing: '1px' }}>{number}</strong>
                    <button 
                      type="button"
                      onClick={handleCopy} 
                      style={{ 
                        background: 'rgba(0,0,0,0.2)', 
                        border: 'none', 
                        color: 'white', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '6px 10px 0 0' }}></span>
                <span>{t.instruction4} <strong style={{ color: '#facc15', fontSize: '1.05rem' }}>{finalPrice}</strong></span>
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '6px 10px 0 0' }}></span>
                <span>{t.instruction5(methodUpper)}</span>
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '6px 10px 0 0' }}></span>
                <span>{t.instruction6(methodUpper)}</span>
              </li>
              <li style={{ padding: '12px 0', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '6px 10px 0 0' }}></span>
                <span>{t.instruction71} <strong style={{ color: '#facc15' }}>Transaction ID</strong> {t.instruction72} <strong style={{ color: '#facc15' }}>VERIFY</strong> {t.instruction73}</span>
              </li>
            </ul>
          </div>

          {/* VERIFY Button inside scrollable flow */}
          <button 
            form="payment-form-mobile"
            type="submit" 
            disabled={submitting} 
            style={{ 
              width: '100%', 
              background: brandColor, 
              color: 'white', 
              border: 'none', 
              padding: '16px', 
              borderRadius: '12px', 
              fontSize: '1.1rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              opacity: submitting ? 0.7 : 1,
              textAlign: 'center',
              marginBottom: '32px'
            }}
          >
            {submitting ? t.verifying : t.verify}
          </button>
        </div>
      </div>
    );
  }

  // Original Desktop Layout
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ 
        background: 'white', 
        width: '100%', 
        maxWidth: '720px', 
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
          <Link href="/checkout/payment" style={{ color: '#64748b' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/>
            </svg>
          </Link>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => setLang(l => l === 'bn' ? 'en' : 'bn')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" /></svg>
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
            <button onClick={() => router.push('/checkout/cancel')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Method Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <img src={getMethodLogo(params.method)} alt={params.method} style={{ height: '50px', objectFit: 'contain' }} />
          </div>

          {/* Invoice Summary Box */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px' }}>
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
                    <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <path d="M22 2L40 12.3V31.7L22 42L4 31.7V12.3L22 2Z" fill="url(#logo-grad1)" opacity="0.15"/>
                  <path d="M22 7L35 14.5V29.5L22 37L9 29.5V14.5L22 7Z" fill="url(#logo-grad2)"/>
                  <path d="M22 7L35 14.5V29.5L22 22V7Z" fill="#2563eb" opacity="0.5"/>
                  <path d="M22 22L35 14.5L22 7L9 14.5L22 22Z" fill="#ffffff" opacity="0.25"/>
                  <path d="M22 22L9 14.5V29.5L22 37V22Z" fill="#7c3aed" opacity="0.7"/>
                  <path d="M22 15L23.8 19.2L28 21L23.8 22.8L22 27L20.2 22.8L16 21L20.2 19.2L22 15Z" fill="#ffffff" filter="url(#logo-glow)"/>
                  <path d="M22 15L23.8 19.2L28 21L23.8 22.8L22 27L20.2 22.8L16 21L20.2 19.2L22 15Z" fill="#ffffff"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', margin: '0 0 4px 0' }}>PREMIUMACCOUNTSSTORE.COM</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {t.invoice}{' '}
                  <span style={{ fontWeight: 600, color: '#475569' }}>{invoiceId}</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#475569' }}>
              ৳ {finalPrice}
            </div>
          </div>

          {/* Instruction Block */}
          <div style={{ background: brandColor, borderRadius: '8px', padding: '24px', color: 'white', marginBottom: '16px' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>{t.transactionIdLabel}</h3>
            
            <form id="payment-form-desktop" onSubmit={handleSubmit}>
              <input 
                type="text" 
                required 
                value={transactionId} 
                onChange={e => setTransactionId(e.target.value)} 
                placeholder={t.transactionIdLabel}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '6px', 
                  border: '1px solid #3b82f6', 
                  outline: 'none', 
                  fontSize: '1rem',
                  marginBottom: '24px',
                  color: '#334155'
                }} 
              />
            </form>
              
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.95 }}>
              <li style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.1)', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '8px 12px 0 0' }}></span>
                <span>{t.instruction1(getUSSDCode(params.method), methodUpper)}</span>
              </li>
              <li style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '8px 12px 0 0' }}></span>
                <span><strong style={{ color: '#facc15' }}>{t.instruction2}</strong></span>
              </li>
              <li style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '8px 12px 0 0' }}></span>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px' }}>
                  <span>{t.instruction3}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <strong style={{ color: '#facc15', fontSize: '1.1rem', letterSpacing: '1px' }}>{number}</strong>
                    <button 
                      type="button"
                      onClick={handleCopy} 
                      style={{ 
                        background: 'rgba(0,0,0,0.2)', 
                        border: 'none', 
                        color: 'white', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </li>
              <li style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '8px 12px 0 0' }}></span>
                <span>{t.instruction4} <strong style={{ color: '#facc15', fontSize: '1.1rem' }}>{finalPrice}</strong></span>
              </li>
              <li style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '8px 12px 0 0' }}></span>
                <span>{t.instruction5(methodUpper)}</span>
              </li>
              <li style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '8px 12px 0 0' }}></span>
                <span>{t.instruction6(methodUpper)}</span>
              </li>
              <li style={{ padding: '16px 0', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-block', minWidth: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '8px 12px 0 0' }}></span>
                <span>{t.instruction71} <strong style={{ color: '#facc15' }}>Transaction ID</strong> {t.instruction72} <strong style={{ color: '#facc15' }}>VERIFY</strong> {t.instruction73}</span>
              </li>
            </ul>
          </div>

          {/* Separate VERIFY Button */}
          <button 
            form="payment-form-desktop"
            type="submit" 
            disabled={submitting} 
            style={{ 
              width: '100%', 
              background: brandColor, 
              color: 'white', 
              border: 'none', 
              padding: '16px', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? t.verifying : t.verify}
          </button>
        </div>
      </div>
    </div>
  );
}
