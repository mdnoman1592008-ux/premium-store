"use client";
import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Delivery Rate' },
    { number: '24/7', label: 'Helpline Support' },
    { number: '100%', label: 'Genuine Accounts' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px' }}>
      
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        padding: '60px 0',
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <div className="container">
          <div style={{ 
            display: 'inline-block', 
            padding: '6px 14px', 
            background: 'white', 
            color: 'var(--primary)', 
            borderRadius: '50px', 
            fontWeight: 700, 
            fontSize: '0.8rem', 
            marginBottom: '16px',
            border: '1px solid #bfdbfe',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Who We Are
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            About Us
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', marginTop: '10px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            We provide affordable digital subscription accounts with instant activation and premium support.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* About Card */}
        <div className="glass-card" style={{ padding: '48px 40px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.03)', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Our Mission</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' }}>
            In today's digital world, subscription services have become essential for entertainment, productivity, and education. However, managing multiple high-cost premium subscriptions can be challenging. 
          </p>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' }}>
            Our mission is to bridge this gap. We provide genuine, verified premium accounts for platforms like ChatGPT, Spotify, Netflix, YouTube, Canva, and more at a fraction of their original prices, making top-tier digital tools accessible to everyone in Bangladesh.
          </p>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Every account we sell undergoes thorough security checks, and we back all our sales with a 100% active warranty. With support available around the clock, your satisfaction is guaranteed.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {stats.map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '24px 16px', background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '6px' }}>{s.number}</div>
              <div style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', 
          borderRadius: '24px', 
          padding: '40px', 
          textAlign: 'center', 
          border: '1px solid #bfdbfe' 
        }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Ready to Go Premium?</h3>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '28px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            Browse our list of digital applications and choose the perfect subscription package today!
          </p>
          <Link href="/store" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: '12px' }}>
            Browse Store →
          </Link>
        </div>

      </div>
    </div>
  );
}
