import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PostJob = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Development',
    type: 'Full-time',
    location: '',
    salary: '',
    experience: '',
    description: '',
    requirements: '',
    deadline: '',
    skills: []
  });

  // Skills input
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    // Check if user is logged in and is company
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'company') {
      navigate('/login');
      return;
    }
    setUser(userData);

    // Get company profile
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const companyProfile = companies.find(c => c.userId === userData.id || c.email === userData.email);
    setCompany(companyProfile);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.salary) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please add at least one required skill');
      setLoading(false);
      return;
    }

    try {
      // Get existing jobs
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      console.log('Existing jobs:', jobs);

      // Create new job
      const newJob = {
        id: Date.now(),
        title: formData.title,
        company: company?.name || user?.name || 'Your Company',
        companyId: company?.id || null,
        companyLogo: company?.logo || `https://ui-avatars.com/api/?name=${(company?.name || user?.name || 'Company').replace(' ', '+')}&background=667eea&color=fff&size=100`,
        category: formData.category,
        type: formData.type,
        location: formData.location,
        salary: formData.salary,
        experience: formData.experience,
        description: formData.description,
        requirements: formData.skills,
        fullRequirements: formData.requirements ? formData.requirements.split('\n').filter(req => req.trim()) : [],
        postedDate: new Date().toISOString().split('T')[0],
        deadline: formData.deadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        applicants: 0,
        active: true,
        status: 'Active'
      };

      console.log('New job being added:', newJob);

      // Save to localStorage
      jobs.push(newJob);
      localStorage.setItem('jobs', JSON.stringify(jobs));
      
      // Verify it was saved
      const savedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      console.log('Jobs after save:', savedJobs);

      // Update company's open positions count
      if (company) {
        const companies = JSON.parse(localStorage.getItem('companies') || '[]');
        console.log('Existing companies:', companies);
        
        const updatedCompanies = companies.map(c => {
          if (c.id === company.id) {
            const updated = {
              ...c,
              openPositions: (c.openPositions || 0) + 1,
              activeJobs: [...(c.activeJobs || []), newJob.id]
            };
            console.log('Updated company:', updated);
            return updated;
          }
          return c;
        });
        
        localStorage.setItem('companies', JSON.stringify(updatedCompanies));
        
        // Verify company was updated
        const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
        console.log('Companies after update:', savedCompanies);
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        category: 'Development',
        type: 'Full-time',
        location: '',
        salary: '',
        experience: '',
        description: '',
        requirements: '',
        deadline: '',
        skills: []
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/company/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error saving job:', error);
      setError('Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Test function to check localStorage
  const checkLocalStorage = () => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    console.log('Current jobs in localStorage:', jobs);
    console.log('Current companies in localStorage:', companies);
    alert(`Jobs: ${jobs.length}, Companies: ${companies.length}. Check console for details.`);
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
      alignItems: 'center'
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#666',
      fontSize: '1rem'
    },
    debugBtn: {
      padding: '0.5rem 1rem',
      background: '#ff9800',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    form: {
      background: 'white',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    formSection: {
      marginBottom: '2rem',
      paddingBottom: '2rem',
      borderBottom: '1px solid #e5e7eb'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1.5rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#4b5563',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    required: {
      color: '#f44336',
      fontSize: '0.8rem'
    },
    input: {
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '0.95rem',
      transition: 'border-color 0.3s',
      outline: 'none',
      ':focus': {
        borderColor: '#667eea'
      }
    },
    textarea: {
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '0.95rem',
      minHeight: '150px',
      resize: 'vertical',
      outline: 'none',
      ':focus': {
        borderColor: '#667eea'
      }
    },
    select: {
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '0.95rem',
      background: 'white',
      outline: 'none',
      cursor: 'pointer',
      ':focus': {
        borderColor: '#667eea'
      }
    },
    skillsSection: {
      marginTop: '1rem'
    },
    skillInput: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    addSkillBtn: {
      padding: '0.75rem 1.5rem',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'background 0.3s',
      ':hover': {
        background: '#764ba2'
      }
    },
    skillsList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    skillTag: {
      background: '#e5e7eb',
      padding: '0.4rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    removeSkill: {
      background: 'none',
      border: 'none',
      color: '#666',
      cursor: 'pointer',
      fontSize: '1.1rem',
      display: 'flex',
      alignItems: 'center',
      ':hover': {
        color: '#f44336'
      }
    },
    helpText: {
      fontSize: '0.8rem',
      color: '#666',
      marginTop: '0.25rem'
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem'
    },
    submitBtn: {
      padding: '0.75rem 2rem',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      ':hover': {
        background: '#764ba2',
        transform: 'translateY(-2px)'
      },
      ':disabled': {
        opacity: 0.7,
        cursor: 'not-allowed',
        transform: 'none'
      }
    },
    cancelBtn: {
      padding: '0.75rem 2rem',
      background: 'transparent',
      color: '#666',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
      ':hover': {
        background: '#f3f4f6',
        borderColor: '#ccc'
      }
    },
    successMessage: {
      background: '#4caf50',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    errorMessage: {
      background: '#f44336',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    previewCard: {
      background: '#f8f9fa',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '2rem'
    },
    previewTitle: {
      fontSize: '1rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    previewContent: {
      color: '#666',
      fontSize: '0.95rem'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Post a New Job</h1>
            <p style={styles.subtitle}>Fill in the details below to create a job posting</p>
          </div>
          <button onClick={checkLocalStorage} style={styles.debugBtn}>
            🔍 Debug Storage
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div style={styles.successMessage}>
            <span>✅</span>
            <span>Job posted successfully! Redirecting to dashboard...</span>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Basic Information */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              <span>📋</span> Basic Information
            </h2>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Job Title <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Management">Management</option>
                  <option value="DevOps">DevOps</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Job Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Location <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Bangalore (Remote)"
                  value={formData.location}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Salary <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="salary"
                  placeholder="e.g. ₹15-25 LPA"
                  value={formData.salary}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience Required</label>
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. 3-5 years"
                  value={formData.experience}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Skills Required */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              <span>🛠️</span> Required Skills <span style={styles.required}>*</span>
            </h2>

            <div style={styles.skillsSection}>
              <div style={styles.skillInput}>
                <input
                  type="text"
                  placeholder="e.g. React, Python, AWS"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  style={{...styles.input, flex: 1}}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button 
                  type="button" 
                  onClick={handleAddSkill}
                  style={styles.addSkillBtn}
                >
                  Add Skill
                </button>
              </div>

              <div style={styles.skillsList}>
                {formData.skills.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={styles.removeSkill}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={styles.helpText}>
                Add skills required for this position (at least one)
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              <span>📝</span> Job Description
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Full Description <span style={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
                required
              />
              <div style={styles.helpText}>
                Include details about the role, team culture, benefits, etc.
              </div>
            </div>

            <div style={{...styles.formGroup, marginTop: '1.5rem'}}>
              <label style={styles.label}>Additional Requirements (Optional)</label>
              <textarea
                name="requirements"
                placeholder="Enter each requirement on a new line..."
                value={formData.requirements}
                onChange={handleChange}
                style={{...styles.textarea, minHeight: '100px'}}
              />
            </div>

            <div style={{...styles.formGroup, marginTop: '1.5rem'}}>
              <label style={styles.label}>Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                style={styles.input}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Preview Section */}
          {formData.title && formData.description && (
            <div style={styles.previewCard}>
              <h3 style={styles.previewTitle}>Preview:</h3>
              <div style={styles.previewContent}>
                <strong>{formData.title}</strong> at {company?.name || 'Your Company'}
                <div style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>
                  📍 {formData.location} • 💰 {formData.salary} • ⏰ {formData.type}
                </div>
                <div style={{marginTop: '0.5rem'}}>
                  Skills: {formData.skills.join(' • ')}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div style={styles.actions}>
            <Link to="/company/dashboard" style={styles.cancelBtn}>
              Cancel
            </Link>
            <button 
              type="submit" 
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default PostJob;