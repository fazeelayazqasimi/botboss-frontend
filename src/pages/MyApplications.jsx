import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getApplicationsByCandidate } from '../data/storage';

const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

const MyApplications = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState({});
  const [interviews, setInterviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'candidate') {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadAll(userData);
  }, [navigate]);

  const loadAll = async (userData) => {
    try {
      const apps = await getApplicationsByCandidate(userData.id);
      setApplications(apps);

      const uniqueJobIds = [...new Set(apps.map(a => a.job_id).filter(Boolean))];
      const jobMap = {};
      await Promise.all(
        uniqueJobIds.map(async (jobId) => {
          try {
            const jRes = await fetch(`${API_URL}/jobs/${jobId}`);
            if (jRes.ok) jobMap[jobId] = await jRes.json();
          } catch (_) {}
        })
      );
      setJobs(jobMap);

      const allInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      const myInterviews = allInterviews.filter(i =>
        apps.some(a => a.id === i.applicationId || a.job_id === i.jobId)
      );
      setInterviews(myInterviews);
      await loadReports(myInterviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async (myInterviews) => {
    const results = await Promise.all(
      myInterviews.filter(i => i.status === 'Completed').map(async (iv) => {
        try {
          const res = await fetch(`${API_URL}/interview/report/${iv.id}`);
          if (res.ok) return { interviewId: iv.id, report: await res.json() };
        } catch (_) {}
        return null;
      })
    );
    setReports(results.filter(Boolean));
  };

  const STATUS_CFG = {
    pending:              { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa', bar: '#f97316', label: 'Applied' },
    reviewed:             { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', bar: '#3b82f6', label: 'Under Review' },
    shortlisted:          { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', bar: '#22c55e', label: 'Shortlisted' },
    interview_scheduled:  { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe', bar: '#8b5cf6', label: 'Interview Scheduled' },
    interview_completed:  { bg: '#fdf4ff', color: '#a21caf', border: '#f0abfc', bar: '#c026d3', label: 'Interview Completed' },
    rejected:             { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', bar: '#ef4444', label: 'Rejected' },
    hired:                { bg: '#f0fdf4', color: '#15803d', border: '#86efac', bar: '#22c55e', label: 'Hired' },
  };
  const cfg = (s) => STATUS_CFG[s] || { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb', bar: '#9ca3af', label: s || 'Applied' };

  const STATUS_ICONS = {
    pending:             <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    reviewed:            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    shortlisted:         <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    interview_scheduled: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    interview_completed: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    rejected:            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    hired:               <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  };

  const getInterview = (appId, jobId) =>
    interviews.find(i => i.applicationId === appId || i.jobId === jobId);
  const getReport = (ivId) =>
    reports.find(r => r.interviewId === ivId)?.report;
  const isInterviewCompleted = (app) => {
    const iv = getInterview(app.id, app.job_id);
    return iv?.status === 'Completed' || app.status === 'interview_completed';
  };

  const FILTER_TABS = [
    { key: 'all',                 label: 'All' },
    { key: 'pending',             label: 'Applied' },
    { key: 'reviewed',            label: 'Under Review' },
    { key: 'shortlisted',         label: 'Shortlisted' },
    { key: 'interview_scheduled', label: 'Scheduled' },
    { key: 'interview_completed', label: 'Completed' },
    { key: 'rejected',            label: 'Rejected' },
    { key: 'hired',               label: 'Hired' },
  ];

  const tabCount = (key) => {
    if (key === 'all') return applications.length;
    return applications.filter(a => a.status === key).length;
  };

  const filtered = activeFilter === 'all'
    ? applications
    : applications.filter(a => a.status === activeFilter);

  const STATS = [
    { label: 'Total', val: applications.length, color: '#7c3aed', bg: '#f5f3ff',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { label: 'Active', val: applications.filter(a => !['rejected','hired','interview_completed'].includes(a.status)).length, color: '#2563eb', bg: '#eff6ff',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Shortlisted', val: applications.filter(a => a.status === 'shortlisted').length, color: '#16a34a', bg: '#f0fdf4',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { label: 'Interviews', val: interviews.length, color: '#7c3aed', bg: '#f5f3ff',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> },
    { label: 'Completed', val: applications.filter(a => a.status === 'interview_completed').length, color: '#a21caf', bg: '#fdf4ff',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg> },
    { label: 'Offers', val: applications.filter(a => a.status === 'hired').length, color: '#15803d', bg: '#f0fdf4',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" />
          <p>Loading your applications...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .ma-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: 'Inter', sans-serif;
          background: #F8F9FF;
          min-height: calc(100vh - 200px);
        }
        
        .ma-hero {
          background: linear-gradient(135deg, #0F0F1A 0%, #1E1B4B 100%);
          padding: 2.5rem;
          border-radius: 24px;
          margin-bottom: 2rem;
          color: white;
        }
        
        .ma-hero h1 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        
        .ma-hero p {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
        }
        
        .ma-stats {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .ma-stat-card {
          background: white;
          padding: 1rem;
          border-radius: 16px;
          border: 1px solid #E9ECF5;
          text-align: center;
        }
        
        .ma-stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0A0A0F;
        }
        
        .ma-stat-label {
          font-size: 0.7rem;
          color: #6B6B84;
          margin-top: 0.25rem;
        }
        
        .ma-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
        }
        
        .ma-tab {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #E9ECF5;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        
        .ma-tab.active {
          background: #6366F1;
          color: white;
          border-color: #6366F1;
        }
        
        .ma-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #E9ECF5;
          margin-bottom: 1rem;
          overflow: hidden;
          transition: all 0.2s;
        }
        
        .ma-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }
        
        .ma-card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F0F2F5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .ma-job-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0A0A0F;
          text-decoration: none;
        }
        
        .ma-job-title:hover {
          color: #6366F1;
        }
        
        .ma-company {
          font-size: 0.8rem;
          color: #6366F1;
          margin-top: 0.25rem;
        }
        
        .ma-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        
        .ma-card-body {
          padding: 1.25rem 1.5rem;
        }
        
        .ma-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .ma-meta-item {
          font-size: 0.75rem;
          color: #6B6B84;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .ma-cover-letter {
          background: #F8F9FF;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          color: #4B5563;
        }
        
        .ma-auto-badge {
          background: #D1FAE5;
          color: #059669;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 0.75rem;
        }
        
        .ma-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        
        .ma-btn {
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        .ma-btn-primary {
          background: #6366F1;
          color: white;
        }
        
        .ma-btn-primary:hover {
          background: #4F46E5;
          transform: translateY(-1px);
        }
        
        .ma-btn-outline {
          background: white;
          border: 1px solid #E9ECF5;
          color: #6366F1;
        }
        
        .ma-empty {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 20px;
          border: 1px solid #E9ECF5;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E9ECF5;
          border-top-color: #6366F1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .ma-stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <Navbar />
      <div className="ma-container">
        <div className="ma-hero">
          <h1>My Applications</h1>
          <p>Track your job applications and interview progress</p>
        </div>

        <div className="ma-stats">
          {STATS.map((s, i) => (
            <div key={i} className="ma-stat-card">
              <div className="ma-stat-value">{s.val}</div>
              <div className="ma-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="ma-tabs">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              className={`ma-tab ${activeFilter === tab.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label} ({tabCount(tab.key)})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="ma-empty">
            <p>No applications found</p>
            <Link to="/jobs" style={{ color: '#6366F1', marginTop: '1rem', display: 'inline-block' }}>
              Browse Jobs →
            </Link>
          </div>
        ) : (
          filtered.map(app => {
            const sc = cfg(app.status);
            const job = jobs[app.job_id];
            const iv = getInterview(app.id, app.job_id);
            const completed = isInterviewCompleted(app);
            
            return (
              <div key={app.id} className="ma-card">
                <div className="ma-card-header">
                  <div>
                    {job ? (
                      <Link to={`/job/${app.job_id}`} className="ma-job-title">
                        {job.title}
                      </Link>
                    ) : (
                      <span className="ma-job-title">Job Application</span>
                    )}
                    <div className="ma-company">{job?.company_name || 'Company'}</div>
                  </div>
                  <span className="ma-badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {STATUS_ICONS[app.status]}
                    {sc.label}
                  </span>
                </div>
                
                <div className="ma-card-body">
                  <div className="ma-meta">
                    <span className="ma-meta-item">
                      📅 Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </span>
                    {job?.location && (
                      <span className="ma-meta-item">📍 {job.location}</span>
                    )}
                    {job?.type && (
                      <span className="ma-meta-item">⏰ {job.type}</span>
                    )}
                  </div>
                  
                  {/* Show auto-shortlist badge for candidates */}
                  {app.status === 'shortlisted' && app.cv_score >= 50 && (
                    <div className="ma-auto-badge">
                      ✨ Auto-shortlisted based on CV match ({app.cv_score}%)
                    </div>
                  )}
                  
                  {app.cover_letter && (
                    <div className="ma-cover-letter">
                      <strong>Cover Letter:</strong> {app.cover_letter.substring(0, 150)}...
                    </div>
                  )}
                  
                  <div className="ma-actions">
                    {app.status === 'shortlisted' && (
                      <Link to={`/interview/${app.job_id}`} state={{ applicationId: app.id }} className="ma-btn ma-btn-primary">
                        🎤 Give Interview
                      </Link>
                    )}
                    
                    {app.status === 'interview_scheduled' && (
                      <Link to={`/interview/${app.job_id}`} state={{ applicationId: app.id }} className="ma-btn ma-btn-primary">
                        🎥 Join Interview
                      </Link>
                    )}
                    
                    {job && (
                      <Link to={`/job/${app.job_id}`} className="ma-btn ma-btn-outline">
                        👁️ View Job
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyApplications;
