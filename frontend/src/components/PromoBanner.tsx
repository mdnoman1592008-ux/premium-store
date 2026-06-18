"use client";
import React from 'react';
import Link from 'next/link';

const PromoBanner = () => {
  return (
    <section className="container" style={{ padding: '40px 0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Blue Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #5b86e5 0%, #36d1dc 100%)',
        borderRadius: '16px',
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(91, 134, 229, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))' }}>
            🎁
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 8px' }}>Special Offers Just For You!</h2>
            <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>Get up to 50% off on selected premium accounts. Limited time only.</p>
          </div>
        </div>
        <Link href="/store" style={{
          background: 'white',
          color: '#5b86e5',
          padding: '12px 28px',
          borderRadius: '8px',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
          display: 'inline-block'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Shop Now
        </Link>
      </div>

      {/* Features Row */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px 40px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '32px'
      }}>
        {[
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
            title: 'Instant Delivery',
            desc: 'Fast delivery within minutes'
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
            title: 'Easy Replacement',
            desc: 'Warranty for all accounts'
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
            title: 'Secure Payment',
            desc: '100% secure payment guarantee'
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-3 1.5 1-3.5-2.5-2.5 3.5-.5 1-3.5 1 3.5 3.5.5-2.5 2.5 1 3.5-3 1.5z"></path></svg>,
            title: 'Best Quality',
            desc: 'Premium & genuine accounts'
          }
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {f.icon}
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{f.title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PromoBanner;
