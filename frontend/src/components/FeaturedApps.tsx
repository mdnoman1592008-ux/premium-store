"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
  'veo': {
    bg: '#000000',
    icon: <img src="/veo_icon.png" alt="Veo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', borderRadius: '20px' }} />,
    desc: "Google's AI video generation tool."
  },
  'disney': {
    bg: '#113CCF',
    icon: <svg viewBox="0 0 24 24" fill="white" width="48" height="48"><path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/></svg>,
    desc: 'Stream Disney, Marvel, Star Wars & more.'
  },
  'claude': {
    bg: '#ffffff',
    icon: <img src="/claude_icon.png" alt="Claude" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', borderRadius: '20px' }} />,
    desc: 'Anthropic\'s powerful conversational AI.'
  },
  'inshot': {
    bg: '#ffffff',
    icon: <img src="/inshot_icon.png" alt="InShot" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', borderRadius: '20px' }} />,
    desc: 'Professional video editing on mobile.'
  }
};

const DEFAULT_APP = {
  bg: '#2563eb',
  icon: <svg viewBox="0 0 24 24" fill="white" width="48" height="48"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>,
  desc: 'Premium digital subscription service.'
};

const FeaturedApps = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        setApps([
          { _id: '1', appName: 'YouTube', appId: 'youtube', category: 'Streaming' },
          { _id: '2', appName: 'Spotify', appId: 'spotify', category: 'Streaming' },
          { _id: '3', appName: 'ChatGPT', appId: 'chatgpt', category: 'AI Tools' },
          { _id: '4', appName: 'Gemini', appId: 'gemini', category: 'AI Tools' },
          { _id: '5', appName: 'Grok', appId: 'grok', category: 'AI Tools' },
          { _id: '6', appName: 'CapCut', appId: 'capcut', category: 'Tools' },
          { _id: '7', appName: 'Canva', appId: 'canva', category: 'Design' },
          { _id: '8', appName: 'Netflix', appId: 'netflix', category: 'Streaming' },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="mobile-p-sm" style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0' }}>
            Top Selling Accounts
          </h2>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ height: '300px', background: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : (
          <>
            <div className="app-grid">
              {apps.slice(0, 8).map((app: any) => {
                const key = (app.appId || app.appName || '').toLowerCase();
                const info = APP_DATA[key] || DEFAULT_APP;
                const inStock = app.inStock !== false; // Default to true if undefined
                return (
                  <div
                    key={app._id}
                    className="glass-card app-card"
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

                    <div className="app-card-icon" style={{ background: info.bg }}>
                      {info.icon}
                    </div>
                    <h3 className="app-card-title">
                      {app.appName}
                    </h3>
                    <div className="app-card-rating">
                      ★★★★★
                    </div>
                    <p className="app-card-desc">
                      {info.desc}
                    </p>
                    <Link
                      href={`/store/${app.appId}`}
                      className="app-card-btn"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.06 1.35-2.45h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                      <span className="desktop-btn-text">Buy Subscription</span>
                      <span className="mobile-btn-text">Buy Now</span>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/store" className="btn-primary" style={{ padding: '14px 40px', fontSize: '1rem', borderRadius: '12px' }}>
                View All Apps →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedApps;
