"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Credentials editor state
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [credEmail, setCredEmail] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credPin, setCredPin] = useState('');

  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) {
      router.push('/admin/login');
      return;
    }
    setToken(t);
    fetchOrders(t);
  }, [router]);

  const fetchOrders = async (t: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders(token); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="container" style={{ maxWidth: '1100px', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Order Management</h1>
          </div>
        </div>

        {/* Table/Cards Container */}
        {loading ? (
          <div style={{ height: '300px', background: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        ) : (
          <div className="glass-card" style={{ 
            background: 'white', 
            borderRadius: '24px', 
            border: '1px solid #f1f5f9', 
            boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
            overflow: 'hidden',
            padding: 0
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #f1f5f9', background: '#f8fafc' }}>
                    <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service Description</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gateway / TRX ID</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sender Number</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Screenshot</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="table-row-hover">
                      <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a' }}>
                        <Link href={`/orders/${o.orderId}`} style={{ color: 'var(--primary)' }}>
                          {o.orderId}
                        </Link>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{o.appName}</div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>{o.planName} - {o.duration}</div>
                      </td>
                      <td style={{ padding: '20px 24px', fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>
                        ৳{o.price}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>{o.paymentMethod}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>{o.transactionId}</div>
                      </td>
                      <td style={{ padding: '20px 24px', color: '#475569', fontWeight: 500 }}>
                        {o.senderNumber}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        {o.screenshotUrl ? (
                          <a 
                            href={`http://localhost:5000${o.screenshotUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: 'var(--primary)', 
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              textDecoration: 'underline'
                            }}
                          >
                            View 🖼️
                          </a>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '6px 12px', 
                          borderRadius: '50px', 
                          fontSize: '0.85rem', 
                          fontWeight: 700,
                          background: o.status === 'Pending' ? '#fffbeb' : o.status === 'Verified' ? '#eff6ff' : o.status === 'Cancelled' ? '#fef2f2' : '#ecfdf5',
                          color: o.status === 'Pending' ? '#d97706' : o.status === 'Verified' ? '#2563eb' : o.status === 'Cancelled' ? '#ef4444' : '#059669'
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                          <select 
                            value={o.status} 
                            onChange={e => updateStatus(o.orderId, e.target.value)}
                            style={{ 
                              padding: '8px 12px', 
                              borderRadius: '10px', 
                              border: '1.5px solid #cbd5e1', 
                              background: 'white', 
                              outline: 'none',
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              color: '#334155',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Verified">Verified</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          
                          <button 
                            onClick={() => {
                              setEditingOrder(o);
                              setCredEmail(o.credentialsEmail || '');
                              setCredPassword(o.credentialsPassword || '');
                              setCredPin(o.credentialsPin || '');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--primary)',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              textDecoration: 'underline',
                              textAlign: 'left',
                              padding: 0
                            }}
                          >
                            🔑 Deliver Info
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8', fontSize: '1.05rem' }}>
                        No orders have been submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Credentials Delivery Modal */}
      {editingOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15,23,42,0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            background: 'white',
            padding: '36px',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Deliver Subscription Credentials</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' }}>
              For Order <strong>#{editingOrder.orderId}</strong> ({editingOrder.appName})
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#475569' }}>Email / Username</label>
                <input 
                  type="text"
                  value={credEmail}
                  onChange={e => setCredEmail(e.target.value)}
                  placeholder="e.g. premium@account.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#475569' }}>Password</label>
                <input 
                  type="text"
                  value={credPassword}
                  onChange={e => setCredPassword(e.target.value)}
                  placeholder="e.g. Pass123!"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#475569' }}>Profile Name / Pin (Optional)</label>
                <input 
                  type="text"
                  value={credPin}
                  onChange={e => setCredPin(e.target.value)}
                  placeholder="e.g. Profile 1 (Pin: 1234)"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setEditingOrder(null)}
                className="btn-secondary"
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/orders/${editingOrder.orderId}/status`, {
                      method: 'PUT',
                      headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                      },
                      body: JSON.stringify({ 
                        status: 'Delivered',
                        credentialsEmail: credEmail,
                        credentialsPassword: credPassword,
                        credentialsPin: credPin
                      })
                    });
                    if (res.ok) {
                      setEditingOrder(null);
                      fetchOrders(token);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="btn-primary"
                style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}
              >
                Save & Deliver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
