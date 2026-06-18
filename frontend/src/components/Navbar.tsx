"use client";
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const activeEl = containerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Load user login state
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        setUserToken(localStorage.getItem('userToken'));
        setUserPhone(localStorage.getItem('userPhone'));
      }
    };
    checkAuth();
    // Listen to changes in localStorage
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userPhone');
    }
    setUserToken(null);
    setUserPhone(null);
    router.push('/');
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '16px 0', background: 'white', borderBottom: '1px solid #f1f5f9' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem'
          }}>
            P
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-dark)', fontWeight: 700 }}>Premium Account Store</h1>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-light)' }}>Premium Digital Accounts</p>
          </div>
        </Link>
        
        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* Menu Links */}
        <div 
          ref={containerRef}
          className={isMobileMenuOpen ? 'mobile-nav-menu' : 'mobile-hidden'}
          style={{ position: 'relative', display: 'flex', gap: '24px', alignItems: 'center', fontWeight: '500', fontSize: '0.9rem' }}
        >
          {[
            { name: 'Home', href: '/' },
            { name: 'Store', href: '/store' },
            { name: 'My Orders', href: '/orders' },
            { name: 'Contact', href: '/contact' },
            { name: 'About Us', href: '/about' },
          ].map(link => {
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                data-active={isActive ? "true" : "false"}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: '8px 0',
                  color: isActive ? 'var(--primary)' : 'var(--text-dark)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                {link.name}
              </Link>
            );
          })}
          {/* Sliding Underline Indicator (hidden on mobile) */}
          <span
            className="mobile-hidden"
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              width: `${indicatorStyle.width}px`,
              height: '3px',
              background: 'var(--primary)',
              borderRadius: '10px',
              transform: `translateX(${indicatorStyle.left}px)`,
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
              opacity: indicatorStyle.opacity,
              pointerEvents: 'none',
            }}
          />
        </div>
        
        {/* Authentication Actions */}
        <div className={isMobileMenuOpen ? 'mobile-nav-menu' : 'mobile-hidden'} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {userToken ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px' }}>
                👤 {userPhone}
              </span>
              <button 
                onClick={handleLogout} 
                className="btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem', border: '1.5px solid #cbd5e1', background: 'white', color: '#374151', borderRadius: '8px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link 
                href="/login" 
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  color: 'var(--primary)', 
                  border: '1.5px solid var(--primary)', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  background: 'transparent'
                }}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="btn-primary"
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  borderRadius: '8px', 
                  textAlign: 'center'
                }}
              >
                Sign Up
              </Link>
            </div>
          )}


        </div>

      </div>
    </nav>
  );
};

export default Navbar;
