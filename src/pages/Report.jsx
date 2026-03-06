import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Report = () => {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchReport();
  }, [sessionId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      console.log('Fetching report for session:', sessionId);
      
      const response = await fetch(`${API_URL}/interview/report/${sessionId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Report not found. Interview may not be completed yet.');
        }
        throw new Error('Failed to fetch report');
      }
      
      const data = await response.json();
      console.log('Report received:', data);
      setReport(data);
      
    } catch (error) {
      console.error('Failed to fetch report:', error);
      setError(error.message || 'Could not load interview report');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    if (score >= 40) return '#f44336';
    return '#9e9e9e';
  };

  const getScoreEmoji = (score) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '👍';
    if (score >= 40) return '👌';
    return '💪';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getRecommendationClass = (recommendation) => {
    if (recommendation.includes('Strongly')) return '#4caf50';
    if (recommendation.includes('Recommend')) return '#2196f3';
    if (recommendation.includes('Consider')) return '#ff9800';
    return '#9e9e9e';
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
      maxWidth: '1000px',
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
    headerLeft: {
      flex: 1
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    sessionId: {
      color: '#666',
      fontSize: '0.9rem',
      fontFamily: 'monospace',
      background: '#f1f3f4',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      display: 'inline-block'
    },
    date: {
      color: '#666',
      fontSize: '0.95rem',
      marginTop: '0.5rem'
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
      gap: '0.5rem'
    },
    overallScore: {
      textAlign: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white',
      marginBottom: '2rem'
    },
    overallValue: {
      fontSize: '4rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    recommendation: {
      fontSize: '1.3rem',
      fontWeight: 500,
      padding: '0.5rem 1rem',
      borderRadius: '30px',
      display: 'inline-block',
      marginTop: '0.5rem'
    },
    scoreGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    scoreCard: {
      textAlign: 'center',
      padding: '1.5rem',
      borderRadius: '10px',
      background: '#f8f9fa'
    },
    scoreValue: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    scoreLabel: {
      color: '#666',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem'
    },
    section: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #667eea',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    strengthsWeaknesses: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    strengthBox: {
      background: '#e8f5e8',
      padding: '1.5rem',
      borderRadius: '10px'
    },
    weaknessBox: {
      background: '#ffebee',
      padding: '1.5rem',
      borderRadius: '10px'
    },
    boxTitle: {
      fontSize: '1.1rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listItem: {
      padding: '0.5rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    },
    summary: {
      color: '#4b5563',
      lineHeight: 1.8,
      fontSize: '1.1rem'
    },
    questionCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      padding: '1.25rem',
      marginBottom: '1rem',
      transition: 'all 0.3s'
    },
    questionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    questionNumber: {
      fontWeight: 600,
      color: '#667eea',
      background: '#e9ecef',
      padding: '0.25rem 0.75rem',
      borderRadius: '15px',
      fontSize: '0.9rem'
    },
    questionScore: {
      padding: '0.25rem 0.75rem',
      borderRadius: '15px',
      fontSize: '0.9rem',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    questionText: {
      color: '#333',
      marginBottom: '0.75rem',
      lineHeight: 1.6,
      fontSize: '1.1rem'
    },
    answerSection: {
      background: '#f8f9fa',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '0.75rem'
    },
    answerLabel: {
      fontSize: '0.85rem',
      color: '#666',
      marginBottom: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    answerText: {
      color: '#333',
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap'
    },
    feedbackText: {
      color: '#4b5563',
      fontSize: '0.95rem',
      fontStyle: 'italic',
      marginTop: '0.5rem'
    },
    modeBadge: {
      display: 'inline-block',
      padding: '0.2rem 0.5rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 500,
      marginLeft: '0.5rem'
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem'
    },
    actionBtn: {
      padding: '0.75rem 2rem',
      background: '#667eea',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: 500,
      transition: 'all 0.3s',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    secondaryBtn: {
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    },
    error: {
      textAlign: 'center',
      padding: '3rem',
      color: '#f44336',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    errorIcon: {
      fontSize: '3rem',
      marginBottom: '1rem'
    },
    retryBtn: {
      marginTop: '1.5rem',
      padding: '0.75rem 2rem',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.loading}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>📊</div>
            <h3>Loading your report...</h3>
            <p style={{color: '#666', marginTop: '0.5rem'}}>Session ID: {sessionId}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.error}>
            <div style={styles.errorIcon}>❌</div>
            <h2>Report Not Found</h2>
            <p style={{margin: '1rem 0', color: '#666'}}>{error || 'Could not load interview report'}</p>
            <p style={{margin: '0.5rem 0', color: '#999', fontSize: '0.9rem'}}>Session: {sessionId}</p>
            <button onClick={fetchReport} style={styles.retryBtn}>
              Retry
            </button>
            <div style={{marginTop: '1.5rem'}}>
              <Link to="/my-applications" style={{...styles.actionBtn, ...styles.secondaryBtn, textDecoration: 'none'}}>
                Go to Applications
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>Interview Report</h1>
            <div>
              <span style={styles.sessionId}>Session: {report.session_id || sessionId}</span>
            </div>
            <p style={styles.date}>
              Completed on {formatDate(report.completion_date || report.interview_date)}
            </p>
          </div>
          <button onClick={fetchReport} style={styles.refreshBtn}>
            🔄 Refresh
          </button>
        </div>

        <div style={styles.overallScore}>
          <div style={styles.overallValue}>
            {getScoreEmoji(report.overall_score)} {report.overall_score}%
          </div>
          <div style={{
            ...styles.recommendation,
            background: getRecommendationClass(report.recommendation) + '20',
            color: getRecommendationClass(report.recommendation)
          }}>
            {report.recommendation || 'No recommendation'}
          </div>
        </div>

        <div style={styles.scoreGrid}>
          <div style={styles.scoreCard}>
            <div style={{...styles.scoreValue, color: getScoreColor(report.eye_contact_score || 0)}}>
              {report.eye_contact_score || 0}%
            </div>
            <div style={styles.scoreLabel}>
              <span>👁️</span> Eye Contact
            </div>
          </div>
          <div style={styles.scoreCard}>
            <div style={{...styles.scoreValue, color: getScoreColor(report.confidence_score || 0)}}>
              {report.confidence_score || 0}%
            </div>
            <div style={styles.scoreLabel}>
              <span>💪</span> Confidence
            </div>
          </div>
          <div style={styles.scoreCard}>
            <div style={{...styles.scoreValue, color: getScoreColor(report.clarity_score || 0)}}>
              {report.clarity_score || 0}%
            </div>
            <div style={styles.scoreLabel}>
              <span>🎯</span> Clarity
            </div>
          </div>
          <div style={styles.scoreCard}>
            <div style={{...styles.scoreValue, color: getScoreColor(report.overall_score || 0)}}>
              {report.answered_questions || 0}/{report.total_questions || 5}
            </div>
            <div style={styles.scoreLabel}>
              <span>📝</span> Questions
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>📋</span> Interview Summary
          </h2>
          <p style={styles.summary}>{report.summary || 'No summary available'}</p>
        </div>

        <div style={styles.strengthsWeaknesses}>
          <div style={styles.strengthBox}>
            <h3 style={{...styles.boxTitle, color: '#2e7d32'}}>
              <span>✅</span> Strengths
            </h3>
            <ul style={styles.list}>
              {report.strengths && report.strengths.length > 0 ? (
                report.strengths.map((s, i) => (
                  <li key={i} style={styles.listItem}>
                    <span style={{color: '#4caf50'}}>✓</span> {s}
                  </li>
                ))
              ) : (
                <li style={styles.listItem}>No specific strengths identified</li>
              )}
            </ul>
          </div>
          <div style={styles.weaknessBox}>
            <h3 style={{...styles.boxTitle, color: '#c62828'}}>
              <span>⚠️</span> Areas to Improve
            </h3>
            <ul style={styles.list}>
              {report.weaknesses && report.weaknesses.length > 0 ? (
                report.weaknesses.map((w, i) => (
                  <li key={i} style={styles.listItem}>
                    <span style={{color: '#f44336'}}>!</span> {w}
                  </li>
                ))
              ) : (
                <li style={styles.listItem}>Keep up the good work!</li>
              )}
            </ul>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>❓</span> Question Analysis
          </h2>
          
          {report.question_analysis && report.question_analysis.length > 0 ? (
            report.question_analysis.map((qa, index) => (
              <div key={index} style={styles.questionCard}>
                <div style={styles.questionHeader}>
                  <span style={styles.questionNumber}>
                    Question {qa.question_number || index + 1}
                    {qa.mode && (
                      <span style={{
                        ...styles.modeBadge,
                        background: qa.mode === 'text' ? '#2196f320' : '#ff980020',
                        color: qa.mode === 'text' ? '#2196f3' : '#ff9800'
                      }}>
                        {qa.mode === 'text' ? '📝' : '🎤'}
                      </span>
                    )}
                  </span>
                  <span style={{
                    ...styles.questionScore,
                    background: getScoreColor(qa.score || 0) + '20',
                    color: getScoreColor(qa.score || 0)
                  }}>
                    {qa.score || 0}%
                  </span>
                </div>
                <div style={styles.questionText}>{qa.question}</div>
                <div style={styles.answerSection}>
                  <div style={styles.answerLabel}>
                    <span>💬 Your Answer:</span>
                  </div>
                  <div style={styles.answerText}>
                    {qa.answer || 'No answer provided'}
                  </div>
                </div>
                {qa.feedback && (
                  <div style={styles.feedbackText}>
                    <span style={{fontWeight: 500}}>Feedback:</span> {qa.feedback}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{color: '#666', textAlign: 'center'}}>No question analysis available</p>
          )}
        </div>

        <div style={styles.actions}>
          <Link to="/my-applications" style={{...styles.actionBtn, ...styles.secondaryBtn, textDecoration: 'none'}}>
            Back to Applications
          </Link>
          <button onClick={() => window.print()} style={{...styles.actionBtn}}>
            🖨️ Print Report
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Report;