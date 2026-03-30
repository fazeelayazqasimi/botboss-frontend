import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = process.env.REACT_APP_API_URL || 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

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
      // 1. Fetch applications from backend
      const res = await fetch(`${API_URL}/applications/user/${userData.id}`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      const apps = await res.json();
      setApplications(apps);

      // 2. Fetch job details for each unique job_id
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

      // 3. Load interviews from localStorage
      const allInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      const myInterviews = allInterviews.filter(i =>
        apps.some(a => a.id === i.applicationId || a.job_id === i.jobId)
      );
      setInterviews(myInterviews);

      // 4. Load reports for completed interviews
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

  // ── Status config ──────────────────────────────────────────────
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

  // ── Helpers ────────────────────────────────────────────────────
  const getInterview = (appId, jobId) =>
    interviews.find(i => i.applicationId === appId || i.jobId === jobId);
  const getReport = (ivId) =>
    reports.find(r => r.interviewId === ivId)?.report;
  const isInterviewCompleted = (app) => {
    const iv = getInterview(app.id, app.job_id);
    return iv?.status === 'Completed' || app.status === 'interview_completed';
  };

  // ── Filter tabs ────────────────────────────────────────────────
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

  // ── Stats ──────────────────────────────────────────────────────
  const STATS = [
    {
      label: 'Total', val: applications.length,
      color: '#7c3aed', bg: '#f5f3ff',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    },
    {
      label: 'Active',
      val: applications.filter(a => !['rejected','hired','interview_completed'].includes(a.status)).length,
      color: '#2563eb', bg: '#eff6ff',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    {
      label: 'Shortlisted', val: applications.filter(a => a.status === 'shortlisted').length,
      color: '#16a34a', bg: '#f0fdf4',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    },
    {
      label: 'Interviews', val: interviews.length,
      color: '#7c3aed', bg: '#f5f3ff',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
    },
    {
      label: 'Completed', val: applications.filter(a => a.status === 'interview_completed').length,
      color: '#a21caf', bg: '#fdf4ff',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>
    },
    {
      label: 'Offers', val: applications.filter(a => a.status === 'hired').length,
      color: '#15803d', bg: '#f0fdf4',
      icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    },
  ];

  /* ─────────── RENDER ─────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ma-root {
          font-family: 'Poppins', sans-serif;
          background: #f8f7ff;
          min-height: 100vh;
          color: #1c0b4b;
          -webkit-font-smoothing: antialiased;
        }

        /* ── LOADER ── */
        .ma-loader {
          min-height: 60vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; color: #9ca3af; font-size: .9rem;
        }
        .ma-spinner {
          width: 40px; height: 40px;
          border: 3px solid #ede9fe; border-top-color: #7c3aed;
          border-radius: 50%; animation: ma-spin .8s linear infinite;
        }
        @keyframes ma-spin { to { transform: rotate(360deg); } }

        /* ── HERO ── */
        .ma-hero {
          background: #1c0b4b;
          padding: 2.75rem 5% 2.25rem;
          position: relative; overflow: hidden;
        }
        .ma-hero::before {
          content:''; position:absolute; top:-140px; right:-140px;
          width:420px; height:420px;
          background: radial-gradient(circle,rgba(124,58,237,.22) 0%,transparent 65%);
          pointer-events:none;
        }
        .ma-hero-inner { max-width:1300px; margin:0 auto; position:relative; z-index:1; }
        .ma-hero-tag {
          font-size:.72rem; font-weight:600; letter-spacing:.12em;
          text-transform:uppercase; color:#a78bfa; margin-bottom:.45rem;
        }
        .ma-hero-title {
          font-size: clamp(1.4rem,3vw,2rem); font-weight:800;
          color:white; letter-spacing:-.03em; line-height:1.2; margin-bottom:.35rem;
        }
        .ma-hero-title span { color:#a78bfa; font-weight:400; }
        .ma-hero-sub { font-size:.875rem; color:#9ca3af; }

        /* ── MAIN ── */
        .ma-main { max-width:1300px; margin:0 auto; padding:1.75rem 5%; }

        /* ── STATS ── */
        .ma-stats {
          display: grid;
          grid-template-columns: repeat(6,1fr);
          gap:.875rem;
          margin-bottom:1.75rem;
        }
        @media(max-width:1000px){ .ma-stats{ grid-template-columns:repeat(3,1fr); } }
        @media(max-width:560px){ .ma-stats{ grid-template-columns:repeat(2,1fr); } }
        .ma-stat {
          background:white; border:1.5px solid #f3f4f6;
          border-radius:14px; padding:1.1rem 1rem;
          display:flex; flex-direction:column; gap:.45rem;
          transition:all .2s; cursor:default;
        }
        .ma-stat:hover { border-color:#ddd6fe; box-shadow:0 4px 16px rgba(124,58,237,.08); }
        .ma-stat-icon {
          width:34px; height:34px; border-radius:9px;
          display:flex; align-items:center; justify-content:center;
        }
        .ma-stat-icon svg { width:17px; height:17px; stroke:currentColor; fill:none; }
        .ma-stat-val { font-size:1.55rem; font-weight:800; color:#1c0b4b; letter-spacing:-.03em; line-height:1; }
        .ma-stat-lbl { font-size:.7rem; color:#9ca3af; font-weight:500; }

        /* ── FILTER TABS ── */
        .ma-tabs {
          display:flex; gap:.375rem;
          overflow-x:auto; padding-bottom:.25rem;
          margin-bottom:1.5rem;
          scrollbar-width:none; -ms-overflow-style:none;
        }
        .ma-tabs::-webkit-scrollbar { display:none; }
        .ma-tab {
          display:inline-flex; align-items:center; gap:.35rem;
          padding:.45rem .9rem;
          border:1.5px solid #f3f4f6; border-radius:100px;
          background:white; font-family:'Poppins',sans-serif;
          font-size:.76rem; font-weight:600; color:#6b7280;
          cursor:pointer; transition:all .18s; white-space:nowrap; flex-shrink:0;
        }
        .ma-tab:hover { border-color:#c4b5fd; color:#7c3aed; }
        .ma-tab.on { background:#7c3aed; color:white; border-color:#7c3aed; }
        .ma-tab-n {
          font-size:.65rem; font-weight:700;
          background:rgba(0,0,0,.1); padding:.08rem .38rem; border-radius:100px;
        }
        .ma-tab.on .ma-tab-n { background:rgba(255,255,255,.25); }

        /* ── APPLICATION LIST ── */
        .ma-list { display:flex; flex-direction:column; gap:1.1rem; }

        /* ── CARD ── */
        .ma-card {
          background:white; border:1.5px solid #f3f4f6;
          border-radius:18px; overflow:hidden;
          transition:all .22s;
        }
        .ma-card:hover { border-color:#ddd6fe; box-shadow:0 6px 24px rgba(124,58,237,.08); }
        .ma-card-bar { height:3.5px; }
        .ma-card-body { padding:1.4rem 1.5rem; }

        /* card header */
        .ma-ch {
          display:flex; justify-content:space-between;
          align-items:flex-start; gap:.875rem; margin-bottom:.9rem;
        }
        .ma-ch-left { flex:1; min-width:0; }
        .ma-job-title {
          font-size:.975rem; font-weight:700; color:#1c0b4b;
          display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
          margin-bottom:.2rem;
        }
        .ma-job-link {
          font-size:.975rem; font-weight:700; color:#1c0b4b;
          text-decoration:none; display:block;
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
          margin-bottom:.2rem; transition:color .18s;
        }
        .ma-job-link:hover { color:#7c3aed; }
        .ma-company { font-size:.8rem; font-weight:600; color:#7c3aed; }

        /* status badge */
        .ma-badge {
          display:inline-flex; align-items:center; gap:.35rem;
          font-size:.7rem; font-weight:700;
          padding:.32rem .8rem; border-radius:100px;
          border:1.5px solid; white-space:nowrap; flex-shrink:0;
        }
        .ma-badge svg { width:11px; height:11px; stroke:currentColor; fill:none; flex-shrink:0; }
        .ma-auto-badge {
          font-size:0.65rem; background:rgba(22,163,74,.1);
          color:#16a34a; padding:2px 6px; border-radius:12px; margin-left:4px;
        }
        .ma-done-badge {
          font-size:0.65rem; background:rgba(162,28,175,.1);
          color:#a21caf; padding:2px 6px; border-radius:12px; margin-left:4px;
        }

        /* meta chips */
        .ma-meta { display:flex; flex-wrap:wrap; gap:.4rem; margin-bottom:.9rem; }
        .ma-chip {
          display:inline-flex; align-items:center; gap:.28rem;
          font-size:.73rem; font-weight:500; color:#6b7280;
          background:#f9fafb; border:1px solid #f3f4f6;
          padding:.25rem .6rem; border-radius:7px;
        }
        .ma-chip svg { width:11px; height:11px; stroke:#9ca3af; fill:none; flex-shrink:0; }

        /* cover letter */
        .ma-cover {
          background:#f8f7ff; border:1.5px solid #ede9fe;
          border-radius:12px; padding:.9rem 1rem; margin-bottom:.9rem;
        }
        .ma-cover-label {
          font-size:.68rem; font-weight:700; color:#7c3aed;
          text-transform:uppercase; letter-spacing:.08em; margin-bottom:.35rem;
        }
        .ma-cover-text { font-size:.8rem; color:#6b7280; line-height:1.6; }

        /* interview block */
        .ma-iv {
          background:#f8f7ff; border:1.5px solid #ede9fe;
          border-radius:14px; padding:1rem 1.1rem; margin-bottom:.9rem;
        }
        .ma-iv-head {
          display:flex; justify-content:space-between;
          align-items:center; gap:.5rem; margin-bottom:.75rem;
        }
        .ma-iv-title {
          display:flex; align-items:center; gap:.375rem;
          font-size:.82rem; font-weight:700; color:#1c0b4b;
        }
        .ma-iv-title svg { width:14px; height:14px; stroke:#7c3aed; fill:none; }
        .ma-iv-status {
          font-size:.68rem; font-weight:700;
          padding:.2rem .6rem; border-radius:100px; border:1.5px solid;
        }
        .ma-iv-meta { display:flex; flex-wrap:wrap; gap:.75rem; }
        .ma-iv-item {
          display:flex; align-items:center; gap:.3rem;
          font-size:.76rem; font-weight:500; color:#6b7280;
        }
        .ma-iv-item svg { width:12px; height:12px; stroke:#a78bfa; fill:none; flex-shrink:0; }

        /* report scores */
        .ma-report {
          background:white; border:1px solid #f3f4f6;
          border-radius:10px; padding:.8rem 1rem; margin-top:.75rem;
        }
        .ma-report-title {
          font-size:.72rem; font-weight:700; color:#7c3aed;
          text-transform:uppercase; letter-spacing:.06em; margin-bottom:.6rem;
        }
        .ma-rscores { display:grid; grid-template-columns:repeat(4,1fr); gap:.4rem; }
        @media(max-width:500px){ .ma-rscores{ grid-template-columns:repeat(2,1fr); } }
        .ma-rs {
          text-align:center; background:#f9fafb;
          border-radius:8px; padding:.45rem .25rem;
        }
        .ma-rs-val { font-size:.95rem; font-weight:800; color:#1c0b4b; letter-spacing:-.02em; }
        .ma-rs-lbl { font-size:.6rem; color:#9ca3af; font-weight:500; margin-top:.1rem; }

        /* action buttons */
        .ma-actions { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.25rem; }
        .ma-btn {
          display:inline-flex; align-items:center; gap:.3rem;
          font-family:'Poppins',sans-serif;
          font-size:.76rem; font-weight:600;
          padding:.46rem .9rem; border-radius:9px;
          text-decoration:none; cursor:pointer; border:none;
          transition:all .18s; white-space:nowrap;
        }
        .ma-btn svg { width:12px; height:12px; stroke:currentColor; fill:none; flex-shrink:0; }
        .ma-btn-primary  { background:#7c3aed; color:white; }
        .ma-btn-primary:hover { background:#6d28d9; }
        .ma-btn-green    { background:#16a34a; color:white; }
        .ma-btn-green:hover { background:#15803d; }
        .ma-btn-purple   { background:#a21caf; color:white; }
        .ma-btn-purple:hover { background:#86198f; }
        .ma-btn-outline  { background:white; color:#7c3aed; border:1.5px solid #ede9fe; }
        .ma-btn-outline:hover { background:#f5f3ff; border-color:#7c3aed; }
        .ma-btn-disabled { background:#c4b5fd; color:white; cursor:not-allowed; opacity:.7; }

        /* empty state */
        .ma-empty {
          background:white; border:1.5px solid #f3f4f6;
          border-radius:20px; padding:4rem 2rem; text-align:center;
        }
        .ma-empty-icon {
          width:72px; height:72px; background:#f5f3ff;
          border-radius:20px; display:flex; align-items:center; justify-content:center;
          margin:0 auto 1.4rem;
        }
        .ma-empty-icon svg { width:32px; height:32px; stroke:#c4b5fd; fill:none; }
        .ma-empty h2 { font-size:1.1rem; font-weight:700; color:#1c0b4b; margin-bottom:.4rem; }
        .ma-empty p { font-size:.84rem; color:#9ca3af; line-height:1.65; max-width:340px; margin:0 auto 1.5rem; }
        .ma-browse {
          display:inline-flex; align-items:center; gap:.4rem;
          font-family:'Poppins',sans-serif; font-size:.875rem; font-weight:700;
          background:#7c3aed; color:white;
          padding:.75rem 1.75rem; border-radius:12px;
          text-decoration:none; transition:all .2s;
        }
        .ma-browse:hover { background:#6d28d9; transform:translateY(-1px); box-shadow:0 8px 20px rgba(124,58,237,.3); }
        .ma-browse svg { width:14px; height:14px; stroke:currentColor; fill:none; }
      `}</style>

      <div className="ma-root">
        <Navbar />

        {loading ? (
          <div className="ma-loader">
            <div className="ma-spinner" />
            <p>Loading your applications...</p>
          </div>
        ) : (
          <>
            {/* ── HERO ── */}
            <section className="ma-hero">
              <div className="ma-hero-inner">
                <p className="ma-hero-tag">Dashboard</p>
                <h1 className="ma-hero-title">
                  My Applications
                  {user && <span> — {user.name?.split(' ')[0]}</span>}
                </h1>
                <p className="ma-hero-sub">Track your job applications and interview progress</p>
              </div>
            </section>

            <main className="ma-main">

              {/* ── STATS ── */}
              <div className="ma-stats">
                {STATS.map((s, i) => (
                  <div key={i} className="ma-stat">
                    <div className="ma-stat-icon" style={{ background: s.bg, color: s.color }}>
                      {s.icon}
                    </div>
                    <div className="ma-stat-val">{s.val}</div>
                    <div className="ma-stat-lbl">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* ── FILTER TABS ── */}
              <div className="ma-tabs">
                {FILTER_TABS.map(t => (
                  <button
                    key={t.key}
                    className={`ma-tab ${activeFilter === t.key ? 'on' : ''}`}
                    onClick={() => setActiveFilter(t.key)}
                  >
                    {t.label}
                    <span className="ma-tab-n">{tabCount(t.key)}</span>
                  </button>
                ))}
              </div>

              {/* ── APPLICATION LIST ── */}
              {filtered.length > 0 ? (
                <div className="ma-list">
                  {filtered.map(app => {
                    const sc = cfg(app.status);
                    const job = jobs[app.job_id];
                    const iv = getInterview(app.id, app.job_id);
                    const rp = iv ? getReport(iv.id) : null;
                    const completed = isInterviewCompleted(app);

                    return (
                      <div key={app.id} className="ma-card">
                        <div className="ma-card-bar" style={{ background: sc.bar }} />

                        <div className="ma-card-body">

                          {/* ── Card Header ── */}
                          <div className="ma-ch">
                            <div className="ma-ch-left">
                              {job
                                ? <Link to={`/job/${app.job_id}`} className="ma-job-link">{job.title}</Link>
                                : <span className="ma-job-title">Job Application</span>
                              }
                              <div className="ma-company">
                                {job?.company_name || '—'}
                              </div>
                            </div>
                            <span className="ma-badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                              {STATUS_ICONS[app.status]}
                              {sc.label}
                              {app.status === 'shortlisted' && <span className="ma-auto-badge">⭐</span>}
                              {completed && <span className="ma-done-badge">✓ Done</span>}
                            </span>
                          </div>

                          {/* ── Meta Chips ── */}
                          <div className="ma-meta">
                            <span className="ma-chip">
                              <svg viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              Applied: {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {job?.location && (
                              <span className="ma-chip">
                                <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="11" r="3"/></svg>
                                {job.location}
                              </span>
                            )}
                            {job?.type && (
                              <span className="ma-chip">
                                <svg viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                                {job.type}
                              </span>
                            )}
                            {job?.salary && (
                              <span className="ma-chip">
                                <svg viewBox="0 0 24 24" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                                {job.salary}
                              </span>
                            )}
                            {job?.experience && (
                              <span className="ma-chip">
                                <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                {job.experience}
                              </span>
                            )}
                            {app.resume_path && (
                              <span className="ma-chip" style={{ background:'#f0fdf4', borderColor:'#bbf7d0', color:'#16a34a' }}>
                                <svg viewBox="0 0 24 24" strokeWidth="2" stroke="#16a34a"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                CV Submitted ✓
                              </span>
                            )}
                            <span className="ma-chip">
                              <svg viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              ID: {app.id?.slice(0, 8)}…
                            </span>
                          </div>

                          {/* ── Cover Letter ── */}
                          {app.cover_letter && app.cover_letter.trim() && (
                            <div className="ma-cover">
                              <div className="ma-cover-label">Cover Letter</div>
                              <div className="ma-cover-text">
                                {app.cover_letter.length > 220
                                  ? app.cover_letter.slice(0, 220) + '…'
                                  : app.cover_letter}
                              </div>
                            </div>
                          )}

                          {/* ── Interview Block ── */}
                          {iv && (
                            <div className="ma-iv">
                              <div className="ma-iv-head">
                                <div className="ma-iv-title">
                                  <svg viewBox="0 0 24 24" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                                  Interview Details
                                </div>
                                <span className="ma-iv-status" style={{
                                  background:  iv.status === 'Completed' ? '#f0fdf4' : '#fff7ed',
                                  color:       iv.status === 'Completed' ? '#16a34a' : '#ea580c',
                                  borderColor: iv.status === 'Completed' ? '#bbf7d0' : '#fed7aa',
                                }}>
                                  {iv.status}
                                </span>
                              </div>
                              <div className="ma-iv-meta">
                                {iv.scheduledDate && (
                                  <>
                                    <span className="ma-iv-item">
                                      <svg viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                      {new Date(iv.scheduledDate).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                                    </span>
                                    <span className="ma-iv-item">
                                      <svg viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                      {new Date(iv.scheduledDate).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                                    </span>
                                  </>
                                )}
                                {iv.type && (
                                  <span className="ma-iv-item">
                                    <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                                    {iv.type}
                                  </span>
                                )}
                              </div>

                              {/* ── Report Scores ── */}
                              {rp && (
                                <div className="ma-report">
                                  <div className="ma-report-title">Interview Report</div>
                                  <div className="ma-rscores">
                                    {[
                                      ['Overall',     rp.overall_score],
                                      ['Eye Contact', rp.eye_contact_score],
                                      ['Confidence',  rp.confidence_score],
                                      ['Clarity',     rp.clarity_score],
                                    ].map(([lbl, val], i) => (
                                      <div key={i} className="ma-rs">
                                        <div className="ma-rs-val">{val ?? '—'}%</div>
                                        <div className="ma-rs-lbl">{lbl}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── Action Buttons ── */}
                          <div className="ma-actions">

                            {/* Give Interview — Shortlisted */}
                            {app.status === 'shortlisted' && (
                              completed ? (
                                <button className="ma-btn ma-btn-disabled" disabled>
                                  <svg viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                  Interview Completed
                                </button>
                              ) : (
                                <Link
                                  to={`/interview/${app.job_id}`}
                                  state={{ applicationId: app.id, jobTitle: job?.title }}
                                  className="ma-btn ma-btn-primary"
                                >
                                  <svg viewBox="0 0 24 24" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                                  Give Interview
                                </Link>
                              )
                            )}

                            {/* Join Interview — Interview Scheduled */}
                            {app.status === 'interview_scheduled' && (
                              completed ? (
                                <button className="ma-btn ma-btn-disabled" disabled>
                                  <svg viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                  Interview Completed
                                </button>
                              ) : (
                                <Link
                                  to={`/interview/${app.job_id}`}
                                  state={{ applicationId: app.id, jobTitle: job?.title }}
                                  className="ma-btn ma-btn-green"
                                >
                                  <svg viewBox="0 0 24 24" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                                  Join Interview
                                </Link>
                              )
                            )}

                            {/* View Full Report */}
                            {rp && iv && (
                              <Link to={`/report/${iv.id}`} className="ma-btn ma-btn-purple">
                                <svg viewBox="0 0 24 24" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                                View Full Report
                              </Link>
                            )}

                            {/* View Job */}
                            {job && (
                              <Link to={`/job/${app.job_id}`} className="ma-btn ma-btn-outline">
                                <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                View Job
                              </Link>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ── Empty State ── */
                <div className="ma-empty">
                  <div className="ma-empty-icon">
                    <svg viewBox="0 0 24 24" strokeWidth="1.5">
                      <path d="M22 13V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h9"/>
                      <path d="M22 13l-4 4-2-2"/>
                    </svg>
                  </div>
                  <h2>No applications found</h2>
                  <p>
                    {activeFilter === 'all'
                      ? "You haven't applied to any jobs yet. Start exploring and find your dream job!"
                      : `No applications with "${FILTER_TABS.find(t => t.key === activeFilter)?.label}" status found.`}
                  </p>
                  <Link to="/jobs" className="ma-browse">
                    Browse Jobs
                    <svg viewBox="0 0 24 24" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              )}

            </main>
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

export default MyApplications;
