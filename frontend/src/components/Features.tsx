import React from 'react';

const Features = () => {
  const features = [
    { title: 'Instant Delivery', desc: 'Fast & Reliable', icon: '⚡' },
    { title: 'Secure Payment', desc: '100% Protected', icon: '🔒' },
    { title: 'Affordable Price', desc: 'Best Market Price', icon: '💎' },
    { title: '24/7 Support', desc: 'Always Available', icon: '🎧' },
  ];

  return (
    <section style={{ padding: '60px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-light)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
