"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DurationPage() {
  const [appName, setAppName] = useState('');
  const [planName, setPlanName] = useState('');
  const router = useRouter();

  const [durations, setDurations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      const app = localStorage.getItem('checkout_app') || '';
      const plan = localStorage.getItem('checkout_plan') || '';

      if (!token) {
        if (app && plan) {
          router.push('/login?redirect=/checkout/duration');
        } else {
          router.push('/store');
        }
        return;
      }

      setAppName(app);
      setPlanName(plan);

      // Fetch dynamic durations
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`)
        .then(res => res.json())
        .then(data => {
          const product = data.find((p: any) => p.appName === app);
          if (product) {
            const selectedPlan = product.plans.find((p: any) => p.planName === plan);
            if (selectedPlan && selectedPlan.durations) {
              setDurations(selectedPlan.durations);
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [router]);

  const handleSelectDuration = (duration: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_duration', duration.label);
      localStorage.setItem('checkout_price', duration.price.toString());
    }
    router.push('/checkout/payment');
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
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Step Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>1</span>
          <span style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem' }}>Select Duration</span>
          <span style={{ width: '40px', height: '1.5px', background: '#cbd5e1' }} />
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Payment Method</span>
          <span style={{ width: '40px', height: '1.5px', background: '#cbd5e1' }} />
          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>3</span>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Payment details</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Choose Subscription Period</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Flexible options for <strong style={{ color: 'var(--primary)' }}>{appName} - {planName}</strong>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading durations...</div>
          ) : (durations || []).map((d, i) => (
            <div 
              key={i} 
              className="glass-card" 
              style={{ 
                padding: '28px 32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                cursor: 'pointer', 
                transition: 'all 0.25s ease',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                position: 'relative',
                background: 'white',
                borderRadius: '20px',
                flexWrap: 'wrap',
                gap: '16px'
              }} 
              onClick={() => handleSelectDuration(d)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(37,99,235,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9';
              }}
            >
              {/* Badge/Tag */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '24px',
                background: d.tag === 'Best Deal' ? '#10b981' : d.tag === 'Popular' ? 'var(--primary)' : '#64748b',
                color: 'white',
                padding: '2px 10px',
                borderRadius: '50px',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                {d.tag}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{d.label}</h3>
                {d.discount > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ background: '#ecfdf5', color: '#10b981', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      Save ৳{d.discount}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      Discounted from <s>৳{d.price + d.discount}</s>
                    </span>
                  </div>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Standard monthly subscription rate</span>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>৳{d.price}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                    ৳{Math.round(d.price / d.months)}/mo
                  </div>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  transition: 'background 0.2s',
                }}>
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
