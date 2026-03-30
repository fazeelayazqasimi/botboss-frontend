import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

const CVViewer = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState(null);
  const [cvContent, setCvContent] = useState('');
  const [loadingCV, setLoadingCV] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    job_id: '',
    status: ''
  });
  const [filteredApps, setFilteredApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'company') {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadCompanyAndData(userData);
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [filters, applications]);

  const loadCompanyAndData = async (userData) => {
    try {
      setLoading(true);
      
      const companyRes = await fetch(`${API_URL}/companies/user/${userData.id}`);
      if (!companyRes.ok) {
        setLoading(false);
        return;
      }
      const companyData = await companyRes.json();
      setCompany(companyData);
      
      const jobsRes = await fetch(`${API_URL}/jobs/company/${companyData.id}`);
      const jobsData = jobsRes.ok ? await jobsRes.json() : [];
      setJobs(jobsData);
      
      const allApps = [];
      for (const job of jobsData) {
        try {
          const appsRes = await fetch(`${API_URL}/applications/job/${job.id}`);
          if (appsRes.ok) {
            const apps = await appsRes.json();
            apps.forEach(app => {
              app.job_title = job.title;
              app.job_id = job.id;
            });
            allApps.push(...apps);
          }
        } catch (e) {
          console.error(`Error fetching apps for job ${job.id}:`, e);
        }
      }
      
      allApps.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
      setApplications(allApps);
      setFilteredApps(allApps);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];
    
    if (filters.search) {
      filtered = filtered.filter(app => 
        app.candidate_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.candidate_email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.job_id) {
      filtered = filtered.filter(app => app.job_id === filters.job_id);
    }
    
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    
    setFilteredApps(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ search: '', job_id: '', status: '' });
  };

  const fetchCVContent = async (app) => {
    setSelectedCV(app);
    setLoadingCV(true);
    setCvContent('');
    
    try {
      const response = await fetch(`${API_URL}/applications/cv/${app.id}`);
      if (response.ok) {
        const data = await response.json();
        setCvContent(data.content || 'No CV content available.');
      } else {
        setCvContent(`CV file stored at: ${app.resume_path || 'Unknown location'}`);
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
      setCvContent('Error loading CV content. Please try again.');
    } finally {
      setLoadingCV(false);
    }
  };

  const closeModal = () => {
    setSelectedCV(null);
    setCvContent('');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ea580c',
      reviewed: '#2563eb',
      shortlisted: '#16a34a',
      interview_scheduled: '#7c3aed',
      interview_completed: '#a21caf',
      rejected: '#dc2626',
      hired: '#15803d'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Applied',
      reviewed: 'Under Review',
      shortlisted: 'Shortlisted',
      interview_scheduled: 'Interview Scheduled',
      interview_completed: 'Interview Completed',
      rejected: 'Rejected',
      hired: 'Hired'
    };
    return labels[status] || status;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#059669';
    if (score >= 50) return '#7C3AED';
    return '#DC2626';
  };

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #E5E7EB', 
            borderTopColor: '#6366F1', 
            borderRadius: '50%', 
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading applications...</p>
        </div>
        <Footer />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  if (!company) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ 
            background: '#FEF3C7', 
            border: '1px solid #F59E0B', 
            borderRadius: '16px', 
            padding: '2rem' 
          }}>
            <h2 style={{ marginBottom: '0.5rem', color: '#92400E' }}>Company Profile Required</h2>
            <p style={{ color: '#B45309', marginBottom: '1.5rem' }}>
              Please complete your company profile to view applications.
            </p>
            <Link 
              to="/company/profile/edit" 
              style={{ 
                background: '#6366F1', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '12px', 
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Complete Profile
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (jobs.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ 
            background: '#F3F4F6', 
            border: '1px solid #E5E7EB', 
            borderRadius: '16px', 
            padding: '2rem' 
          }}>
            <h2 style={{ marginBottom: '0.5rem' }}>No Jobs Posted Yet</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Post a job to start receiving applications.
            </p>
            <Link 
              to="/company/post-job" 
              style={{ 
                background: '#6366F1', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '12px', 
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Post Your First Job
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .cv-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: 'Inter', sans-serif;
          background: #F8F9FF;
          min-height: calc(100vh - 200px);
        }
        
        .cv-header {
          background: linear-gradient(135deg, #0F0F1A 0%, #1E1B4B 100%);
          padding: 2rem;
          border-radius: 24px;
          margin-bottom: 2rem;
          color: white;
        }
        
        .cv-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        
        .cv-header p {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
        }
        
        .company-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.8rem;
          margin-top: 0.75rem;
        }
        
        .cv-stats {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        
        .cv-stat {
          background: rgba(255,255,255,0.1);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }
        
        .cv-stat-value {
          font-size: 1.3rem;
          font-weight: 700;
        }
        
        .cv-stat-label {
          font-size: 0.7rem;
          opacity: 0.7;
        }
        
        .cv-filters {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #E9ECF5;
        }
        
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .filter-group label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #6B6B84;
          letter-spacing: 0.05em;
        }
        
        .filter-group input, .filter-group select {
          padding: 0.6rem 0.8rem;
          border: 1.5px solid #E9ECF5;
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        
        .filter-group input:focus, .filter-group select:focus {
          outline: none;
          border-color: #6366F1;
        }
        
        .clear-btn {
          background: #F3F4F6;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1.5rem;
          width: 100%;
          color: #4B5563;
        }
        
        .clear-btn:hover {
          background: #E5E7EB;
        }
        
        .cv-table {
          background: white;
          border-radius: 20px;
          border: 1px solid #E9ECF5;
          overflow-x: auto;
        }
        
        .cv-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .cv-table th {
          text-align: left;
          padding: 1rem 1rem;
          background: #F9FAFB;
          font-size: 0.75rem;
          font-weight: 700;
          color: #6B6B84;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #E9ECF5;
        }
        
        .cv-table td {
          padding: 1rem;
          border-bottom: 1px solid #F0F2F5;
          font-size: 0.85rem;
          color: #1F2937;
        }
        
        .cv-table tr:hover {
          background: #F9FAFB;
          cursor: pointer;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        
        .score-bar {
          width: 60px;
          height: 6px;
          background: #E5E7EB;
          border-radius: 3px;
          overflow: hidden;
          display: inline-block;
          margin-right: 6px;
        }
        
        .score-fill {
          height: 100%;
          border-radius: 3px;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 800px;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #E9ECF5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0A0A0F;
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #9CA3AF;
        }
        
        .modal-close:hover {
          color: #4B5563;
        }
        
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
        
        .cv-meta {
          background: #F9FAFB;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }
        
        .cv-meta p {
          margin: 0.25rem 0;
          font-size: 0.85rem;
        }
        
        .cv-content {
          background: white;
          padding: 1rem;
          border: 1px solid #E9ECF5;
          border-radius: 12px;
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 0.8rem;
          line-height: 1.5;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6B6B84;
        }
        
        @media (max-width: 768px) {
          .cv-container {
            padding: 1rem;
          }
          .cv-table th, .cv-table td {
            padding: 0.75rem;
          }
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Navbar />
      <div className="cv-container">
        <div className="cv-header">
          <h1>📄 Candidate CVs</h1>
          <p>View all applications for your company's jobs</p>
          <div className="company-badge">
            🏢 {company.name}
          </div>
          <div className="cv-stats">
            <div className="cv-stat">
              <div className="cv-stat-value">{applications.length}</div>
              <div className="cv-stat-label">Total Applications</div>
            </div>
            <div className="cv-stat">
              <div className="cv-stat-value">{applications.filter(a => a.cv_score >= 50).length}</div>
              <div className="cv-stat-label">Auto-Shortlisted</div>
            </div>
            <div className="cv-stat">
              <div className="cv-stat-value">{applications.filter(a => a.status === 'hired').length}</div>
              <div className="cv-stat-label">Hired</div>
            </div>
          </div>
        </div>

        <div className="cv-filters">
          <div className="filters-grid">
            <div className="filter-group">
              <label>🔍 Search Candidate</label>
              <input
                type="text"
                name="search"
                placeholder="Name or email..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>💼 Job Position</label>
              <select name="job_id" value={filters.job_id} onChange={handleFilterChange}>
                <option value="">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>📌 Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="pending">Applied</option>
                <option value="reviewed">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interview_completed">Interview Completed</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button className="clear-btn" onClick={clearFilters}>
              Clear Filters ({activeFilterCount})
            </button>
          )}
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <p>No applications received yet for your jobs.</p>
            <Link to="/company/post-job" style={{ color: '#6366F1', marginTop: '1rem', display: 'inline-block' }}>
              Post more jobs to attract candidates →
            </Link>
          </div>
        ) : (
          <div className="cv-table">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>Applied</th>
                  <th>CV Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(app => (
                  <tr key={app.id} onClick={() => fetchCVContent(app)}>
                    <td>
                      <strong>{app.candidate_name}</strong>
                      <br />
                      <small style={{ color: '#9CA3AF' }}>{app.candidate_email}</small>
                    </td>
                    <td>{app.job_title || '—'}</td>
                    <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td>
                      {app.cv_score ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ 
                                width: `${app.cv_score}%`,
                                background: getScoreColor(app.cv_score)
                              }}
                            />
                          </div>
                          <span style={{ 
                            fontWeight: 600,
                            color: getScoreColor(app.cv_score)
                          }}>
                            {app.cv_score}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#9CA3B8' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ 
                          background: `${getStatusColor(app.status)}15`,
                          color: getStatusColor(app.status),
                          border: `1px solid ${getStatusColor(app.status)}30`
                        }}
                      >
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredApps.length === 0 && (
              <div className="empty-state">
                <p>No applications match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedCV && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📄 CV: {selectedCV.candidate_name}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="cv-meta">
                <p><strong>Email:</strong> {selectedCV.candidate_email}</p>
                <p><strong>Job:</strong> {selectedCV.job_title || '—'}</p>
                <p><strong>Applied:</strong> {new Date(selectedCV.applied_at).toLocaleString()}</p>
                {selectedCV.cv_score && (
                  <p><strong>CV Match Score:</strong> {selectedCV.cv_score}%</p>
                )}
                <p><strong>Status:</strong> {getStatusLabel(selectedCV.status)}</p>
              </div>
              <div className="cv-content">
                {loadingCV ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>Loading CV content...</div>
                ) : (
                  cvContent || 'No CV content available.'
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CVViewer;
