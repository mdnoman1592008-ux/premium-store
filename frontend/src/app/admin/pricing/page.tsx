"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PricingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProducts = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [router]);

  const updateDurations = async (appId: string, planId: string, durations: any[]) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${appId}/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ durations })
      });
      if (res.ok) {
        alert('Pricing updated successfully');
        fetchProducts();
      } else {
        alert('Failed to update pricing');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="container" style={{ maxWidth: '1000px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Manage Pricing</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gap: '32px' }}>
            {products.map(product => (
              <div key={product._id} style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px', color: '#1e293b' }}>{product.appName}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {product.plans.map((plan: any) => (
                    <div key={plan._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', margin: 0 }}>{plan.planName}</h3>
                      </div>
                      <div style={{ padding: '24px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ color: '#64748b', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9' }}>
                              <th style={{ paddingBottom: '12px' }}>Duration</th>
                              <th style={{ paddingBottom: '12px' }}>Price (৳)</th>
                              <th style={{ paddingBottom: '12px' }}>Discount (৳)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {((plan.durations && plan.durations.length > 0 && plan.durations[0].label) ? plan.durations : [
                              { months: 1, label: '1 Month', price: 0, discount: 0 },
                              { months: 3, label: '3 Months', price: 0, discount: 0 },
                              { months: 6, label: '6 Months', price: 0, discount: 0 },
                              { months: 12, label: '12 Months', price: 0, discount: 0 },
                              { months: 18, label: '18 Months', price: 0, discount: 0 }
                            ]).map((duration: any, idx: number) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '12px 0', fontWeight: 600 }}>{duration.label}</td>
                                <td style={{ padding: '12px 0' }}>
                                  <input 
                                    type="number" 
                                    defaultValue={duration.price} 
                                    id={`price-${plan._id}-${idx}`}
                                    style={{ width: '120px', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                  />
                                </td>
                                <td style={{ padding: '12px 0' }}>
                                  <input 
                                    type="number" 
                                    defaultValue={duration.discount} 
                                    id={`discount-${plan._id}-${idx}`}
                                    style={{ width: '120px', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                          <button 
                            className="btn-primary" 
                            style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '0.95rem' }}
                            onClick={() => {
                              const targetDurations = (plan.durations && plan.durations.length > 0 && plan.durations[0].label) ? plan.durations : [
                                { months: 1, label: '1 Month', price: 0, discount: 0 },
                                { months: 3, label: '3 Months', price: 0, discount: 0 },
                                { months: 6, label: '6 Months', price: 0, discount: 0 },
                                { months: 12, label: '12 Months', price: 0, discount: 0 },
                                { months: 18, label: '18 Months', price: 0, discount: 0 }
                              ];
                              const updatedDurations = targetDurations.map((d: any, idx: number) => ({
                                ...d,
                                price: Number((document.getElementById(`price-${plan._id}-${idx}`) as HTMLInputElement).value),
                                discount: Number((document.getElementById(`discount-${plan._id}-${idx}`) as HTMLInputElement).value)
                              }));
                              updateDurations(product.appId, plan._id, updatedDurations);
                            }}
                          >
                            Save {plan.planName} Pricing
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
