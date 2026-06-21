"use client";
import React, { useEffect, useState } from 'react';

export default function CleanupPage() {
  const [msg, setMsg] = useState('Cleaning up 18 months plans from non-Gemini apps...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/cleanup-18-months`)
      .then(res => res.json())
      .then(data => {
        setMsg(data.message || 'Cleanup complete!');
      })
      .catch(err => {
        setMsg('Error: ' + err.message);
      });
  }, []);

  return (
    <div style={{ padding: '60px', textAlign: 'center', fontSize: '1.2rem', fontFamily: 'system-ui' }}>
      <h1>Database Cleanup</h1>
      <p>{msg}</p>
      <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'gray' }}>
        You can safely delete this page after seeing the success message.
      </p>
    </div>
  );
}
