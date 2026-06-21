"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New coupon state
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [applicableApp, setApplicableApp] = useState('All');
  const [maxUses, setMaxUses] = useState('0');

  const router = useRouter();

  const fetchCoupons = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [router]);

  const addCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          code, 
          discountPercentage: Number(discount), 
          validUntil,
          applicableApp,
          maxUses: Number(maxUses)
        })
      });
      if (res.ok) {
        alert('Coupon added successfully');
        setCode('');
        setDiscount('');
        setValidUntil('');
        setApplicableApp('All');
        setMaxUses('0');
        fetchCoupons();
      } else {
        const errorData = await res.json();
        alert(`Failed to add coupon: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="container" style={{ maxWidth: '1000px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Manage Coupons</h1>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Add New Coupon</h2>
          <form onSubmit={addCoupon} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#64748b' }}>Coupon Code</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="e.g. SUMMER10" />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#64748b' }}>Discount (%)</label>
              <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="e.g. 10" />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#64748b' }}>Valid Until</label>
              <input type="datetime-local" value={validUntil} onChange={e => setValidUntil(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#64748b' }}>App (e.g. Gemini, or All)</label>
              <input type="text" value={applicableApp} onChange={e => setApplicableApp(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="All" />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#64748b' }}>Max Limit (0=No limit)</label>
              <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="0" />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px' }}>Add Coupon</button>
          </form>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Code</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Discount</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Valid Until</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>App</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Uses</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Status</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center' }}>No coupons found.</td></tr>
              ) : coupons.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 700 }}>{c.code}</td>
                  <td style={{ padding: '16px 24px' }}>{c.discountPercentage}%</td>
                  <td style={{ padding: '16px 24px' }}>{new Date(c.validUntil).toLocaleString()}</td>
                  <td style={{ padding: '16px 24px' }}>{c.applicableApp || 'All'}</td>
                  <td style={{ padding: '16px 24px' }}>{c.usesCount || 0} / {c.maxUses === 0 || !c.maxUses ? '∞' : c.maxUses}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '0.8rem', background: c.isActive && new Date(c.validUntil) > new Date() ? '#dcfce7' : '#fee2e2', color: c.isActive && new Date(c.validUntil) > new Date() ? '#16a34a' : '#ef4444' }}>
                      {c.isActive && new Date(c.validUntil) > new Date() ? 'Active' : 'Expired/Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button onClick={() => deleteCoupon(c._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
