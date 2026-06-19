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

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ 
        background: 'white', 
        width: '100%', 
        maxWidth: '560px', 
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
          <div style={{ display: 'flex', gap: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" /></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
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
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', margin: '0 0 4px 0' }}>PREMIUMACCCOUNTSSTORE.COM</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '2px' }}>ইনভয়েস আইডিঃ</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{invoiceId}</div>
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#475569' }}>
              ৳ {finalPrice}
            </div>
          </div>

          {/* Colored Instruction Block */}
          <div style={{ background: brandColor, borderRadius: '8px', padding: '24px', color: 'white' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>ট্রানজেকশন আইডি দিন</h3>
            
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                required 
                value={transactionId} 
                onChange={e => setTransactionId(e.target.value)} 
                placeholder="ট্রানজেকশন আইডি দিন" 
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  outline: 'none', 
                  fontSize: '1rem',
                  marginBottom: '24px',
                  color: '#334155'
                }} 
              />
              
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', lineHeight: '1.8', margin: '0 0 24px 0', opacity: 0.95 }}>
                <li>{getUSSDCode(params.method)} ডায়াল করে আপনার {methodUpper} মোবাইল মেনুতে যান অথবা {methodUpper} অ্যাপে যান।</li>
                <li>"Send Money" -এ ক্লিক করুন।</li>
                <li>
                  প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ <strong style={{ fontSize: '0.95rem' }}>{number}</strong>
                  <button 
                    type="button"
                    onClick={handleCopy} 
                    style={{ 
                      background: 'rgba(0,0,0,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      marginLeft: '8px', 
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </li>
                <li>টাকার পরিমাণঃ <strong style={{ fontSize: '0.95rem' }}>{finalPrice}</strong></li>
                <li>নিশ্চিত করতে এখন আপনার {methodUpper} মোবাইল মেনু পিন লিখুন।</li>
                <li>সবকিছু ঠিক থাকলে, আপনি {methodUpper} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</li>
                <li>এখন উপরের বক্সে আপনার Transaction ID দিন এবং নিচের VERIFY বাটনে ক্লিক করুন।</li>
              </ul>

              <button 
                type="submit" 
                disabled={submitting} 
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.15)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '16px', 
                  borderRadius: '6px', 
                  fontSize: '1rem', 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
              >
                {submitting ? 'VERIFYING...' : 'VERIFY'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
