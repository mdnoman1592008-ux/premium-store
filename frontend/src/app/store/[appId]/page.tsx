"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// App data with real brand colors & SVG icons
const APP_DATA: Record<string, { bg: string; icon: React.ReactNode; desc: string }> = {
  'youtube': {
    bg: '#ffffff',
    icon: <img src="/youtube_icon.png" alt="YouTube" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14px', borderRadius: '28px' }} />,
    desc: 'Ad-free videos and YouTube Music included.'
  },
  'spotify': {
    bg: '#ffffff',
    icon: <img src="/spotify_icon.png" alt="Spotify" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14px', borderRadius: '28px' }} />,
    desc: 'Listen to millions of songs ad-free.'
  },
  'chatgpt': {
    bg: '#ffffff',
    icon: <img src="/chatgpt_icon.png" alt="ChatGPT" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', borderRadius: '28px' }} />,
    desc: 'Access to GPT-5.5 and exclusive features.'
  },
  'gemini': {
    bg: '#ffffff',
    icon: <img src="/gemini_icon.png" alt="Gemini" style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0px', borderRadius: '28px' }} />,
    desc: "Google's most powerful AI model."
  },
  'grok': {
    bg: '#000000',
    icon: <img src="/grok_icon.png" alt="Grok" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px', borderRadius: '28px' }} />,
    desc: 'AI assistant by xAI. Smart and powerful.'
  },
  'capcut': {
    bg: '#ffffff',
    icon: <img src="/capcut_icon.png" alt="CapCut" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14px', borderRadius: '28px' }} />,
    desc: 'Unlock all premium editing features.'
  },
  'canva': {
    bg: '#00C4CC',
    icon: <svg viewBox="0 0 24 24" fill="white" width="72" height="72"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/><path d="M12 6a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>,
    desc: 'Premium design tools for everyone.'
  },
  'netflix': {
    bg: '#ffffff',
    icon: <img src="/netflix_icon.png" alt="Netflix" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14px', borderRadius: '28px' }} />,
    desc: 'Watch unlimited movies and TV shows.'
  },
  'disney': {
    bg: '#113CCF',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1.8rem' }}>Disney+</span>,
    desc: 'Stream Disney, Marvel, Star Wars & more.'
  },
  'inshot': {
    bg: '#ffffff',
    icon: <img src="/inshot_icon.png" alt="InShot" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', borderRadius: '28px' }} />,
    desc: 'Professional video editing on mobile.'
  },
  'veo': {
    bg: '#000000',
    icon: <img src="/veo_icon.png" alt="Veo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px', borderRadius: '28px' }} />,
    desc: "Google's AI video generation tool."
  },
  'claude': {
    bg: '#ffffff',
    icon: <img src="/claude_icon.png" alt="Claude" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14px', borderRadius: '28px' }} />,
    desc: 'Anthropic\'s powerful conversational AI.'
  },
  'cursor': {
    bg: '#000000',
    icon: <svg viewBox="0 0 24 24" fill="white" width="72" height="72"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 14.5l10 5 10-5-10-5z"/></svg>,
    desc: 'The AI Code Editor built to make you extraordinarily productive.'
  },
  'figma': {
    bg: '#1e1e1e',
    icon: <svg viewBox="0 0 38 57" width="72" height="72" xmlns="http://www.w3.org/2000/svg"><path fill="#0acf83" d="M19 28.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19z"/><path fill="#a259ff" d="M0 28.5a9.5 9.5 0 0 1 9.5-9.5H19v19H9.5A9.5 9.5 0 0 1 0 28.5z"/><path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z"/><path fill="#ff7262" d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z"/><path fill="#1abcfe" d="M19 19h9.5a9.5 9.5 0 1 1 0 19H19V19z"/></svg>,
    desc: 'The collaborative interface design tool.'
  },
  'nordvpn': {
    bg: '#4559F4',
    icon: <svg viewBox="0 0 24 24" fill="white" width="72" height="72"><path d="M12 1l5.5 10L21 8l2 15H1L3 8l3.5 3L12 1z"/></svg>,
    desc: 'Fast and secure VPN service.'
  },
  'expressvpn': {
    bg: '#DA291C',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '1.8rem', fontStyle: 'italic', padding: '10px' }}>ExpressVPN</span>,
    desc: 'The VPN that just works.'
  },
  'surfshark': {
    bg: '#139B9E',
    icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '2rem', padding: '10px' }}>Surfshark</span>,
    desc: 'Secure your digital life.'
  }
};

