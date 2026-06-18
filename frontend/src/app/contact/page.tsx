"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

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
            Get Support 24/7
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Contact Support
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', marginTop: '10px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            We're here to help! Get in touch for order verification, support, queries, or custom subscription requests.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Get In Touch Column */}
          <div className="glass-card" style={{ padding: '40px 32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>Official Channels</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</h4>
                  <a href="mailto:support@premiumstore.com" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>
                    support@premiumstore.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.68a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.04 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z"></path></svg>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp Helpline</h4>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.05rem' }}>
                    +880 1700-000000
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Response Speed</h4>
                  <span style={{ color: '#334155', fontWeight: 700, fontSize: '1.05rem' }}>
                    Within 5-15 Minutes
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Form Column */}
          <div className="glass-card" style={{ padding: '40px 32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Send a Message</h3>
            
            {sent ? (
              <div style={{ 
                padding: '32px 24px', 
                background: '#ecfdf5', 
                color: '#065f46', 
                borderRadius: '16px', 
                textAlign: 'center', 
                fontWeight: 700,
                border: '1.5px solid #a7f3d0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '2.5rem' }}>✉️</span>
                <span>Thank you! We've received your request and will get back to you shortly.</span>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>Your Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '10px', 
                      border: '1.5px solid #cbd5e1', 
                      outline: 'none', 
                      background: 'white', 
                      fontSize: '1rem',
                      transition: 'border-color 0.2s'
                    }} 
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>Your Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. john@example.com" 
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '10px', 
                      border: '1.5px solid #cbd5e1', 
                      outline: 'none', 
                      background: 'white', 
                      fontSize: '1rem',
                      transition: 'border-color 0.2s'
                    }} 
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>Your Message / Request</label>
                  <textarea 
                    placeholder="Write details of your query..." 
                    required 
                    rows={4} 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '10px', 
                      border: '1.5px solid #cbd5e1', 
                      outline: 'none', 
                      background: 'white', 
                      fontSize: '1rem',
                      resize: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ 
                    padding: '14px', 
                    width: '100%', 
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 8px 20px rgba(37,99,235,0.15)',
                    marginTop: '8px'
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
