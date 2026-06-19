"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AIAgentAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [agentLoggedIn, setAgentLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

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
    setTimeout(() => setToast(null), 5000);
  };

  // Agent-specific token (separate from main backend token)
  const getAgentHeaders = () => {
    const token = localStorage.getItem('agentAdminToken');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  // Login to the ai-agent directly
  const handleAgentLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginUsername || !loginPassword) {
      showToast('Enter your admin username and password', 'error');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        localStorage.setItem('agentAdminToken', data.token);
        setAgentLoggedIn(true);
        showToast('Connected to AI Agent!', 'success');
        fetchStatusAndSettings();
      } else {
        showToast(`Login failed: ${data.message || res.status}`, 'error');
      }
    } catch (err: any) {
      showToast(`Cannot reach AI Agent: ${err.message}`, 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const checkAgentAuth = useCallback(async () => {
    const token = localStorage.getItem('agentAdminToken');
    if (!token) { setLoading(false); return; }

    // Verify token is still valid by calling status
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/status`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAgentLoggedIn(true);
        const data = await res.json();
        setWaStatus(data);
        // Also load FB settings
        const fbRes = await fetch(`${agentApiUrl}/api/agent/facebook/settings`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        if (fbRes.ok) setFbSettings(await fbRes.json());
      } else if (res.status === 401) {
        // Token expired - clear and show login
        localStorage.removeItem('agentAdminToken');
        setAgentLoggedIn(false);
      }
    } catch (err) {
      console.error('Agent auth check failed:', err);
    } finally {
      setLoading(false);
    }
  }, [agentApiUrl]);

  const fetchStatusAndSettings = useCallback(async () => {
    const token = localStorage.getItem('agentAdminToken');
    if (!token) return;
    try {
      const waRes = await fetch(`${agentApiUrl}/api/agent/whatsapp/status`, { headers: getAgentHeaders() });
      if (waRes.ok) setWaStatus(await waRes.json());
      else if (waRes.status === 401) { localStorage.removeItem('agentAdminToken'); setAgentLoggedIn(false); }

      const fbRes = await fetch(`${agentApiUrl}/api/agent/facebook/settings`, { headers: getAgentHeaders() });
      if (fbRes.ok) setFbSettings(await fbRes.json());
    } catch (err) {
      console.error('Fetch status failed:', err);
    }
  }, [agentApiUrl]);

  useEffect(() => {
    // Also check if main admin is logged in
    if (!localStorage.getItem('adminToken')) { router.push('/admin/login'); return; }
    checkAgentAuth();
  }, [checkAgentAuth, router]);

  useEffect(() => {
    if (!agentLoggedIn) return;
    const interval = setInterval(fetchStatusAndSettings, 5000);
    return () => clearInterval(interval);
  }, [agentLoggedIn, fetchStatusAndSettings]);

  // --- WhatsApp Actions ---
  const handleConnectWhatsApp = async () => {
    setWaActionLoading(true);
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/connect`, { method: 'POST', headers: getAgentHeaders() });
      if (res.ok) { showToast('Connection started! Waiting for QR...', 'success'); fetchStatusAndSettings(); }
      else { const d = await res.json().catch(() => ({})); showToast(`Failed: ${d.message || d.error || res.status}`, 'error'); }
    } catch (err: any) { showToast(`Error: ${err.message}`, 'error'); }
    finally { setWaActionLoading(false); }
  };

  const handleDisconnectWhatsApp = async () => {
    if (!confirm('Disconnect WhatsApp? This will clear the session.')) return;
    setWaActionLoading(true);
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/disconnect`, { method: 'POST', headers: getAgentHeaders() });
      if (res.ok) { showToast('WhatsApp disconnected.', 'success'); setPairingResult(''); fetchStatusAndSettings(); }
      else { const d = await res.json().catch(() => ({})); showToast(`Failed: ${d.message || d.error || res.status}`, 'error'); }
    } catch (err: any) { showToast(`Error: ${err.message}`, 'error'); }
    finally { setWaActionLoading(false); }
  };

  const handleResetSession = async () => {
    if (!confirm('Hard reset: deletes all saved session data from database. You will need to re-scan QR or get a new pairing code.')) return;
    setWaActionLoading(true);
    setPairingResult('');
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/reset`, { method: 'POST', headers: getAgentHeaders() });
      if (res.ok) { showToast('✅ Session reset! Now click Start Connection or enter phone number.', 'success'); fetchStatusAndSettings(); }
      else { const d = await res.json().catch(() => ({})); showToast(`Reset failed: ${d.message || d.error || res.status}`, 'error'); }
    } catch (err: any) { showToast(`Error: ${err.message}`, 'error'); }
    finally { setWaActionLoading(false); }
  };

  const handleGetPairingCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingPhone) { showToast('Enter a phone number (e.g. 8801712345678)', 'error'); return; }
    setWaActionLoading(true); setPairingResult('');
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/whatsapp/pair`, {
        method: 'POST', headers: getAgentHeaders(),
        body: JSON.stringify({ phone: pairingPhone })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.pairingCode) { setPairingResult(data.pairingCode); showToast('Pairing code ready!', 'success'); }
      else { showToast(`Failed: ${data.message || data.error || res.status}`, 'error'); }
    } catch (err: any) { showToast(`Error: ${err.message}`, 'error'); }
    finally { setWaActionLoading(false); }
  };

  const handleSaveFbSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setSaveStatus('Saving...');
    try {
      const res = await fetch(`${agentApiUrl}/api/agent/facebook/settings`, {
        method: 'POST', headers: getAgentHeaders(), body: JSON.stringify(fbSettings)
      });
      if (res.ok) { setSaveStatus('Saved!'); setTimeout(() => setSaveStatus(''), 3000); }
      else { const d = await res.json().catch(() => ({})); setSaveStatus(`Failed: ${d.message || d.error || res.status}`); }
    } catch (err: any) { setSaveStatus(`Error: ${err.message}`); }
  };

  const statusColor = waStatus.status === 'Connected' ? '#10b981' : waStatus.status === 'Scanning' || waStatus.status === 'Connecting' ? '#f59e0b' : '#ef4444';
  const statusBg   = waStatus.status === 'Connected' ? '#ecfdf5' : waStatus.status === 'Scanning' || waStatus.status === 'Connecting' ? '#fffbeb' : '#fef2f2';
  const statusBorder = waStatus.status === 'Connected' ? '#bbf7d0' : waStatus.status === 'Scanning' || waStatus.status === 'Connecting' ? '#fef3c7' : '#fecaca';

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚙️</div>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Connecting to AI Agent...</p>
      </div>
    );
  }

  // ─── Agent Login Screen ───────────────────────────────────────────────────
  if (!agentLoggedIn) {
    return (
      <div style={{ maxWidth: '420px', margin: '80px auto', padding: '0 16px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '3rem' }}>🤖</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '12px 0 4px' }}>Connect to AI Agent</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Enter your admin credentials to connect to the AI Agent service.</p>
          </div>

          {toast && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
              background: toast.type === 'error' ? '#fef2f2' : '#ecfdf5',
              border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
              color: toast.type === 'error' ? '#991b1b' : '#065f46', fontWeight: 600, fontSize: '0.88rem' }}>
              {toast.type === 'error' ? '❌ ' : '✅ '}{toast.msg}
            </div>
          )}

          <form onSubmit={handleAgentLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Admin Username</label>
              <input
                type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
                placeholder="Enter admin username"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Password</label>
              <input
                type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" disabled={loginLoading}
              style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: 700, fontSize: '1rem', cursor: loginLoading ? 'not-allowed' : 'pointer', opacity: loginLoading ? 0.7 : 1, marginTop: '4px' }}>
              {loginLoading ? 'Connecting...' : '🔗 Connect to AI Agent'}
            </button>
          </form>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', marginTop: '20px', marginBottom: 0 }}>
            Use the same username and password as your admin login.
          </p>
        </div>
      </div>
    );
  }

  // ─── Main Agent Page ──────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px', position: 'relative' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          padding: '14px 22px', borderRadius: '12px', maxWidth: '380px',
          background: toast.type === 'success' ? '#ecfdf5' : toast.type === 'error' ? '#fef2f2' : '#eff6ff',
          border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : toast.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
          color: toast.type === 'success' ? '#065f46' : toast.type === 'error' ? '#991b1b' : '#1e3a8a',
          fontWeight: 600, fontSize: '0.92rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          animation: 'slideIn 0.3s ease'
        }}>
          {toast.type === 'success' ? '✅ ' : toast.type === 'error' ? '❌ ' : 'ℹ️ '}{toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        .wa-btn { border:none; padding:11px 18px; border-radius:10px; font-weight:700; cursor:pointer; font-size:0.88rem; transition:all 0.2s; }
        .wa-btn:hover { opacity:0.85; transform:translateY(-1px); }
        .wa-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px', paddingTop: '8px' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>🤖 AI Agent Connections</h1>
          <p style={{ color: '#64748b', marginTop: '6px', margin: '6px 0 0', fontSize: '0.92rem' }}>Manage WhatsApp, Facebook Messenger, and Web Chatbot integrations.</p>
        </div>
        <button onClick={() => { localStorage.removeItem('agentAdminToken'); setAgentLoggedIn(false); }}
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 16px', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
          🔓 Disconnect Agent
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>

        {/* WhatsApp Card */}
        <div style={{ background: 'white', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>💬</span> WhatsApp Connection
            </h2>
            <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.76rem', fontWeight: 700, background: statusBg, color: statusColor, border: `1px solid ${statusBorder}` }}>
              {waStatus.status === 'Connecting' ? '⏳ Connecting...' : waStatus.status}
            </span>
          </div>

          {waStatus.status === 'Connected' ? (
            <div style={{ textAlign: 'center', padding: '28px 16px', background: '#f0fdf4', borderRadius: '12px', border: '1px dashed #86efac' }}>
              <div style={{ fontSize: '2.5rem' }}>✅</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803d', margin: '10px 0 6px' }}>WhatsApp Bot is Active!</h3>
              <p style={{ color: '#166534', fontSize: '0.85rem', marginBottom: '18px' }}>AI Agent is connected and auto-replying to messages.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={handleDisconnectWhatsApp} disabled={waActionLoading} className="wa-btn" style={{ background: '#ef4444', color: 'white' }}>🔌 Disconnect</button>
                <button onClick={handleResetSession} disabled={waActionLoading} className="wa-btn" style={{ background: '#f97316', color: 'white' }}>🔄 Reset Session</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {(waStatus.reconnectAttempts || 0) >= 5 && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 14px', fontSize: '0.85rem', color: '#991b1b' }}>
                  ⚠️ <strong>Max reconnects reached.</strong> Click <strong>Reset Session</strong> first.
                </div>
              )}

              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Link your WhatsApp to enable AI auto-replies via QR code or phone number pairing.</p>

              {waStatus.status === 'Disconnected' && (
                <button onClick={handleConnectWhatsApp} disabled={waActionLoading} className="wa-btn" style={{ background: '#25D366', color: 'white', width: '100%', padding: '13px', fontSize: '0.95rem' }}>
                  {waActionLoading ? 'Starting...' : '📱 Start Connection (Generate QR)'}
                </button>
              )}

              {(waStatus.status === 'Scanning' || waStatus.status === 'Connecting') && !waStatus.qrCode && (
                <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⏳</div>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>Generating QR code... please wait a few seconds.</p>
                </div>
              )}

              {waStatus.qrCode && (
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px', color: '#334155', fontSize: '0.9rem', fontWeight: 700 }}>📷 Scan in WhatsApp → Linked Devices → Link a Device:</h4>
                  <img src={waStatus.qrCode} alt="WhatsApp QR Code" style={{ width: '200px', height: '200px', margin: '0 auto', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '10px', background: 'white', display: 'block' }} />
                </div>
              )}

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <h4 style={{ margin: '0 0 10px', color: '#334155', fontWeight: 700, fontSize: '0.9rem' }}>📞 Or Link via Phone Number Pairing Code</h4>
                <form onSubmit={handleGetPairingCode} style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="e.g. 8801712345678" value={pairingPhone}
                    onChange={e => setPairingPhone(e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                  <button type="submit" disabled={waActionLoading} className="wa-btn" style={{ background: '#0f172a', color: 'white' }}>
                    {waActionLoading ? '...' : 'Get Code'}
                  </button>
                </form>
                {pairingResult && (
                  <div style={{ marginTop: '14px', background: '#eff6ff', padding: '18px', borderRadius: '12px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                    <p style={{ margin: '0 0 6px', color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600 }}>Your Pairing Code:</p>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '6px', color: '#1d4ed8', fontFamily: 'monospace' }}>{pairingResult}</div>
                    <p style={{ color: '#1e3a8a', fontSize: '0.78rem', marginTop: '10px', marginBottom: 0 }}>WhatsApp → Linked Devices → Link with phone number instead.</p>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 8px' }}>🔧 Stuck in reconnect loop or session corrupted?</p>
                <button onClick={handleResetSession} disabled={waActionLoading} className="wa-btn"
                  style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', width: '100%' }}>
                  {waActionLoading ? 'Resetting...' : '🗑️ Reset Session (Clear All Session Data)'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Facebook Card */}
        <div style={{ background: 'white', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌐</span> Meta Facebook Webhook
          </h2>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Meta Developer Webhook Config:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>Callback URL:</span>
                <code style={{ background: '#e2e8f0', padding: '5px 8px', borderRadius: '6px', fontSize: '0.8rem', wordBreak: 'break-all', display: 'block' }}>
                  {agentApiUrl}/api/agent/facebook/webhook
                </code>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>Verify Token:</span>
                <code style={{ background: '#e2e8f0', padding: '5px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'block' }}>
                  {fbSettings.verifyToken || 'verify_token_default'}
                </code>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveFbSettings} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Facebook Page ID', key: 'pageId', placeholder: 'e.g. 10293847561234', type: 'text' },
              { label: 'Webhook Verify Token', key: 'verifyToken', placeholder: 'e.g. my_verify_token_secret', type: 'text' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{label}</label>
                <input type={type} placeholder={placeholder} value={(fbSettings as any)[key]}
                  onChange={e => setFbSettings({ ...fbSettings, [key]: e.target.value })}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Page Access Token</label>
              <textarea placeholder="Paste Page Access Token from Meta developer app" rows={3}
                value={fbSettings.accessToken} onChange={e => setFbSettings({ ...fbSettings, accessToken: e.target.value })}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'monospace', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: saveStatus.includes('Failed') || saveStatus.includes('Error') ? '#ef4444' : '#10b981' }}>{saveStatus}</span>
              <button type="submit" className="wa-btn" style={{ background: '#2563eb', color: 'white', padding: '11px 24px' }}>💾 Save Config</button>
            </div>
          </form>
        </div>
      </div>

      {/* Web Chat info */}
      <div style={{ marginTop: '24px', background: 'white', padding: '24px 28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🖥️</span> Storefront Web Chatbot
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 12px' }}>The AI chat widget is embedded on every storefront page automatically — no configuration needed.</p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px' }}>
          <span style={{ color: '#166534', fontWeight: 700, fontSize: '0.88rem' }}>✅ Web Chatbot is always active</span>
        </div>
      </div>
    </div>
  );
}
