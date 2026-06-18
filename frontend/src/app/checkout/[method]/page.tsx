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
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('appName', data.appName);
      formData.append('planName', data.planName);
      formData.append('duration', data.duration);
      formData.append('price', data.price);
      formData.append('paymentMethod', params.method);
      formData.append('senderNumber', senderNumber);
      formData.append('transactionId', transactionId);
      
      const fileInput = document.getElementById('screenshot') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('screenshot', fileInput.files[0]);
      }

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

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Step Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>✓</span>
          <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>Select Duration</span>
          <span style={{ width: '40px', height: '1.5px', background: 'var(--primary)' }} />
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>✓</span>
          <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>Payment Method</span>
          <span style={{ width: '40px', height: '1.5px', background: 'var(--primary)' }} />
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>3</span>
          <span style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem' }}>Payment details</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textTransform: 'capitalize' }}>
            {params.method} Payment
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Complete the transaction and submit details below
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Left Column: Payment QR and Summary */}
          <div className="glass-card" style={{ padding: '40px 32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            
            {/* 1. QR Code and Send Money Number Box */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '28px 24px', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              marginBottom: '32px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '16px' 
            }}>
              {/* QR Code Container (Bigger size: 200px) */}
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {paymentSetting.qrCodeUrl ? (
                  <img 
                    src={paymentSetting.qrCodeUrl.startsWith('data:') ? paymentSetting.qrCodeUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${paymentSetting.qrCodeUrl}`} 
                    alt={`${params.method} QR Code`} 
                    style={{ 
                      width: '200px', 
                      height: '200px', 
                      objectFit: 'contain',
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0', 
                      background: 'white',
                      padding: '4px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                ) : (
                  <QRCodeSVG color={brandColor} letter={params.method.charAt(0).toUpperCase()} size={200} />
                )}
              </div>

              <div style={{ width: '100%', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Send Money Number ({params.method})
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', position: 'relative' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: brandColor, letterSpacing: '1px' }}>
                    {number}
                  </h2>
                  <button 
                    onClick={handleCopy} 
                    style={{ 
                      background: 'white', 
                      border: '1px solid #cbd5e1', 
                      borderRadius: '8px', 
                      width: '36px', 
                      height: '36px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                    }}
                    title="Copy Number"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                  
                  {copied && (
                    <span style={{ 
                      position: 'absolute', 
                      bottom: '105%', 
                      background: '#1e293b', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* 2. Order Summary */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '24px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Order Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>App Subscription:</span> 
                  <strong style={{ color: '#334155' }}>{data.appName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Subscription Plan:</span> 
                  <strong style={{ color: '#334155' }}>{data.planName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Billing Cycle:</span> 
                  <strong style={{ color: '#334155' }}>{data.duration}</strong>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '12px', 
                  paddingTop: '16px', 
                  borderTop: '1px dashed #e2e8f0',
                  alignItems: 'baseline'
                }}>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>Total Payable:</span> 
                  <strong style={{ fontSize: '1.6rem', color: brandColor, fontWeight: 800 }}>৳{data.price}</strong>
                </div>
              </div>
            </div>

            {/* 3. How to Pay (Now below Order Summary) */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>How to Pay</h3>
              <ol style={{ paddingLeft: '20px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <li>Open your <strong>{params.method}</strong> app or dial code.</li>
                <li>Choose <strong>Send Money</strong> option.</li>
                <li>Enter the payment number or scan the QR Code above.</li>
                <li>Send exactly <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>৳{data.price}</strong>.</li>
                <li>Copy the <strong>Transaction ID</strong> and paste it in the form.</li>
              </ol>
            </div>

          </div>

          {/* Right Column: Payment Form */}
          <div className="glass-card" style={{ padding: '40px 32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Submit Transaction Details</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                  Your {params.method} Wallet Number
                </label>
                <input 
                  type="text" 
                  required 
                  value={senderNumber} 
                  onChange={e => setSenderNumber(e.target.value)} 
                  placeholder="e.g. 017XXXXXXXX" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    border: '1.5px solid #cbd5e1', 
                    outline: 'none', 
                    background: 'white', 
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                  }} 
                  onFocus={e => e.target.style.borderColor = brandColor}
                  onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                  Payment Transaction ID (TxID)
                </label>
                <input 
                  type="text" 
                  required 
                  value={transactionId} 
                  onChange={e => setTransactionId(e.target.value)} 
                  placeholder="e.g. 8N3JK889KL" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    border: '1.5px solid #cbd5e1', 
                    outline: 'none', 
                    background: 'white', 
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                  }} 
                  onFocus={e => e.target.style.borderColor = brandColor}
                  onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                  Upload Screenshot (Optional)
                </label>
                <input 
                  type="file" 
                  id="screenshot" 
                  accept="image/*" 
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: '1.5px solid #cbd5e1', 
                    outline: 'none', 
                    background: 'white', 
                    fontSize: '0.9rem' 
                  }} 
                />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                  Upload a screenshot of the payment confirmation page.
                </span>
              </div>

              <button 
                type="submit" 
                disabled={submitting} 
                className="btn-primary" 
                style={{ 
                  marginTop: '16px', 
                  padding: '16px', 
                  width: '100%',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  background: brandColor,
                  borderColor: brandColor,
                  color: 'white',
                  boxShadow: `0 8px 20px ${brandColor}25`,
                  transition: 'opacity 0.2s'
                }}
              >
                {submitting ? 'Verifying transaction...' : 'Payment Complete'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
