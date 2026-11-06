"use client";
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #090d16 0%, #111827 45%, #1e1b4b 100%)',
      color: '#e2e8f0',
      position: 'relative',
      overflow: 'hidden',
      marginTop: 'auto',
      paddingTop: '72px',
      paddingBottom: '32px'
    }}>
      {/* Top Animated Gradient Border */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #2563eb, #8b5cf6, #ec4899, #3b82f6)',
        backgroundSize: '200% 100%',
        animation: 'footerGradientSlide 6s linear infinite'
      }} />

      {/* Ambient Decorative Glows */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '-80px',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        right: '-80px',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <style>{`
        @keyframes footerGradientSlide {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.92rem;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .footer-link:hover {
          color: #60a5fa;
          transform: translateX(4px);
        }
        .footer-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .footer-social-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '56px'
        }}>
          {/* Column 1: Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px' }}>
                <svg width="46" height="46" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footer-logo-1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6"/>
                      <stop offset="1" stopColor="#8b5cf6"/>
                    </linearGradient>
                    <linearGradient id="footer-logo-2" x1="44" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#60a5fa"/>
                      <stop offset="1" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                  <path d="M22 2L40 12.3V31.7L22 42L4 31.7V12.3L22 2Z" fill="url(#footer-logo-1)" opacity="0.25"/>
                  <path d="M22 7L35 14.5V29.5L22 37L9 29.5V14.5L22 7Z" fill="url(#footer-logo-2)"/>
                  <path d="M22 7L35 14.5V29.5L22 22V7Z" fill="#2563eb" opacity="0.5"/>
                  <path d="M22 22L35 14.5L22 7L9 14.5L22 22Z" fill="#ffffff" opacity="0.25"/>
                  <path d="M22 22L9 14.5V29.5L22 37V22Z" fill="#7c3aed" opacity="0.7"/>
                  <path d="M22 15L23.8 19.2L28 21L23.8 22.8L22 27L20.2 22.8L16 21L20.2 19.2L22 15Z" fill="#ffffff"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
                  <span style={{ background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium</span> Account Store
                </h3>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  #1 Digital Store in BD
                </p>
              </div>
            </Link>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
              Bangladesh&apos;s most trusted platform for genuine AI, Streaming, Design & VPN subscriptions with instant delivery via bKash, Nagad & Rocket.
            </p>

            {/* Live Status Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 600,
              alignSelf: 'flex-start'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              Instant Delivery Active 24/7
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
              <a href="/contact" className="footer-social-btn" title="Support">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Quick Links</h4>
            <Link href="/" className="footer-link">› Home</Link>
            <Link href="/store" className="footer-link">› All Subscriptions</Link>
            <Link href="/orders" className="footer-link">› Track Your Order</Link>
            <Link href="/about" className="footer-link">› About Us</Link>
            <Link href="/contact" className="footer-link">› Contact Support</Link>
          </div>

          {/* Column 3: Top Subscriptions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Trending Plans</h4>
            <Link href="/store/chatgpt" className="footer-link">› ChatGPT Plus</Link>
            <Link href="/store/gemini" className="footer-link">› Google Gemini Advanced</Link>
            <Link href="/store/netflix" className="footer-link">› Netflix 4K UHD</Link>
            <Link href="/store/spotify" className="footer-link">› Spotify Premium</Link>
            <Link href="/store/canva" className="footer-link">› Canva Pro</Link>
            <Link href="/store/youtube" className="footer-link">› YouTube Premium</Link>
          </div>

          {/* Column 4: Legal & Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Legal & Support</h4>
            <Link href="/privacy-policy" className="footer-link">› Privacy Policy</Link>
            <Link href="/terms" className="footer-link">› Terms & Conditions</Link>
            <Link href="/refund-policy" className="footer-link">› Refund & Replacement Policy</Link>

            <div style={{
              marginTop: '8px',
              padding: '14px 16px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Direct Helpline
              </span>
              <span style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>✉️ support@premiumstore.com</span>
              <span style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>💬 WhatsApp: +880 1700-000000</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
            &copy; {new Date().getFullYear()} <strong style={{ color: '#cbd5e1' }}>Premium Account Store</strong>. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              fontSize: '0.8rem',
              color: '#94a3b8',
              background: 'rgba(255,255,255,0.05)',
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              🔒 100% Verified & Warranty Protected
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Back to Top"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
                cursor: 'pointer'
              }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