const DEFAULT_APP = {
  bg: '#2563eb',
  icon: <span style={{ color: 'white', fontWeight: 900, fontSize: '2.5rem' }}>⭐</span>,
  desc: 'Premium digital subscription service.'
};

// Fallback static products
const FALLBACK_PRODUCTS: Record<string, any> = {
  'youtube': {
    appName: 'YouTube',
    appId: 'youtube',
    category: 'Streaming',
    plans: [
      { planName: 'YouTube Premium', description: 'Experience YouTube without interruptions. Background playback and download features included.', features: ['Ad-free videos', 'Background play', 'YouTube Music included', 'Offline downloads'] }
    ]
  },
  'spotify': {
    appName: 'Spotify',
    appId: 'spotify',
    category: 'Streaming',
    plans: [
      { planName: 'Spotify Premium Individual', description: 'Unlimited ad-free music with offline downloads and high quality sound.', features: ['1 Premium account', 'Ad-free music listening', 'Play offline anywhere', 'On-demand playback'] }
    ]
  },
  'chatgpt': {
    appName: 'ChatGPT',
    appId: 'chatgpt',
    category: 'AI Tools',
    plans: [
      { planName: 'ChatGPT Plus', description: 'Get access to GPT-5.5, DALL-E, advanced data analysis and faster response times.', features: ['Access to GPT-5.5 & GPT-4o', 'Create images with DALL-E', 'Data analysis & web browsing', 'Priority access during peak hours'] },
      { planName: 'ChatGPT Team', description: 'Collaborate with higher message limits and workspace management features.', features: ['Higher usage limits on GPT-5.5', 'Admin console & team management', 'Shared workspace workspace tools', 'Exclude data from model training'] }
    ]
  },
  'gemini': {
    appName: 'Gemini',
    appId: 'gemini',
    category: 'AI Tools',
    plans: [
      { planName: 'Gemini Advanced', description: 'Google\'s most capable AI model, 1.5 Pro, built for highly complex tasks.', features: ['Access to 1.5 Pro model', '1 Million token context window', 'Integration with Gmail & Docs', 'Priority access to new updates'] }
    ]
  },
  'grok': {
    appName: 'Grok',
    appId: 'grok',
    category: 'AI Tools',
    plans: [
      { planName: 'Grok Premium', description: 'Access to Grok AI with real-time news access directly from X platform.', features: ['Real-time news search', 'Fun & rebellious personality modes', 'Available directly inside X app', 'Fast response speed'] }
    ]
  },
  'capcut': {
    appName: 'CapCut',
    appId: 'capcut',
    category: 'Tools',
    plans: [
      { planName: 'CapCut Pro', description: 'Unlock premium templates, transitions, effects and cloud storage.', features: ['No watermarks on export', 'Premium templates & filters', '100GB secure cloud storage', 'Advanced AI features'] }
    ]
  },
  'canva': {
    appName: 'Canva',
    appId: 'canva',
    category: 'Design',
    plans: [
      { planName: 'Canva Pro', description: 'Design like a professional with premium templates, magic resize and brand kit.', features: ['100M+ premium stock photos & videos', 'Magic Resize & BG Remover', 'Brand Kit with fonts & colors', 'Schedule social media posts'] }
    ]
  },
  'netflix': {
    appName: 'Netflix',
    appId: 'netflix',
    category: 'Streaming',
    plans: [
      { planName: 'Netflix Premium Ultra HD', description: 'Watch on 4 screens at the same time in crystal clear 4K HDR resolution.', features: ['4 Screens sharing', 'Ultra HD 4K + HDR quality', 'Unlimited movies & TV shows', 'Download on 6 devices'] }
    ]
  }
};

