"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// App data with real brand colors & SVG icons
const APP_DATA: Record<string, { bg: string; icon: React.ReactNode; desc: string }> = {
  'youtube': {
    bg: '#ffffff',
    icon: <img src="/youtube_icon.png" alt="YouTube" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', borderRadius: '20px' }} />,
    desc: 'Ad-free videos and YouTube Music included.'
  },
  'spotify': {
    bg: '#ffffff',
    icon: <img src="/spotify_icon.png" alt="Spotify" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', borderRadius: '20px' }} />,
    desc: 'Listen to millions of songs ad-free.'
  },
  'chatgpt': {
    bg: '#ffffff',
    icon: <img src="/chatgpt_icon.png" alt="ChatGPT" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', borderRadius: '20px' }} />,
    desc: 'Access to GPT-4 and exclusive features.'
  },
  'gemini': {
    bg: '#ffffff',
    icon: <img src="/gemini_icon.png" alt="Gemini" style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0px', borderRadius: '20px' }} />,
    desc: "Google's most powerful AI model."
  },
  'grok': {
    bg: '#000000',
    icon: <img src="/grok_icon.png" alt="Grok" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', borderRadius: '20px' }} />,
    desc: 'AI assistant by xAI. Smart and powerful.'
  },
  'capcut': {
    bg: '#ffffff',
    icon: <img src="/capcut_icon.png" alt="CapCut" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', borderRadius: '20px' }} />,
    desc: 'Unlock all premium editing features.'
  },
  'canva': {
    bg: '#00C4CC',
    icon: <svg viewBox="0 0 24 24" fill="white" width="48" height="48"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>,
    desc: 'Premium design tools for everyone.'
  },
  'netflix': {
    bg: '#ffffff',
    icon: <img src="/netflix_icon.png" alt="Netflix" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', borderRadius: '20px' }} />,
    desc: 'Watch unlimited movies and TV shows.'
  },
  'disney': {
    bg: '#113CCF',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>Disney+</span>,
    desc: 'Stream Disney, Marvel, Star Wars & more.'
  },
  'inshot': {
    bg: '#ffffff',
    icon: <img src="/inshot_icon.png" alt="InShot" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', borderRadius: '20px' }} />,
    desc: 'Professional video editing on mobile.'
  },
  'claude': {
    bg: '#ffffff',
    icon: <img src="/claude_icon.png" alt="Claude" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', borderRadius: '20px' }} />,
    desc: 'Anthropic\'s powerful conversational AI.'
  },
  'cursor': {
    bg: '#000000',
    icon: <svg viewBox="0 0 24 24" fill="white" width="48" height="48"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 14.5l10 5 10-5-10-5z"/></svg>,
    desc: 'The AI Code Editor built to make you extraordinarily productive.'
  },
  'figma': {
    bg: '#1e1e1e',
    icon: <svg viewBox="0 0 38 57" width="48" height="48" xmlns="http://www.w3.org/2000/svg"><path fill="#0acf83" d="M19 28.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19z"/><path fill="#a259ff" d="M0 28.5a9.5 9.5 0 0 1 9.5-9.5H19v19H9.5A9.5 9.5 0 0 1 0 28.5z"/><path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z"/><path fill="#ff7262" d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z"/><path fill="#1abcfe" d="M19 19h9.5a9.5 9.5 0 1 1 0 19H19V19z"/></svg>,
    desc: 'The collaborative interface design tool.'
  },
  'nordvpn': {
    bg: '#4559F4',
    icon: <svg viewBox="0 0 24 24" fill="white" width="48" height="48"><path d="M12 1l5.5 10L21 8l2 15H1L3 8l3.5 3L12 1z"/></svg>,
    desc: 'Fast and secure VPN service.'
  },
  'expressvpn': {
    bg: '#DA291C',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', fontStyle: 'italic', padding: '10px' }}>ExpressVPN</span>,
    desc: 'The VPN that just works.'
  },
  'surfshark': {
    bg: '#139B9E',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1.4rem', padding: '10px' }}>Surfshark</span>,
    desc: 'Secure your digital life.'
  }
};

const DEFAULT_APP = {
  bg: '#2563eb',
  icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1.8rem' }}>⭐</span>,
  desc: 'Premium digital subscription service.'
};

