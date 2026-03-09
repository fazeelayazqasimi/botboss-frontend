import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#0A0A0F',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      fontFamily: "'DM Sans', 'Poppins', sans-serif",
      width: '100%',
    }}>
      {/* Top gradient line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, #5B4CFF, #8B7FFF, #FF4C8B)' }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '1.5rem 2rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: 'linear-gradient(135deg, #4C1D95, #5B4CFF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            BotBoss
          </span>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', margin: 0, textAlign: 'center' }}>
          © 2026 BotBoss. All rights reserved.
        </p>

        {/* Legal links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {['Privacy', 'Terms', 'Cookies'].map((label, i) => (
            <a key={label} href="#"
              style={{
                color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
                fontSize: '0.78rem', fontWeight: 500, transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 540px) {
          footer > div:last-of-type > div {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
