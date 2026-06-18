"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const resetPassword = async (userId: string) => {
    const newPassword = prompt("Enter new password for the user (min 6 characters):");
    if (!newPassword) return;
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert('Password reset successfully.');
      } else {
        alert(`Failed to reset password: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Manage Users</h1>
          <Link href="/admin/dashboard" className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '10px' }}>
            Back to Dashboard
          </Link>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Name</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Email / Phone</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Joined At</th>
                <th style={{ padding: '16px 24px', color: '#475569' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>No users found.</td></tr>
              ) : users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: '#0f172a' }}>{user.name}</td>
                  <td style={{ padding: '16px 24px', color: '#475569' }}>{user.email || user.phone}</td>
                  <td style={{ padding: '16px 24px', color: '#475569' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <button 
                      onClick={() => resetPassword(user._id)} 
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}
                    >
                      Reset Password
                    </button>
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
