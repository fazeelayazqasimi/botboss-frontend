import React from 'react';
import { Link } from 'react-router-dom';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 15, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ic = {
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  twitter:  'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  github:   'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  zap:      'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  mail:     'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
};

const C = {
  purple:      '#7C3AED',
  purpleLight: '#A78BFA',
  purpleDark:  '#4C1D95',
  grey900:     '#0F172A',
  grey800:     '#1E293B',
  grey700:     '#334155',
  grey500:     '#64748B',
  grey400:     '#94A3B8',
  grey300:     '#CBD5E1',
  white:       '#FFFFFF',
};

const font = "'Poppins', sans-serif";

const Dot = () => (
  <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.grey700,
    display: 'inline-block', margin: '0 8px', verticalAlign: 'middle', flexShrink: 0 }} />
);

const Footer = () => {
  const cols = [
    {
      label: 'Platform',
      links: [
        { to: '/',           label: 'Home' },
        { to: '/jobs',       label: 'Browse Jobs' },
        { to: '/companies',  label: 'Companies' },
        { to: '/about',      label: 'About Us' },
        { to: '/contact',    label: 'Contact' },
      ],
    },
    {
      label: 'Candidates',
      links: [
        { to: '/signup?type=candidate', label: 'Create Account' },
        { to: '/jobs',                  label: 'Find Jobs' },
        { to: '/interview-tips',        label: 'Interview Tips' },
        { to: '/faq',                   label: 'FAQ' },
      ],
    },
    {
      label: 'Companies',
      links: [
        { to: '/signup?type=company', label: 'Post a Job' },
        { to: '/pricing',             label: 'Pricing' },
        { to: '/solutions',           label: 'Solutions' },
        { to: '/contact',             label: 'Contact Sales' },
      ],
    },
  ];

  return (
    <footer style={{ background: C.grey900, fontFamily: font, width: '100%', overflowX: 'hidden' }}>

      {/* Top accent */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple}, ${C.purpleLight})` }} />

      {/* Main grid */}
      <div className="fi-grid">

        {/* Brand */}
        <div className="fi-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: `linear-gradient(135deg, ${C.purpleDark}, ${C.purple})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={ic.zap} size={16} color={C.white} sw={2} />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: C.white }}>AI Interview</span>
          </div>
          <p style={{ fontSize: '0.845rem', color: C.grey400, lineHeight: 1.75, maxWidth: 280, margin: '0 0 1.5rem' }}>
            Connecting top talent with great companies through intelligent, AI-powered interview experiences.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { icon: ic.linkedin, href: '#', label: 'LinkedIn' },
              { icon: ic.twitter,  href: '#', label: 'Twitter' },
              { icon: ic.github,   href: '#', label: 'GitHub' },
              { icon: ic.mail,     href: '#', label: 'Email' },
            ].map(({ icon, href, label }) => (
              <a key={label} href={href} aria-label={label} className="fi-social"
                style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  background: C.grey800, border: `1px solid ${C.grey700}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', transition: 'all 0.15s' }}>
                <Icon d={icon} size={14} color={C.grey400} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map(col => (
          <div key={col.label}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: C.grey500,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, display: 'block' }}>
              {col.label}
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="fi-link"
                    style={{ color: C.grey400, textDecoration: 'none', fontSize: '0.845rem',
                      fontFamily: font, display: 'inline-flex', alignItems: 'center',
                      transition: 'color 0.15s', lineHeight: 1 }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: C.grey800, margin: '0 1.5rem' }} />

      {/* Bottom bar */}
      <div className="fi-bottom">
        <p style={{ fontSize: '0.78rem', color: C.grey500, margin: 0 }}>
          &copy; 2026 AI Interview Platform. All rights reserved.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: '6px' }}>
          {[
            { to: '/privacy', label: 'Privacy Policy' },
            { to: '/terms',   label: 'Terms of Service' },
            { to: '/cookies', label: 'Cookies' },
          ].map(({ to, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <Dot />}
              <Link to={to} className="fi-legal-link"
                style={{ color: C.grey500, textDecoration: 'none', fontSize: '0.78rem',
                  fontFamily: font, transition: 'color 0.15s', lineHeight: 1 }}>
                {label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .fi-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem 2rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 2.5rem;
        }

        .fi-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .fi-link:hover       { color: #FFFFFF !important; }
        .fi-legal-link:hover { color: #CBD5E1 !important; }
        .fi-social:hover     { background: #334155 !important; border-color: #7C3AED !important; }

        /* ── Tablet (≤ 900px): 2 cols, brand full-width ── */
        @media (max-width: 900px) {
          .fi-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .fi-brand {
            grid-column: 1 / -1;
          }
        }

        /* ── Mobile (≤ 540px): single col ── */
        @media (max-width: 540px) {
          .fi-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
            padding: 2rem 1.25rem 1.5rem;
          }
          .fi-brand {
            grid-column: auto;
          }
          .fi-bottom {
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem 1.25rem;
            gap: 0.5rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;