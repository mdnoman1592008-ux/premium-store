"use client";
import React from 'react';
import Link from 'next/link';

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
        @media (max-width: 768px) {
          .hero-banner-desktop {
            display: none;
          }
          .hero-banner-mobile {
            display: block;
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

      {/* Popular Apps label */}
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Popular Apps</h3>
      </div>
    </section>
  );
};

export default Hero;
