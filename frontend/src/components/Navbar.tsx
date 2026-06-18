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
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('userToken');
        setUserToken(token);
        setUserPhone(localStorage.getItem('userPhone'));

        if (token) {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setUserProfile(data);
            }
          } catch (err) {
            console.error('Failed to fetch profile', err);
          }
        } else {
          setUserProfile(null);
        }
      }
    };
    checkAuth();
    // Listen to changes in localStorage
    window.addEventListener('storage', checkAuth);
    // Custom event to trigger re-fetch from profile page
    window.addEventListener('profileUpdate', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('profileUpdate', checkAuth);
    };
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px' }}>
            <svg width="46" height="46" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-grad1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
                <linearGradient id="logo-grad2" x1="44" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa"/>
                  <stop offset="1" stopColor="#a855f7"/>
                </linearGradient>
                <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d="M22 2L40 12.3V31.7L22 42L4 31.7V12.3L22 2Z" fill="url(#logo-grad1)" opacity="0.15"/>
              <path d="M22 7L35 14.5V29.5L22 37L9 29.5V14.5L22 7Z" fill="url(#logo-grad2)"/>
              <path d="M22 7L35 14.5V29.5L22 22V7Z" fill="#2563eb" opacity="0.5"/>
              <path d="M22 22L35 14.5L22 7L9 14.5L22 22Z" fill="#ffffff" opacity="0.25"/>
              <path d="M22 22L9 14.5V29.5L22 37V22Z" fill="#7c3aed" opacity="0.7"/>
              <path d="M22 15L23.8 19.2L28 21L23.8 22.8L22 27L20.2 22.8L16 21L20.2 19.2L22 15Z" fill="#ffffff" filter="url(#logo-glow)"/>
              <path d="M22 15L23.8 19.2L28 21L23.8 22.8L22 27L20.2 22.8L16 21L20.2 19.2L22 15Z" fill="#ffffff"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              <span style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium</span>
              <span style={{ color: '#0f172a' }}> Account Store</span>
            </h1>
            <p style={{ fontSize: '0.75rem', margin: 0, color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '2px' }}>
              Digital Subscriptions
            </p>
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

        <div className={isMobileMenuOpen ? 'mobile-nav-menu' : 'desktop-nav-menu'}>
          {/* Menu Links */}
          <div 
            ref={containerRef}
            className="nav-links-container"
            style={{ position: 'relative', display: 'flex', gap: '24px', alignItems: 'center', fontWeight: '500', fontSize: '0.9rem' }}
          >
            {[
              { name: 'Home', href: '/' },
              { name: 'Store', href: '/store' },
              { name: 'History', href: '/orders' },
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
                    textAlign: 'left',
                    whiteSpace: 'nowrap'
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
          <div className="nav-auth-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {userToken ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link href="/profile" title="My Profile" style={{ display: 'flex', alignItems: 'center' }}>
                  {userProfile?.photo ? (
                    <img 
                      src={userProfile.photo.startsWith('http') ? userProfile.photo : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${userProfile.photo}`} 
                      alt="Profile" 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
                    />
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </Link>
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

      </div>
    </nav>
  );
};

export default Navbar;