export default function AppDetailsPage({ params }: { params: { appId: string } }) {
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${params.appId}`)
      .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(data => {
        if (data && !data.message) {
          if (data.appId?.toLowerCase() === 'gemini' && data.plans) {
            let ultraPlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('ultra'));
            if (ultraPlan) {
              ultraPlan.features = [
                "5x higher usage limits than Pro plan | Get usage limits that are 5x higher than the Google AI Pro plan",
                "Higher access to our Pro model | Get the advanced reasoning of our Gemini 3 Pro model for complex maths and coding problems",
                "Access Deep Think and more features | Get access to our most advanced features like Deep Think"
              ];
            }
            let proPlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('pro') || p.planName.toLowerCase().includes('advanced'));
            if (!proPlan && !ultraPlan && data.plans.length > 0) proPlan = data.plans[0];
            if (proPlan) {
              proPlan.features = [
                "4x higher usage limits | Get usage limits that are 4x higher than without a Google AI plan",
                "Access to our Pro model | Get the advanced reasoning of our Gemini 3 Pro model for complex maths and coding problems",
                "Access Deep Research, video generation and more features | Get access to more advanced features like Deep Research and video generation"
              ];
            }
            let plusPlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('plus'));
            if (!plusPlan && data.plans.length > 0) {
              plusPlan = {
                planName: 'Google AI Plus',
                description: 'Get more access to AI tools to boost your productivity and creativity¹',
                durations: data.plans[0].durations,
                features: []
              };
              data.plans.push(plusPlan);
            }
            if (plusPlan) {
              plusPlan.features = [
                "2x higher usage limits | Get usage limits that are 2x higher than without a Google AI plan",
                "Access to our Flash Thinking model | Get the speed and intelligence of our Gemini 3 Flash Thinking model for complex problems"
              ];
            }

            // Sort plans: Plus -> Pro -> Ultra
            if (data.plans && Array.isArray(data.plans)) {
              data.plans.sort((a: any, b: any) => {
                const aName = a.planName.toLowerCase();
                const bName = b.planName.toLowerCase();
                const getOrder = (name: string) => {
                  if (name.includes('plus')) return 1;
                  if (name.includes('pro') || name.includes('advanced')) return 2;
                  if (name.includes('ultra')) return 3;
                  return 4;
                };
                return getOrder(aName) - getOrder(bName);
              });
            }
          } else if (data.appId?.toLowerCase() === 'chatgpt' && data.plans) {
            let plusPlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('plus'));
            if (!plusPlan && data.plans.length > 0) plusPlan = data.plans[0];
            if (plusPlan) {
              plusPlan.features = [
                "icon:sparkles|Advanced models",
                "icon:image|Advanced image creation with Thinking",
                "icon:brain|Expanded memory across chats",
                "icon:bot|Codex coding agent",
                "icon:telescope|Expanded deep research",
                "icon:projects|Projects and custom GPTs"
              ];
            }
            let proPlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('pro'));
            if (proPlan) {
              proPlan.features = [
                "icon:chart|5x or 20x more usage than Plus",
                "icon:sparkles|Frontier Pro model",
                "icon:smilebot|Maximum access to Codex",
                "icon:projectsplus|Maximum deep research",
                "icon:chatloop|Unlimited core chat",
                "icon:imagesparkle|Unlimited and faster image creation"
              ];
            }
          } else if (data.appId?.toLowerCase() === 'spotify' && data.plans) {
            data.plans.forEach((plan: any) => {
              plan.features = [
                "🎧 Ad-free music listening",
                "⬇️ Download songs",
                "🔀 Play songs in any order",
                "🔊 High quality audio",
                "👥 Listen with friends in real time",
                "📋 Organize listening queue"
              ];
            });
          } else if (data.appId?.toLowerCase() === 'claude' && data.plans) {
            let proPlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('pro'));
            if (!proPlan && data.plans.length > 0) proPlan = data.plans[0];
            if (proPlan) {
              proPlan.description = 'Research, code, and organize';
              proPlan.features = [
                "icon:claudemark|Claude Code directly in your codebase",
                "icon:claudemark|Power through tasks with Cowork",
                "icon:claudemark|Higher usage limits",
                "icon:claudemark|Access to more Claude models",
                "icon:claudemark|Memory that carries across conversations"
              ];
            }
            let maxPlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('max'));
            if (!maxPlan && data.plans.length > 1) maxPlan = data.plans[1];
            if (maxPlan) {
              maxPlan.description = 'Higher limits, priority access';
              maxPlan.features = [
                "icon:claudemark|Up to 20x more usage than Pro*",
                "icon:claudemark|Recommended for Claude Code & Cowork",
                "icon:claudemark|Early access to advanced Claude features",
                "icon:claudemark|Higher output limits for all tasks",
                "icon:claudemark|Priority access at high traffic times"
              ];
            }
          } else if (data.appId?.toLowerCase() === 'grok' && data.plans) {
            let litePlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('lite'));
            if (!litePlan && data.plans.length > 0) {
              litePlan = {
                planName: 'SuperGrok Lite',
                description: 'Essential access to Grok AI features',
                durations: data.plans[0].durations,
                features: []
              };
              data.plans.unshift(litePlan); // Make it the first plan
            }
            if (litePlan) {
              litePlan.features = [
                "icon:grokrocket|2x longer conversations in Chat",
                "icon:grokbrain|1x AI agent on Expert mode",
                "icon:grokmedia|Try out AI image & video creation",
                "icon:grokarrow|Increased limits at regular speed"
              ];
            }
            let grokPlan = data.plans.find((p: any) => p.planName.toLowerCase() === 'supergrok' || (p.planName.toLowerCase().includes('grok') && !p.planName.toLowerCase().includes('lite') && !p.planName.toLowerCase().includes('heavy')));
            if (!grokPlan && data.plans.length > 1) grokPlan = data.plans[1];
            if (grokPlan) {
              grokPlan.features = [
                "icon:grokcode|Access to Grok Build",
                "icon:grokrocket|5x longer conversations in Chat",
                "icon:grokmedia|More usage, at lightning-fast speed | With HD 720p, 30-second video",
                "icon:grokfile|Upload more files for smarter help",
                "icon:groklightning|Lightning-fast replies"
              ];
            }
            let heavyPlan = data.plans.find((p: any) => p.planName.toLowerCase().includes('heavy'));
            if (heavyPlan) {
              heavyPlan.features = [
                "icon:groklogo|Everything in SuperGrok",
                "icon:grokbrain|Solve extremely hard problems",
                "icon:grokrocket|Highest usage limits",
                "icon:grokagents|16x AI agents on Expert mode | Large team of AI agents collaborating to get you the best possible answers",
                "icon:grokheart|Dedicated support & early access"
              ];
            }
          }
          setApp(data);
        } else {
          // fallback to client static data if not found in backend response
          setApp(FALLBACK_PRODUCTS[params.appId.toLowerCase()]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setApp(FALLBACK_PRODUCTS[params.appId.toLowerCase()]);
        setLoading(false);
      });
  }, [params.appId]);

  const handleSelectPlan = (plan: any) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      localStorage.setItem('checkout_app', app.appName);
      localStorage.setItem('checkout_plan', plan.planName);
      
      if (!token) {
        router.push('/login?redirect=/checkout/duration');
        return;
      }
    }
    router.push('/checkout/duration');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div style={{ height: '180px', background: '#e2e8f0', borderRadius: '24px', marginBottom: '40px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ height: '400px', background: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#0f172a' }}>Subscription Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>The digital service you are looking for does not exist or has been removed.</p>
        <Link href="/store" className="btn-primary" style={{ padding: '12px 32px' }}>
          Back to Store
        </Link>
      </div>
    );
  }

  const appKey = app.appId?.toLowerCase() || app.appName?.toLowerCase();
  const appInfo = APP_DATA[appKey] || DEFAULT_APP;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      
      {/* Premium Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        padding: '60px 0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '130px', 
            height: '130px', 
            borderRadius: '32px', 
            background: appInfo.bg, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {appInfo.icon}
          </div>
          {appKey === 'chatgpt' ? (
            <div>
              <div style={{ 
                display: 'inline-block', 
                padding: '6px 14px', 
                background: 'white', 
                color: 'var(--primary)', 
                borderRadius: '50px', 
                fontWeight: 700, 
                fontSize: '0.8rem', 
                marginBottom: '12px',
                border: '1px solid #bfdbfe',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {app.category || 'AI Tools'}
              </div>
              
              {/* Custom Image Banner for ChatGPT */}
              <div style={{ marginTop: '16px', width: '100%', maxWidth: '850px' }}>
                <img 
                  src="/chatgpt_banner.png" 
                  alt="ChatGPT Premium Subscription Bangladesh" 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: '16px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    display: 'block'
                  }} 
                />
              </div>
            </div>
          ) : (
            <div>
              <div style={{ 
                display: 'inline-block', 
                padding: '6px 14px', 
                background: 'white', 
                color: 'var(--primary)', 
                borderRadius: '50px', 
                fontWeight: 700, 
                fontSize: '0.8rem', 
                marginBottom: '12px',
                border: '1px solid #bfdbfe',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {app.category || 'Subscription'}
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
                {app.appName} Premium
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '8px', maxWidth: '600px', lineHeight: 1.5 }}>
                {appInfo.desc} Select a premium plan below to continue.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Plans Section */}
      <div className="container" style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '32px', textAlign: 'center' }}>
          Available Subscription Plans
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: app.plans.length === 1 ? 'minmax(320px, 450px)' : (app.appId?.toLowerCase() === 'spotify' ? 'repeat(auto-fit, minmax(380px, 1fr))' : 'repeat(auto-fit, minmax(320px, 1fr))'), 
          gap: '30px',
          justifyContent: 'center',
          maxWidth: app.plans.length === 1 ? '500px' : (app.appId?.toLowerCase() === 'spotify' ? '1200px' : '1000px'),
          margin: '0 auto'
        }}>
          {app.plans.map((plan: any, i: number) => (
            <div 
              key={i} 
              style={{ 
                background: 'white', 
                borderRadius: '24px', 
                padding: '40px 32px', 
                border: '1.5px solid rgba(59, 130, 246, 0.4)',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.15)',
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.3)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.7)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.15)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.4)';
              }}
            >
              {/* RECOMMENDED badge */}
              {i === 0 && (
                <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Recommended
                </div>
              )}

              <h3 style={{ fontSize: '1.8rem', fontWeight: 500, color: '#0f172a', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', letterSpacing: '-0.5px' }}>
                {(() => {
                  const words = plan.planName.split(' ');
                  if (words.length > 1) {
                    const lastWord = words.pop();
                    return (
                      <>
                        <span>{words.join(' ')}</span>
                        <span style={{ color: '#3b82f6' }}>{lastWord}</span>
                      </>
                    );
                  }
                  return plan.planName;
                })()}
              </h3>
              
              <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: app.appId?.toLowerCase() === 'gemini' ? '16px' : '28px', lineHeight: 1.5, minHeight: app.appId?.toLowerCase() === 'gemini' ? 'auto' : '44px' }}>
                {plan.description}
              </p>

              {/* Special Pill for Gemini */}
              {app.appId?.toLowerCase() === 'gemini' && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 14px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 500, color: '#0f172a', marginBottom: '28px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                  {plan.planName.toLowerCase().includes('ultra') ? '20 TB storage²' : plan.planName.toLowerCase().includes('plus') ? '400 GB storage²' : '5 TB storage²'}
                </div>
              )}

              {/* Features List */}
              <div style={{ flex: 1, paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                {app.appId?.toLowerCase() === 'claude' && plan.planName.toLowerCase().includes('pro') ? (
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#3f3f46', marginBottom: '12px', letterSpacing: '0.2px' }}>
                    Everything in Free and:
                  </h4>
                ) : app.appId?.toLowerCase() === 'claude' && plan.planName.toLowerCase().includes('max') ? (
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#3f3f46', marginBottom: '12px', letterSpacing: '0.2px' }}>
                    Everything in Pro, plus:
                  </h4>
                ) : app.appId?.toLowerCase() === 'chatgpt' && plan.planName.toLowerCase().includes('pro') ? (
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px', letterSpacing: '0.2px' }}>
                    Everything in Plus and:
                  </h4>
                ) : app.appId?.toLowerCase() === 'gemini' ? (
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" fill="url(#sparkle-gradient)"/>
                      <defs>
                        <linearGradient id="sparkle-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#fbbc04"/>
                          <stop offset="33%" stopColor="#ea4335"/>
                          <stop offset="66%" stopColor="#4285f4"/>
                          <stop offset="100%" stopColor="#34a853"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    Gemini
                  </h4>
                ) : (
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    What is included:
                  </h4>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {plan.features && plan.features.map((feature: string, j: number) => {
              const hasIcon = feature.startsWith('icon:');
              let iconName = null;
              let title = '';
              let desc: string | null = null;
              
              if (hasIcon) {
                const parts = feature.split('|');
                iconName = parts[0].replace('icon:', '');
                title = parts[1];
                desc = parts.length > 2 ? parts.slice(2).join(' | ') : null;
              } else {
                const parts = feature.split(' | ');
                title = parts[0];
                desc = parts.length > 1 ? parts.slice(1).join(' | ') : null;
              }

              return (
                <li key={j} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: hasIcon ? '14px' : '12px', 
                  fontSize: '0.95rem', 
                  color: '#475569',
                  paddingBottom: app.appId?.toLowerCase() === 'spotify' ? '12px' : '0'
                }}>
                  {iconName === 'sparkles' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/></svg>}
                  {iconName === 'image' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
                  {iconName === 'brain' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><path d="M9.5 2c-1.38 0-2.5 1.12-2.5 2.5 0 .42.1.81.29 1.16C5.55 6.07 4 7.66 4 9.5 4 11.23 4.96 12.72 6.36 13.5c-.23.47-.36 1-.36 1.5 0 1.93 1.57 3.5 3.5 3.5.4 0 .78-.07 1.14-.19.64 1.25 1.95 2.19 3.36 2.19 1.41 0 2.72-.94 3.36-2.19.36.12.74.19 1.14.19 1.93 0 3.5-1.57 3.5-3.5 0-.5-.13-1.03-.36-1.5C23.04 12.72 24 11.23 24 9.5c0-1.84-1.55-3.43-3.29-3.84.19-.35.29-.74.29-1.16 0-1.38-1.12-2.5-2.5-2.5z"/></svg>}
                  {iconName === 'bot' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>}
                  {iconName === 'telescope' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><path d="M22 12l-4-4-6 6 4 4 6-6zm-7-1l-3-3m-1 3l-3 3c-.4.4-1 .4-1.4 0l-1.6-1.6c-.4-.4-.4-1 0-1.4l3-3m-1 5l-2.5 2.5a2 2 0 102.8 2.8l2.5-2.5" /></svg>}
                  {iconName === 'projects' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14l6 6m0-6l-6 6"/></svg>}
                  {iconName === 'chart' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
                  {iconName === 'smilebot' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><circle cx="12" cy="12" r="10"/><path d="M8 10a2 2 0 0 1 2-2M14 10a2 2 0 0 1 2-2M8 16h8"/></svg>}
                  {iconName === 'projectsplus' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M16 14v8M12 18h8"/></svg>}
                  {iconName === 'chatloop' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M8 10h8"/></svg>}
                  {iconName === 'imagesparkle' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#1f2937' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/><path d="M21 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" strokeWidth="1.5"/></svg>}
                  {iconName === 'claudemark' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="5 12 10 17 20 7"/></svg>}
                  {iconName === 'grokrocket' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a5.4 5.4 0 0 0 1-1.5L18.4 8.6c.77-.77 1.26-1.85 1.55-2.9.23-1.04.05-2.02-.38-2.67-.43-.65-1.25-1.07-2.3-1.12-1.04-.04-2.14.33-3 1.18L5.3 12.1a5.4 5.4 0 0 0-1.5 1l-.8.9z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                    </div>
                  )}
                  {iconName === 'grokbrain' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><path d="M9.5 2c-1.38 0-2.5 1.12-2.5 2.5 0 .42.1.81.29 1.16C5.55 6.07 4 7.66 4 9.5 4 11.23 4.96 12.72 6.36 13.5c-.23.47-.36 1-.36 1.5 0 1.93 1.57 3.5 3.5 3.5.4 0 .78-.07 1.14-.19.64 1.25 1.95 2.19 3.36 2.19 1.41 0 2.72-.94 3.36-2.19.36.12.74.19 1.14.19 1.93 0 3.5-1.57 3.5-3.5 0-.5-.13-1.03-.36-1.5C23.04 12.72 24 11.23 24 9.5c0-1.84-1.55-3.43-3.29-3.84.19-.35.29-.74.29-1.16 0-1.38-1.12-2.5-2.5-2.5z"/><path d="M12 3v18" /></svg>
                    </div>
                  )}
                  {iconName === 'grokmedia' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><path d="M18 2v4M20 4h-4" /></svg>
                    </div>
                  )}
                  {iconName === 'grokarrow' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 8v8"/></svg>
                    </div>
                  )}
                  {iconName === 'grokcode' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    </div>
                  )}
                  {iconName === 'grokfile' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                    </div>
                  )}
                  {iconName === 'groklightning' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                  )}
                  {iconName === 'groklogo' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><circle cx="12" cy="12" r="8"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
                    </div>
                  )}
                  {iconName === 'grokagents' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><circle cx="9" cy="12" r="7"/><circle cx="17" cy="12" r="5"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="11" cy="12" r="1" fill="currentColor"/></svg>
                    </div>
                  )}
                  {iconName === 'grokheart' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', flexShrink: 0, marginTop: '-4px', background: '#ffffff' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </div>
                  )}
                  {!hasIcon && app.appId?.toLowerCase() !== 'spotify' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={app.appId?.toLowerCase() === 'gemini' ? '#334155' : 'var(--primary)'} strokeWidth={app.appId?.toLowerCase() === 'gemini' ? '2.5' : '3'} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <span style={{ 
                      fontWeight: desc ? 600 : (app.appId?.toLowerCase() === 'spotify' ? 600 : (app.appId?.toLowerCase() === 'grok' ? 600 : 400)), 
                      color: app.appId?.toLowerCase() === 'spotify' ? '#1e293b' : '#0f172a',
                      display: 'inline-block',
                      width: 'fit-content',
                      paddingBottom: app.appId?.toLowerCase() === 'spotify' ? '2px' : '0'
                    }}>{title}</span>
                    {desc && <span style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{desc}</span>}
                  </div>
                </li>
              );
            })}
                </ul>
              </div>

              {/* CTA Action */}
              <button 
                onClick={() => handleSelectPlan(plan)} 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(37,99,235,0.15)'
                }}
              >
                Choose {plan.planName}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
