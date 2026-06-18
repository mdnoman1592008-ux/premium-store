"use client";
import React from 'react';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px' }}>
      
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        padding: '60px 0',
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <div className="container">
          <div style={{ 
            display: 'inline-block', 
            padding: '6px 14px', 
            background: 'white', 
            color: 'var(--primary)', 
            borderRadius: '50px', 
            fontWeight: 700, 
            fontSize: '0.8rem', 
            marginBottom: '16px',
            border: '1px solid #bfdbfe',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Legal
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Refund Policy
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', marginTop: '10px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Our guidelines for replacements and refunds.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-card" style={{ padding: '48px 40px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>1. Overview</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            At Premium Account Store, we strive to ensure 100% customer satisfaction. Due to the digital nature of our products (subscription accounts, license keys), we have specific guidelines regarding replacements and refunds to protect both our business and our customers.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>2. Warranty & Replacements</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            All accounts come with a stated warranty period. If your purchased account stops working or loses its premium status during the warranty period, <strong>we will provide a replacement account free of charge.</strong> Please contact our support team with your Order ID, and we will issue a replacement within 24 hours.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>3. Eligibility for Refunds</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            Refunds are strictly issued under the following conditions:
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>We are unable to deliver your purchased account within 48 hours of payment verification.</li>
              <li style={{ marginBottom: '8px' }}>Your account stops working within the warranty period, and we are unable to provide a working replacement within 48 hours of your report.</li>
            </ul>
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>4. Non-Refundable Cases</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            We do not issue refunds or replacements in the following scenarios:
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>Change of mind after the account has been delivered.</li>
              <li style={{ marginBottom: '8px' }}>The warranty period for your account has expired.</li>
              <li style={{ marginBottom: '8px' }}>You have violated the usage terms (e.g., changing the password of a shared account).</li>
              <li style={{ marginBottom: '8px' }}>Your device or network is incompatible with the service (e.g., regional blocks without using a VPN).</li>
            </ul>
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>5. How to Request a Refund or Replacement</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            To request assistance, please email us or contact us via WhatsApp with your <strong>Order ID</strong> and a detailed description of the issue. Our support team will verify the claim and proceed with the replacement or refund process. Approved refunds will be processed back to your original payment method within 3-5 business days.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>6. Contact Us</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
            If you have any questions regarding our refund policy, please reach out: <br/>
            <strong>Email:</strong> support@premiumstore.com
          </p>
          
        </div>
      </div>
    </div>
  );
}
