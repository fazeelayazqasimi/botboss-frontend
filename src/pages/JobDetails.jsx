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
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null
  });

  useEffect(() => {
    // Check logged in user
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    // Load job details
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const foundJob = jobs.find(j => j.id === parseInt(id));
    
    if (foundJob) {
      setJob(foundJob);
      
      // Load company details
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const foundCompany = companies.find(c => c.id === foundJob.companyId || c.name === foundJob.company);
      setCompany(foundCompany);

      // Load related jobs (same category or company)
      const related = jobs
        .filter(j => j.id !== foundJob.id && (j.category === foundJob.category || j.company === foundJob.company))
        .slice(0, 3);
      setRelatedJobs(related);

      // Check if user has already applied
      if (userData && userData.type === 'candidate') {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const applied = applications.some(a => 
          a.jobId === foundJob.id && a.candidateId === userData.profileId
        );
        setHasApplied(applied);
      }
    } else {
      // Job not found
      navigate('/jobs');
    }

    setLoading(false);
  }, [id, navigate]);

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.type !== 'candidate') {
      alert('Only candidates can apply for jobs');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    
    // Get candidates
    const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const candidate = candidates.find(c => c.id === user.profileId);

    // Create new application
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const newApplication = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      candidateId: user.profileId,
      candidateName: user.name,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      coverLetter: applicationData.coverLetter,
      resume: applicationData.resume ? applicationData.resume.name : (candidate?.resume || 'No resume'),
      score: null
    };

    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));

    // Update job applicants count
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const updatedJobs = jobs.map(j => {
      if (j.id === job.id) {
        return { ...j, applicants: (j.applicants || 0) + 1 };
      }
      return j;
    });
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));

    // Update candidate's applied jobs
    if (candidate) {
      const updatedCandidates = candidates.map(c => {
        if (c.id === user.profileId) {
          return {
            ...c,
            appliedJobs: [...(c.appliedJobs || []), job.id]
          };
        }
        return c;
      });
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    }

    setShowApplyModal(false);
    setHasApplied(true);
    alert('Application submitted successfully!');
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
    breadcrumb: {
      marginBottom: '2rem',
      color: '#666',
      fontSize: '0.95rem'
    },
    breadcrumbLink: {
      color: '#667eea',
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'underline'
      }
    },
    jobHeader: {
      background: 'white',
      borderRadius: '10px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      gap: '2rem',
      '@media (max-width: 768px)': {
        flexDirection: 'column'
      }
    },
    companyLogo: {
      width: '100px',
      height: '100px',
      borderRadius: '10px',
      objectFit: 'cover'
    },
    jobInfo: {
      flex: 1
    },
    jobTitle: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    companyName: {
      fontSize: '1.2rem',
      color: '#667eea',
      marginBottom: '1rem',
      textDecoration: 'none',
      display: 'inline-block',
      ':hover': {
        textDecoration: 'underline'
      }
    },
    jobMeta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#666'
    },
    jobActions: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem'
    },
    applyBtn: {
      background: '#667eea',
      color: 'white',
      padding: '0.75rem 2rem',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background 0.3s',
      ':hover': {
        background: '#764ba2'
      },
      ':disabled': {
        background: '#ccc',
        cursor: 'not-allowed'
      }
    },
    saveBtn: {
      background: 'transparent',
      color: '#667eea',
      padding: '0.75rem 2rem',
      border: '2px solid #667eea',
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      ':hover': {
        background: '#667eea',
        color: 'white'
      }
    },
    appliedBadge: {
      background: '#4caf50',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      display: 'inline-block',
      fontWeight: 500
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '2rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    mainContent: {
      background: 'white',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    sidebar: {
      background: 'white',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      height: 'fit-content'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#333',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #667eea'
    },
    description: {
      color: '#4b5563',
      lineHeight: 1.8,
      marginBottom: '1.5rem',
      whiteSpace: 'pre-line'
    },
    requirementsList: {
      listStyle: 'none',
      padding: 0
    },
    requirementItem: {
      padding: '0.5rem 0',
      color: '#4b5563',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      ':before': {
        content: '"•"',
        color: '#667eea',
        fontWeight: 'bold'
      }
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    skillTag: {
      background: '#e5e7eb',
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      color: '#4b5563'
    },
    companyCard: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    companyLogoLarge: {
      width: '120px',
      height: '120px',
      borderRadius: '10px',
      marginBottom: '1rem'
    },
    companyStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      marginTop: '1.5rem',
      padding: '1rem 0',
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb'
    },
    companyStat: {
      textAlign: 'center'
    },
    companyStatValue: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333'
    },
    companyStatLabel: {
      fontSize: '0.8rem',
      color: '#666'
    },
    relatedJobCard: {
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '5px',
      marginBottom: '1rem',
      transition: 'all 0.3s',
      ':hover': {
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderColor: '#667eea'
      }
    },
    relatedJobTitle: {
      fontSize: '1rem',
      color: '#333',
      marginBottom: '0.25rem'
    },
    relatedJobCompany: {
      fontSize: '0.9rem',
      color: '#667eea',
      marginBottom: '0.5rem'
    },
    relatedJobMeta: {
      fontSize: '0.8rem',
      color: '#666',
      display: 'flex',
      gap: '1rem'
    },
    viewJobLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: 500,
      ':hover': {
        textDecoration: 'underline'
      }
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
      borderRadius: '10px',
      padding: '2rem',
      maxWidth: '500px',
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
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#4b5563',
      marginBottom: '0.5rem'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '5px',
      fontSize: '0.95rem',
      outline: 'none',
      minHeight: '120px',
      ':focus': {
        borderColor: '#667eea'
      }
    },
    fileInput: {
      width: '100%',
      padding: '0.5rem',
      border: '2px dashed #e5e7eb',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    },
    notFound: {
      textAlign: 'center',
      padding: '3rem',
      color: '#666'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.loading}>Loading job details...</div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.notFound}>
          <h2>Job not found</h2>
          <Link to="/jobs" style={styles.breadcrumbLink}>Back to Jobs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link to="/" style={styles.breadcrumbLink}>Home</Link> {' > '}
          <Link to="/jobs" style={styles.breadcrumbLink}>Jobs</Link> {' > '}
          <span style={{color: '#333'}}>{job.title}</span>
        </div>

        {/* Job Header */}
        <div style={styles.jobHeader}>
          <img 
            src={job.companyLogo || company?.logo || 'https://via.placeholder.com/100'} 
            alt={job.company}
            style={styles.companyLogo}
          />
          
          <div style={styles.jobInfo}>
            <h1 style={styles.jobTitle}>{job.title}</h1>
            <Link to={`/company/${job.companyId}`} style={styles.companyName}>
              {job.company}
            </Link>
            
            <div style={styles.jobMeta}>
              <span style={styles.metaItem}>📍 {job.location}</span>
              <span style={styles.metaItem}>💰 {job.salary}</span>
              <span style={styles.metaItem}>⏰ {job.type}</span>
              <span style={styles.metaItem}>📅 Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>

            <div style={styles.jobActions}>
              {user?.type === 'candidate' && !hasApplied && (
                <button onClick={handleApply} style={styles.applyBtn}>
                  Apply Now
                </button>
              )}
              {user?.type === 'candidate' && hasApplied && (
                <span style={styles.appliedBadge}>✓ Applied</span>
              )}
              {!user && (
                <button onClick={handleApply} style={styles.applyBtn}>
                  Login to Apply
                </button>
              )}
              <button style={styles.saveBtn}>★ Save Job</button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={styles.contentGrid}>
          {/* Main Content */}
          <div style={styles.mainContent}>
            {/* Job Description */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Job Description</h2>
              <p style={styles.description}>{job.description}</p>
            </div>

            {/* Requirements */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Requirements</h2>
              <ul style={styles.requirementsList}>
                {job.requirements?.map((req, index) => (
                  <li key={index} style={styles.requirementItem}>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Required Skills</h2>
              <div style={styles.skillsContainer}>
                {job.requirements?.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Company Info */}
            {company && (
              <div style={styles.companyCard}>
                <img 
                  src={company.logo || 'https://via.placeholder.com/120'} 
                  alt={company.name}
                  style={styles.companyLogoLarge}
                />
                <h3>{company.name}</h3>
                <p style={{color: '#666', fontSize: '0.9rem'}}>{company.industry}</p>
                
                <div style={styles.companyStats}>
                  <div style={styles.companyStat}>
                    <div style={styles.companyStatValue}>{company.openPositions}</div>
                    <div style={styles.companyStatLabel}>Open Jobs</div>
                  </div>
                  <div style={styles.companyStat}>
                    <div style={styles.companyStatValue}>{company.rating || 'New'}</div>
                    <div style={styles.companyStatLabel}>Rating</div>
                  </div>
                </div>

                <Link to={`/company/${company.id}`} style={styles.viewJobLink}>
                  View Company Profile →
                </Link>
              </div>
            )}

            {/* Job Summary */}
            <div style={{marginTop: '2rem'}}>
              <h3 style={{marginBottom: '1rem'}}>Job Summary</h3>
              <table style={{width: '100%'}}>
                <tbody>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Position:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>{job.title}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Experience:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>{job.experience || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Location:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>{job.location}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Job Type:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>{job.type}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Salary:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>{job.salary}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Posted:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>{new Date(job.postedDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Applicants:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>{job.applicants || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <div style={{marginTop: '3rem'}}>
            <h2 style={styles.sectionTitle}>Similar Jobs</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
              {relatedJobs.map(relatedJob => (
                <Link 
                  key={relatedJob.id} 
                  to={`/job/${relatedJob.id}`}
                  style={{textDecoration: 'none'}}
                >
                  <div style={styles.relatedJobCard}>
                    <h3 style={styles.relatedJobTitle}>{relatedJob.title}</h3>
                    <p style={styles.relatedJobCompany}>{relatedJob.company}</p>
                    <div style={styles.relatedJobMeta}>
                      <span>📍 {relatedJob.location.split(' ')[0]}</span>
                      <span>💰 {relatedJob.salary}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={styles.modalOverlay} onClick={() => setShowApplyModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Apply for {job.title}</h2>
              <button style={styles.closeBtn} onClick={() => setShowApplyModal(false)}>×</button>
            </div>

            <form onSubmit={handleApplicationSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cover Letter (Optional)</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Write a brief cover letter explaining why you're a good fit..."
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Resume</label>
                <input
                  type="file"
                  style={styles.fileInput}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setApplicationData({...applicationData, resume: e.target.files[0]})}
                />
                <p style={{fontSize: '0.8rem', color: '#666', marginTop: '0.25rem'}}>
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                <button type="submit" style={{...styles.applyBtn, flex: 1}}>
                  Submit Application
                </button>
                <button 
                  type="button" 
                  style={{...styles.saveBtn, flex: 1}}
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JobDetails;