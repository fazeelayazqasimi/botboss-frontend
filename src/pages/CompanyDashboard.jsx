import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CompanyDashboard = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    interviews: 0,
    completed: 0,
    hired: 0
  });
  
  const API_URL = 'http://localhost:8000';
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

  const loadCompanyData = async (userData) => {
    try {
      // Get company profile
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const companyProfile = companies.find(c => 
        c.userId === userData.id || 
        c.email === userData.email ||
        c.name === userData.name
      );
      
      setCompany(companyProfile);

      if (!companyProfile) {
        setLoading(false);
        return;
      }

      // Get jobs posted by this company
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const companyJobsList = jobs.filter(job => 
        job.companyId === companyProfile.id || 
        job.company === companyProfile.name
      );
      
      setCompanyJobs(companyJobsList);

      // Get applications for company's jobs
      const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const companyApplications = allApplications.filter(app => 
        companyJobsList.some(job => job.id === app.jobId)
      );
      
      setApplications(companyApplications);

      // Get interviews
      const allInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      const companyInterviews = allInterviews.filter(interview => 
        companyApplications.some(app => app.id === interview.applicationId)
      );
      setInterviews(companyInterviews);

      // Load reports from backend for completed interviews
      await loadReportsFromBackend(companyInterviews);

      // Calculate stats
      const activeJobsCount = companyJobsList.filter(job => job.active !== false).length;
      const completedInterviews = companyInterviews.filter(i => i.status === 'Completed').length;

      setStats({
        totalJobs: companyJobsList.length,
        activeJobs: activeJobsCount,
        totalApplications: companyApplications.length,
        shortlisted: companyApplications.filter(a => a.status === 'Shortlisted').length,
        interviews: companyInterviews.length,
        completed: completedInterviews,
        hired: companyApplications.filter(a => a.status === 'Hired').length
      });

    } catch (error) {
      console.error('Error loading company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportsFromBackend = async (companyInterviews) => {
    const completedInterviews = companyInterviews.filter(i => i.status === 'Completed');
    
    const reportPromises = completedInterviews.map(async (interview) => {
      try {
        const response = await fetch(`${API_URL}/interview/report/${interview.id}`);
        if (response.ok) {
          const report = await response.json();
          return { interviewId: interview.id, report };
        }
      } catch (error) {
        console.error('Error loading report:', error);
      }
      return null;
    });

    const results = await Promise.all(reportPromises);
    const validReports = results.filter(r => r !== null);
    setReports(validReports);
  };

  const updateApplicationStatus = (applicationId, newStatus) => {
    try {
      const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApplications = allApplications.map(app => {
        if (app.id === applicationId) {
          return { ...app, status: newStatus };
        }
        return app;
      });
      
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      
      // Refresh data
      if (user) loadCompanyData(user);
      
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const scheduleInterview = (applicationId) => {
    const date = prompt('Enter interview date and time (YYYY-MM-DD HH:MM):', '2026-03-15 10:00');
    if (!date) return;

    try {
      // Create new interview
      const allInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      const newInterview = {
        id: Date.now(),
        applicationId: applicationId,
        scheduledDate: new Date(date).toISOString(),
        status: 'Scheduled',
        feedback: null,
        score: null,
        report: null
      };
      
      allInterviews.push(newInterview);
      localStorage.setItem('interviews', JSON.stringify(allInterviews));
      
      // Update application status
      updateApplicationStatus(applicationId, 'Interview Scheduled');
      
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Invalid date format. Please use YYYY-MM-DD HH:MM');
    }
  };

  const completeInterview = async (interviewId, applicationId) => {
    try {
      // In a real app, this would be done by the interview system
      // For demo, we'll manually mark as completed
      
      const allInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      const updatedInterviews = allInterviews.map(interview => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            status: 'Completed',
            score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
            report: {
              overall_score: Math.floor(Math.random() * 30) + 70,
              eye_contact_score: Math.floor(Math.random() * 30) + 60,
              confidence_score: Math.floor(Math.random() * 30) + 60,
              clarity_score: Math.floor(Math.random() * 30) + 60
            }
          };
        }
        return interview;
      });
      
      localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
      
      // Update application status
      updateApplicationStatus(applicationId, 'Interview Completed');
      
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return { bg: '#ff980020', color: '#ff9800' };
      case 'Under Review': return { bg: '#2196f320', color: '#2196f3' };
      case 'Shortlisted': return { bg: '#4caf5020', color: '#4caf50' };
      case 'Interview Scheduled': return { bg: '#9c27b020', color: '#9c27b0' };
      case 'Interview Completed': return { bg: '#673ab720', color: '#673ab7' };
      case 'Rejected': return { bg: '#f4433620', color: '#f44336' };
      case 'Hired': return { bg: '#2e7d3220', color: '#2e7d32' };
      default: return { bg: '#75757520', color: '#757575' };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const toggleJobStatus = (jobId) => {
    try {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          return { ...job, active: !job.active };
        }
        return job;
      });
      
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      
      // Refresh data
      if (user) loadCompanyData(user);
      
    } catch (error) {
      console.error('Error toggling job status:', error);
    }
  };

  const deleteJob = (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      
      // Refresh data
      if (user) loadCompanyData(user);
      
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const getReportForInterview = (interviewId) => {
    const reportData = reports.find(r => r.interviewId === interviewId);
    return reportData?.report;
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status.toLowerCase().replace(/ /g, '-') === statusFilter;
  });

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8f9fa'
    },
    main: {
      flex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 5%',
      width: '100%'
    },
    header: {
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    welcomeSection: {
      flex: 1
    },
    welcome: {
      fontSize: '2rem',
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
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      ':hover': {
        background: '#764ba2',
        transform: 'translateY(-2px)'
      }
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
      transition: 'transform 0.3s',
      ':hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.15)'
      }
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
    tabsContainer: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '0.5rem',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    },
    tab: {
      padding: '0.5rem 1.25rem',
      cursor: 'pointer',
      color: '#666',
      fontWeight: 500,
      transition: 'all 0.3s',
      borderBottom: '2px solid transparent',
      marginBottom: '-0.5rem',
      ':hover': {
        color: '#667eea'
      }
    },
    activeTab: {
      color: '#667eea',
      borderBottom: '2px solid #667eea'
    },
    section: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#333'
    },
    filterContainer: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    filterBtn: {
      padding: '0.4rem 1rem',
      borderRadius: '20px',
      border: '1px solid #e5e7eb',
      background: 'white',
      color: '#666',
      cursor: 'pointer',
      fontSize: '0.85rem',
      transition: 'all 0.3s',
      ':hover': {
        borderColor: '#667eea',
        color: '#667eea'
      }
    },
    activeFilter: {
      background: '#667eea',
      color: 'white',
      borderColor: '#667eea',
      ':hover': {
        background: '#764ba2',
        color: 'white'
      }
    },
    tableContainer: {
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '1000px'
    },
    th: {
      textAlign: 'left',
      padding: '1rem 0.75rem',
      borderBottom: '2px solid #e5e7eb',
      color: '#4b5563',
      fontWeight: 600,
      fontSize: '0.9rem',
      background: '#f9fafb'
    },
    td: {
      padding: '1rem 0.75rem',
      borderBottom: '1px solid #e5e7eb',
      color: '#333',
      verticalAlign: 'middle'
    },
    statusBadge: {
      padding: '0.35rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 500,
      display: 'inline-block',
      textAlign: 'center'
    },
    scoreBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: 500,
      display: 'inline-block',
      marginRight: '0.25rem'
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
      display: 'inline-block',
      ':hover': {
        background: '#667eea',
        color: 'white'
      }
    },
    deleteBtn: {
      borderColor: '#f44336',
      color: '#f44336',
      ':hover': {
        background: '#f44336',
        color: 'white'
      }
    },
    successBtn: {
      background: '#4caf50',
      color: 'white',
      borderColor: '#4caf50',
      ':hover': {
        background: '#45a049'
      }
    },
    viewLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '0.9rem',
      ':hover': {
        textDecoration: 'underline'
      }
    },
    jobCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      padding: '1.25rem',
      marginBottom: '1rem',
      transition: 'all 0.3s',
      ':hover': {
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        borderColor: '#667eea'
      }
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.75rem',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    jobTitle: {
      fontSize: '1.2rem',
      color: '#333',
      margin: 0
    },
    jobMeta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '0.75rem'
    },
    jobActions: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      marginTop: '0.5rem'
    },
    interviewCard: {
      background: '#f8f9fa',
      borderRadius: '8px',
      padding: '0.75rem',
      marginTop: '0.5rem'
    },
    interviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    scoreRow: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      marginTop: '0.5rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#666'
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      opacity: 0.5
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    },
    select: {
      padding: '0.4rem',
      borderRadius: '5px',
      border: '1px solid #e5e7eb',
      fontSize: '0.85rem',
      outline: 'none',
      cursor: 'pointer'
    },
    refreshBtn: {
      padding: '0.5rem 1rem',
      background: '#f3f4f6',
      border: '1px solid #e5e7eb',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      ':hover': {
        background: '#e5e7eb'
      }
    }
  };

  const refreshData = () => {
    if (user) loadCompanyData(user);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.loading}>
          <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
          <h3>Loading dashboard...</h3>
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏢</div>
          <h2>Company Profile Not Found</h2>
          <p style={{marginBottom: '2rem'}}>Please complete your company profile first.</p>
          <Link to="/company/profile/edit" style={styles.postJobBtn}>
            Complete Profile
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        {/* Header with Refresh */}
        <div style={styles.header}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcome}>Welcome back, {user?.name?.split(' ')[0] || 'Company'}!</h1>
            <p style={styles.companyName}>{company?.name} • Company Dashboard</p>
          </div>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <button onClick={refreshData} style={styles.refreshBtn}>
              🔄 Refresh
            </button>
            <Link to="/company/post-job" style={styles.postJobBtn}>
              + Post New Job
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e3f2fd', color: '#1976d2'}}>📋</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.totalJobs}</div>
              <div style={styles.statLabel}>Total Jobs</div>
              <div style={{fontSize: '0.8rem', color: '#4caf50'}}>{stats.activeJobs} Active</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e8f5e8', color: '#388e3c'}}>👥</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.totalApplications}</div>
              <div style={styles.statLabel}>Applications</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#fff3e0', color: '#f57c00'}}>⭐</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.shortlisted}</div>
              <div style={styles.statLabel}>Shortlisted</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#f3e5f5', color: '#7b1fa2'}}>🎯</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.interviews}</div>
              <div style={styles.statLabel}>Interviews</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e8f5e8', color: '#673ab7'}}>✅</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.completed}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e8f5e8', color: '#2e7d32'}}>🎉</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.hired}</div>
              <div style={styles.statLabel}>Hired</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div 
            style={{...styles.tab, ...(activeTab === 'overview' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </div>
          <div 
            style={{...styles.tab, ...(activeTab === 'jobs' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('jobs')}
          >
            📋 My Jobs ({stats.totalJobs})
          </div>
          <div 
            style={{...styles.tab, ...(activeTab === 'applications' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('applications')}
          >
            📝 Applications ({stats.totalApplications})
          </div>
          <div 
            style={{...styles.tab, ...(activeTab === 'interviews' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('interviews')}
          >
            🎥 Interviews ({stats.interviews})
          </div>
          <div 
            style={{...styles.tab, ...(activeTab === 'reports' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('reports')}
          >
            📊 Reports ({stats.completed})
          </div>
          <div 
            style={{...styles.tab, ...(activeTab === 'profile' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('profile')}
          >
            🏢 Company Profile
          </div>
        </div>

        {/* Tab Content */}
        <div style={styles.section}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Recent Activity</h2>
                <Link to="/company/post-job" style={styles.viewLink}>+ Post New Job</Link>
              </div>

              {applications.length > 0 ? (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Candidate</th>
                        <th style={styles.th}>Job</th>
                        <th style={styles.th}>Applied</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Interview</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map(app => {
                        const interview = interviews.find(i => i.applicationId === app.id);
                        const report = interview ? getReportForInterview(interview.id) : null;
                        
                        return (
                          <tr key={app.id}>
                            <td style={styles.td}>
                              <strong>{app.candidateName}</strong>
                            </td>
                            <td style={styles.td}>{app.jobTitle}</td>
                            <td style={styles.td}>{new Date(app.appliedDate).toLocaleDateString()}</td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.statusBadge,
                                background: getStatusColor(app.status).bg,
                                color: getStatusColor(app.status).color
                              }}>
                                {app.status}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {interview ? (
                                <span style={{
                                  ...styles.scoreBadge,
                                  background: interview.status === 'Completed' ? '#4caf5020' : '#ff980020',
                                  color: interview.status === 'Completed' ? '#4caf50' : '#ff9800'
                                }}>
                                  {interview.status}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td style={styles.td}>
                              {report && (
                                <Link to={`/report/${interview.id}`} style={{...styles.actionBtn, background: '#9c27b0', color: 'white', borderColor: '#9c27b0'}}>
                                  View Report
                                </Link>
                              )}
                              <button 
                                style={styles.actionBtn}
                                onClick={() => setActiveTab('applications')}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📭</div>
                  <p>No applications yet</p>
                  <Link to="/company/post-job" style={styles.viewLink}>
                    Post a job to start receiving applications
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>My Jobs</h2>
                <Link to="/company/post-job" style={styles.postJobBtn}>
                  + Post New Job
                </Link>
              </div>

              {companyJobs.length > 0 ? (
                companyJobs.map(job => (
                  <div key={job.id} style={styles.jobCard}>
                    <div style={styles.jobHeader}>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
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
                      <span>⏰ {job.type}</span>
                      <span>📅 Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                      <span>👥 {applications.filter(a => a.jobId === job.id).length} applicants</span>
                    </div>

                    <div style={styles.jobActions}>
                      <Link to={`/job/${job.id}`} style={styles.actionBtn}>
                        View Details
                      </Link>
                      <button 
                        style={styles.actionBtn}
                        onClick={() => toggleJobStatus(job.id)}
                      >
                        {job.active ? 'Close Job' : 'Reopen Job'}
                      </button>
                      <button 
                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                        onClick={() => deleteJob(job.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📋</div>
                  <p>You haven't posted any jobs yet</p>
                  <Link to="/company/post-job" style={styles.postJobBtn}>
                    Post Your First Job
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>All Applications</h2>
                <div style={styles.filterContainer}>
                  <button 
                    style={{...styles.filterBtn, ...(statusFilter === 'all' ? styles.activeFilter : {})}}
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    style={{...styles.filterBtn, ...(statusFilter === 'applied' ? styles.activeFilter : {})}}
                    onClick={() => setStatusFilter('applied')}
                  >
                    Applied
                  </button>
                  <button 
                    style={{...styles.filterBtn, ...(statusFilter === 'shortlisted' ? styles.activeFilter : {})}}
                    onClick={() => setStatusFilter('shortlisted')}
                  >
                    Shortlisted
                  </button>
                  <button 
                    style={{...styles.filterBtn, ...(statusFilter === 'interview-scheduled' ? styles.activeFilter : {})}}
                    onClick={() => setStatusFilter('interview-scheduled')}
                  >
                    Interview Scheduled
                  </button>
                  <button 
                    style={{...styles.filterBtn, ...(statusFilter === 'interview-completed' ? styles.activeFilter : {})}}
                    onClick={() => setStatusFilter('interview-completed')}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {filteredApplications.length > 0 ? (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Candidate</th>
                        <th style={styles.th}>Job</th>
                        <th style={styles.th}>Applied</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Interview</th>
                        <th style={styles.th}>Report</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map(app => {
                        const interview = interviews.find(i => i.applicationId === app.id);
                        const report = interview ? getReportForInterview(interview.id) : null;
                        
                        return (
                          <tr key={app.id}>
                            <td style={styles.td}>
                              <strong>{app.candidateName}</strong>
                            </td>
                            <td style={styles.td}>{app.jobTitle}</td>
                            <td style={styles.td}>{new Date(app.appliedDate).toLocaleDateString()}</td>
                            <td style={styles.td}>
                              <select 
                                style={{...styles.select, background: getStatusColor(app.status).bg, color: getStatusColor(app.status).color}}
                                value={app.status}
                                onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Interview Completed">Interview Completed</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hired">Hired</option>
                              </select>
                            </td>
                            <td style={styles.td}>
                              {interview ? (
                                <div>
                                  <span style={{
                                    ...styles.scoreBadge,
                                    background: interview.status === 'Completed' ? '#4caf5020' : '#ff980020',
                                    color: interview.status === 'Completed' ? '#4caf50' : '#ff9800'
                                  }}>
                                    {interview.status}
                                  </span>
                                  <div style={{fontSize: '0.8rem', color: '#666'}}>
                                    {new Date(interview.scheduledDate).toLocaleDateString()}
                                  </div>
                                </div>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td style={styles.td}>
                              {report && (
                                <div>
                                  <span style={{
                                    ...styles.scoreBadge,
                                    background: getScoreColor(report.overall_score) + '20',
                                    color: getScoreColor(report.overall_score)
                                  }}>
                                    Score: {report.overall_score}%
                                  </span>
                                </div>
                              )}
                            </td>
                            <td style={styles.td}>
                              {app.status === 'Shortlisted' && (
                                <button 
                                  style={styles.actionBtn}
                                  onClick={() => scheduleInterview(app.id)}
                                >
                                  Schedule Interview
                                </button>
                              )}
                              {interview && interview.status === 'Scheduled' && (
                                <button 
                                  style={{...styles.actionBtn, ...styles.successBtn}}
                                  onClick={() => completeInterview(interview.id, app.id)}
                                >
                                  Mark Completed
                                </button>
                              )}
                              {report && (
                                <Link to={`/report/${interview.id}`} style={{...styles.actionBtn, background: '#9c27b0', color: 'white', borderColor: '#9c27b0'}}>
                                  View Report
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📭</div>
                  <p>No applications found</p>
                </div>
              )}
            </>
          )}

          {/* Interviews Tab */}
          {activeTab === 'interviews' && (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>All Interviews</h2>
              </div>

              {interviews.length > 0 ? (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Candidate</th>
                        <th style={styles.th}>Job</th>
                        <th style={styles.th}>Scheduled</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Score</th>
                        <th style={styles.th}>Report</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map(interview => {
                        const app = applications.find(a => a.id === interview.applicationId);
                        const report = getReportForInterview(interview.id);
                        
                        return (
                          <tr key={interview.id}>
                            <td style={styles.td}>
                              <strong>{app?.candidateName}</strong>
                            </td>
                            <td style={styles.td}>{app?.jobTitle}</td>
                            <td style={styles.td}>
                              {new Date(interview.scheduledDate).toLocaleString()}
                            </td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.statusBadge,
                                background: interview.status === 'Completed' ? '#4caf5020' : '#ff980020',
                                color: interview.status === 'Completed' ? '#4caf50' : '#ff9800'
                              }}>
                                {interview.status}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {report ? (
                                <span style={{
                                  ...styles.scoreBadge,
                                  background: getScoreColor(report.overall_score) + '20',
                                  color: getScoreColor(report.overall_score)
                                }}>
                                  {report.overall_score}%
                                </span>
                              ) : interview.score ? `${interview.score}%` : '-'}
                            </td>
                            <td style={styles.td}>
                              {report ? (
                                <Link to={`/report/${interview.id}`} style={styles.viewLink}>
                                  View Report
                                </Link>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td style={styles.td}>
                              {interview.status === 'Scheduled' && (
                                <button 
                                  style={{...styles.actionBtn, ...styles.successBtn}}
                                  onClick={() => completeInterview(interview.id, app?.id)}
                                >
                                  Mark Completed
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🎥</div>
                  <p>No interviews scheduled</p>
                </div>
              )}
            </>
          )}

          {/* Reports Tab - NEW */}
          {activeTab === 'reports' && (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Interview Reports</h2>
              </div>

              {reports.length > 0 ? (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Candidate</th>
                        <th style={styles.th}>Job</th>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Overall</th>
                        <th style={styles.th}>Eye Contact</th>
                        <th style={styles.th}>Confidence</th>
                        <th style={styles.th}>Clarity</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map(({ interviewId, report }) => {
                        const interview = interviews.find(i => i.id === interviewId);
                        const app = applications.find(a => a.id === interview?.applicationId);
                        
                        return (
                          <tr key={interviewId}>
                            <td style={styles.td}>
                              <strong>{app?.candidateName}</strong>
                            </td>
                            <td style={styles.td}>{app?.jobTitle}</td>
                            <td style={styles.td}>
                              {new Date(report.completion_date || report.interview_date).toLocaleDateString()}
                            </td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.scoreBadge,
                                background: getScoreColor(report.overall_score) + '20',
                                color: getScoreColor(report.overall_score)
                              }}>
                                {report.overall_score}%
                              </span>
                            </td>
                            <td style={styles.td}>
                              <span style={{color: getScoreColor(report.eye_contact_score)}}>
                                {report.eye_contact_score}%
                              </span>
                            </td>
                            <td style={styles.td}>
                              <span style={{color: getScoreColor(report.confidence_score)}}>
                                {report.confidence_score}%
                              </span>
                            </td>
                            <td style={styles.td}>
                              <span style={{color: getScoreColor(report.clarity_score)}}>
                                {report.clarity_score}%
                              </span>
                            </td>
                            <td style={styles.td}>
                              <Link to={`/report/${interviewId}`} style={styles.actionBtn}>
                                Full Report
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📊</div>
                  <p>No reports available yet</p>
                  <p style={{fontSize: '0.9rem', color: '#999'}}>Complete interviews to generate reports</p>
                </div>
              )}
            </>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Company Profile</h2>
                <Link to="/company/profile/edit" style={styles.postJobBtn}>
                  Edit Profile
                </Link>
              </div>

              {company && (
                <div>
                  <div style={{display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap'}}>
                    <img 
                      src={company.logo || `https://ui-avatars.com/api/?name=${company.name?.replace(' ', '+')}&background=667eea&color=fff&size=120`} 
                      alt={company.name}
                      style={{width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover'}}
                    />
                    <div style={{flex: 1}}>
                      <h3 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>{company.name}</h3>
                      <p style={{color: '#667eea', marginBottom: '0.5rem'}}>{company.industry || 'Industry not specified'}</p>
                      <p style={{color: '#666'}}>{company.location || 'Location not specified'}</p>
                    </div>
                  </div>

                  <div style={{marginBottom: '2rem'}}>
                    <h4 style={{fontSize: '1.1rem', color: '#333', marginBottom: '0.5rem'}}>About Company</h4>
                    <p style={{color: '#666', lineHeight: 1.8}}>
                      {company.description || 'No description added yet.'}
                    </p>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
                    <div>
                      <h4 style={{fontSize: '0.9rem', color: '#999', marginBottom: '0.25rem'}}>Email</h4>
                      <p style={{color: '#333'}}>{company.email || user?.email}</p>
                    </div>
                    <div>
                      <h4 style={{fontSize: '0.9rem', color: '#999', marginBottom: '0.25rem'}}>Website</h4>
                      <p style={{color: '#333'}}>{company.website || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 style={{fontSize: '0.9rem', color: '#999', marginBottom: '0.25rem'}}>Founded</h4>
                      <p style={{color: '#333'}}>{company.founded || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 style={{fontSize: '0.9rem', color: '#999', marginBottom: '0.25rem'}}>Employees</h4>
                      <p style={{color: '#333'}}>{company.totalEmployees || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 style={{fontSize: '0.9rem', color: '#999', marginBottom: '0.25rem'}}>Open Positions</h4>
                      <p style={{color: '#333'}}>{stats.activeJobs}</p>
                    </div>
                    <div>
                      <h4 style={{fontSize: '0.9rem', color: '#999', marginBottom: '0.25rem'}}>Member Since</h4>
                      <p style={{color: '#333'}}>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : '2026'}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;