"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export const WeAccept = () => {
  const methods = [
    { name: 'bKash', img: '/bkash_logo.png' },
    { name: 'Nagad', img: '/nagad_logo.png' },
    { name: 'Rocket', img: '/rocket_logo.png' },
    { name: 'Upay', img: '/upay_logo.png' },
    { name: 'Cellfin', img: '/cellfin_logo.png' },
    { name: 'VISA', isVisa: true },
    { name: 'Mastercard', isMastercard: true }
  ];

  return (
    <section className="container" style={{ padding: '10px 0 70px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        borderRadius: '28px',
        padding: '44px 36px',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.14)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 14px',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            color: '#93c5fd',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            💳 100% Secure Checkout
          </span>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff', letterSpacing: '-0.5px' }}>
            We Accept All Local &amp; Card Payments
          </h3>
          <p style={{ fontSize: '1rem', margin: 0, color: '#94a3b8' }}>
            Instant verification with bKash, Nagad, Rocket, Upay &amp; Cellfin
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
          {methods.map(m => (
            <div
              key={m.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                borderRadius: '16px',
                width: '132px',
                height: '78px',
                padding: '14px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
                transition: 'transform 0.25s ease',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
            >
              {m.isVisa ? (
                <span style={{ fontWeight: 900, color: '#1A1F71', fontSize: '2rem', fontStyle: 'italic', letterSpacing: '-1px' }}>VISA</span>
              ) : m.isMastercard ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '42px', height: '26px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#EB001B', position: 'absolute', left: 0, mixBlendMode: 'multiply' }}></div>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FF5F00', position: 'absolute', right: 0, mixBlendMode: 'multiply' }}></div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#111', marginTop: '4px', letterSpacing: '-0.2px' }}>mastercard</span>
                </div>
              ) : (
                <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LATEST_ORDERS = [
  { app: 'ChatGPT Plus', buyer: 'Tanvir A.', time: '2m ago', bg: '#10A37F', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073z"/></svg> },
  { app: 'Spotify Premium', buyer: 'Nusrat J.', time: '4m ago', bg: '#1DB954', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg> },
  { app: 'YouTube Premium', buyer: 'Mehedi H.', time: '7m ago', bg: '#FF0000', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
  { app: 'Gemini Advanced', buyer: 'Sadia R.', time: '9m ago', bg: 'linear-gradient(135deg,#4285F4,#9C27B0)', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/></svg> },
  { app: 'Netflix 4K UHD', buyer: 'Farhan K.', time: '12m ago', bg: '#E50914', icon: <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 24c.557-.07 3.811-.298 4.387-.573zM.026 0l-.003 24 4.341-.032V0z"/></svg> },
  { app: 'Canva Pro', buyer: 'Arif M.', time: '15m ago', bg: '#00C4CC', icon: <div style={{ fontWeight: 800, fontSize: '15px', color: 'white', fontStyle: 'italic' }}>Canva</div> },
  { app: 'Cursor Pro', buyer: 'Shuvo D.', time: '18m ago', bg: '#000000', icon: <div style={{ fontWeight: 800, fontSize: '15px', color: 'white' }}>&gt;_</div> },
  { app: 'CapCut Pro', buyer: 'Rifat I.', time: '22m ago', bg: '#111827', icon: <div style={{ fontWeight: 800, fontSize: '15px', color: 'white' }}>CC</div> },
  { app: 'Surfshark VPN', buyer: 'Mahmud S.', time: '25m ago', bg: '#00D1B2', icon: <div style={{ fontWeight: 800, fontSize: '18px', color: 'white' }}>S</div> },
];

export const LatestOrders = () => {
  return (
    <section className="container" style={{ padding: '0 0 64px' }}>
      <style>{`
        @keyframes autoScrollOrders {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 8px)); }
        }
        .scroll-track:hover {
          animation-play-state: paused;
        }
        @keyframes livePulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.3); }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Live Recent Deliveries</h3>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#059669',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', animation: 'livePulseDot 1.5s infinite' }} />
            REAL-TIME
          </span>
        </div>
        <Link href="/orders" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none' }}>
          Track Your Order →
        </Link>
      </div>
      <div style={{ overflow: 'hidden', width: '100%', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)' }}>
        <div
          className="scroll-track"
          style={{
            display: 'flex',
            gap: '16px',
            width: 'max-content',
            animation: 'autoScrollOrders 28s linear infinite'
          }}
        >
          {[...LATEST_ORDERS, ...LATEST_ORDERS].map((o, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '18px',
              padding: '16px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              minWidth: '245px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              flex: '0 0 auto',
            }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {o.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{o.app}</h4>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{o.time}</span>
                </div>
                <p style={{ fontSize: '0.78rem', margin: '3px 0 0', color: '#64748b' }}>
                  {o.buyer} • <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Delivered</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Plan',
      desc: 'Browse our catalog of 25+ official AI, Streaming & Design apps and pick your preferred billing duration.',
      icon: '🛒',
      color: '#2563eb',
      bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
    },
    {
      step: '02',
      title: 'Pay in BDT Easily',
      desc: 'Send money via bKash, Nagad, Rocket or Upay and submit your Transaction ID (TrxID) on the checkout page.',
      icon: '📲',
      color: '#7c3aed',
      bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
    },
    {
      step: '03',
      title: 'Instant Account Delivery',
      desc: 'Your payment is verified within minutes and login credentials appear directly on your Order Tracking page!',
      icon: '🚀',
      color: '#059669',
      bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
    }
  ];

  return (
    <section style={{ padding: '40px 0 72px', background: '#f8fafc' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '999px',
            background: '#f5f3ff',
            border: '1px solid #ddd6fe',
            color: '#7c3aed',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '12px'
          }}>
            ✨ Simple 3-Step Process
          </div>
          <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.4px' }}>
            How To Get Your <span style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium Subscription</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
            No international credit card or technical hassle — get started in under 5 minutes.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px 28px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '18px',
                  background: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.9rem'
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  color: `${s.color}20`,
                  letterSpacing: '-1px'
                }}>
                  {s.step}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                {s.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const WhyChooseUs = () => {
  const perks = [
    {
      icon: '💰',
      title: 'Save Up To 75% Every Month',
      desc: 'Get official premium plans at a fraction of international pricing tailored for students, freelancers & professionals.'
    },
    {
      icon: '🇧🇩',
      title: 'No Dollar Endorsement Needed',
      desc: 'Forget passport endorsement or dual-currency cards. Pay directly in Bangladeshi Taka via bKash, Nagad or Rocket.'
    },
    {
      icon: '🛡️',
      title: 'Full Period Replacement Warranty',
      desc: 'Every subscription is backed by our full billing-cycle warranty. If anything stops working, we replace it fast.'
    },
    {
      icon: '🤖',
      title: '24/7 AI + Live Admin Support',
      desc: 'Get instant answers anytime through our smart website AI assistant, WhatsApp bot, or dedicated human support team.'
    }
  ];

  return (
    <section className="container" style={{ padding: '10px 0 72px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #1e3a8a 100%)',
        borderRadius: '32px',
        padding: '56px 40px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.16)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '44px', position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(96, 165, 250, 0.18)',
            border: '1px solid rgba(147, 197, 253, 0.35)',
            color: '#93c5fd',
            fontSize: '0.76rem',
            fontWeight: 800,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            💎 Why 15,000+ Users Trust Us
          </span>
          <h2 style={{ fontSize: '2.35rem', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.4px' }}>
            Why Choose <span style={{ background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium Account Store?</span>
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            We combine unbeatable local pricing with rock-solid account stability and instant customer care.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '22px',
          position: 'relative',
          zIndex: 1
        }}>
          {perks.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '22px',
                padding: '28px 24px',
                transition: 'transform 0.28s ease, background 0.28s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.7rem',
                marginBottom: '18px'
              }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const REVIEWS = [
  { name: 'Sultana Yesmin', initial: 'S', color: '#2563eb', app: 'Netflix 4K', text: 'Thanks Premium Account Store for the instant delivery. Of course, I got the best service for being a regular customer.', designation: 'Homemaker' },
  { name: 'Ayesha Khan', initial: 'A', color: '#7c3aed', app: 'Canva Pro', text: '২য় বার Premium Account Store থেকে অর্ডার করলাম। আগের মতো এবারও দারুণ কোয়ালিটি আর দ্রুত ডেলিভারি পেয়েছি। একদম সন্তুষ্ট!', designation: 'Banker' },
  { name: 'Fariha Akter Tumpa', initial: 'F', color: '#db2777', app: 'ChatGPT Plus', text: 'এই অবিশ্বাসের জগতে আস্থাশীল একটি প্রতিষ্ঠান Premium Account Store। পেমেন্ট করার ৫ মিনিটের মধ্যে অ্যাক্সেস পেয়েছি।', designation: 'Entrepreneur' },
  { name: 'Rakib Hasan', initial: 'R', color: '#059669', app: 'Netflix 4K', text: 'অনেক ফাস্ট ডেলিভারি। আমি নেটফ্লিক্স নিয়েছি, ৪কে কোয়ালিটিতে সবকিছু ঠিকঠাক কাজ করছে। সাপোর্ট টিমও অনেক হেল্পফুল।', designation: 'University Student' },
  { name: 'Md. Noman', initial: 'N', color: '#0284c7', app: 'Gemini Advanced', text: 'Best service in Bangladesh! Took Google Gemini Advanced 18 Months plan and it activated on my own Gmail smoothly.', designation: 'Full-Stack Freelancer' },
  { name: 'Tanvir Ahmed', initial: 'T', color: '#4f46e5', app: 'Cursor Pro', text: 'ডুয়েল কারেন্সি কার্ড ছাড়াই বিকাশ দিয়ে Cursor Pro ও ChatGPT Plus কিনতে পেরেছি। কোডিংয়ের জন্য সেরা সার্ভিস!', designation: 'Software Engineer' },
  { name: 'Nusrat Jahan Mim', initial: 'M', color: '#e11d48', app: 'YouTube Premium', text: 'ইউটিউব প্রিমিয়াম নিলাম ৬ মাসের জন্য। কোনো অ্যাড আসে না, ব্যাকগ্রাউন্ড প্লে আর ইউটিউব মিউজিক দুটোই দারুণ চলছে।', designation: 'Medical Student' },
  { name: 'Mahmudul Hasan', initial: 'M', color: '#0d9488', app: 'CapCut Pro', text: 'ভিডিও এডিটিংয়ের জন্য CapCut Pro খুব দরকার ছিল। এখান থেকে নেওয়ার পর সব প্রিমিয়াম ইফেক্ট আনলক হয়ে গেছে। ধন্যবাদ!', designation: 'Content Creator' },
  { name: 'Sabbir Hossain', initial: 'S', color: '#ea580c', app: 'Spotify Premium', text: 'Been using their Spotify Individual plan for 4 months now without a single interruption. Worth every taka!', designation: 'UI/UX Designer' },
  { name: 'Farzana Yasmin', initial: 'F', color: '#9333ea', app: 'Canva Pro', text: 'আমাদের এজেন্সির কাজের জন্য ক্যানভা প্রো নিয়েছি। টিম ইনভাইটেশন সাথে সাথেই পেয়েছি এবং সব ব্র্যান্ড কিট কাজ করছে।', designation: 'Digital Marketer' },
  { name: 'Imran Kabir', initial: 'I', color: '#16a34a', app: 'NordVPN', text: 'ফ্রিল্যান্সিং কাজের জন্য NordVPN নিয়েছি। স্পিড অসাধারণ এবং সব দেশের সার্ভার এক ক্লিকেই কানেক্ট হয়।', designation: 'Upwork Freelancer' },
  { name: 'Shafiqul Islam', initial: 'S', color: '#2563eb', app: 'Claude Pro', text: 'Claude Pro আর ChatGPT Plus দুটোই এখান থেকে নেওয়া। রাত ২টায় অর্ডার করেও ১০ মিনিটে ডেলিভারি পেয়েছি, অবিশ্বাস্য!', designation: 'AI Researcher' },
  { name: 'Tanjিনা আক্তার', initial: 'T', color: '#d97706', app: 'Disney+ Hotstar', text: 'পরিবারের সবার জন্য মুভি ও খেলা দেখার জন্য নিয়েছি। কোনো বাফারিং বা লগআউট সমস্যা হয়নি, ফুল ওয়ারেন্টি সাপোর্ট পেয়েছি।', designation: 'Teacher' },
  { name: 'Ariful Islam', initial: 'A', color: '#0891b2', app: 'Gemini Advanced', text: 'Google AI Plus 2TB স্টোরেজসহ জেমিনি প্রো প্ল্যানটা এক কথায় সেরা ডিল। দামও হাতের নাগালে।', designation: 'Graphic Designer' },
  { name: 'Rashedul Alam', initial: 'R', color: '#7c3aed', app: 'InShot Pro', text: 'মোবাইলে রিলস ও শর্টস এডিট করার জন্য InShot Pro নিয়েছি। ওয়াটারমার্ক ছাড়া সব প্রিমিয়াম ফিল্টার কাজ করছে।', designation: 'Vlogger' },
  { name: 'Nazmul Huda', initial: 'N', color: '#1d4ed8', app: 'ChatGPT Plus', text: 'কাস্টমার সাপোর্ট ১০/১০! ওয়েবসাইটের এআই চ্যাটবট এবং হোয়াটসঅ্যাপ সাপোর্ট দুটোই খুব দ্রুত রেসপন্স করে।', designation: 'Business Owner' },
];

const ReviewCard = ({ r }: { r: typeof REVIEWS[0] }) => (
  <div
    className="review-card-item"
    style={{
      background: 'white',
      borderRadius: '20px',
      padding: '24px 26px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
      width: '360px',
      flex: '0 0 auto',
      transition: 'all 0.3s ease'
    }}
  >
    <div>
      {/* Top Row: Stars + App Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ color: '#f59e0b', fontSize: '0.95rem', letterSpacing: '1.5px', fontWeight: 800 }}>
          ★★★★★ <span style={{ color: '#475569', fontSize: '0.78rem', letterSpacing: 0 }}>5.0</span>
        </div>
        <span style={{
          padding: '4px 10px',
          borderRadius: '999px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#2563eb',
          fontSize: '0.72rem',
          fontWeight: 700
        }}>
          {r.app}
        </span>
      </div>

      {/* Review Text */}
      <p style={{ color: '#334155', fontSize: '0.93rem', lineHeight: 1.65, margin: '0 0 20px 0' }}>
        &ldquo;{r.text}&rdquo;
      </p>
    </div>

    {/* Author Footer */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: r.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: '1.05rem',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${r.color}40`
        }}>
          {r.initial}
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{r.name}</h4>
          <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '2px 0 0' }}>{r.designation}</p>
        </div>
      </div>
      <span style={{
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#059669',
        background: '#ecfdf5',
        padding: '4px 8px',
        borderRadius: '6px'
      }}>
        ✓ Verified
      </span>
    </div>
  </div>
);

export const CustomerReviews = () => {
  const firstRow = REVIEWS.slice(0, 8);
  const secondRow = REVIEWS.slice(8, 16);

  return (
    <section style={{
      background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)',
      padding: '72px 0',
      marginBottom: '40px',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 10px)); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(calc(-50% - 10px)); }
          100% { transform: translateX(0); }
        }
        .reviews-track-left {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marqueeLeft 48s linear infinite;
        }
        .reviews-track-right {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marqueeRight 52s linear infinite;
        }
        .reviews-track-left:hover,
        .reviews-track-right:hover {
          animation-play-state: paused;
        }
        .review-card-item:hover {
          transform: translateY(-6px);
          border-color: #93c5fd !important;
          box-shadow: 0 16px 36px rgba(37, 99, 235, 0.12) !important;
        }
      `}</style>

      <div className="container" style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          color: '#d97706',
          fontSize: '0.78rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          marginBottom: '12px'
        }}>
          ⭐ 4.9/5 Average Rating • 15,000+ Verified Buyers
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Loved by Thousands of <span style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Happy Customers</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
          Real feedback from freelancers, students, creators, and professionals across Bangladesh.
        </p>
      </div>

      {/* Row 1: Smooth Left Marquee */}
      <div style={{
        overflow: 'hidden',
        width: '100%',
        padding: '8px 0',
        marginBottom: '20px',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)'
      }}>
        <div className="reviews-track-left">
          {[...firstRow, ...firstRow].map((r, i) => (
            <ReviewCard key={`r1-${i}`} r={r} />
          ))}
        </div>
      </div>

      {/* Row 2: Smooth Right Marquee */}
      <div style={{
        overflow: 'hidden',
        width: '100%',
        padding: '8px 0',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)'
      }}>
        <div className="reviews-track-right">
          {[...secondRow, ...secondRow].map((r, i) => (
            <ReviewCard key={`r2-${i}`} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQS = [
  {
    q: 'How fast will I receive my subscription after payment?',
    a: 'Most orders are verified and delivered within 5 to 15 minutes! As soon as your payment is verified, your login credentials appear directly on your Order Tracking page.'
  },
  {
    q: 'Do I need an international credit/debit card to buy?',
    a: 'Not at all! You can pay directly in Bangladeshi Taka (BDT) using bKash, Nagad, Rocket, Upay, or Cellfin without needing any dual-currency card.'
  },
  {
    q: 'Are these accounts 100% genuine and covered by warranty?',
    a: 'Yes! Every subscription we provide is 100% genuine and comes with a full billing-period warranty. If you ever face any issue, our support team provides an instant fix or replacement.'
  },
  {
    q: 'How do I check my order status and get my login details?',
    a: 'Simply go to the "History" (Track Order) menu, enter your Order ID (e.g., ORD-123456), and you will see real-time status updates along with your account email, password, and profile PIN.'
  },
  {
    q: 'What if I need help after purchasing?',
    a: 'Our AI Assistant and human support team are available 24/7 via the website chat widget and WhatsApp to help you with login or renewal anytime.'
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="container" style={{ padding: '20px 0 72px', maxWidth: '880px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{
          display: 'inline-block',
          padding: '6px 16px',
          borderRadius: '999px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#2563eb',
          fontSize: '0.78rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          marginBottom: '10px'
        }}>
          ❓ Got Questions?
        </span>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
          Frequently Asked <span style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Questions</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.98rem', margin: 0 }}>
          Everything you need to know about ordering and using our premium subscriptions.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '18px',
                border: `1.5px solid ${isOpen ? '#93c5fd' : '#e2e8f0'}`,
                boxShadow: isOpen ? '0 10px 28px rgba(37, 99, 235, 0.08)' : '0 2px 10px rgba(0,0,0,0.02)',
                overflow: 'hidden',
                transition: 'all 0.25s ease'
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '1.02rem', fontWeight: 700, color: isOpen ? '#1d4ed8' : '#0f172a' }}>
                  {item.q}
                </span>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isOpen ? '#2563eb' : '#f1f5f9',
                  color: isOpen ? 'white' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  flexShrink: 0,
                  transition: 'all 0.25s ease',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                }}>
                  +
                </span>
              </button>
              {isOpen && (
                <div style={{
                  padding: '0 24px 20px',
                  color: '#475569',
                  fontSize: '0.94rem',
                  lineHeight: 1.65,
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '14px'
                }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const Newsletter = () => {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="container" style={{ padding: '0 0 64px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f5f3ff 100%)',
        border: '1.5px solid #bfdbfe',
        borderRadius: '28px',
        padding: '40px 44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '28px',
        boxShadow: '0 16px 40px rgba(37, 99, 235, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0,
            boxShadow: '0 10px 24px rgba(37, 99, 235, 0.25)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Get Exclusive Flash Promo Codes!
            </h3>
            <p style={{ color: '#475569', margin: '4px 0 0', fontSize: '0.94rem' }}>
              Subscribe to receive special discount coupons and new app launch alerts.
            </p>
          </div>
        </div>
        {subscribed ? (
          <div style={{
            padding: '14px 24px',
            borderRadius: '14px',
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            color: '#047857',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            🎉 Thank you for subscribing! Watch your inbox for promo codes.
          </div>
        ) : (
          <form
            style={{ display: 'flex', gap: '12px', flex: '1 1 320px', maxWidth: '480px' }}
            onSubmit={e => { e.preventDefault(); setSubscribed(true); }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              style={{
                flex: 1,
                padding: '15px 20px',
                borderRadius: '14px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                fontSize: '0.95rem',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '15px 28px',
                borderRadius: '14px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
              }}
            >
              Subscribe →
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
