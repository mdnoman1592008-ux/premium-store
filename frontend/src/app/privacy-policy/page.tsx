"use client";
import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', marginTop: '10px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            How we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-card" style={{ padding: '48px 40px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>1. Introduction</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            At Premium Account Store, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our digital services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>2. Information We Collect</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            <br/><br/>
            <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.
            <br/><br/>
            <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>3. How We Use Your Information</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>Create and manage your account.</li>
              <li style={{ marginBottom: '8px' }}>Process your transactions and deliver your digital subscriptions.</li>
              <li style={{ marginBottom: '8px' }}>Email you regarding your account or order status.</li>
              <li style={{ marginBottom: '8px' }}>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
              <li style={{ marginBottom: '8px' }}>Increase the efficiency and operation of the Site.</li>
            </ul>
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>4. Data Security</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>5. Third-Party Payment Processors</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            We use third-party payment processors to process payments made to us. In connection with the processing of such payments, we do not retain any personally identifiable information or any financial information such as credit card numbers. Rather, all such information is provided directly to our third-party processors.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>6. Contact Us</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
            If you have questions or comments about this Privacy Policy, please contact us at: <br/>
            <strong>Email:</strong> support@premiumstore.com
          </p>
          
        </div>
      </div>
    </div>
  );
}
