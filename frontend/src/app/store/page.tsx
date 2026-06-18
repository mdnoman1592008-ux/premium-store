"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WeAccept } from '../../components/HomeSections';
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
    icon: <img src="/nordvpn_icon.png" alt="NordVPN" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', borderRadius: '20px' }} />,
    desc: 'Fast and secure VPN service.'
  },
  'expressvpn': {
    bg: '#DA291C',
    icon: <svg viewBox="0 0 24 24" fill="white" width="48" height="48"><path d="M11.705 2.349a4.874 4.874 0 00-4.39 2.797L6.033 7.893h14.606c.41 0 .692.308.692.668 0 .359-.282.666-.692.666H2.592L0 14.772h2.824c-.796 1.72-1.002 2.567-1.002 3.26 0 2.105 1.72 3.62 4.416 3.62h8.239c1.771 0 3.337-1.412 3.337-3.03 0-1.411-1.206-2.515-2.772-2.515H5.596c-.873 0-1.284-.59-.924-1.335h11.859c4.004 0 7.469-3.029 7.469-6.802 0-3.183-2.618-5.621-6.16-5.621z"/></svg>,
    desc: 'The VPN that just works.'
  },
  'surfshark': {
    bg: '#139B9E',
    icon: <svg viewBox="0 0 24 24" fill="white" width="48" height="48"><path d="M11.47 0C7.815.2 6.3 2.293 5.872 3.43c-1.615 4.866-3.127 14.325-3.33 15.662-.201 1.31-.228 2.119-.228 2.119 0 .328.026.705.102 1.059.454 1.286 1.792 2.37 4.768 1.287a192.353 192.353 0 0 0 9.533-4.44c1.387-.807 3.227-2.32 4.236-4.312.404-.807.682-1.716.733-2.65v-.452c-.026-2.295-.052-4.692-.204-7.013 0 0-.125-1.488-.2-2.017-.076-.53-.177-.733-.177-.733C20.626.906 19.693.38 18.71.126 18.23.026 17.7.024 17.095 0Zm4.692 4.44h.252c.277 0 .48.2.48.452V6.53c0 .252-.203.455-.48.455h-.252c-1.589 0-2.875 1.26-2.875 2.8v2.498c0 2.976-2.472 5.37-5.498 5.37h-.254c-.277 0-.478-.2-.478-.452v-1.64c0-.253.226-.454.478-.454h.254c1.589 0 2.875-1.262 2.875-2.8V9.81c0-2.977 2.472-5.373 5.498-5.373z"/></svg>,
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
          <div className="app-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ height: '300px', background: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
            ))}
          </div>
        ) : (
          <div className="app-grid">
            {filtered.map((app: any) => {
              const rawKey = app.appId?.toLowerCase() || app.appName?.toLowerCase() || '';
              const appKey = rawKey.replace(/\s+/g, '');
              const appInfo = APP_DATA[appKey] || DEFAULT_APP;
              const inStock = app.inStock !== false; // Default to true if undefined
              return (
                <div
                  key={app._id}
                  className="glass-card app-card"
                  style={{ cursor: 'pointer' }}
                >
                  {/* Stock Status Badge */}
                  <div className="app-card-badge" style={{
                    background: inStock ? '#dcfce7' : '#fee2e2',
                    color: inStock ? '#16a34a' : '#ef4444',
                    border: `1px solid ${inStock ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                    <span className="app-card-badge-text">{inStock ? 'In Stock' : 'Stock Out'}</span>
                  </div>

                  {/* App Icon */}
                  <div className="app-card-icon" style={{ background: typeof appInfo.bg === 'string' ? appInfo.bg : appInfo.bg }}>
                    {appInfo.icon}
                  </div>

                  {/* App Name */}
                  <h3 className="app-card-title">
                    {app.appName}
                  </h3>

                  {/* Stars */}
                  <div className="app-card-rating">
                    ★★★★★
                  </div>

                  {/* Description */}
                  <p className="app-card-desc">
                    {appInfo.desc}
                  </p>

                  {/* View Plans Button */}
                  <Link
                    href={`/store/${app.appId}`}
                    className="app-card-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.06 1.35-2.45h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    <span className="desktop-btn-text">View Plans</span>
                    <span className="mobile-btn-text">Buy Now</span>
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
      <div style={{ paddingBottom: '20px' }}>
        <WeAccept />
      </div>
    </div>
  );
}
