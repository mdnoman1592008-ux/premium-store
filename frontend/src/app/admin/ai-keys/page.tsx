"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState('openrouter');
  const [bulkKeys, setBulkKeys] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchKeys = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/admin/ai-keys`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [router]);

  const handleAddKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkKeys.trim()) {
      setMessage('Please enter at least one API key.');
      return;
    }
    setSubmitLoading(true);
    setMessage('');
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${apiUrl}/api/admin/ai-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ provider, keys: bulkKeys })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Keys added successfully!');
        setBulkKeys('');
        fetchKeys();
      } else {
        setMessage(data.message || 'Failed to add keys.');
      }
    } catch (err: any) {
      setMessage(err.message || 'An error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API Key?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${apiUrl}/api/admin/ai-keys/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchKeys();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading AI Keys...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>Manage AI API Keys</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Add and manage API keys for your AI providers (Bulk Supported).</p>
        </div>
      </div>
      
      {/* Add New API Keys Card */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 20px 0' }}>Add New API Keys (Bulk)</h2>
        
        <form onSubmit={handleAddKeys} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Select AI Provider</label>
            <select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
              style={{ width: '100%', maxWidth: '300px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }}
            >
              <option value="openrouter">OpenRouter</option>
              <option value="deepseek">DeepSeek</option>
              <option value="groq">Groq</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Paste API Keys (One per line, or comma-separated)</label>
            <textarea
              value={bulkKeys}
              onChange={(e) => setBulkKeys(e.target.value)}
              rows={5}
              placeholder="sk-or-v1-abcd123...\nsk-or-v1-xyz987..."
              style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'monospace', outline: 'none', backgroundColor: '#f8fafc', resize: 'vertical' }}
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              disabled={submitLoading}
              style={{ background: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: submitLoading ? 'not-allowed' : 'pointer', opacity: submitLoading ? 0.7 : 1 }}
            >
              {submitLoading ? 'Saving Keys...' : 'Save Keys'}
            </button>
          </div>
          
          {message && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', background: message.includes('success') ? '#ecfdf5' : '#fef2f2', border: `1px solid ${message.includes('success') ? '#10b981' : '#ef4444'}`, color: message.includes('success') ? '#047857' : '#b91c1c', fontWeight: 500 }}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Active API Keys List */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Active API Keys ({keys.length})</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'white', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Snippet</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8' }}>
                    No API keys found. Add some keys above to get started.
                  </td>
                </tr>
              ) : (
                keys.map((k) => (
                  <tr key={k._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize',
                        background: k.provider === 'openrouter' ? '#eff6ff' : k.provider === 'deepseek' ? '#faf5ff' : k.provider === 'groq' ? '#fff7ed' : '#ecfdf5',
                        color: k.provider === 'openrouter' ? '#2563eb' : k.provider === 'deepseek' ? '#9333ea' : k.provider === 'groq' ? '#ea580c' : '#16a34a'
                      }}>
                        {k.provider}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: '#475569', fontSize: '0.95rem' }}>
                      {maskKey(k.key)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {k.isActive ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span> Active
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 600, fontSize: '0.9rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> Disabled
                        </div>
                      )}
                      {k.lastError && (
                        <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={k.lastError}>
                          Err: {k.lastError}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(k._id)}
                        style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
