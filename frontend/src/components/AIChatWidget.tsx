"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const agentApiUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:5001';

  // Initialize unique session ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('chat_session_id');
      if (!sid) {
        sid = 'web_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('chat_session_id', sid);
      }
      setSessionId(sid);

      // Load initial message
      setMessages([
        { sender: 'bot', text: 'হ্যালো! PREMIUMACCOUNTSSTORE.COM-এ আপনাকে স্বাগতম। আমি আপনার কীভাবে সাহায্য করতে পারি? (Hello! How can I assist you today?)' }
      ]);
    }
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // 1. Add user message
    const userMsg = textToSend.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch(`${agentApiUrl}/api/agent/web/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMsg })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'দুঃখিত, সংযোগে কিছু ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হচ্ছে না।' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    handleSendMessage(actionText);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 8px 30px rgba(37,99,235,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            outline: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(37,99,235,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,235,0.4)';
          }}
        >
          🤖
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '520px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#38bdf8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                🤖
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.3px' }}>Premium Store Bot</h3>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Active now
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '4px',
                lineHeight: 1,
                outline: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              &times;
            </button>
          </div>

          {/* Conversation Area */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
            {messages.map((m, i) => (
              <div 
                key={i} 
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: m.sender === 'user' ? '#2563eb' : 'white',
                  color: m.sender === 'user' ? 'white' : '#1e293b',
                  padding: '12px 16px',
                  borderRadius: m.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  boxShadow: m.sender === 'user' ? '0 4px 12px rgba(37,99,235,0.15)' : '0 4px 12px rgba(0,0,0,0.02)',
                  border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  fontSize: '0.9rem',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'white',
                border: '1px solid #e2e8f0',
                padding: '12px 20px',
                borderRadius: '18px 18px 18px 2px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}>
                <span className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out' }} />
                <span className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }} style-id="dot2" />
                <span className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }} style-id="dot3" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions / Pills */}
          <div style={{ padding: '8px 16px', background: '#f1f5f9', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid #e2e8f0', scrollbarWidth: 'none' }}>
            <button 
              onClick={() => handleQuickAction('Show catalog prices')}
              style={{ padding: '6px 12px', borderRadius: '50px', background: 'white', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 600, color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            >
              🏷️ Product Prices
            </button>
            <button 
              onClick={() => handleQuickAction('How do I track my order?')}
              style={{ padding: '6px 12px', borderRadius: '50px', background: 'white', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 600, color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            >
              📦 Track Order
            </button>
            <button 
              onClick={() => handleQuickAction('I want to reset my password')}
              style={{ padding: '6px 12px', borderRadius: '50px', background: 'white', border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 600, color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            >
              🔑 Reset Password
            </button>
          </div>

          {/* Input Area */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #cbd5e1', background: 'white' }}>
            <form 
              onSubmit={e => { e.preventDefault(); handleSendMessage(inputText); }}
              style={{ display: 'flex', gap: '10px' }}
            >
              <input 
                type="text" 
                placeholder="মেসেজ লিখুন..." 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '0.9rem',
                  transition: 'border 0.2s'
                }}
              />
              <button 
                type="submit" 
                disabled={loading || !inputText.trim()}
                style={{
                  background: (loading || !inputText.trim()) ? '#94a3b8' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: (loading || !inputText.trim()) ? 'default' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Animations and Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .dot {
          animation: bounce 1.4s infinite ease-in-out both;
        }
      `}} />
    </div>
  );
}
