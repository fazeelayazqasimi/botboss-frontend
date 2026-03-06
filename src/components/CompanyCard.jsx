import React from 'react';
import { Link } from 'react-router-dom';

const CompanyCard = ({ company }) => {
  const stars = Math.round(company.rating || 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .cc {
          font-family: 'Poppins', sans-serif;
          background: white;
          border: 1.5px solid #f3f4f6;
          border-radius: 16px;
          padding: 1.75rem 1.5rem;
          text-align: center;
          transition: all 0.22s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .cc:hover {
          border-color: #c4b5fd;
          box-shadow: 0 12px 36px rgba(124,58,237,0.1);
          transform: translateY(-3px);
        }

        /* ── LOGO ── */
        .cc-logo {
          width: 64px; height: 64px;
          border-radius: 14px;
          object-fit: cover;
          border: 1px solid #f3f4f6;
          margin-bottom: 0.25rem;
          flex-shrink: 0;
        }
        .cc-logo-fallback {
          width: 64px; height: 64px;
          border-radius: 14px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          color: #7c3aed;
          margin-bottom: 0.25rem;
          flex-shrink: 0;
        }

        /* ── TEXT ── */
        .cc-name {
          font-size: 0.975rem;
          font-weight: 700;
          color: #1c0b4b;
          margin: 0.25rem 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }
        .cc-industry {
          font-size: 0.775rem;
          color: #9ca3af;
          font-weight: 500;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }

        /* ── RATING ── */
        .cc-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
          margin: 0.25rem 0;
          flex-wrap: nowrap;
        }
        .cc-star { width: 14px; height: 14px; flex-shrink: 0; }
        .cc-star.filled { color: #f59e0b; }
        .cc-star.empty  { color: #e5e7eb; }
        .cc-rating-num {
          font-size: 0.775rem;
          font-weight: 600;
          color: #6b7280;
          margin-left: 0.2rem;
          white-space: nowrap;
        }

        /* ── POSITIONS PILL ── */
        .cc-positions {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.775rem;
          font-weight: 600;
          color: #7c3aed;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
          padding: 0.3rem 0.875rem;
          border-radius: 100px;
          margin: 0.25rem 0 0.5rem;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cc-positions svg {
          width: 13px; height: 13px;
          stroke: #7c3aed; fill: none; flex-shrink: 0;
        }

        /* ── BUTTON ── */
        .cc-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #7c3aed;
          background: white;
          border: 1.5px solid #ede9fe;
          padding: 0.55rem 1.25rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s;
          width: 100%;
          margin-top: 0.25rem;
          white-space: nowrap;
          box-sizing: border-box;
        }
        .cc-btn:hover {
          background: #7c3aed;
          color: white;
          border-color: #7c3aed;
        }
        .cc-btn svg {
          width: 13px; height: 13px;
          stroke: currentColor; fill: none;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .cc-btn:hover svg { transform: translateX(2px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 480px) {
          .cc { padding: 1.25rem 1rem; }
          .cc-logo, .cc-logo-fallback {
            width: 54px; height: 54px;
            border-radius: 12px;
            font-size: 1.2rem;
          }
          .cc-name { font-size: 0.9rem; }
          .cc-industry { font-size: 0.72rem; }
          .cc-positions { font-size: 0.72rem; padding: 0.25rem 0.7rem; }
          .cc-btn { font-size: 0.78rem; padding: 0.5rem 1rem; }
          .cc-star { width: 13px; height: 13px; }
        }

        /* Side-by-side layout on medium screens (2-col grids) */
        @media (min-width: 481px) and (max-width: 640px) {
          .cc { padding: 1.4rem 1.1rem; }
          .cc-logo, .cc-logo-fallback { width: 56px; height: 56px; font-size: 1.25rem; }
        }
      `}</style>

      <div className="cc">
        
          
          <div className="cc-logo-fallback">
            {company.name ? company.name.charAt(0).toUpperCase() : 'C'}
          </div>
        

        {/* Name & Industry */}
        <h3 className="cc-name">{company.name}</h3>
        <p className="cc-industry">{company.industry}</p>

        {/* Star Rating */}
        <div className="cc-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`cc-star ${i < stars ? 'filled' : 'empty'}`}
              viewBox="0 0 24 24"
              fill={i < stars ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="cc-rating-num">{company.rating?.toFixed(1) || '—'}</span>
        </div>

        {/* Open Positions */}
        <div className="cc-positions">
          <svg viewBox="0 0 24 24" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
            <line x1="10" y1="14" x2="14" y2="14"/>
          </svg>
          {company.openPositions || 0} open positions
        </div>

        {/* CTA */}
        <Link to={`/company/${company.id}`} className="cc-btn">
          View Profile
          <svg viewBox="0 0 24 24" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </>
  );
};

export default CompanyCard;