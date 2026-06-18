"use client";
import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', marginTop: '10px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Rules and guidelines for using our digital services.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-card" style={{ padding: '48px 40px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>1. Agreement to Terms</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Premium Account Store ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto. You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms of Service.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>2. Services Provided</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            We provide digital subscription accounts for various online platforms. Our services act as a reseller or provider of these digital keys and accounts. 
            <br/><br/>
            <strong>Shared Accounts:</strong> Some of our affordable plans provide shared accounts. You must not change the password, email, or any profile settings of a shared account. Doing so will immediately void your warranty.
            <br/><br/>
            <strong>Private Accounts:</strong> Private accounts are exclusively yours. You may change passwords and manage them as you see fit.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>3. User Representations</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            By using the Site, you represent and warrant that: 
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>All registration information you submit will be true, accurate, current, and complete.</li>
              <li style={{ marginBottom: '8px' }}>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li style={{ marginBottom: '8px' }}>You have the legal capacity and you agree to comply with these Terms of Service.</li>
              <li style={{ marginBottom: '8px' }}>You are not a minor in the jurisdiction in which you reside.</li>
              <li style={{ marginBottom: '8px' }}>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
            </ul>
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>4. Warranty and Delivery</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            We guarantee that the account credentials provided to you will be functional upon delivery. Delivery is typically completed within 5-15 minutes after payment verification. We provide a replacement warranty for the duration specified in your purchased plan. If an account stops working within the warranty period, we will replace it free of charge, provided you have not violated any usage terms.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>5. Account Suspension</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
            We reserve the right to suspend or terminate your access to the purchased accounts and our website if you are found to be violating these terms, including but not limited to sharing account credentials publicly, changing passwords on shared accounts, or using the accounts for illegal activities. No refunds will be provided in such cases.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>6. Contact Information</h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
            If you have questions regarding these terms, please contact us at: <br/>
            <strong>Email:</strong> support@premiumstore.com
          </p>
          
        </div>
      </div>
    </div>
  );
}
