"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchStats();
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'white', color: 'var(--primary)', border: '1px solid #e2e8f0', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Management Portal
            </div>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Admin Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <Link 
              href="/admin/orders" 
              className="btn-secondary" 
              style={{ 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: 600, 
                fontSize: '0.95rem',
                border: '1.5px solid #cbd5e1',
                background: 'white',
                color: '#374151'
              }}
            >
              Manage Orders
            </Link>
            <Link 
              href="/admin/pricing" 
              className="btn-secondary" 
              style={{ 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: 600, 
                fontSize: '0.95rem',
                border: '1.5px solid #cbd5e1',
                background: 'white',
                color: '#374151'
              }}
            >
              Manage Pricing
            </Link>
            <Link 
              href="/admin/coupons" 
              className="btn-secondary" 
              style={{ 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: 600, 
                fontSize: '0.95rem',
                border: '1.5px solid #cbd5e1',
                background: 'white',
                color: '#374151'
              }}
            >
              Manage Coupons
            </Link>
            <Link 
              href="/admin/users" 
              className="btn-secondary" 
              style={{ 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: 600, 
                fontSize: '0.95rem',
                border: '1.5px solid #cbd5e1',
                background: 'white',
                color: '#374151'
              }}
            >
              Manage Users
            </Link>
            <Link 
              href="/admin/payments" 
              className="btn-secondary" 
              style={{ 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: 600, 
                fontSize: '0.95rem',
                border: '1.5px solid #cbd5e1',
                background: 'white',
                color: '#374151'
              }}
            >
              Manage Payments
            </Link>
            <button 
              onClick={() => { localStorage.removeItem('adminToken'); router.push('/admin/login'); }} 
              className="btn-primary" 
              style={{ 
                background: '#ef4444', 
                borderColor: '#ef4444',
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: '12px',
                fontWeight: 600, 
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(239,68,68,0.2)'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {!stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '160px', background: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            
            {/* Total Orders */}
            <div className="glass-card" style={{ padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 16px', fontSize: '1.3rem' }}>
                📦
              </div>
              <h3 style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Orders</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.totalOrders}</div>
            </div>

            {/* Pending Orders */}
            <div className="glass-card" style={{ padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', margin: '0 auto 16px', fontSize: '1.3rem' }}>
                🕒
              </div>
              <h3 style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Pending Verification</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#f59e0b' }}>{stats.pendingOrders}</div>
            </div>

            {/* Delivered Orders */}
            <div className="glass-card" style={{ padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 16px', fontSize: '1.3rem' }}>
                ✅
              </div>
              <h3 style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Delivered</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#10b981' }}>{stats.deliveredOrders}</div>
            </div>

            {/* Total Revenue */}
            <div className="glass-card" style={{ padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 16px', fontSize: '1.3rem' }}>
                ৳
              </div>
              <h3 style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Revenue</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary)' }}>৳{stats.revenue}</div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
