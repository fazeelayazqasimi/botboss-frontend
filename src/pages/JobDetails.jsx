import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jobs, applications, candidates, companies } from '../data';
import { calculateCVJobMatch, parseCVFile } from '../data/jobs.json.js';

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
  const [cvScore, setCvScore] = useState(null);
  const [cvAnalyzing, setCvAnalyzing] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState('');
  const [applicationData, setApplicationData] = useState({
    coverLetter: ''
  });
  const [forceReupload, setForceReupload] = useState(false);
  const [uploadError, setUploadError] = useState(''); // New state for upload error

  useEffect(() => {
    // Check logged in user
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    // Load job details
    const allJobs = jobs.getJobs();
    const foundJob = allJobs.find(j => j.id === parseInt(id));
    
    if (foundJob) {
      setJob(foundJob);
      
      // Load company details
      const allCompanies = companies.getCompanies();
      const foundCompany = allCompanies.find(c => c.id === foundJob.companyId || c.name === foundJob.company);
      setCompany(foundCompany);

      // Load related jobs
      const related = allJobs
        .filter(j => j.id !== foundJob.id && (j.category === foundJob.category || j.company === foundJob.company))
        .slice(0, 3);
      setRelatedJobs(related);

      // CRITICAL FIX: Check if user has already applied with correct ID comparison
      if (userData && userData.type === 'candidate') {
        const allApplications = applications.getApplications();
        console.log('Checking applications for job:', foundJob.id, 'candidate:', userData.profileId);
        console.log('All applications:', allApplications);
        
        const applied = allApplications.some(a => {
          // Convert both to numbers/strings for proper comparison
          const jobIdMatch = Number(a.jobId) === Number(foundJob.id);
          const candidateIdMatch = Number(a.candidateId) === Number(userData.profileId);
          return jobIdMatch && candidateIdMatch;
        });
        
        console.log('Has applied:', applied);
        setHasApplied(applied);
      } else {
        setHasApplied(false);
      }
    } else {
      navigate('/jobs');
    }

    setLoading(false);
  }, [id, navigate]);

  // Re-check application status when modal closes or when job changes
  useEffect(() => {
    if (user && user.type === 'candidate' && job) {
      const allApplications = applications.getApplications();
      const applied = allApplications.some(a => 
        Number(a.jobId) === Number(job.id) && Number(a.candidateId) === Number(user.profileId)
      );
      setHasApplied(applied);
    }
  }, [user, job, showApplyModal]);

  // Validate file type and size
  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only PDF and Word documents (.pdf, .doc, .docx) are allowed');
      return false;
    }
    
    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return false;
    }
    
    setUploadError('');
    return true;
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!validateFile(file)) {
      setCvFile(null);
      setCvFileName('');
      return;
    }
    
    setCvFile(file);
    setCvFileName(file.name);
    setCvAnalyzing(true);
    setCvScore(null); // Reset score while analyzing
    
    try {
      // Simulate CV parsing and analysis
      setTimeout(() => {
        // Calculate a random score between 30-90 for demo
        const randomScore = Math.floor(Math.random() * 60) + 30;
        setCvScore(randomScore);
        setCvAnalyzing(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error analyzing CV:', error);
      alert('Error analyzing CV. Please try again.');
      setCvScore(0);
      setCvAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.type !== 'candidate') {
      alert('Only candidates can apply for jobs');
      return;
    }
    
    // Double-check if already applied
    const allApplications = applications.getApplications();
    const alreadyApplied = allApplications.some(a => 
      Number(a.jobId) === Number(job.id) && Number(a.candidateId) === Number(user.profileId)
    );
    
    if (alreadyApplied) {
      // Show option to upload again
      const confirmReapply = window.confirm(
        'You have already applied for this position.\n\nDo you want to upload your CV again? This will update your application.'
      );
      
      if (confirmReapply) {
        // Set force reupload mode
        setForceReupload(true);
        setShowApplyModal(true);
        setCvScore(null);
        setCvFile(null);
        setCvFileName('');
        setUploadError('');
        setApplicationData({ coverLetter: '' });
      }
      return;
    }
    
    setForceReupload(false);
    setShowApplyModal(true);
    setCvScore(null);
    setCvFile(null);
    setCvFileName('');
    setUploadError('');
    setApplicationData({ coverLetter: '' });
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    
    if (!cvFile) {
      alert('Please upload your CV');
      return;
    }
    
    if (cvScore === null) {
      alert('Please wait for CV analysis to complete');
      return;
    }
    
    // Get all applications
    let allApplications = applications.getApplications();
    const existingApplicationIndex = allApplications.findIndex(a => 
      Number(a.jobId) === Number(job.id) && Number(a.candidateId) === Number(user.profileId)
    );
    
    if (existingApplicationIndex !== -1 && !forceReupload) {
      alert('You have already applied for this job!');
      setShowApplyModal(false);
      setHasApplied(true);
      return;
    }
    
    // Get candidate
    const allCandidates = candidates.getCandidates();
    let candidate = allCandidates.find(c => Number(c.id) === Number(user.profileId));

    let newApplication;
    
    if (existingApplicationIndex !== -1 && forceReupload) {
      // Update existing application
      const existingApp = allApplications[existingApplicationIndex];
      newApplication = {
        ...existingApp,
        resume: cvFileName,
        cvScore: cvScore,
        coverLetter: applicationData.coverLetter || existingApp.coverLetter,
        updatedAt: new Date().toISOString(),
        reuploaded: true
      };
      
      // Update in array
      allApplications[existingApplicationIndex] = newApplication;
      localStorage.setItem('applications', JSON.stringify(allApplications));
      
      alert(`✅ Application updated! Your new CV matches ${cvScore}% of the requirements.`);
    } else {
      // Create new application
      newApplication = applications.saveApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        companyId: company?.id,
        candidateId: user.profileId,
        candidateName: user.name,
        coverLetter: applicationData.coverLetter,
        resume: cvFileName,
        cvScore: cvScore,
        appliedAt: new Date().toISOString()
      });

      // Update job applicants count only for new applications
      jobs.incrementApplicants(job.id);

      // Update candidate's applied jobs
      if (candidate) {
        const updatedCandidate = {
          ...candidate,
          appliedJobs: [...(candidate.appliedJobs || []), job.id]
        };
        candidates.saveCandidate(updatedCandidate);
      }
      
      alert(`✅ Application submitted! Your CV matches ${cvScore}% of the requirements.`);
    }

    setShowApplyModal(false);
    setHasApplied(true);
    setForceReupload(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 50) return '#ff9800';
    return '#f44336';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent Match!';
    if (score >= 50) return 'Good Match - Eligible for Interview';
    return 'Below Requirements - Not Eligible for Interview';
  };

  // Helper function to format salary display
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (salary.toLowerCase().includes('unpaid')) {
      return '💰 Unpaid Position (Volunteer/Internship)';
    }
    return `💰 ${salary}`;
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
      textDecoration: 'none'
    },
    jobHeader: {
      background: 'white',
      borderRadius: '10px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      gap: '2rem'
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
      display: 'inline-block'
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
      cursor: 'pointer'
    },
    saveBtn: {
      background: 'transparent',
      color: '#667eea',
      padding: '0.75rem 2rem',
      border: '2px solid #667eea',
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer'
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
      gap: '2rem'
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
      gap: '0.5rem'
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
      marginBottom: '1rem'
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
      fontWeight: 500
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
    cvSection: {
      marginBottom: '1.5rem',
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '8px'
    },
    cvLabel: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#4b5563',
      marginBottom: '0.5rem'
    },
    cvInput: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '5px',
      fontSize: '0.95rem',
      background: 'white',
      cursor: 'pointer',
      marginBottom: '0.5rem'
    },
    cvFileName: {
      fontSize: '0.85rem',
      color: '#667eea',
      marginTop: '0.25rem'
    },
    cvAnalyzing: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#666',
      fontSize: '0.9rem',
      marginTop: '0.5rem'
    },
    cvScoreDisplay: {
      marginTop: '1rem',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center',
      background: '#f0f4f8'
    },
    scoreCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white'
    },
    scoreMessage: {
      fontSize: '1rem',
      fontWeight: 500,
      marginBottom: '0.5rem'
    },
    scoreDetail: {
      fontSize: '0.9rem',
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
      minHeight: '120px'
    },
    modalActions: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    submitBtn: {
      flex: 1,
      padding: '0.75rem',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer'
    },
    cancelBtn: {
      flex: 1,
      padding: '0.75rem',
      background: 'transparent',
      color: '#666',
      border: '2px solid #e5e7eb',
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    },
    reuploadNote: {
      background: '#fff3e0',
      padding: '0.75rem',
      borderRadius: '5px',
      marginBottom: '1rem',
      fontSize: '0.9rem',
      color: '#ed6c02',
      borderLeft: '3px solid #ed6c02'
    },
    uploadError: {
      color: '#f44336',
      fontSize: '0.85rem',
      marginTop: '0.5rem',
      padding: '0.5rem',
      background: '#ffebee',
      borderRadius: '4px'
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
        <div style={{textAlign: 'center', padding: '3rem'}}>
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
              <span style={styles.metaItem}>{formatSalary(job.salary)}</span>
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
                <>
                  <span style={styles.appliedBadge}>✓ Applied</span>
                  <button onClick={handleApply} style={{...styles.applyBtn, background: '#ff9800'}}>
                    Upload Again
                  </button>
                </>
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
                    • {req}
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
                    <div style={styles.companyStatValue}>{company.openPositions || 0}</div>
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
                    <td style={{padding: '0.5rem 0', color: '#333'}}>
                      {job.salary === 'Unpaid (Volunteer/Internship)' 
                        ? 'Unpaid Position' 
                        : job.salary}
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Posted:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>{new Date(job.postedDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '0.5rem 0', color: '#666'}}>Job Deadline:</td>
                    <td style={{padding: '0.5rem 0', color: '#333'}}>
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}
                    </td>
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
                      <span>📍 {relatedJob.location?.split(' ')[0] || relatedJob.location}</span>
                      <span>
                        {relatedJob.salary === 'Unpaid (Volunteer/Internship)' 
                          ? 'Unpaid' 
                          : relatedJob.salary}
                      </span>
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
              <h2 style={styles.modalTitle}>
                {forceReupload ? 'Update Your Application' : `Apply for ${job.title}`}
              </h2>
              <button style={styles.closeBtn} onClick={() => setShowApplyModal(false)}>×</button>
            </div>

            {forceReupload && (
              <div style={styles.reuploadNote}>
                ⚠️ You have already applied for this position. Uploading again will update your existing application.
              </div>
            )}

            <form onSubmit={handleApplicationSubmit}>
              {/* CV Upload Section */}
              <div style={styles.cvSection}>
                <label style={styles.cvLabel}>
                  {forceReupload ? 'Upload Updated CV *' : 'Upload CV *'}
                </label>
                <label style={{...styles.cvLabel, fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>
                  (PDF, DOC, DOCX only, Max 10MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVUpload}
                  style={styles.cvInput}
                  required
                />
                {cvFileName && !uploadError && (
                  <div style={styles.cvFileName}>📄 {cvFileName}</div>
                )}
                {uploadError && (
                  <div style={styles.uploadError}>⚠️ {uploadError}</div>
                )}
                
                {cvAnalyzing && (
                  <div style={styles.cvAnalyzing}>
                    <span>⏳ Analyzing your CV...</span>
                  </div>
                )}
                
                {cvScore !== null && !cvAnalyzing && !uploadError && (
                  <div style={styles.cvScoreDisplay}>
                    
                    <div style={{
                      ...styles.scoreMessage,
                      color: getScoreColor(cvScore)
                    }}>
                      {getScoreMessage(cvScore)}
                    </div>
                    <div style={styles.scoreDetail}>
                      {cvScore >= 50 
                        ? 'You are eligible for the interview process.'
                        : 'Your CV does not meet the minimum requirements for an interview.'}
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Cover Letter (Optional)</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Write a brief cover letter explaining why you're a good fit..."
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({coverLetter: e.target.value})}
                />
              </div>

              <div style={styles.modalActions}>
                <button 
                  type="submit" 
                  style={styles.submitBtn}
                  disabled={!cvFile || cvAnalyzing || uploadError}
                >
                  {forceReupload ? 'Update Application' : 'Submit Application'}
                </button>
                <button 
                  type="button" 
                  style={styles.cancelBtn}
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