export default function StorePage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setApps(data);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      })
      .catch(() => {
        // fallback static data if backend not running
        setApps([
          { _id: '5', appName: 'Grok', appId: 'grok', category: 'AI Tools' },
          { _id: 'cursor_1', appName: 'Cursor AI', appId: 'cursor', category: 'AI Tools' },
          { _id: 'figma_1', appName: 'Figma', appId: 'figma', category: 'Design' },
          { _id: 'nordvpn_1', appName: 'NordVPN', appId: 'nordvpn', category: 'VPN' },
          { _id: 'expressvpn_1', appName: 'ExpressVPN', appId: 'expressvpn', category: 'VPN' },
          { _id: 'surfshark_1', appName: 'Surfshark VPN', appId: 'surfshark', category: 'VPN' },
          { _id: '6', appName: 'CapCut', appId: 'capcut', category: 'Tools' },
          { _id: '7', appName: 'Canva', appId: 'canva', category: 'Design' },
          { _id: '8', appName: 'Netflix', appId: 'netflix', category: 'Streaming' },
          { _id: '9', appName: 'Disney+', appId: 'disney', category: 'Streaming' },
          { _id: '10', appName: 'InShot', appId: 'inshot', category: 'Video Editing' },
          { _id: '11', appName: 'Claude', appId: 'claude', category: 'AI Tools' },
        ]);
        setLoading(false);
      });
  }, []);

  const categories = ['all', 'AI Tools', 'Streaming', 'Design', 'Tools', 'VPN'];
  const filtered = apps.filter((app: any) => {
    const matchesCategory = filter === 'all' || app.category === filter;
    const matchesSearch = app.appName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Our <span style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Premium</span> Store
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Choose from the most popular digital services
        </p>
      </div>

      {/* Search Bar */}
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
          <input
            type="text"
            placeholder="Search premium apps..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px 16px 48px',
              borderRadius: '50px',
              border: '1.5px solid #e2e8f0',
              outline: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#0f172a',
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              transition: 'all 0.25s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.08)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
            }}
          />
          {/* Search Icon */}
          <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '48px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '10px 24px',
              borderRadius: '50px',
              border: '1px solid',
              borderColor: filter === cat ? 'var(--primary)' : '#e2e8f0',
              background: filter === cat ? 'var(--primary)' : 'white',
              color: filter === cat ? 'white' : '#64748b',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: cat === 'all' ? 'capitalize' : 'none',
            }}
          >
            {cat === 'all' ? 'All Apps' : cat}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="container" style={{ paddingBottom: '80px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ height: '300px', background: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {filtered.map((app: any) => {
              const appKey = app.appId?.toLowerCase() || app.appName?.toLowerCase();
              const appInfo = APP_DATA[appKey] || DEFAULT_APP;
              const inStock = app.inStock !== false; // Default to true if undefined
              return (
                <div
                  key={app._id}
                  className="glass-card"
                  style={{
                    position: 'relative',
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {/* Stock Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '6px 12px',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: inStock ? '#dcfce7' : '#fee2e2',
                    color: inStock ? '#16a34a' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: `1px solid ${inStock ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                    {inStock ? 'In Stock' : 'Stock Out'}
                  </div>

                  {/* App Icon */}
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '24px',
                    background: typeof appInfo.bg === 'string' ? appInfo.bg : appInfo.bg,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    marginTop: '8px'
                  }}>
                    {appInfo.icon}
                  </div>

                  {/* App Name */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
                    {app.appName}
                  </h3>

                  {/* Stars */}
                  <div style={{ color: '#FBBF24', fontSize: '1.1rem', marginBottom: '12px', letterSpacing: '2px' }}>
                    ★★★★★
                  </div>

                  {/* Description */}
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5', flex: 1 }}>
                    {appInfo.desc}
                  </p>

                  {/* View Plans Button */}
                  <Link
                    href={`/store/${app.appId}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      width: '100%', padding: '14px 20px', textAlign: 'center',
                      borderRadius: '50px',
                      background: 'linear-gradient(90deg, #a855f7 0%, #3b82f6 100%)',
                      color: 'white', fontWeight: 700, fontSize: '0.95rem',
                      transition: 'all 0.25s ease', textDecoration: 'none',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
                      border: 'none',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.35)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.06 1.35-2.45h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    Buy Subscription
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <p style={{ fontSize: '1.2rem' }}>No apps found in this category.</p>
          </div>
        )}
      </div>

      {/* We Accept Banner */}
      <div className="container" style={{ paddingBottom: '60px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '28px 40px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>We Accept</h3>
            <p style={{ fontSize: '0.85rem', margin: 0, color: '#64748b' }}>100% Secure Payment Methods</p>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { name: 'bKash', color: '#E2136E' },
              { name: 'Nagad', color: '#F05A28' },
              { name: 'Rocket', color: '#8B2FC9' },
              { name: 'Upay', color: '#00A651' },
              { name: 'Cellfin', color: '#005BAA' },
            ].map(m => (
              <span key={m.name} style={{ fontWeight: 700, color: m.color, fontSize: '1rem' }}>{m.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
