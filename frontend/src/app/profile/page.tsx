"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || '');
        setPhone(data.phone || '');
        setPhotoPreview(data.photo ? (data.photo.startsWith('http') ? data.photo : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${data.photo}`) : '');
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem('userToken');
    
    try {
      let photoUrl = profile.photo;

      // Upload photo if a new one is selected
      if (photo) {
        const formData = new FormData();
        formData.append('image', photo);
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }, // Note: may need admin token if your upload route restricts it. We assume user can upload.
          body: formData
        });
        
        if (uploadRes.ok) {
          photoUrl = await uploadRes.text(); // multer returns the path as text or json. Assuming text here based on standard setup, or JSON.
          try {
            const parsed = JSON.parse(photoUrl);
            photoUrl = parsed.url || parsed.path || photoUrl;
          } catch(e) {}
        }
      }

      // Update Profile
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          password: password || undefined,
          photo: photoUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setPassword('');
        alert('Profile updated successfully!');
        // Dispatch custom event so Navbar updates immediately
        window.dispatchEvent(new Event('profileUpdate'));
      } else {
        const data = await res.json();
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '60px 20px' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '40px' }}>
          My Profile
        </h1>

        <div className="glass-card" style={{ padding: '40px 32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Avatar Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
                <label style={{
                  position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: 'white',
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </label>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Click the icon to upload photo</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Email / Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter email or phone"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>New Password (Optional)</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="btn-primary"
              style={{ padding: '16px', fontSize: '1.05rem', marginTop: '16px', width: '100%', opacity: updating ? 0.7 : 1 }}
            >
              {updating ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
