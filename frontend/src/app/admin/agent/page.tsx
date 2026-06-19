"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AIAgentAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [waStatus, setWaStatus] = useState<any>({ status: 'Disconnected', qrCode: '', pairingCode: '', reconnectAttempts: 0 });
  const [pairingPhone, setPairingPhone] = useState('');
  const [pairingResult, setPairingResult] = useState('');
  const [fbSettings, setFbSettings] = useState({ pageId: '', accessToken: '', verifyToken: '' });
  const [saveStatus, setSaveStatus] = useState('');
  const [waActionLoading, setWaActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const agentApiUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:5001';

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

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

  const fetchStatusAndSettings = useCallback(async () => {
    if (!checkAuth()) return;
    try {
      const waRes = await fetch(`${agentApiUrl}/api/agent/whatsapp/status`, { headers: getHeaders() });
      if (waRes.ok) {
        const waData = await waRes.json();
        setWaStatus(waData);
      }
      const fbRes = await fetch(`${agentApiUrl}/api/agent/facebook/settings`, { headers: getHeaders() });
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        setFbSettings(fbData);
      }
    } catch (err) {
      console.error('Failed to fetch AI Agent details:', err);
    } finally {
      setLoading(false);
    }
  }, [agentApiUrl]);

  useEffect(() => {
    fetchStatusAndSettings();
    const interval = setInterval(fetchStatusAndSettings, 5000);
    return () => clearInterval(interval);
  }, [fetchStatusAndSettings]);

  const handleConnectWhatsApp = async () => {
    setWaActionLoading(true);
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/connect`, { method: 'POST', headers: getHeaders() });
      if (res.ok) {
        showToast('Connection started! Waiting for QR code...', 'success');
        fetchStatusAndSettings();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(`Failed: ${data.message || data.error || res.status}`, 'error');
      }
    } catch (err: any) {
      showToast(`Network error: ${err.message}`, 'error');
    } finally {
      setWaActionLoading(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    if (!confirm('Disconnect WhatsApp? This will clear the session.')) return;
    setWaActionLoading(true);
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/disconnect`, { method: 'POST', headers: getHeaders() });
      if (res.ok) {
        showToast('WhatsApp disconnected successfully.', 'success');
        setPairingResult('');
        fetchStatusAndSettings();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(`Failed: ${data.message || data.error || res.status}`, 'error');
      }
    } catch (err: any) {
      showToast(`Network error: ${err.message}`, 'error');
    } finally {
      setWaActionLoading(false);
    }
  };

  const handleResetSession = async () => {
    if (!confirm('Hard reset the WhatsApp session? This will delete all saved session data from the database and stop reconnect loops. You will need to scan QR or enter a pairing code again.')) return;
    setWaActionLoading(true);
    setPairingResult('');
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/reset`, { method: 'POST', headers: getHeaders() });
      if (res.ok) {
        showToast('✅ Session fully reset! You can now link your WhatsApp account fresh.', 'success');
        fetchStatusAndSettings();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(`Reset failed: ${data.message || data.error || res.status}`, 'error');
      }
    } catch (err: any) {
      showToast(`Network error: ${err.message}`, 'error');
    } finally {
      setWaActionLoading(false);
    }
  };

  const handleGetPairingCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingPhone) {
      showToast('Enter a valid phone number (e.g. 8801712345678)', 'error');
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
        showToast('Pairing code received!', 'success');
      } else {
        showToast(`Failed: ${data.message || data.error || res.status}`, 'error');
      }
    } catch (err: any) {
      showToast(`Network error: ${err.message}`, 'error');
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
        setSaveStatus(`Failed: ${data.message || data.error || res.status}`);
      }
    } catch (err: any) {
      setSaveStatus(`Error: ${err.message}`);
    }
  };

  const statusColor = waStatus.status === 'Connected' ? '#10b981' : waStatus.status === 'Scanning' || waStatus.status === 'Connecting' ? '#f59e0b' : '#ef4444';
  const statusBg = waStatus.status === 'Connected' ? '#ecfdf5' : waStatus.status === 'Scanning' || waStatus.status === 'Connecting' ? '#fffbeb' : '#fef2f2';
  const statusBorder = waStatus.status === 'Connected' ? '#bbf7d0' : waStatus.status === 'Scanning' || waStatus.status === 'Connecting' ? '#fef3c7' : '#fecaca';

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚙️</div>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading AI Agent config...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px', position: 'relative' }}>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          padding: '16px 24px', borderRadius: '12px', maxWidth: '400px',
          background: toast.type === 'success' ? '#ecfdf5' : toast.type === 'error' ? '#fef2f2' : '#eff6ff',
          border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : toast.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
          color: toast.type === 'success' ? '#065f46' : toast.type === 'error' ? '#991b1b' : '#1e3a8a',
          fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          animation: 'slideIn 0.3s ease'
        }}>
          {toast.type === 'success' ? '✅ ' : toast.type === 'error' ? '❌ ' : 'ℹ️ '}{toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .wa-btn { border: none; padding: 12px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
        .wa-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .wa-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px', paddingTop: '8px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>🤖 AI Agent Connections</h1>
          <p style={{ color: '#64748b', marginTop: '6px', margin: '6px 0 0' }}>Manage your WhatsApp, Facebook Messenger, and Web Chatbot integrations.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '28px' }}>

        {/* WhatsApp Card */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>💬</span> WhatsApp Connection
            </h2>
            <span style={{ padding: '5px 14px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700, background: statusBg, color: statusColor, border: `1px solid ${statusBorder}` }}>
              {waStatus.status === 'Connecting' ? '⏳ Connecting...' : waStatus.status}
            </span>
          </div>

          {/* Connected State */}
          {waStatus.status === 'Connected' ? (
            <div style={{ textAlign: 'center', padding: '32px 20px', background: '#f0fdf4', borderRadius: '12px', border: '1px dashed #86efac' }}>
              <div style={{ fontSize: '3rem' }}>✅</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#15803d', marginTop: '12px', marginBottom: '8px' }}>WhatsApp Bot is Active!</h3>
              <p style={{ color: '#166534', fontSize: '0.88rem', marginBottom: '20px' }}>Your AI Agent is connected and auto-answering messages.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={handleDisconnectWhatsApp} disabled={waActionLoading} className="wa-btn" style={{ background: '#ef4444', color: 'white' }}>
                  {waActionLoading ? '...' : '🔌 Disconnect'}
                </button>
                <button onClick={handleResetSession} disabled={waActionLoading} className="wa-btn" style={{ background: '#f97316', color: 'white' }}>
                  {waActionLoading ? '...' : '🔄 Reset Session'}
                </button>
              </div>
            </div>

          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Info / Reconnect warning */}
              {(waStatus.reconnectAttempts || 0) >= 5 && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px 16px', fontSize: '0.88rem', color: '#991b1b' }}>
                  ⚠️ <strong>Max reconnect attempts reached.</strong> The bot has stopped trying. Click <strong>Reset Session</strong> to start fresh.
                </div>
              )}

              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                Link your WhatsApp to enable AI auto-replies. Choose to scan a QR code <em>or</em> enter a pairing code via phone number.
              </p>

              {/* Option 1: QR Code */}
              {waStatus.status === 'Disconnected' && (
                <button onClick={handleConnectWhatsApp} disabled={waActionLoading} className="wa-btn" style={{ background: '#25D366', color: 'white', width: '100%', padding: '14px' }}>
                  {waActionLoading ? 'Starting...' : '📱 Start Connection (Generate QR)'}
                </button>
              )}

              {(waStatus.status === 'Scanning' || waStatus.status === 'Connecting') && !waStatus.qrCode && (
                <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Generating QR code... please wait.</p>
                </div>
              )}

              {waStatus.qrCode && (
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 14px', color: '#334155', fontSize: '0.95rem', fontWeight: 700 }}>📷 Scan QR Code in WhatsApp:</h4>
                  <img src={waStatus.qrCode} alt="WhatsApp QR Code" style={{ width: '200px', height: '200px', margin: '0 auto', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '10px', background: 'white', display: 'block' }} />
                  <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '12px', marginBottom: 0 }}>Open WhatsApp → Linked Devices → Link a Device</p>
                </div>
              )}

              {/* Option 2: Pairing Code */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                <h4 style={{ margin: '0 0 12px', color: '#334155', fontWeight: 700, fontSize: '0.95rem' }}>📞 Or Link via Phone Number</h4>
                <form onSubmit={handleGetPairingCode} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="e.g. 8801712345678"
                    value={pairingPhone}
                    onChange={e => setPairingPhone(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.93rem' }}
                  />
                  <button type="submit" disabled={waActionLoading} className="wa-btn" style={{ background: '#0f172a', color: 'white' }}>
                    {waActionLoading ? '...' : 'Get Code'}
                  </button>
                </form>

                {pairingResult && (
                  <div style={{ marginTop: '16px', background: '#eff6ff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                    <p style={{ margin: '0 0 6px', color: '#1e3a8a', fontSize: '0.88rem', fontWeight: 600 }}>Your Pairing Code:</p>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '6px', color: '#1d4ed8', fontFamily: 'monospace' }}>{pairingResult}</div>
                    <p style={{ color: '#1e3a8a', fontSize: '0.8rem', marginTop: '10px', marginBottom: 0 }}>
                      Enter this in WhatsApp → Linked Devices → Link with phone number instead.
                    </p>
                  </div>
                )}
              </div>

              {/* Reset Session */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0 0 10px' }}>
                  🔧 If you are stuck in a reconnect loop or session is corrupted:
                </p>
                <button onClick={handleResetSession} disabled={waActionLoading} className="wa-btn" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', width: '100%' }}>
                  {waActionLoading ? 'Resetting...' : '🗑️ Reset Session (Clear All Session Data)'}
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Facebook Messenger Card */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>🌐</span> Meta Facebook Webhook
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
            Connect your Facebook Page Messenger by registering the webhook in Meta Developer portal.
          </p>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Webhook Config for Meta Developer:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Callback URL:</span>
                <code style={{ background: '#e2e8f0', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem', wordBreak: 'break-all', display: 'block' }}>
                  {agentApiUrl}/api/agent/facebook/webhook
                </code>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Verify Token:</span>
                <code style={{ background: '#e2e8f0', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem', display: 'block' }}>
                  {fbSettings.verifyToken || 'verify_token_default'}
                </code>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveFbSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>Facebook Page ID</label>
              <input
                type="text"
                placeholder="e.g. 10293847561234"
                value={fbSettings.pageId}
                onChange={e => setFbSettings({ ...fbSettings, pageId: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.93rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>Page Access Token</label>
              <textarea
                placeholder="Paste Page Access Token from Meta developer app"
                rows={4}
                value={fbSettings.accessToken}
                onChange={e => setFbSettings({ ...fbSettings, accessToken: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>Webhook Verify Token</label>
              <input
                type="text"
                placeholder="e.g. my_verify_token_secret"
                value={fbSettings.verifyToken}
                onChange={e => setFbSettings({ ...fbSettings, verifyToken: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.93rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: saveStatus.includes('Failed') || saveStatus.includes('Error') ? '#ef4444' : '#10b981' }}>{saveStatus}</span>
              <button type="submit" className="wa-btn" style={{ background: '#2563eb', color: 'white', padding: '12px 28px' }}>
                💾 Save Meta Config
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Web Chat Info Card */}
      <div style={{ marginTop: '28px', background: 'white', padding: '28px 32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🖥️</span> Storefront Web Chatbot
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0 0 16px' }}>
          The AI chat widget is embedded on every page of your storefront automatically. No configuration required.
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 18px' }}>
          <span style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>✅ Web Chatbot is always active</span>
          <p style={{ color: '#166534', fontSize: '0.82rem', margin: '4px 0 0' }}>Customers can chat with your AI Agent live on your store at any time.</p>
        </div>
      </div>

    </div>
  );
}
