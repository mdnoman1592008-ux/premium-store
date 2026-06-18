"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PAYMENT_METHODS = ['bKash', 'Nagad', 'Rocket', 'Upay', 'Cellfin'];

export default function PaymentsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment-settings`);
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [router]);

  const updateSetting = async (method: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const numberInput = document.getElementById(`number-${method}`) as HTMLInputElement;
    const fileInput = document.getElementById(`qr-${method}`) as HTMLInputElement;

    const formData = new FormData();
    formData.append('number', numberInput.value);
    
    if (fileInput.files && fileInput.files[0]) {
      formData.append('qrCode', fileInput.files[0]);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment-settings/${method}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (res.ok) {
        alert(`${method} updated successfully!`);
        fetchSettings(); // Refresh to get new QR code URL if any
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="container" style={{ maxWidth: '1000px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Manage Payments</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {PAYMENT_METHODS.map(method => {
              const setting = settings.find(s => s.method === method.toLowerCase()) || { number: '', qrCodeUrl: '' };
              
              return (
                <div key={method} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  
                  {/* Current QR Code Preview */}
                  <div style={{ width: '120px', height: '120px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    {setting.qrCodeUrl ? (
                      <img src={setting.qrCodeUrl.startsWith('data:') ? setting.qrCodeUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${setting.qrCodeUrl}`} alt={`${method} QR`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No QR</span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>{method}</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#64748b' }}>Payment Number</label>
                        <input 
                          type="text" 
                          id={`number-${method.toLowerCase()}`} 
                          defaultValue={setting.number} 
                          placeholder={`Enter ${method} number`}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', color: '#64748b' }}>Upload New QR Code (Image)</label>
                        <input 
                          type="file" 
                          id={`qr-${method.toLowerCase()}`} 
                          accept="image/*"
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc' }}
                        />
                      </div>

                      <button 
                        onClick={() => updateSetting(method.toLowerCase())}
                        className="btn-primary" 
                        style={{ padding: '10px 20px', borderRadius: '8px', marginTop: '8px', alignSelf: 'flex-start' }}
                      >
                        Save {method}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
