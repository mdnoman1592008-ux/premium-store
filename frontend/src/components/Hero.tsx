"use client";
import React from 'react';

const STATS = [
  { value: '15,000+', label: 'Happy Customers', icon: '👥', color: '#3b82f6' },
  { value: '5–15 Min', label: 'Instant Delivery', icon: '⚡', color: '#10b981' },
  { value: '100%', label: 'Official Warranty', icon: '🛡️', color: '#8b5cf6' },
  { value: '4.9 / 5', label: 'Customer Rating', icon: '⭐', color: '#f59e0b' },
];

const Hero = () => {
  return (
    <section style={{
      background: '#f8fafc',
      padding: 0,
      margin: 0,
      width: '100%',
      overflow: 'hidden'
    }}>
      <style>{`
        .hero-banner-desktop {
          display: block;
          width: 100%;
          height: auto;
        }
        .hero-banner-mobile {
          display: none;
          width: 100%;
          height: auto;
        }
        .stat-card {
          background: white;
          border-radius: 18px;
          padding: 20px 22px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(37, 99, 235, 0.1);
        }
        @media (max-width: 768px) {
          .hero-banner-desktop {
            display: none;
          }
          .hero-banner-mobile {
            display: block;
          }
          .stat-card {
            padding: 14px 16px;
          }
        }
      `}</style>
      <div>
        <img 
          src="/banner_desktop.png" 
          alt="Premium Subscription Banner" 
          className="hero-banner-desktop" 
        />
        <img 
          src="/banner_mobile.png" 
          alt="Premium Subscription Banner Mobile" 
          className="hero-banner-mobile" 
        />
      </div>

      {/* Eye-Catching Floating Stats Strip */}
      <div className="container" style={{ marginTop: '28px', marginBottom: '8px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}>
          {STATS.map((s, idx) => (
            <div key={idx} className="stat-card">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: `${s.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginTop: '3px' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
