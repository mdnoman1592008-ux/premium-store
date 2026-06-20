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

  // Utility to mask key for display
  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
  };

  if (loading) return <div className="p-8">Loading AI Keys...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage AI API Keys</h1>
      
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-10">
        <h2 className="text-xl font-semibold mb-4">Add New API Keys (Bulk)</h2>
        <form onSubmit={handleAddKeys} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Select AI Provider</label>
            <select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
              className="w-full md:w-1/3 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="openrouter">OpenRouter</option>
              <option value="deepseek">DeepSeek</option>
              <option value="groq">Groq</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Paste API Keys (One per line, or comma-separated)</label>
            <textarea
              value={bulkKeys}
              onChange={(e) => setBulkKeys(e.target.value)}
              rows={5}
              placeholder="sk-or-v1-abcd123...\nsk-or-v1-xyz987..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-red-500 transition-colors font-mono"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={submitLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {submitLoading ? 'Saving Keys...' : 'Save Keys'}
          </button>
          
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
              {message}
            </div>
          )}
        </form>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Active API Keys ({keys.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium">Provider</th>
                <th className="p-4 font-medium">Key Snippet</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {keys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No API keys found. Add some keys above to get started.
                  </td>
                </tr>
              ) : (
                keys.map((k) => (
                  <tr key={k._id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        k.provider === 'openrouter' ? 'bg-blue-500/20 text-blue-400' :
                        k.provider === 'deepseek' ? 'bg-purple-500/20 text-purple-400' :
                        k.provider === 'groq' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {k.provider}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-gray-300">
                      {maskKey(k.key)}
                    </td>
                    <td className="p-4">
                      {k.isActive ? (
                        <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 block"></span> Active</span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 block"></span> Disabled</span>
                      )}
                      {k.lastError && (
                        <div className="text-xs text-red-400 mt-1" title={k.lastError}>Error Logged</div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(k._id)}
                        className="text-gray-400 hover:text-red-400 transition-colors bg-gray-900/50 p-2 rounded border border-gray-700 hover:border-red-500/50"
                        title="Delete Key"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
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
