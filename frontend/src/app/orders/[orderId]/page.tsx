"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// App data with real brand colors & SVG icons
const APP_DATA: Record<string, { bg: string; icon: React.ReactNode }> = {
  'youtube': {
    bg: '#FF0000',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>,
  },
  'spotify': {
    bg: '#1DB954',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>,
  },
  'chatgpt': {
    bg: '#10A37F',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494z"/></svg>,
  },
  'gemini': {
    bg: 'linear-gradient(135deg, #4285F4, #9C27B0)',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 2L9.09 9.09 2 12l7.09 2.91L12 22l2.91-7.09L22 12l-7.09-2.91z"/></svg>,
  },
  'grok': {
    bg: '#1a1a1a',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  'capcut': {
    bg: '#000000',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M14.121 2L12 4.121l2.121 2.122L16.243 4.12zm-4.242 0L7.757 4.121 9.879 6.243 12 4.121zM12 8.364L7.757 12.607l4.243 4.243 4.243-4.243zm0 10.607L9.879 21.09l2.122 2.121 2.121-2.121z"/></svg>,
  },
  'canva': {
    bg: '#00C4CC',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/><path d="M12 6a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>,
  },
  'netflix': {
    bg: '#E50914',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 24c.557-.07 3.811-.298 4.387-.573zM.026 0l-.003 24 4.341-.032V0z"/></svg>,
  },
  'disney': {
    bg: '#113CCF',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>Disney+</span>,
  },
  'inshot': {
    bg: '#FF5E5B',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1rem' }}>📱</span>,
  },
  'veo': {
    bg: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
    icon: <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M8 5v14l11-7z"/></svg>,
  },
  'claude': {
    bg: '#D97706',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>C</span>,
  }
};

const DEFAULT_APP = {
  bg: '#2563eb',
  icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>⭐</span>,
};

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${params.orderId}`)
      .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(data => {
        if (data && !data.message) {
          setOrder(data);
        } else {
          // fallback mockup order if not found (mostly for offline demonstration)
          setOrder({
            orderId: params.orderId,
            appName: 'ChatGPT',
            planName: 'ChatGPT Plus',
            duration: '1 Month',
            price: 500,
            paymentMethod: 'bkash',
            transactionId: 'TRX99283726',
            senderNumber: '01712345678',
            status: 'Delivered',
            createdAt: new Date().toISOString()
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // Fallback static order for UI review
        setOrder({
          orderId: params.orderId,
          appName: 'ChatGPT',
          planName: 'ChatGPT Plus',
          duration: '1 Month',
          price: 500,
          paymentMethod: 'bkash',
          transactionId: 'TRX99283726',
          senderNumber: '01712345678',
          status: 'Delivered',
          createdAt: new Date().toISOString()
        });
        setLoading(false);
      });
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', maxWidth: '800px' }}>
        <div style={{ height: '350px', background: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Order Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>We couldn't locate any order matching ID <strong>{params.orderId}</strong>.</p>
        <Link href="/orders" className="btn-primary" style={{ padding: '12px 32px' }}>
          Try Again
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'Pending') return '#f59e0b';
    if (status === 'Verified') return '#3b82f6';
    if (status === 'Delivered') return '#10b981';
    return 'var(--primary)';
  };

  const steps = ['Pending', 'Verified', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status);
  const appKey = (order.appName || '').toLowerCase();
  const appInfo = APP_DATA[appKey] || DEFAULT_APP;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 0 100px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '6px 14px', 
            background: 'white', 
            color: '#64748b', 
            borderRadius: '50px', 
            fontWeight: 700, 
            fontSize: '0.8rem', 
            marginBottom: '16px',
            border: '1px solid #e2e8f0'
          }}>
            Order Status Tracking
          </div>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            Order #{order.orderId}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Timeline Status Box */}
        <div className="glass-card" style={{ padding: '40px', marginBottom: '32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginBottom: '40px', padding: '0 10px' }}>
            <div style={{ position: 'absolute', top: '22px', left: '24px', right: '24px', height: '4px', background: '#e2e8f0', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', top: '22px', left: '24px', width: `${(currentStepIndex / 2) * 90}%`, height: '4px', background: 'var(--primary)', zIndex: 0, transition: 'width 0.5s' }}></div>
            
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '50%', 
                  background: i <= currentStepIndex ? 'var(--primary)' : 'white', 
                  border: `4px solid ${i <= currentStepIndex ? '#eff6ff' : '#f1f5f9'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: i <= currentStepIndex ? 'white' : '#94a3b8',
                  fontWeight: 'bold', 
                  transition: 'all 0.3s',
                  boxShadow: i <= currentStepIndex ? '0 8px 20px rgba(37,99,235,0.2)' : 'none'
                }}>
                  {i < currentStepIndex ? '✓' : i === currentStepIndex ? '●' : i + 1}
                </div>
                <span style={{ 
                  marginTop: '12px', 
                  fontWeight: 700, 
                  fontSize: '0.9rem',
                  color: i <= currentStepIndex ? '#0f172a' : '#94a3b8' 
                }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', marginRight: '8px' }}>Current Status:</span>
            <span style={{ 
              display: 'inline-block', 
              padding: '6px 16px', 
              borderRadius: '50px', 
              background: `${getStatusColor(order.status)}12`, 
              color: getStatusColor(order.status), 
              fontWeight: 700, 
              fontSize: '1rem' 
            }}>
              {order.status === 'Pending' ? '🕒 Pending verification' : order.status === 'Verified' ? '⚙️ Payment verified' : '🎉 Account delivered'}
            </span>
          </div>
        </div>

        {/* Credentials Box (Only shown when status is Delivered) */}
        {order.status === 'Pending' && (
          <div className="glass-card float-anim" style={{ 
            padding: '36px 32px', 
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
            borderRadius: '24px', 
            border: '1.5px solid #fde68a', 
            boxShadow: '0 10px 30px rgba(245,158,11,0.08)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span style={{ fontSize: '1.8rem' }}>⏳</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#92400e', margin: 0 }}>Order Pending Verification</h3>
            </div>
            <p style={{ color: '#b45309', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              We have received your payment transaction details. Our administrators are currently verifying the transfer with our financial systems. Once verified and approved, your premium account credentials will be delivered right here on this page. Please keep this URL safe or bookmark it to check back!
            </p>
          </div>
        )}

        {/* Payment Verified Box */}
        {order.status === 'Verified' && (
          <div className="glass-card float-anim" style={{ 
            padding: '36px 32px', 
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
            borderRadius: '24px', 
            border: '1.5px solid #bfdbfe', 
            boxShadow: '0 10px 30px rgba(37,99,235,0.08)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span style={{ fontSize: '1.8rem' }}>⚙️</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e40af', margin: 0 }}>Payment Verified</h3>
            </div>
            <p style={{ color: '#1d4ed8', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              Your payment has been successfully verified! Our team is currently preparing and registering your premium account access details. This process typically takes 5-15 minutes. Once completed, your credentials will be delivered here instantly. Please refresh the page shortly.
            </p>
          </div>
        )}

        {/* Credentials Box (Only shown when status is Delivered) */}
        {order.status === 'Delivered' && (
          <div className="glass-card float-anim" style={{ 
            padding: '36px 32px', 
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
            borderRadius: '24px', 
            border: '1.5px solid #a7f3d0', 
            boxShadow: '0 10px 30px rgba(16,185,129,0.08)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span style={{ fontSize: '1.8rem' }}>🔑</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46', margin: 0 }}>Your Account Login Details</h3>
            </div>
            
            <p style={{ color: '#047857', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Your subscription is ready! Log in to the application using the following premium credentials.
            </p>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0fdf4', paddingBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: '#475569', fontSize: '0.9rem' }}>Email / Username:</span>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                  {order.credentialsEmail || `premium_user_ord${order.orderId.split('-')[1]}@premiumstore.com`}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0fdf4', paddingBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: '#475569', fontSize: '0.9rem' }}>Password:</span>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                  {order.credentialsPassword || `PremiumPass${order.orderId.split('-')[1]}!`}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: '#475569', fontSize: '0.9rem' }}>Profile Name / Pin:</span>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                  {order.credentialsPin || 'Profile 1 (Pin: 2026)'}
                </strong>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', marginTop: '2px' }}>⚠️</span>
              <span style={{ fontSize: '0.82rem', color: '#065f46', lineHeight: 1.4, fontWeight: 500 }}>
                <strong>Important Rule:</strong> Do not change the password, email, or profile settings of this account. Modifying details will void your warranty.
              </span>
            </div>
          </div>
        )}

        {/* Order Details Grid */}
        <div className="glass-card" style={{ padding: '40px 32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: appInfo.bg, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}>
              {appInfo.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Order Specification</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Verify transaction details below</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Service Application:</span>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', marginTop: '4px' }}>{order.appName}</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Subscription Plan:</span>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', marginTop: '4px' }}>{order.planName}</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Billing Cycle:</span>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', marginTop: '4px' }}>{order.duration}</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Price Charged:</span>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem', marginTop: '4px' }}>৳{order.price}</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Payment Gateway:</span>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', marginTop: '4px', textTransform: 'capitalize' }}>{order.paymentMethod}</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Transaction ID:</span>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '1.05rem', marginTop: '4px' }}>{order.transactionId}</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Sender Wallet:</span>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '1.05rem', marginTop: '4px' }}>{order.senderNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
