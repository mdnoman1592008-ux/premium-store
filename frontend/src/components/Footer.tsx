"use client";
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{ background: 'white', borderTop: '1px solid #f1f5f9', padding: '60px 0 20px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem'
              }}>
                P
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-dark)', fontWeight: 700 }}>Premium Account Store</h3>
                <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-light)' }}>At Affordable Prices</p>
              </div>
            </Link>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {/* Fake Social Icons */}
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>f</a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>t</a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>in</a>
            </div>
          </div>

          {/* Legal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Legal</h4>
            <Link href="/privacy-policy" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>Terms & Conditions</Link>
            <Link href="/refund-policy" style={{ color: '#64748b', textDecoration: 'none' }}>Refund Policy</Link>
          </div>

          {/* Contact Us */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Contact Us</h4>
            <p style={{ color: '#64748b', margin: 0 }}>Email: support@premiumstore.com</p>
            <p style={{ color: '#64748b', margin: 0 }}>WhatsApp: +880 1234-567890</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>&copy; {new Date().getFullYear()} Premium Account Store. All rights reserved.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
