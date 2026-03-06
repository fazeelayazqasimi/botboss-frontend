import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .jc {
          font-family: 'Poppins', sans-serif;
          background: white;
          border: 1.5px solid #f3f4f6;
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.22s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .jc:hover {
          border-color: #c4b5fd;
          box-shadow: 0 12px 36px rgba(124,58,237,0.1);
          transform: translateY(-3px);
        }

        /* ── HEADER ── */
        .jc-header {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          min-width: 0;
        }
        .jc-logo {
          width: 46px; height: 46px;
          border-radius: 12px;
          object-fit: cover;
          border: 1px solid #f3f4f6;
          flex-shrink: 0;
          background: #f8f7ff;
        }
        .jc-logo-fallback {
          width: 46px; height: 46px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: #7c3aed;
        }
        .jc-title-wrap {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        .jc-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1c0b4b;
          margin-bottom: 0.2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .jc-company {
          font-size: 0.78rem;
          color: #9ca3af;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .jc-badge {
          flex-shrink: 0;
          font-size: 0.67rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.28rem 0.65rem;
          border-radius: 100px;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          white-space: nowrap;
        }
        .jc-badge.remote { background: #f5f3ff; color: #7c3aed; border-color: #ddd6fe; }
        .jc-badge.hybrid { background: #fff7ed; color: #ea580c; border-color: #fed7aa; }

        /* ── DETAILS ── */
        .jc-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .jc-detail {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          padding: 0.28rem 0.65rem;
          border-radius: 8px;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .jc-detail svg {
          width: 12px; height: 12px;
          stroke: #9ca3af; fill: none; flex-shrink: 0;
        }

        /* ── SKILLS ── */
        .jc-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .jc-skill {
          font-size: 0.72rem;
          font-weight: 500;
          color: #4b5563;
          background: #f3f4f6;
          padding: 0.22rem 0.6rem;
          border-radius: 6px;
          white-space: nowrap;
        }
        .jc-skill-more {
          font-size: 0.72rem;
          font-weight: 600;
          color: #7c3aed;
          background: #f5f3ff;
          padding: 0.22rem 0.6rem;
          border-radius: 6px;
          white-space: nowrap;
        }

        /* ── FOOTER ── */
        .jc-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.875rem;
          border-top: 1px solid #f3f4f6;
          margin-top: auto;
          gap: 0.75rem;
        }
        .jc-applicants {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #9ca3af;
          white-space: nowrap;
          min-width: 0;
          overflow: hidden;
        }
        .jc-applicants svg {
          width: 13px; height: 13px;
          stroke: #c4b5fd; fill: none; flex-shrink: 0;
        }
        .jc-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #7c3aed;
          background: #f5f3ff;
          border: 1.5px solid #ede9fe;
          padding: 0.45rem 0.875rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .jc-btn:hover {
          background: #7c3aed;
          color: white;
          border-color: #7c3aed;
        }
        .jc-btn svg {
          width: 12px; height: 12px;
          stroke: currentColor; fill: none;
          transition: transform 0.2s;
        }
        .jc-btn:hover svg { transform: translateX(2px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 480px) {
          .jc { padding: 1.1rem; gap: 0.875rem; }

          .jc-logo, .jc-logo-fallback {
            width: 40px; height: 40px;
            border-radius: 10px;
            font-size: 0.875rem;
          }

          .jc-title { font-size: 0.875rem; }
          .jc-company { font-size: 0.75rem; }
          .jc-badge { font-size: 0.62rem; padding: 0.22rem 0.5rem; }

          .jc-detail { font-size: 0.72rem; padding: 0.22rem 0.55rem; }

          .jc-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.625rem;
          }
          .jc-btn {
            width: 100%;
            justify-content: center;
            padding: 0.6rem;
          }
        }

        @media (min-width: 481px) and (max-width: 600px) {
          .jc { padding: 1.25rem; }
          .jc-title { font-size: 0.9rem; }
        }
      `}</style>

      <div className="jc">
        {/* Header */}
        <div className="jc-header">
          
            <div className="jc-logo-fallback">
              {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
            </div>
          

          <div className="jc-title-wrap">
            <div className="jc-title">{job.title}</div>
            <div className="jc-company">{job.company}</div>
          </div>

          <span className={`jc-badge ${
            job.type?.toLowerCase() === 'remote' ? 'remote' :
            job.type?.toLowerCase() === 'hybrid' ? 'hybrid' : ''
          }`}>
            {job.type || 'Full-time'}
          </span>
        </div>

        {/* Details */}
        <div className="jc-details">
          {job.location && (
            <span className="jc-detail">
              <svg viewBox="0 0 24 24" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {job.location}
            </span>
          )}
          {job.salary && (
            <span className="jc-detail">
              <svg viewBox="0 0 24 24" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              {job.salary}
            </span>
          )}
          <span className="jc-detail">
            <svg viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {job.experience || 'Mid-level'}
          </span>
        </div>

        {/* Skills */}
        {job.requirements?.length > 0 && (
          <div className="jc-skills">
            {job.requirements.slice(0, 3).map((skill, i) => (
              <span key={i} className="jc-skill">{skill}</span>
            ))}
            {job.requirements.length > 3 && (
              <span className="jc-skill-more">+{job.requirements.length - 3} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="jc-footer">
          <span className="jc-applicants">
            <svg viewBox="0 0 24 24" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            {job.applicants || 0} applicants
          </span>
          <Link to={`/job/${job.id}`} className="jc-btn">
            View Details
            <svg viewBox="0 0 24 24" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};

export default JobCard;