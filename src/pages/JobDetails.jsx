import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({ coverLetter: '', resume: null });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const foundJob = jobs.find(j => j.id === parseInt(id));
    if (foundJob) {
      setJob(foundJob);
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      setCompany(companies.find(c => c.id === foundJob.companyId || c.name === foundJob.company));
      setRelatedJobs(jobs.filter(j => j.id !== foundJob.id && (j.category === foundJob.category || j.company === foundJob.company)).slice(0, 3));
      if (userData?.type === 'candidate') {
        const apps = JSON.parse(localStorage.getItem('applications') || '[]');
        setHasApplied(apps.some(a => a.jobId === foundJob.id && a.candidateId === userData.profileId));
      }
    } else { navigate('/jobs'); }
    setLoading(false);
  }, [id, navigate]);

  const handleApply = () => {
    if (!user) { navigate('/login'); return; }
    if (user.type !== 'candidate') { alert('Only candidates can apply for jobs'); return; }
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const candidate = candidates.find(c => c.id === user.profileId);
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications.push({
      id: Date.now(), jobId: job.id, jobTitle: job.title, company: job.company,
      candidateId: user.profileId, candidateName: user.name,
      appliedDate: new Date().toISOString().split('T')[0], status: 'Applied',
      coverLetter: applicationData.coverLetter,
      resume: applicationData.resume ? applicationData.resume.name : (candidate?.resume || 'No resume'),
      score: null
    });
    localStorage.setItem('applications', JSON.stringify(applications));
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    localStorage.setItem('jobs', JSON.stringify(jobs.map(j => j.id === job.id ? { ...j, applicants: (j.applicants || 0) + 1 } : j)));
    if (candidate) {
      localStorage.setItem('candidates', JSON.stringify(candidates.map(c => c.id === user.profileId ? { ...c, appliedJobs: [...(c.appliedJobs || []), job.id] } : c)));
    }
    setShowApplyModal(false);
    setHasApplied(true);
    alert('Application submitted successfully!');
  };

  if (loading) {
    return (
      <div className="jd-root">
        <Navbar />
        <div className="jd-loading"><div className="jd-spinner" /><p>Loading job details...</p></div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="jd-root">
        <Navbar />
        <div className="jd-loading"><p>Job not found.</p><Link to="/jobs" className="jd-link">Back to Jobs</Link></div>
        <Footer />
      </div>
    );
  }

  const summaryRows = [
    { label: 'Position', value: job.title },
    { label: 'Experience', value: job.experience || 'Not specified' },
    { label: 'Location', value: job.location },
    { label: 'Job Type', value: job.type },
    { label: 'Salary', value: job.salary },
    { label: 'Posted', value: new Date(job.postedDate).toLocaleDateString() },
    { label: 'Applicants', value: job.applicants || 0 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .jd-root {
          font-family: 'Poppins', sans-serif;
          background: #f8f7ff;
          min-height: 100vh;
          color: #1c0b4b;
          -webkit-font-smoothing: antialiased;
        }

        /* ── LOADING ── */
        .jd-loading {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; padding: 6rem 2rem;
          font-size: 0.9rem; color: #9ca3af;
        }
        .jd-spinner {
          width: 36px; height: 36px;
          border: 3px solid #ede9fe; border-top-color: #7c3aed;
          border-radius: 50%; animation: jd-spin 0.8s linear infinite;
        }
        @keyframes jd-spin { to { transform: rotate(360deg); } }
        .jd-link { color: #7c3aed; text-decoration: none; font-weight: 600; }

        /* ── MAIN WRAPPER ── */
        .jd-main { max-width: 1300px; margin: 0 auto; padding: 2rem 5%; }

        /* ── BREADCRUMB ── */
        .jd-breadcrumb {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.8rem; color: #9ca3af; margin-bottom: 1.5rem;
        }
        .jd-breadcrumb a { color: #7c3aed; text-decoration: none; font-weight: 500; }
        .jd-breadcrumb a:hover { text-decoration: underline; }
        .jd-breadcrumb svg { width: 12px; height: 12px; stroke: #d1d5db; fill: none; }

        /* ── JOB HEADER CARD ── */
        .jd-header-card {
          background: white; border: 1.5px solid #f3f4f6;
          border-radius: 20px; padding: 2rem;
          display: flex; gap: 1.5rem; align-items: flex-start;
          margin-bottom: 1.75rem;
        }
        .jd-logo {
          width: 72px; height: 72px; border-radius: 14px;
          object-fit: cover; border: 1px solid #f3f4f6; flex-shrink: 0;
        }
        .jd-logo-fallback {
          width: 72px; height: 72px; border-radius: 14px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.6rem; color: #7c3aed; flex-shrink: 0;
        }
        .jd-header-info { flex: 1; min-width: 0; }
        .jd-job-title {
          font-size: clamp(1.3rem, 2.5vw, 1.8rem); font-weight: 800;
          color: #1c0b4b; letter-spacing: -0.02em; margin-bottom: 0.3rem;
        }
        .jd-company-link {
          font-size: 0.95rem; font-weight: 600; color: #7c3aed;
          text-decoration: none; display: inline-block; margin-bottom: 1.1rem;
        }
        .jd-company-link:hover { text-decoration: underline; }
        .jd-meta-row {
          display: flex; flex-wrap: wrap; gap: 0.625rem; margin-bottom: 1.5rem;
        }
        .jd-meta-chip {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.78rem; font-weight: 500; color: #6b7280;
          background: #f9fafb; border: 1px solid #f3f4f6;
          padding: 0.35rem 0.875rem; border-radius: 8px;
        }
        .jd-meta-chip svg { width: 13px; height: 13px; stroke: #9ca3af; fill: none; flex-shrink: 0; }
        .jd-actions { display: flex; gap: 0.875rem; flex-wrap: wrap; }
        .jd-apply-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: 'Poppins', sans-serif; font-size: 0.9rem; font-weight: 700;
          background: #7c3aed; color: white; border: none;
          padding: 0.8rem 2rem; border-radius: 12px; cursor: pointer;
          transition: all 0.2s;
        }
        .jd-apply-btn:hover { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(124,58,237,0.3); }
        .jd-save-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: 'Poppins', sans-serif; font-size: 0.9rem; font-weight: 600;
          background: white; color: #7c3aed;
          border: 1.5px solid #ede9fe; padding: 0.8rem 2rem;
          border-radius: 12px; cursor: pointer; transition: all 0.2s;
        }
        .jd-save-btn:hover { background: #f5f3ff; border-color: #7c3aed; }
        .jd-save-btn svg, .jd-apply-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; }
        .jd-applied-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.875rem; font-weight: 600;
          background: #f0fdf4; color: #16a34a;
          border: 1.5px solid #bbf7d0;
          padding: 0.7rem 1.25rem; border-radius: 12px;
        }
        .jd-applied-badge svg { width: 15px; height: 15px; stroke: #16a34a; fill: none; }

        /* ── CONTENT GRID ── */
        .jd-content-grid {
          display: grid; grid-template-columns: 1fr 320px;
          gap: 1.75rem; align-items: start;
        }

        /* ── CONTENT CARD ── */
        .jd-card {
          background: white; border: 1.5px solid #f3f4f6;
          border-radius: 20px; padding: 2rem;
        }
        .jd-section { margin-bottom: 2rem; }
        .jd-section:last-child { margin-bottom: 0; }
        .jd-section-title {
          font-size: 1rem; font-weight: 700; color: #1c0b4b;
          margin-bottom: 1.25rem; padding-bottom: 0.75rem;
          border-bottom: 1.5px solid #f3f4f6;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .jd-section-title svg { width: 16px; height: 16px; stroke: #7c3aed; fill: none; }
        .jd-description {
          font-size: 0.9rem; color: #4b5563; line-height: 1.85;
          white-space: pre-line;
        }
        .jd-req-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
        .jd-req-item {
          display: flex; align-items: flex-start; gap: 0.6rem;
          font-size: 0.88rem; color: #4b5563; line-height: 1.6;
        }
        .jd-req-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #7c3aed; flex-shrink: 0; margin-top: 0.5rem;
        }
        .jd-skills-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .jd-skill-tag {
          font-size: 0.78rem; font-weight: 500; color: #4b5563;
          background: #f3f4f6; padding: 0.3rem 0.75rem; border-radius: 8px;
        }

        /* ── SIDEBAR ── */
        .jd-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
        .jd-company-card { text-align: center; }
        .jd-co-logo {
          width: 72px; height: 72px; border-radius: 14px;
          object-fit: cover; border: 1px solid #f3f4f6;
          margin: 0 auto 0.875rem; display: block;
        }
        .jd-co-logo-fallback {
          width: 72px; height: 72px; border-radius: 14px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.5rem; color: #7c3aed;
          margin: 0 auto 0.875rem;
        }
        .jd-co-name { font-size: 1rem; font-weight: 700; color: #1c0b4b; margin-bottom: 0.25rem; }
        .jd-co-industry { font-size: 0.78rem; color: #9ca3af; font-weight: 500; margin-bottom: 1rem; }
        .jd-co-stats {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.75rem; margin-bottom: 1.25rem;
          padding: 1rem 0; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;
        }
        .jd-co-stat-val { font-size: 1.2rem; font-weight: 800; color: #1c0b4b; }
        .jd-co-stat-label { font-size: 0.72rem; color: #9ca3af; font-weight: 500; margin-top: 0.15rem; }
        .jd-co-link {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.82rem; font-weight: 600; color: #7c3aed;
          text-decoration: none;
        }
        .jd-co-link:hover { text-decoration: underline; }
        .jd-co-link svg { width: 13px; height: 13px; stroke: currentColor; fill: none; }

        /* Job Summary Table */
        .jd-summary-table { width: 100%; border-collapse: collapse; }
        .jd-summary-table tr { border-bottom: 1px solid #f9fafb; }
        .jd-summary-table tr:last-child { border-bottom: none; }
        .jd-summary-table td { padding: 0.65rem 0; vertical-align: top; }
        .jd-summary-table td:first-child {
          font-size: 0.75rem; font-weight: 600; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.06em;
          width: 38%; padding-right: 0.75rem;
        }
        .jd-summary-table td:last-child { font-size: 0.84rem; font-weight: 500; color: #1c0b4b; }

        /* ── RELATED JOBS ── */
        .jd-related { margin-top: 1.75rem; }
        .jd-related-title {
          font-size: 1.1rem; font-weight: 800; color: #1c0b4b;
          letter-spacing: -0.02em; margin-bottom: 1.25rem;
        }
        .jd-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .jd-related-card {
          background: white; border: 1.5px solid #f3f4f6;
          border-radius: 14px; padding: 1.25rem;
          text-decoration: none; display: block;
          transition: all 0.22s;
        }
        .jd-related-card:hover { border-color: #c4b5fd; box-shadow: 0 8px 24px rgba(124,58,237,0.1); transform: translateY(-2px); }
        .jd-rel-title { font-size: 0.9rem; font-weight: 700; color: #1c0b4b; margin-bottom: 0.25rem; }
        .jd-rel-company { font-size: 0.78rem; color: #7c3aed; font-weight: 600; margin-bottom: 0.75rem; }
        .jd-rel-meta { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .jd-rel-chip {
          display: inline-flex; align-items: center; gap: 0.3rem;
          font-size: 0.72rem; color: #9ca3af; font-weight: 500;
        }
        .jd-rel-chip svg { width: 11px; height: 11px; stroke: #c4b5fd; fill: none; }

        /* ── MODAL ── */
        .jd-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(28,11,75,0.5);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 1rem;
        }
        .jd-modal {
          background: white; border-radius: 20px;
          padding: 2rem; max-width: 500px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 40px 80px rgba(28,11,75,0.2);
        }
        .jd-modal-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .jd-modal-title { font-size: 1.1rem; font-weight: 800; color: #1c0b4b; }
        .jd-modal-sub { font-size: 0.8rem; color: #9ca3af; margin-top: 0.2rem; }
        .jd-modal-close {
          background: #f5f3ff; border: none; border-radius: 8px;
          width: 32px; height: 32px; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: #7c3aed;
          font-size: 1.2rem; line-height: 1; flex-shrink: 0;
          transition: background 0.2s;
        }
        .jd-modal-close:hover { background: #ede9fe; }
        .jd-form-group { margin-bottom: 1.25rem; }
        .jd-form-label {
          display: block; font-size: 0.78rem; font-weight: 600;
          color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }
        .jd-form-textarea {
          width: 100%; padding: 0.875rem;
          border: 1.5px solid #e5e7eb; border-radius: 12px;
          font-family: 'Poppins', sans-serif; font-size: 0.875rem;
          color: #1c0b4b; outline: none; min-height: 120px;
          resize: vertical; transition: border-color 0.2s;
        }
        .jd-form-textarea:focus { border-color: #7c3aed; }
        .jd-form-file {
          width: 100%; padding: 0.875rem;
          border: 2px dashed #e5e7eb; border-radius: 12px;
          font-family: 'Poppins', sans-serif; font-size: 0.84rem;
          cursor: pointer; transition: border-color 0.2s;
        }
        .jd-form-file:hover { border-color: #c4b5fd; }
        .jd-form-hint { font-size: 0.75rem; color: #9ca3af; margin-top: 0.35rem; }
        .jd-modal-actions { display: flex; gap: 0.875rem; margin-top: 1.5rem; }
        .jd-modal-submit {
          flex: 1; font-family: 'Poppins', sans-serif; font-size: 0.9rem;
          font-weight: 700; background: #7c3aed; color: white;
          border: none; border-radius: 12px; padding: 0.875rem;
          cursor: pointer; transition: background 0.2s;
        }
        .jd-modal-submit:hover { background: #6d28d9; }
        .jd-modal-cancel {
          flex: 1; font-family: 'Poppins', sans-serif; font-size: 0.9rem;
          font-weight: 600; background: white; color: #6b7280;
          border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 0.875rem;
          cursor: pointer; transition: all 0.2s;
        }
        .jd-modal-cancel:hover { border-color: #9ca3af; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .jd-content-grid { grid-template-columns: 1fr; }
          .jd-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .jd-header-card { flex-direction: column; }
          .jd-related-grid { grid-template-columns: 1fr; }
          .jd-main { padding: 1.5rem 1.25rem; }
        }
      `}</style>

      <div className="jd-root">
        <Navbar />

        <main className="jd-main">
          {/* Breadcrumb */}
          <nav className="jd-breadcrumb">
            <Link to="/">Home</Link>
            <svg viewBox="0 0 24 24" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            <Link to="/jobs">Jobs</Link>
            <svg viewBox="0 0 24 24" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            <span style={{ color: '#1c0b4b', fontWeight: 500 }}>{job.title}</span>
          </nav>

          {/* Header Card */}
          <div className="jd-header-card">
            {job.companyLogo || company?.logo ? (
              <img src={job.companyLogo || company?.logo} alt={job.company} className="jd-logo" />
            ) : (
              <div className="jd-logo-fallback">{job.company?.charAt(0).toUpperCase() || 'C'}</div>
            )}

            <div className="jd-header-info">
              <h1 className="jd-job-title">{job.title}</h1>
              <Link to={`/company/${job.companyId}`} className="jd-company-link">{job.company}</Link>

              <div className="jd-meta-row">
                <span className="jd-meta-chip">
                  <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {job.location}
                </span>
                <span className="jd-meta-chip">
                  <svg viewBox="0 0 24 24" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                  {job.salary}
                </span>
                <span className="jd-meta-chip">
                  <svg viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                  {job.type}
                </span>
                <span className="jd-meta-chip">
                  <svg viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Posted: {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </div>

              <div className="jd-actions">
                {user?.type === 'candidate' && !hasApplied && (
                  <button onClick={handleApply} className="jd-apply-btn">
                    <svg viewBox="0 0 24 24" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Apply Now
                  </button>
                )}
                {user?.type === 'candidate' && hasApplied && (
                  <span className="jd-applied-badge">
                    <svg viewBox="0 0 24 24" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Applied
                  </span>
                )}
                {!user && (
                  <button onClick={handleApply} className="jd-apply-btn">
                    Login to Apply
                  </button>
                )}
                <button className="jd-save-btn">
                  <svg viewBox="0 0 24 24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Save Job
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="jd-content-grid">
            {/* Left */}
            <div>
              <div className="jd-card">
                <div className="jd-section">
                  <h2 className="jd-section-title">
                    <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Job Description
                  </h2>
                  <p className="jd-description">{job.description}</p>
                </div>

                <div className="jd-section">
                  <h2 className="jd-section-title">
                    <svg viewBox="0 0 24 24" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                    Requirements
                  </h2>
                  <ul className="jd-req-list">
                    {job.requirements?.map((req, i) => (
                      <li key={i} className="jd-req-item">
                        <span className="jd-req-dot" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="jd-section">
                  <h2 className="jd-section-title">
                    <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    Required Skills
                  </h2>
                  <div className="jd-skills-wrap">
                    {job.requirements?.map((skill, i) => (
                      <span key={i} className="jd-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="jd-sidebar">
              {/* Company Card */}
              {company && (
                <div className="jd-card jd-company-card">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="jd-co-logo" />
                  ) : (
                    <div className="jd-co-logo-fallback">{company.name?.charAt(0).toUpperCase()}</div>
                  )}
                  <div className="jd-co-name">{company.name}</div>
                  <div className="jd-co-industry">{company.industry}</div>
                  <div className="jd-co-stats">
                    <div>
                      <div className="jd-co-stat-val">{company.openPositions}</div>
                      <div className="jd-co-stat-label">Open Jobs</div>
                    </div>
                    <div>
                      <div className="jd-co-stat-val">{company.rating || '—'}</div>
                      <div className="jd-co-stat-label">Rating</div>
                    </div>
                  </div>
                  <Link to={`/company/${company.id}`} className="jd-co-link">
                    View Company Profile
                    <svg viewBox="0 0 24 24" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              )}

              {/* Job Summary */}
              <div className="jd-card">
                <h3 className="jd-section-title" style={{ marginBottom: '0.75rem' }}>
                  <svg viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  Job Summary
                </h3>
                <table className="jd-summary-table">
                  <tbody>
                    {summaryRows.map(row => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Related Jobs */}
          {relatedJobs.length > 0 && (
            <div className="jd-related">
              <h2 className="jd-related-title">Similar Jobs</h2>
              <div className="jd-related-grid">
                {relatedJobs.map(r => (
                  <Link key={r.id} to={`/job/${r.id}`} className="jd-related-card">
                    <div className="jd-rel-title">{r.title}</div>
                    <div className="jd-rel-company">{r.company}</div>
                    <div className="jd-rel-meta">
                      <span className="jd-rel-chip">
                        <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {r.location?.split(' ')[0]}
                      </span>
                      <span className="jd-rel-chip">
                        <svg viewBox="0 0 24 24" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                        {r.salary}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="jd-modal-overlay" onClick={() => setShowApplyModal(false)}>
            <div className="jd-modal" onClick={e => e.stopPropagation()}>
              <div className="jd-modal-head">
                <div>
                  <div className="jd-modal-title">Apply for {job.title}</div>
                  <div className="jd-modal-sub">{job.company}</div>
                </div>
                <button className="jd-modal-close" onClick={() => setShowApplyModal(false)}>×</button>
              </div>

              <form onSubmit={handleApplicationSubmit}>
                <div className="jd-form-group">
                  <label className="jd-form-label">Cover Letter (Optional)</label>
                  <textarea
                    className="jd-form-textarea"
                    placeholder="Write a brief cover letter explaining why you're a good fit..."
                    value={applicationData.coverLetter}
                    onChange={e => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  />
                </div>

                <div className="jd-form-group">
                  <label className="jd-form-label">Resume</label>
                  <input
                    type="file" className="jd-form-file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setApplicationData({ ...applicationData, resume: e.target.files[0] })}
                  />
                  <p className="jd-form-hint">Accepted: PDF, DOC, DOCX (Max 5MB)</p>
                </div>

                <div className="jd-modal-actions">
                  <button type="submit" className="jd-modal-submit">Submit Application</button>
                  <button type="button" className="jd-modal-cancel" onClick={() => setShowApplyModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default JobDetails;