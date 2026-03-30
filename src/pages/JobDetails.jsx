import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getJobById } from '../data/storage';

const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicationScore, setApplicationScore] = useState(null);
  const [formData, setFormData] = useState({
    cover_letter: '',
    resume: null
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) setUser(userData);
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const jobData = await getJobById(id);
      setJob(jobData);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!formData.resume) {
      alert('Please upload your resume/CV');
      return;
    }

    setApplying(true);

    try {
      const form = new FormData();
      form.append('job_id', id);
      form.append('user_id', user.id);
      form.append('candidate_name', user.name);
      form.append('candidate_email', user.email);
      form.append('cover_letter', formData.cover_letter);
      form.append('resume', formData.resume);

      const response = await fetch(`${API_URL}/applications/`, {
        method: 'POST',
        body: form
      });

      const data = await response.json();

      if (response.ok) {
        setApplicationSubmitted(true);
        setApplicationStatus(data.status);
        setApplicationScore(data.cv_score);
        
        // Show message based on auto-status
        if (data.status === 'shortlisted') {
          alert(`✅ Great news! Your application has been shortlisted based on your CV match (${data.cv_score}%). You can now give the interview.`);
        } else {
          alert(`📝 Application submitted successfully! The company will review your application.`);
        }
        
        setTimeout(() => navigate('/my-applications'), 2500);
      } else {
        alert('Application failed: ' + (data.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading job details...</div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>Job not found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .job-details-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: 'Inter', sans-serif;
          background: #F8F9FF;
          min-height: calc(100vh - 200px);
        }
        
        .job-header {
          background: white;
          border-radius: 20px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          border: 1px solid #E9ECF5;
        }
        
        .job-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0A0A0F;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }
        
        .job-company {
          font-size: 1rem;
          color: #6366F1;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #6B6B84;
          background: #F8F9FF;
          padding: 0.3rem 0.8rem;
          border-radius: 100px;
        }
        
        .job-description {
          background: white;
          border-radius: 20px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          border: 1px solid #E9ECF5;
        }
        
        .job-description h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #0A0A0F;
        }
        
        .job-description p {
          line-height: 1.6;
          color: #4B5563;
          font-size: 0.95rem;
        }
        
        .apply-form {
          background: white;
          border-radius: 20px;
          padding: 1.75rem;
          border: 1px solid #E9ECF5;
        }
        
        .apply-form h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: #0A0A0F;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .form-group textarea {
          width: 100%;
          padding: 0.85rem;
          border: 1.5px solid #E5E7EB;
          border-radius: 14px;
          font-family: inherit;
          resize: vertical;
          min-height: 120px;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        
        .form-group textarea:focus {
          outline: none;
          border-color: #6366F1;
        }
        
        .form-group input[type="file"] {
          width: 100%;
          padding: 0.75rem;
          border: 1.5px dashed #E5E7EB;
          border-radius: 14px;
          background: #F9FAFB;
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        .form-group input[type="file"]:hover {
          border-color: #6366F1;
          background: #F5F3FF;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #6366F1, #4F46E5);
          color: white;
          border: none;
          padding: 0.9rem 1.5rem;
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99,102,241,0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .success-message {
          background: #D1FAE5;
          border: 1px solid #059669;
          border-radius: 16px;
          padding: 1.25rem;
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .success-message h4 {
          color: #059669;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .success-message p {
          color: #065F46;
          font-size: 0.9rem;
        }
        
        .auto-shortlist-badge {
          background: #FEF3C7;
          border: 1px solid #F59E0B;
          border-radius: 12px;
          padding: 0.75rem;
          margin-top: 1rem;
          text-align: center;
        }
        
        .auto-shortlist-badge span {
          color: #D97706;
          font-weight: 600;
          font-size: 0.85rem;
        }
        
        .login-prompt {
          background: #FEF3C7;
          border: 1px solid #F59E0B;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
        }
        
        .login-prompt p {
          margin-bottom: 1rem;
          color: #92400E;
        }
        
        .login-btn {
          background: #F59E0B;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
        }
        
        small {
          display: block;
          margin-top: 0.5rem;
          color: #9CA3AF;
          font-size: 0.7rem;
        }
      `}</style>

      <Navbar />
      <div className="job-details-container">
        <div className="job-header">
          <h1 className="job-title">{job.title}</h1>
          <div className="job-company">{job.company_name || 'Company Name'}</div>
          <div className="job-meta">
            <span className="job-meta-item">📍 {job.location || 'Remote'}</span>
            <span className="job-meta-item">💰 {job.salary || 'Negotiable'}</span>
            <span className="job-meta-item">⏰ {job.type || 'Full-time'}</span>
            {job.experience && <span className="job-meta-item">🎓 {job.experience}</span>}
          </div>
        </div>

        <div className="job-description">
          <h3>📋 Job Description</h3>
          <p>{job.description || 'No description provided.'}</p>
          
          {job.requirements && (
            <>
              <h3 style={{ marginTop: '1.5rem' }}>✅ Requirements</h3>
              <p>{job.requirements}</p>
            </>
          )}
          
          {job.benefits && (
            <>
              <h3 style={{ marginTop: '1.5rem' }}>🎁 Benefits</h3>
              <p>{job.benefits}</p>
            </>
          )}
        </div>

        {!user ? (
          <div className="login-prompt">
            <p>🔐 Please login to apply for this position</p>
            <a href="/login" className="login-btn">Login to Apply</a>
          </div>
        ) : applicationSubmitted ? (
          <div className="apply-form">
            <div className="success-message">
              <h4>✅ Application Submitted Successfully!</h4>
              <p>Your application has been received. You will be notified about the next steps.</p>
              {applicationStatus === 'shortlisted' && (
                <div className="auto-shortlist-badge">
                  <span>🎉 Congratulations! Based on your CV match ({applicationScore}%), you've been auto-shortlisted!</span>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                    Go to <strong>My Applications</strong> to give the AI interview.
                  </p>
                </div>
              )}
              {applicationStatus === 'pending' && applicationScore && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#6B6B84' }}>
                  Your CV match score: {applicationScore}%. The company will review your application.
                </div>
              )}
            </div>
          </div>
        ) : (
          <form className="apply-form" onSubmit={handleSubmit}>
            <h3>📝 Apply for this position</h3>
            
            <div className="form-group">
              <label>Cover Letter (Optional)</label>
              <textarea
                name="cover_letter"
                placeholder="Tell us why you're a great fit for this role..."
                value={formData.cover_letter}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Resume/CV *</label>
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                required
              />
              <small>Accepted formats: PDF, TXT, DOC, DOCX (Max 5MB)</small>
            </div>

            <button type="submit" className="submit-btn" disabled={applying}>
              {applying ? 'Submitting Application...' : 'Submit Application'}
            </button>
            
            <small style={{ textAlign: 'center', marginTop: '1rem' }}>
              Your CV will be analyzed by AI to match with job requirements. 
              {!user && ' Login to apply.'}
            </small>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default JobDetails;
