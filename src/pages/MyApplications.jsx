import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyApplications = () => {
  const [user, setUser] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'candidate') {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadCandidateData(userData);
  }, [navigate]);

  const loadCandidateData = async (userData) => {
    try {
      const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      const candidateProfile = candidates.find(c => 
        c.userId === userData.id || 
        c.email === userData.email ||
        c.name === userData.name
      );
      setCandidate(candidateProfile);

      const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const myApplications = allApplications.filter(app => 
        app.candidateId === candidateProfile?.id || 
        app.candidateName === userData.name ||
        app.candidateEmail === userData.email
      );
      setApplications(myApplications);

      const allInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
      const myInterviews = allInterviews.filter(interview => 
        myApplications.some(app => app.id === interview.applicationId)
      );
      setInterviews(myInterviews);

      await loadReportsFromBackend(myInterviews);

    } catch (error) {
      console.error('Error loading candidate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportsFromBackend = async (myInterviews) => {
    const completedInterviews = myInterviews.filter(i => i.status === 'Completed');
    
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Applied': return '📝';
      case 'Under Review': return '🔍';
      case 'Shortlisted': return '⭐';
      case 'Interview Scheduled': return '📅';
      case 'Interview Completed': return '✅';
      case 'Rejected': return '❌';
      case 'Hired': return '🎉';
      default: return '📋';
    }
  };

  const getInterviewForApplication = (applicationId) => {
    return interviews.find(i => i.applicationId === applicationId);
  };

  const getReportForInterview = (interviewId) => {
    const reportData = reports.find(r => r.interviewId === interviewId);
    return reportData?.report;
  };

  const filteredApplications = activeFilter === 'all' 
    ? applications 
    : applications.filter(app => {
        const status = app.status.toLowerCase().replace(/ /g, '-');
        return status === activeFilter;
      });

  const stats = {
    total: applications.length,
    active: applications.filter(a => !['Rejected', 'Hired', 'Interview Completed'].includes(a.status)).length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    interviews: interviews.length,
    completed: applications.filter(a => a.status === 'Interview Completed').length,
    offers: applications.filter(a => a.status === 'Hired').length
  };

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
      marginBottom: '2rem'
    },
    welcome: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666'
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
      gap: '1rem'
    },
    statIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '10px',
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
    filtersContainer: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      overflowX: 'auto',
      paddingBottom: '0.5rem'
    },
    filterBtn: {
      padding: '0.5rem 1.25rem',
      borderRadius: '30px',
      border: '1px solid #e5e7eb',
      background: 'white',
      color: '#666',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'all 0.3s',
      whiteSpace: 'nowrap'
    },
    activeFilter: {
      background: '#667eea',
      color: 'white',
      borderColor: '#667eea'
    },
    applicationsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    applicationCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, boxShadow 0.3s'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    jobInfo: {
      flex: 1
    },
    jobTitle: {
      fontSize: '1.3rem',
      color: '#333',
      marginBottom: '0.25rem',
      textDecoration: 'none'
    },
    companyName: {
      color: '#667eea',
      fontSize: '1rem',
      marginBottom: '0.5rem'
    },
    statusBadge: {
      padding: '0.5rem 1rem',
      borderRadius: '30px',
      fontSize: '0.9rem',
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    cardDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
      padding: '1rem 0',
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb'
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#666',
      fontSize: '0.95rem'
    },
    interviewSection: {
      background: '#f3f4f6',
      borderRadius: '10px',
      padding: '1rem',
      marginTop: '1rem'
    },
    interviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem'
    },
    interviewTitle: {
      fontSize: '1rem',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    interviewDetails: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      marginBottom: '1rem'
    },
    interviewItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#666',
      fontSize: '0.95rem'
    },
    reportPreview: {
      background: 'white',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '0.75rem'
    },
    scoreRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '0.75rem',
      flexWrap: 'wrap'
    },
    scoreBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 500,
      display: 'inline-block'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem',
      flexWrap: 'wrap'
    },
    btn: {
      padding: '0.5rem 1.25rem',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      border: 'none'
    },
    btnPrimary: {
      background: '#667eea',
      color: 'white'
    },
    btnSuccess: {
      background: '#4caf50',
      color: 'white'
    },
    btnWarning: {
      background: '#ff9800',
      color: 'white'
    },
    btnPurple: {
      background: '#9c27b0',
      color: 'white'
    },
    btnOutline: {
      background: 'transparent',
      border: '1px solid #667eea',
      color: '#667eea'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      opacity: 0.5
    },
    emptyTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    emptyText: {
      color: '#666',
      marginBottom: '2rem'
    },
    browseJobsBtn: {
      display: 'inline-block',
      padding: '0.75rem 2rem',
      background: '#667eea',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: 500
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.loading}>
          <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
          <h3>Loading your applications...</h3>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.welcome}>My Applications</h1>
          <p style={styles.subtitle}>Track your job applications and interview status</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e3f2fd'}}>📋</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.total}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#fff3e0'}}>⏳</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.active}</div>
              <div style={styles.statLabel}>Active</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e8f5e8'}}>⭐</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.shortlisted}</div>
              <div style={styles.statLabel}>Shortlisted</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#f3e5f5'}}>🎥</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.interviews}</div>
              <div style={styles.statLabel}>Interviews</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#e8f5e8'}}>✅</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.completed}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: '#fff3e0'}}>🎉</div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stats.offers}</div>
              <div style={styles.statLabel}>Offers</div>
            </div>
          </div>
        </div>

        <div style={styles.filtersContainer}>
          <button 
            style={{...styles.filterBtn, ...(activeFilter === 'all' ? styles.activeFilter : {})}}
            onClick={() => setActiveFilter('all')}
          >
            All ({stats.total})
          </button>
          <button 
            style={{...styles.filterBtn, ...(activeFilter === 'applied' ? styles.activeFilter : {})}}
            onClick={() => setActiveFilter('applied')}
          >
            Applied ({applications.filter(a => a.status === 'Applied').length})
          </button>
          <button 
            style={{...styles.filterBtn, ...(activeFilter === 'under-review' ? styles.activeFilter : {})}}
            onClick={() => setActiveFilter('under-review')}
          >
            Under Review ({applications.filter(a => a.status === 'Under Review').length})
          </button>
          <button 
            style={{...styles.filterBtn, ...(activeFilter === 'shortlisted' ? styles.activeFilter : {})}}
            onClick={() => setActiveFilter('shortlisted')}
          >
            Shortlisted ({stats.shortlisted})
          </button>
          <button 
            style={{...styles.filterBtn, ...(activeFilter === 'interview-scheduled' ? styles.activeFilter : {})}}
            onClick={() => setActiveFilter('interview-scheduled')}
          >
            Interview Scheduled ({applications.filter(a => a.status === 'Interview Scheduled').length})
          </button>
          <button 
            style={{...styles.filterBtn, ...(activeFilter === 'interview-completed' ? styles.activeFilter : {})}}
            onClick={() => setActiveFilter('interview-completed')}
          >
            Completed ({stats.completed})
          </button>
          <button 
            style={{...styles.filterBtn, ...(activeFilter === 'rejected' ? styles.activeFilter : {})}}
            onClick={() => setActiveFilter('rejected')}
          >
            Rejected ({applications.filter(a => a.status === 'Rejected').length})
          </button>
          <button 
            style={{...styles.filterBtn, ...(activeFilter === 'hired' ? styles.activeFilter : {})}}
            onClick={() => setActiveFilter('hired')}
          >
            Hired ({stats.offers})
          </button>
        </div>

        {filteredApplications.length > 0 ? (
          <div style={styles.applicationsList}>
            {filteredApplications.map(app => {
              const interview = getInterviewForApplication(app.id);
              const report = interview ? getReportForInterview(interview.id) : null;
              
              return (
                <div key={app.id} style={styles.applicationCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.jobInfo}>
                      <Link to={`/job/${app.jobId}`} style={styles.jobTitle}>
                        {app.jobTitle}
                      </Link>
                      <div style={styles.companyName}>{app.company}</div>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      background: getStatusColor(app.status).bg,
                      color: getStatusColor(app.status).color
                    }}>
                      {getStatusIcon(app.status)} {app.status}
                    </span>
                  </div>

                  <div style={styles.cardDetails}>
                    <div style={styles.detailItem}>
                      <span>📅</span>
                      <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                    </div>
                    {app.score && (
                      <div style={styles.detailItem}>
                        <span>📊</span>
                        <span>Score: {app.score}%</span>
                      </div>
                    )}
                  </div>

                  {interview && (
                    <div style={styles.interviewSection}>
                      <div style={styles.interviewHeader}>
                        <div style={styles.interviewTitle}>
                          <span>🎥</span>
                          <strong>Interview Details</strong>
                        </div>
                        <span style={{
                          ...styles.scoreBadge,
                          background: interview.status === 'Completed' ? '#4caf5020' : '#ff980020',
                          color: interview.status === 'Completed' ? '#4caf50' : '#ff9800'
                        }}>
                          {interview.status}
                        </span>
                      </div>
                      
                      <div style={styles.interviewDetails}>
                        <div style={styles.interviewItem}>
                          <span>📅</span>
                          <span>Date: {new Date(interview.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div style={styles.interviewItem}>
                          <span>⏰</span>
                          <span>Time: {new Date(interview.scheduledDate).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {report && (
                        <div style={styles.reportPreview}>
                          <div style={styles.scoreRow}>
                            <span style={{
                              ...styles.scoreBadge,
                              background: '#4caf5020',
                              color: '#4caf50'
                            }}>
                              Overall: {report.overall_score}%
                            </span>
                            <span style={{color: '#666'}}>
                              👁️ {report.eye_contact_score}%
                            </span>
                            <span style={{color: '#666'}}>
                              💪 {report.confidence_score}%
                            </span>
                            <span style={{color: '#666'}}>
                              🎯 {report.clarity_score}%
                            </span>
                          </div>
                        </div>
                      )}

                      <div style={styles.actionButtons}>
                        {app.status === 'Shortlisted' && (
                          <Link 
                            to={`/interview/${app.jobId}`}
                            state={{ applicationId: app.id, jobTitle: app.jobTitle }}
                            style={{...styles.btn, ...styles.btnSuccess}}
                          >
                            🎥 Give Interview
                          </Link>
                        )}
                        
                        {interview && interview.status === 'Scheduled' && (
                          <Link 
                            to={`/interview/${app.jobId}`}
                            style={{...styles.btn, ...styles.btnWarning}}
                          >
                            📅 Join Interview
                          </Link>
                        )}
                        
                        {report && (
                          <Link 
                            to={`/report/${interview?.id || app.sessionId}`}
                            style={{...styles.btn, ...styles.btnPurple}}
                          >
                            📊 View Full Report
                          </Link>
                        )}
                        
                        <Link 
                          to={`/job/${app.jobId}`}
                          style={{...styles.btn, ...styles.btnOutline}}
                        >
                          View Job
                        </Link>
                      </div>
                    </div>
                  )}

                  {!interview && app.status !== 'Rejected' && app.status !== 'Hired' && (
                    <div style={styles.actionButtons}>
                      <Link 
                        to={`/job/${app.jobId}`}
                        style={{...styles.btn, ...styles.btnOutline}}
                      >
                        View Job Details
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h2 style={styles.emptyTitle}>No applications yet</h2>
            <p style={styles.emptyText}>
              {activeFilter === 'all' 
                ? "You haven't applied to any jobs yet. Start exploring and apply to your dream job!"
                : `No applications with status "${activeFilter.replace('-', ' ')}" found.`}
            </p>
            <Link to="/jobs" style={styles.browseJobsBtn}>
              Browse Jobs
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyApplications;