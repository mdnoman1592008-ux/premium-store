"use client";
import React from 'react';
import Link from 'next/link';

const PromoBanner = () => {
  return (
    <section className="container" style={{ padding: '28px 0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`
        @keyframes promoPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(4deg); }
        }
        .promo-feature-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.28s ease;
        }
        .promo-feature-card:hover {
          background: white;
          border-color: #93c5fd;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.08);
        }
      `}</style>

      {/* Eye-Catching Animated Gradient Banner */}
      <div style={{
        background: 'linear-gradient(125deg, #1e1b4b 0%, #2563eb 52%, #7c3aed 100%)',
        borderRadius: '24px',
        padding: '36px 42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        color: 'white',
        boxShadow: '0 20px 45px rgba(37, 99, 235, 0.22)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background circle */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          top: '-60px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.4rem',
            animation: 'promoPulse 3s ease-in-out infinite',
            flexShrink: 0
          }}>
            🎁
          </div>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid rgba(250, 204, 21, 0.45)',
              color: '#fde047',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              🔥 Flash Sale • Save Up To 70%
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.3px' }}>
              Unlock Premium AI, Streaming & Design Tools!
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#e0e7ff', margin: 0 }}>
              Pay easily with bKash, Nagad or Rocket — No international dual-currency card needed.
            </p>
          </div>
        </div>

        <Link
          href="/store"
          style={{
            background: 'white',
            color: '#1e40af',
            padding: '14px 32px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '0.98rem',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            position: 'relative',
            zIndex: 1
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Explore Store →
        </Link>
      </div>

      {/* Features Row */}
      <div style={{
        background: 'white',
        borderRadius: '22px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 28px rgba(15, 23, 42, 0.03)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px'
      }}>
        {[
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
            title: 'Instant Delivery',
            desc: 'Credentials delivered in minutes',
            color: '#2563eb',
            bg: '#eff6ff'
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
            title: 'Full Warranty',
            desc: '100% replacement guarantee',
            color: '#7c3aed',
            bg: '#f5f3ff'
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
            title: 'Secure BDT Payment',
            desc: 'bKash, Nagad, Rocket & Upay',
            color: '#059669',
            bg: '#ecfdf5'
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-3 1.5 1-3.5-2.5-2.5 3.5-.5 1-3.5 1 3.5 3.5.5-2.5 2.5 1 3.5-3 1.5z"></path></svg>,
            title: '100% Genuine',
            desc: 'Official paid subscriptions',
            color: '#d97706',
            bg: '#fffbeb'
          }
        ].map((f, i) => (
          <div key={i} className="promo-feature-card">
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: f.bg,
              color: f.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {f.icon}
            </div>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 3px', color: '#0f172a' }}>{f.title}</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;
