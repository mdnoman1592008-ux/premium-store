"use client";
import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section style={{
      padding: '70px 0 60px',
      background: 'linear-gradient(160deg, #f0f7ff 0%, #e8f0fe 40%, #f8fafc 100%)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes heroFloat {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-14px); }
          100% { transform: translateY(0px); }
        }
        .hero-mockup-wrap {
          animation: heroFloat 7s ease-in-out infinite;
          will-change: transform;
        }
        .hero-mockup-img {
          width: 100%;
          max-width: 580px;
          height: auto;
          display: block;
          /* Blend mode: white/light bg of the image becomes transparent against page bg */
          mix-blend-mode: multiply;
          /* Radial fade mask to dissolve all 4 edges into the page */
          -webkit-mask-image: radial-gradient(
            ellipse 90% 88% at 52% 50%,
            black 45%,
            rgba(0,0,0,0.95) 55%,
            rgba(0,0,0,0.7) 68%,
            rgba(0,0,0,0.3) 80%,
            transparent 100%
          );
          mask-image: radial-gradient(
            ellipse 90% 88% at 52% 50%,
            black 45%,
            rgba(0,0,0,0.95) 55%,
            rgba(0,0,0,0.7) 68%,
            rgba(0,0,0,0.3) 80%,
            transparent 100%
          );
        }
        .hero-cta-secondary:hover {
          background: #f1f5f9 !important;
          border-color: #94a3b8 !important;
        }
        .hero-feature-pill {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-feature-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.08) !important;
        }
      `}</style>

      <div className="container mobile-col-reverse mobile-text-center" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px',
        flexWrap: 'wrap',
      }}>

        {/* ── LEFT SIDE ── */}
        <div className="mobile-col mobile-text-center" style={{ flex: '1 1 480px', maxWidth: '560px', display: 'flex', flexDirection: 'column' }}>

          {/* Trusted Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', background: '#eff6ff',
            color: 'var(--primary)', borderRadius: '50px',
            fontWeight: 700, fontSize: '0.78rem', marginBottom: '28px',
            letterSpacing: '1px', textTransform: 'uppercase',
            border: '1px solid #bfdbfe',
            alignSelf: 'flex-start'
          }} className="mobile-hidden">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
            </svg>
            Trusted By Thousands
          </div>

          <h1 className="mobile-title-lg" style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            lineHeight: 1.15, fontWeight: 800,
            color: '#0f172a', marginBottom: '20px',
          }}>
            Premium Accounts<br />
            For Your <span style={{ color: 'var(--primary)' }}>Digital Life</span>
          </h1>

          <p style={{
            fontSize: '1.05rem', color: '#64748b',
            marginBottom: '36px', lineHeight: 1.7, maxWidth: '480px',
          }}>
            Get premium accounts, subscriptions and digital services
            at the best price. Fast delivery, 100% secure and reliable.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Link href="/store" className="btn-primary" style={{
              padding: '14px 28px', fontSize: '1rem', borderRadius: '12px', gap: '8px',
            }}>
              Explore Plans <span>→</span>
            </Link>
            <Link href="/contact" className="hero-cta-secondary" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 24px', borderRadius: '12px',
              border: '1.5px solid #cbd5e1', background: 'white',
              color: '#374151', fontWeight: 600, fontSize: '1rem',
              textDecoration: 'none', transition: 'all 0.2s',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.68a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.04 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z"/>
              </svg>
              Contact Support
            </Link>
          </div>

          {/* Feature Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '480px' }}>
            {[
              { icon: '🚀', title: 'Instant Delivery', desc: 'Fast & Reliable' },
              { icon: '🛡️', title: 'Secure Payment', desc: '100% Protected' },
              { icon: '💎', title: 'Affordable Price', desc: 'Best Market Price' },
              { icon: '🎧', title: '24/7 Support', desc: 'Always Here' },
            ].map((f, i) => (
              <div key={i} className="hero-feature-pill" style={{
                display: 'flex', gap: '10px', alignItems: 'center',
                background: 'white', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                cursor: 'default',
              }}>
                <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>{f.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDE: Your Image — seamlessly blended ── */}
        <div style={{
          flex: '1 1 460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '460px',
        }}>
          <div className="hero-mockup-wrap">
            <img
              src="/hero_3d_mockup.png"
              alt="Premium Account Store 3D Mockup"
              className="hero-mockup-img"
            />
          </div>
        </div>
      </div>

      {/* Popular Apps label */}
      <div className="container" style={{ paddingTop: '48px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Popular Apps</h3>
      </div>
    </section>
  );
};

export default Hero;
