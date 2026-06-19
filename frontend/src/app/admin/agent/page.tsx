"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AIAgentAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [waStatus, setWaStatus] = useState<any>({ status: 'Disconnected', qrCode: '', pairingCode: '' });
  const [pairingPhone, setPairingPhone] = useState('');
  const [pairingResult, setPairingResult] = useState('');
  const [fbSettings, setFbSettings] = useState({ pageId: '', accessToken: '', verifyToken: '' });
  const [saveStatus, setSaveStatus] = useState('');
  const [waActionLoading, setWaActionLoading] = useState(false);

  const agentApiUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:5001';

  const getHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return false;
    }
    return true;
  };

  const fetchStatusAndSettings = async () => {
    if (!checkAuth()) return;
    try {
      // 1. Fetch WhatsApp Status
      const waRes = await fetch(`${agentApiUrl}/api/agent/whatsapp/status`, {
        headers: getHeaders()
      });
      if (waRes.ok) {
        const waData = await waRes.json();
        setWaStatus(waData);
      }

      // 2. Fetch FB Settings
      const fbRes = await fetch(`${agentApiUrl}/api/agent/facebook/settings`, {
        headers: getHeaders()
      });
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        setFbSettings(fbData);
      }
    } catch (err) {
      console.error('Failed to fetch AI Agent details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndSettings();
    // Poll WhatsApp status every 5 seconds
    const interval = setInterval(() => {
      fetchStatusAndSettings();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectWhatsApp = async () => {
    setWaActionLoading(true);
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/connect`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        alert('WhatsApp connection initialization requested.');
        fetchStatusAndSettings();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to initialize WhatsApp connection: ${data.message || data.error || res.statusText || res.status}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error initializing WhatsApp: ${err.message}`);
    } finally {
      setWaActionLoading(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    if (!confirm('Are you sure you want to disconnect JID from WhatsApp?')) return;
    setWaActionLoading(true);
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/disconnect`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        alert('Disconnected WhatsApp successfully.');
        setPairingResult('');
        fetchStatusAndSettings();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to disconnect WhatsApp: ${data.message || data.error || res.statusText || res.status}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error disconnecting WhatsApp: ${err.message}`);
    } finally {
      setWaActionLoading(false);
    }
  };

  const handleGetPairingCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingPhone) {
      alert('Please enter a valid phone number (including country code, e.g. 88017XXXXXXXX)');
      return;
    }
    setWaActionLoading(true);
    setPairingResult('');
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/pair`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ phone: pairingPhone })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.pairingCode) {
        setPairingResult(data.pairingCode);
      } else {
        alert(`Failed to get pairing code: ${data.message || data.error || res.statusText || res.status}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error fetching pairing code: ${err.message}`);
    } finally {
      setWaActionLoading(false);
    }
  };

  const handleSaveFbSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/facebook/settings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(fbSettings)
      });
      if (res.ok) {
        setSaveStatus('Saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveStatus(`Failed to save settings: ${data.message || data.error || res.statusText || res.status}`);
      }
    } catch (err: any) {
      console.error(err);
      setSaveStatus(`Failed to save settings: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', fontSize: '1.2rem', color: '#64748b' }}>Loading AI Agent config...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>AI Agent Connections</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Configure and link your AI Agent to WhatsApp, Facebook Page Messenger, and the storefront.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
        
        {/* WhatsApp Card */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>💬</span> WhatsApp Connection
            </h2>
            <span style={{ 
              padding: '6px 14px', 
              borderRadius: '50px', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              background: waStatus.status === 'Connected' ? '#ecfdf5' : waStatus.status === 'Scanning' ? '#fffbeb' : '#fef2f2',
              color: waStatus.status === 'Connected' ? '#10b981' : waStatus.status === 'Scanning' ? '#f59e0b' : '#ef4444',
              border: `1px solid ${waStatus.status === 'Connected' ? '#bbf7d0' : waStatus.status === 'Scanning' ? '#fef3c7' : '#fecaca'}`
            }}>
              {waStatus.status}
            </span>
          </div>

          {waStatus.status === 'Connected' ? (
            <div style={{ textAlign: 'center', padding: '40px 24px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '3rem' }}>✅</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', marginTop: '16px', marginBottom: '8px' }}>WhatsApp Bot is Active!</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Your AI Agent is fully connected to your WhatsApp number and auto-answering messages.</p>
              <button 
                onClick={handleDisconnectWhatsApp} 
                disabled={waActionLoading}
                className="btn-danger" 
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                {waActionLoading ? 'Disconnecting...' : 'Disconnect WhatsApp'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Link your WhatsApp account to enable the AI Chatbot auto-responder. You can choose to scan the QR code or link via phone number pairing code.
              </p>

              {waStatus.status === 'Disconnected' && (
                <button 
                  onClick={handleConnectWhatsApp}
                  disabled={waActionLoading}
                  className="btn-primary"
                  style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  {waActionLoading ? 'Starting connection...' : 'Start Connection (Generate QR)'}
                </button>
              )}

              {waStatus.status === 'Scanning' && waStatus.qrCode && (
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '24px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 16px', color: '#334155' }}>Scan QR Code on your WhatsApp app:</h4>
                  <img 
                    src={waStatus.qrCode} 
                    alt="WhatsApp QR Code" 
                    style={{ width: '220px', height: '220px', margin: '0 auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: 'white' }} 
                  />
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '16px', marginBottom: 0 }}>Open WhatsApp &rarr; Linked Devices &rarr; Link a Device.</p>
                </div>
              )}

              {waStatus.status !== 'Connected' && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', color: '#334155', fontWeight: 700 }}>Option 2: Link with Phone Number</h4>
                  <form onSubmit={handleGetPairingCode} style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. 8801712345678" 
                      value={pairingPhone}
                      onChange={e => setPairingPhone(e.target.value)}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                    <button 
                      type="submit" 
                      disabled={waActionLoading}
                      style={{ background: '#0f172a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
                    >
                      Get Code
                    </button>
                  </form>

                  {pairingResult && (
                    <div style={{ marginTop: '20px', background: '#eff6ff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                      <h5 style={{ margin: '0 0 8px', color: '#1e3a8a', fontSize: '0.95rem' }}>Your WhatsApp Pairing Code:</h5>
                      <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '4px', color: '#1d4ed8' }}>
                        {pairingResult}
                      </div>
                      <p style={{ color: '#1e3a8a', fontSize: '0.85rem', marginTop: '12px', marginBottom: 0 }}>
                        Enter this code on your WhatsApp app when prompted by clicking "Link with phone number instead".
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Facebook Messenger Card */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🌐</span> Meta Facebook Webhook
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Connect your Facebook Page Messenger account by registering the webhook below and providing your Page credentials.
          </p>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#475569', fontWeight: 700 }}>Meta Developer Webhook Config:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Callback URL:</span>
                <code style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', wordBreak: 'break-all', display: 'inline-block', marginTop: '4px' }}>
                  {agentApiUrl}/api/agent/facebook/webhook
                </code>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Verify Token:</span>
                <code style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', display: 'inline-block', marginTop: '4px' }}>
                  {fbSettings.verifyToken || 'verify_token_default'}
                </code>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveFbSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Facebook Page ID</label>
              <input 
                type="text"
                placeholder="e.g. 10293847561234"
                value={fbSettings.pageId}
                onChange={e => setFbSettings({ ...fbSettings, pageId: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Page Access Token</label>
              <textarea 
                placeholder="Paste Page Access Token from Meta developer app"
                rows={4}
                value={fbSettings.accessToken}
                onChange={e => setFbSettings({ ...fbSettings, accessToken: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'monospace', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Webhook Verify Token (Hub Verify Token)</label>
              <input 
                type="text"
                placeholder="e.g. facebook_verify_token_secret"
                value={fbSettings.verifyToken}
                onChange={e => setFbSettings({ ...fbSettings, verifyToken: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981' }}>{saveStatus}</span>
              <button 
                type="submit" 
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
              >
                Save Meta Config
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
