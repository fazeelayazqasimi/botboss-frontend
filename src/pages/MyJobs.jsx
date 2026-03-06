import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { companies, jobs, applications } from '../data';

const MyJobs = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    reviewedApplications: 0,
    shortlistedApplications: 0,
    interviewedApplications: 0,
    hiredApplications: 0,
    rejectedApplications: 0,
    averagePerJob: 0,
    mostAppliedJob: null,
    leastAppliedJob: null
  });
  
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is company
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'company') {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadCompanyData(userData);
  }, []);

  const loadCompanyData = (userData) => {
    setLoading(true);
    
    try {
      // Try to get company profile
      const companyProfile = companies.getCompanyByUserId(userData.id);
      setCompany(companyProfile);

      // If no company profile, still show jobs using company name from user
      let companyJobsList = [];
      let allApps = [];

      if (companyProfile) {
        // Get jobs posted by this company using company ID
        companyJobsList = jobs.getJobsByCompany(companyProfile.id);
        allApps = applications.getApplicationsByCompany(companyProfile.id);
      } else {
        // If no profile, try to find jobs by company name (from user)
        const allJobs = jobs.getJobs();
        companyJobsList = allJobs.filter(job => 
          job.company === userData.name || 
          job.companyEmail === userData.email
        );
        
        // Get applications for these jobs
        allApps = applications.getApplications().filter(app => 
          companyJobsList.some(job => job.id === app.jobId)
        );
      }

      setCompanyJobs(companyJobsList);
      setAllApplications(allApps);
      
      // Show profile prompt if no company profile and no jobs
      setShowProfilePrompt(!companyProfile && companyJobsList.length === 0);

      // Calculate stats
      calculateStats(companyJobsList, allApps);

    } catch (error) {
      console.error('Error loading company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (jobsList, appsList) => {
    const totalJobs = jobsList.length;
    const activeJobs = jobsList.filter(j => j.active !== false).length;
    const closedJobs = jobsList.filter(j => j.active === false).length;
    const totalApps = appsList.length;
    
    // Application status breakdown
    const pending = appsList.filter(a => a.status === 'Applied').length;
    const reviewed = appsList.filter(a => a.status === 'Under Review').length;
    const shortlisted = appsList.filter(a => a.status === 'Shortlisted').length;
    const interviewed = appsList.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview Completed').length;
    const hired = appsList.filter(a => a.status === 'Hired').length;
    const rejected = appsList.filter(a => a.status === 'Rejected').length;
    
    // Average per job
    const avgPerJob = totalJobs > 0 ? (totalApps / totalJobs).toFixed(1) : 0;
    
    // Most and least applied jobs
    let mostApplied = null;
    let leastApplied = null;
    let maxApps = 0;
    let minApps = Infinity;
    
    jobsList.forEach(job => {
      const jobApps = appsList.filter(a => a.jobId === job.id).length;
      if (jobApps > maxApps) {
        maxApps = jobApps;
        mostApplied = { ...job, applicationCount: jobApps };
      }
      if (jobApps < minApps) {
        minApps = jobApps;
        leastApplied = { ...job, applicationCount: jobApps };
      }
    });

    setStats({
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications: totalApps,
      pendingApplications: pending,
      reviewedApplications: reviewed,
      shortlistedApplications: shortlisted,
      interviewedApplications: interviewed,
      hiredApplications: hired,
      rejectedApplications: rejected,
      averagePerJob: avgPerJob,
      mostAppliedJob: mostApplied,
      leastAppliedJob: leastApplied
    });
  };

  const getFilteredAndSortedJobs = () => {
    let filtered = [...companyJobs];
    
    // Apply status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(j => j.active !== false);
    } else if (filterStatus === 'closed') {
      filtered = filtered.filter(j => j.active === false);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'date':
          return new Date(b.postedDate) - new Date(a.postedDate);
        case 'applicants':
          const aApps = allApplications.filter(app => app.jobId === a.id).length;
          const bApps = allApplications.filter(app => app.jobId === b.id).length;
          return bApps - aApps;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'salary':
          const aSalary = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
          const bSalary = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
          return bSalary - aSalary;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getJobApplications = (jobId) => {
    return allApplications.filter(app => app.jobId === jobId);
  };

  const getApplicationStatusCounts = (jobId) => {
    const jobApps = getJobApplications(jobId);
    return {
      total: jobApps.length,
      pending: jobApps.filter(a => a.status === 'Applied').length,
      reviewed: jobApps.filter(a => a.status === 'Under Review').length,
      shortlisted: jobApps.filter(a => a.status === 'Shortlisted').length,
      interviewed: jobApps.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview Completed').length,
      hired: jobApps.filter(a => a.status === 'Hired').length,
      rejected: jobApps.filter(a => a.status === 'Rejected').length
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      'Applied': '#ff9800',
      'Under Review': '#2196f3',
      'Shortlisted': '#4caf50',
      'Interview Scheduled': '#9c27b0',
      'Interview Completed': '#673ab7',
      'Rejected': '#f44336',
      'Hired': '#2e7d32'
    };
    return colors[status] || '#757575';
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleToggleJobStatus = (jobId, currentStatus) => {
    const updated = jobs.updateJob(jobId, { active: !currentStatus });
    if (updated) {
      loadCompanyData(user);
    }
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      jobs.deleteJob(jobId);
      loadCompanyData(user);
    }
  };

  const filteredJobs = getFilteredAndSortedJobs();

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8f9fa'
    },
    main: {
      flex: 1,
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      width: '100%'
    },
    header: {
      marginBottom: '2rem'
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '0.5rem'
    },
    title: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '0.25rem'
    },
    companyName: {
      fontSize: '1.2rem',
      color: '#667eea',
      fontWeight: 500
    },
    postJobBtn: {
      background: '#667eea',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s'
    },
    profilePrompt: {
      background: '#fff3e0',
      border: '1px solid #ffb74d',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    promptText: {
      color: '#f57c00',
      fontSize: '0.95rem'
    },
    promptBtn: {
      background: '#f57c00',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      textDecoration: 'none',
      fontSize: '0.9rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      transition: 'transform 0.3s'
    },
    statIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem'
    },
    statInfo: {
      flex: 1
    },
    statValue: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#333',
      lineHeight: 1.2
    },
    statLabel: {
      color: '#666',
      fontSize: '0.9rem'
    },
    statSubtext: {
      fontSize: '0.8rem',
      color: '#999',
      marginTop: '0.25rem'
    },
    highlightsSection: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#333',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    highlightsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    highlightCard: {
      background: '#f8f9fa',
      padding: '1.25rem',
      borderRadius: '10px',
      border: '1px solid #e5e7eb'
    },
    highlightTitle: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    highlightJobTitle: {
      fontSize: '1.2rem',
      color: '#333',
      fontWeight: 600,
      marginBottom: '0.5rem'
    },
    highlightStats: {
      display: 'flex',
      gap: '1rem',
      color: '#666',
      fontSize: '0.95rem'
    },
    controlsBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    filtersGroup: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    select: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      background: 'white',
      fontSize: '0.95rem',
      outline: 'none',
      cursor: 'pointer'
    },
    viewToggle: {
      display: 'flex',
      gap: '0.5rem'
    },
    viewBtn: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      background: 'white',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.3s'
    },
    activeViewBtn: {
      background: '#667eea',
      color: 'white',
      borderColor: '#667eea'
    },
    jobsGrid: {
      display: 'grid',
      gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : '1fr',
      gap: '1.5rem'
    },
    jobCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'all 0.3s',
      border: '1px solid transparent'
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem'
    },
    jobTitle: {
      fontSize: '1.2rem',
      color: '#333',
      margin: 0,
      textDecoration: 'none'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 500
    },
    jobMeta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '1rem'
    },
    progressSection: {
      marginBottom: '1rem'
    },
    progressBar: {
      height: '8px',
      background: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '0.5rem'
    },
    progressFill: {
      height: '100%',
      background: '#667eea',
      borderRadius: '4px',
      transition: 'width 0.3s'
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.85rem',
      color: '#666'
    },
    statusTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    statusTag: {
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 500,
      color: 'white'
    },
    jobFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e5e7eb'
    },
    actionBtn: {
      padding: '0.4rem 0.75rem',
      borderRadius: '5px',
      border: '1px solid #667eea',
      background: 'transparent',
      color: '#667eea',
      cursor: 'pointer',
      fontSize: '0.85rem',
      margin: '0.2rem',
      transition: 'all 0.3s',
      textDecoration: 'none',
      display: 'inline-block'
    },
    deleteBtn: {
      borderColor: '#f44336',
      color: '#f44336'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem',
      background: 'white',
      borderRadius: '12px'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      opacity: 0.5
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    modalTitle: {
      fontSize: '1.3rem',
      color: '#333'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#666'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.loading}>
          <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
          <h3>Loading your jobs...</h3>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.title}>My Jobs</h1>
              <p style={styles.companyName}>
                {company ? company.name : user?.name}
                {!company && <span style={{fontSize: '0.9rem', color: '#999', marginLeft: '0.5rem'}}>(Basic Account)</span>}
              </p>
            </div>
            <Link to="/company/post-job" style={styles.postJobBtn}>
              + Post New Job
            </Link>
          </div>
        </div>

        {/* Profile Prompt - Non-blocking suggestion */}
        {showProfilePrompt && (
          <div style={styles.profilePrompt}>
            <span style={styles.promptText}>
              💡 Tip: Complete your company profile to get better visibility and track applications more effectively.
            </span>
            <Link to="/company/profile/edit" style={styles.promptBtn}>
              Complete Profile
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e3f2fd', color: '#1976d2'}}>📋</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.totalJobs}</div>
              <div style={styles.statLabel}>Total Jobs</div>
              <div style={styles.statSubtext}>{stats.activeJobs} Active • {stats.closedJobs} Closed</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e8f5e8', color: '#388e3c'}}>👥</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.totalApplications}</div>
              <div style={styles.statLabel}>Total Applications</div>
              <div style={styles.statSubtext}>Avg {stats.averagePerJob} per job</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#fff3e0', color: '#f57c00'}}>⏳</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.pendingApplications}</div>
              <div style={styles.statLabel}>Pending Review</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#f3e5f5', color: '#7b1fa2'}}>⭐</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.shortlistedApplications}</div>
              <div style={styles.statLabel}>Shortlisted</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e8f5e8', color: '#2e7d32'}}>✅</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.interviewedApplications}</div>
              <div style={styles.statLabel}>Interviews</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#fff3e0', color: '#f57c00'}}>🎉</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.hiredApplications}</div>
              <div style={styles.statLabel}>Hired</div>
            </div>
          </div>
        </div>

        {/* Highlights Section - Only show if there are jobs */}
        {stats.totalJobs > 0 && (stats.mostAppliedJob || stats.leastAppliedJob) && (
          <div style={styles.highlightsSection}>
            <h2 style={styles.sectionTitle}>
              <span>📊</span> Job Performance Highlights
            </h2>
            <div style={styles.highlightsGrid}>
              {stats.mostAppliedJob && (
                <div style={styles.highlightCard}>
                  <div style={styles.highlightTitle}>
                    <span>🔥 Most Applications</span>
                  </div>
                  <div style={styles.highlightJobTitle}>{stats.mostAppliedJob.title}</div>
                  <div style={styles.highlightStats}>
                    <span>📋 {stats.mostAppliedJob.applicationCount} applications</span>
                    <span>📍 {stats.mostAppliedJob.location}</span>
                  </div>
                </div>
              )}
              
              {stats.leastAppliedJob && stats.leastAppliedJob.id !== stats.mostAppliedJob?.id && (
                <div style={styles.highlightCard}>
                  <div style={styles.highlightTitle}>
                    <span>📉 Least Applications</span>
                  </div>
                  <div style={styles.highlightJobTitle}>{stats.leastAppliedJob.title}</div>
                  <div style={styles.highlightStats}>
                    <span>📋 {stats.leastAppliedJob.applicationCount} applications</span>
                    <span>📍 {stats.leastAppliedJob.location}</span>
                  </div>
                </div>
              )}
              
              <div style={styles.highlightCard}>
                <div style={styles.highlightTitle}>
                  <span>⚡ Quick Stats</span>
                </div>
                <div style={styles.highlightStats}>
                  <div>🎯 Conversion Rate: {stats.totalApplications > 0 ? ((stats.hiredApplications / stats.totalApplications) * 100).toFixed(1) : 0}%</div>
                  <div>📊 Interview Rate: {stats.totalApplications > 0 ? ((stats.interviewedApplications / stats.totalApplications) * 100).toFixed(1) : 0}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls Bar - Only show if there are jobs */}
        {stats.totalJobs > 0 && (
          <div style={styles.controlsBar}>
            <div style={styles.filtersGroup}>
              <select 
                style={styles.select} 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Jobs</option>
                <option value="active">Active Jobs</option>
                <option value="closed">Closed Jobs</option>
              </select>
              
              <select 
                style={styles.select} 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by: Date (Newest)</option>
                <option value="applicants">Sort by: Most Applications</option>
                <option value="title">Sort by: Title</option>
                <option value="salary">Sort by: Salary (High to Low)</option>
              </select>
            </div>
            
            <div style={styles.viewToggle}>
              <button 
                style={{...styles.viewBtn, ...(viewMode === 'grid' ? styles.activeViewBtn : {})}}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button 
                style={{...styles.viewBtn, ...(viewMode === 'list' ? styles.activeViewBtn : {})}}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>
          </div>
        )}

        {/* Jobs Grid/List */}
        {filteredJobs.length > 0 ? (
          <div style={styles.jobsGrid}>
            {filteredJobs.map(job => {
              const jobStats = getApplicationStatusCounts(job.id);
              const totalJobApps = jobStats.total;
              const applicationRate = totalJobApps > 0 ? (jobStats.hired / totalJobApps * 100).toFixed(1) : 0;
              
              return (
                <div key={job.id} style={styles.jobCard}>
                  <div style={styles.jobHeader}>
                    <Link to={`/job/${job.id}`} style={styles.jobTitle}>
                      {job.title}
                    </Link>
                    <span style={{
                      ...styles.statusBadge,
                      background: job.active ? '#4caf5020' : '#f4433620',
                      color: job.active ? '#4caf50' : '#f44336'
                    }}>
                      {job.active ? '● Active' : '○ Closed'}
                    </span>
                  </div>

                  <div style={styles.jobMeta}>
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>📅 Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>

                  {/* Application Progress */}
                  {totalJobApps > 0 && (
                    <div style={styles.progressSection}>
                      <div style={styles.progressBar}>
                        <div style={{...styles.progressFill, width: `${Math.min((totalJobApps / 50) * 100, 100)}%`}}></div>
                      </div>
                      <div style={styles.statsRow}>
                        <span>📋 Total: {totalJobApps} applications</span>
                        <span>📊 Rate: {applicationRate}% hired</span>
                      </div>
                    </div>
                  )}

                  {/* Status Tags */}
                  {totalJobApps > 0 && (
                    <div style={styles.statusTags}>
                      {jobStats.pending > 0 && (
                        <span style={{...styles.statusTag, background: getStatusColor('Applied')}}>
                          Pending: {jobStats.pending}
                        </span>
                      )}
                      {jobStats.reviewed > 0 && (
                        <span style={{...styles.statusTag, background: getStatusColor('Under Review')}}>
                          Review: {jobStats.reviewed}
                        </span>
                      )}
                      {jobStats.shortlisted > 0 && (
                        <span style={{...styles.statusTag, background: getStatusColor('Shortlisted')}}>
                          Shortlisted: {jobStats.shortlisted}
                        </span>
                      )}
                      {jobStats.interviewed > 0 && (
                        <span style={{...styles.statusTag, background: getStatusColor('Interview Scheduled')}}>
                          Interviews: {jobStats.interviewed}
                        </span>
                      )}
                      {jobStats.hired > 0 && (
                        <span style={{...styles.statusTag, background: getStatusColor('Hired')}}>
                          Hired: {jobStats.hired}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Job Footer with Actions */}
                  <div style={styles.jobFooter}>
                    <div>
                      <button 
                        style={styles.actionBtn}
                        onClick={() => handleViewDetails(job)}
                      >
                        Details
                      </button>
                      <Link to={`/company/edit-job/${job.id}`} style={styles.actionBtn}>
                        Edit
                      </Link>
                    </div>
                    <div>
                      <button 
                        style={{...styles.actionBtn, ...(job.active ? {} : styles.deleteBtn)}}
                        onClick={() => handleToggleJobStatus(job.id, job.active)}
                      >
                        {job.active ? 'Close' : 'Reopen'}
                      </button>
                      <button 
                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Quick View Link */}
                  {totalJobApps > 0 && (
                    <div style={{marginTop: '0.5rem', textAlign: 'right'}}>
                      <Link to={`/job/${job.id}/applications`} style={{color: '#667eea', fontSize: '0.85rem', textDecoration: 'none'}}>
                        View all applications →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h2>No Jobs Posted Yet</h2>
            <p>You haven't posted any jobs. Click the button below to post your first job!</p>
            <Link to="/company/post-job" style={{...styles.postJobBtn, marginTop: '1rem'}}>
              Post Your First Job
            </Link>
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Job Details: {selectedJob.title}</h2>
              <button style={styles.closeBtn} onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            
            <div>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              <p><strong>Requirements:</strong> {selectedJob.requirements?.join(', ')}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Salary:</strong> {selectedJob.salary}</p>
              <p><strong>Type:</strong> {selectedJob.type}</p>
              <p><strong>Posted:</strong> {new Date(selectedJob.postedDate).toLocaleDateString()}</p>
              <p><strong>Deadline:</strong> {new Date(selectedJob.deadline).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedJob.active ? 'Active' : 'Closed'}</p>
              
              <h3 style={{marginTop: '1.5rem', marginBottom: '1rem'}}>Application Statistics</h3>
              {(() => {
                const stats = getApplicationStatusCounts(selectedJob.id);
                return (
                  <div>
                    <p>Total Applications: {stats.total}</p>
                    <p>Pending Review: {stats.pending}</p>
                    <p>Under Review: {stats.reviewed}</p>
                    <p>Shortlisted: {stats.shortlisted}</p>
                    <p>Interviews: {stats.interviewed}</p>
                    <p>Hired: {stats.hired}</p>
                    <p>Rejected: {stats.rejected}</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyJobs;