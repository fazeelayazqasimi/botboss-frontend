import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getJobById, saveApplication } from '../data/storage';

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
        
        // Show message based on auto-status
        if (data.status === 'shortlisted') {
          alert(`✅ Great news! Your application has been shortlisted based on your CV match (${data.cv_score}%). You can now give the interview.`);
        } else {
          alert(`📝 Application submitted successfully! Your CV match score was ${data.cv_score}%. The company will review your application.`);
        }
        
        setTimeout(() => navigate('/my-applications'), 2000);
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
        .job-details-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: 'Inter', sans-serif;
        }
        .job-header {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          border: 1px solid #E9ECF5;
        }
        .job-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0A0A0F;
          margin-bottom: 0.5rem;
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
          margin-bottom: 1rem;
        }
        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #6B6B84;
        }
        .job-description {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #E9ECF5;
        }
        .job-description h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #0A0A0F;
        }
        .job-description p {
          line-height: 1.6;
          color: #4B5563;
        }
        .apply-form {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid #E9ECF5;
        }
        .apply-form h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #0A0A0F;
        }
        .form-group {
          margin-bottom: 1rem;
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
          padding: 0.75rem;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-family: inherit;
          resize: vertical;
          min-height: 120px;
        }
        .form-group input[type="file"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px dashed #E5E7EB;
          border-radius: 12px;
          background: #F9FAFB;
        }
        .submit-btn {
          background: linear-gradient(135deg, #6366F1, #4F46E5);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(99,102,241,0.3);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .success-message {
          background: #D1FAE5;
          border: 1px solid #059669;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          margin-bottom: 1rem;
        }
      `}</style>

      <Navbar />
      <div className="job-details-container">
        <div className="job-header">
          <h1 className="job-title">{job.title}</h1>
          <div className="job-company">{job.company_name || 'Company'}</div>
          <div className="job-meta">
            <span className="job-meta-item">📍 {job.location || 'Remote'}</span>
            <span className="job-meta-item">💰 {job.salary || 'Negotiable'}</span>
            <span className="job-meta-item">⏰ {job.type || 'Full-time'}</span>
            {job.experience && <span className="job-meta-item">🎓 {job.experience}</span>}
          </div>
        </div>

        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description || 'No description provided.'}</p>
          {job.requirements && (
            <>
              <h3 style={{ marginTop: '1rem' }}>Requirements</h3>
              <p>{job.requirements}</p>
            </>
          )}
        </div>

        {applicationSubmitted ? (
          <div className="apply-form">
            <div className="success-message">
              <strong>✅ Application Submitted Successfully!</strong>
              <p>Your application has been received. You will be notified about the next steps.</p>
              {applicationStatus === 'shortlisted' && (
                <p style={{ color: '#059669', marginTop: '0.5rem' }}>
                  🎉 Good news! Based on your CV, you've been shortlisted. 
                  Go to <strong>My Applications</strong> to give the interview.
                </p>
              )}
            </div>
          </div>
        ) : (
          <form className="apply-form" onSubmit={handleSubmit}>
            <h3>Apply for this position</h3>
            
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
              <small style={{ color: '#6B6B84', fontSize: '0.75rem' }}>
                Accepted formats: PDF, TXT, DOC, DOCX
              </small>
            </div>

            <button type="submit" className="submit-btn" disabled={applying}>
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default JobDetails;
