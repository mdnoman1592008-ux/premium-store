"use client";
import React from 'react';
import Link from 'next/link';

export const WeAccept = () => {
  return (
    <section className="container" style={{ padding: '20px 0 60px' }}>
      <div 
        style={{
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '950px',
          height: '150px',
          margin: '0 auto',
          borderRadius: '24px',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(59, 130, 246, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <img 
          src="/payment-banner.png" 
          alt="We Accept All Major Payment Methods" 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: 'block', 
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '24px'
          }} 
        />
      </div>
    </section>
  );
};

const LATEST_ORDERS = [
  { app: 'ChatGPT', bg: '#10A37F', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073z"/></svg> },
  { app: 'Spotify', bg: '#1DB954', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg> },
  { app: 'YouTube', bg: '#FF0000', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
  { app: 'Gemini', bg: 'linear-gradient(135deg,#4285F4,#9C27B0)', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/></svg> },
  { app: 'Netflix', bg: '#E50914', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 24c.557-.07 3.811-.298 4.387-.573zM.026 0l-.003 24 4.341-.032V0z"/></svg> },
];

export const LatestOrders = () => (
  <section className="container" style={{ padding: '0 0 60px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Latest Orders</h3>
      <Link href="/orders" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>View All Orders →</Link>
    </div>
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
      {LATEST_ORDERS.map((o, i) => (
        <div key={i} style={{
          background: 'white', borderRadius: '16px', padding: '16px 20px',
          border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '210px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          flex: '0 0 auto',
        }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {o.icon}
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{o.app}</h4>
            <p style={{ fontSize: '0.8rem', margin: 0, color: '#10b981', fontWeight: 600 }}>✓ Delivered</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const REVIEWS = [
  { name: 'Rahim', initial: 'R', color: '#2563eb', text: 'Very fast delivery. Recommended.' },
  { name: 'Karim', initial: 'K', color: '#10a37f', text: 'Genuine account and excellent support.' },
  { name: 'Noman', initial: 'N', color: '#e50914', text: 'Best premium store I have used.' },
];

export const CustomerReviews = () => (
  <section className="container" style={{ padding: '0 0 60px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Customer Reviews</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0' }}>What our customers say about us</p>
      </div>
      <button style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>View All Reviews →</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {REVIEWS.map((r, i) => (
        <div key={i} style={{
          background: 'white', borderRadius: '20px', padding: '28px',
          border: '1px solid #f1f5f9', position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div style={{ position: 'absolute', top: '24px', right: '24px', color: '#e2e8f0', fontSize: '3.5rem', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>{r.initial}</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{r.name}</h4>
              <div style={{ color: '#FBBF24', fontSize: '1rem', letterSpacing: '1px' }}>★★★★★</div>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{r.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export const Newsletter = () => (
  <section className="container" style={{ padding: '0 0 80px' }}>
    <div style={{
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
      borderRadius: '24px', padding: '36px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Stay Updated</h3>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.9rem' }}>Subscribe to get special offers and updates.</p>
        </div>
      </div>
      <form style={{ display: 'flex', gap: '12px', flex: '1 1 300px', maxWidth: '480px' }} onSubmit={e => e.preventDefault()}>
        <input type="email" placeholder="Enter your email" required style={{
          flex: 1, padding: '14px 20px', borderRadius: '12px',
          border: '1.5px solid white', outline: 'none', fontSize: '0.95rem',
          background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }} />
        <button type="submit" className="btn-primary" style={{ padding: '14px 28px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
          Subscribe
        </button>
      </form>
    </div>
  </section>
);
