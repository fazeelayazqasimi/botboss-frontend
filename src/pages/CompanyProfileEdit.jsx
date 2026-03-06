import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CompanyProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    industry: '',
    location: '',
    website: '',
    founded: '',
    totalEmployees: '',
    description: '',
    logo: '',
    phone: '',
    address: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  });

  useEffect(() => {
    // Check if user is logged in and is company
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'company') {
      navigate('/login');
      return;
    }
    setUser(userData);

    // Get company profile
    loadCompanyData(userData);
  }, [navigate]);

  const loadCompanyData = (userData) => {
    try {
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const companyProfile = companies.find(c => 
        c.userId === userData.id || 
        c.email === userData.email ||
        c.name === userData.name
      );

      if (companyProfile) {
        setCompany(companyProfile);
        setFormData({
          name: companyProfile.name || '',
          email: companyProfile.email || userData.email || '',
          industry: companyProfile.industry || '',
          location: companyProfile.location || '',
          website: companyProfile.website || '',
          founded: companyProfile.founded || '',
          totalEmployees: companyProfile.totalEmployees || '',
          description: companyProfile.description || '',
          logo: companyProfile.logo || '',
          phone: companyProfile.phone || '',
          address: companyProfile.address || '',
          socialMedia: {
            linkedin: companyProfile.socialMedia?.linkedin || '',
            twitter: companyProfile.socialMedia?.twitter || '',
            facebook: companyProfile.socialMedia?.facebook || ''
          }
        });
      }
    } catch (error) {
      console.error('Error loading company data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested social media fields
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validation
      if (!formData.name || !formData.email) {
        setError('Company name and email are required');
        setLoading(false);
        return;
      }

      // Get all companies
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      
      // Check if company exists
      let updatedCompanies;
      
      if (company) {
        // Update existing company
        updatedCompanies = companies.map(c => {
          if (c.id === company.id) {
            return {
              ...c,
              ...formData,
              socialMedia: formData.socialMedia,
              updatedAt: new Date().toISOString()
            };
          }
          return c;
        });
      } else {
        // Create new company profile
        const newCompany = {
          id: Date.now(),
          userId: user.id,
          ...formData,
          socialMedia: formData.socialMedia,
          openPositions: 0,
          rating: 0,
          activeJobs: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedCompanies = [...companies, newCompany];
      }

      // Save to localStorage
      localStorage.setItem('companies', JSON.stringify(updatedCompanies));
      
      // Update user's company reference if needed
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            name: formData.name,
            email: formData.email
          };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update current user in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        currentUser.name = formData.name;
        currentUser.email = formData.email;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/company/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error saving company profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to server
      // For demo, create object URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
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
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '0.25rem'
    },
    subtitle: {
      color: '#666',
      fontSize: '1rem'
    },
    form: {
      background: 'white',
      borderRadius: '12px',
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
    fullWidth: {
      gridColumn: '1 / -1'
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
      minHeight: '120px',
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
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    },
    logoPreview: {
      width: '120px',
      height: '120px',
      borderRadius: '12px',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      border: '2px dashed #e5e7eb'
    },
    logoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    logoPlaceholder: {
      fontSize: '2rem',
      color: '#999'
    },
    logoUpload: {
      flex: 1
    },
    logoInput: {
      width: '100%',
      padding: '0.75rem',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '0.5rem'
    },
    logoHint: {
      fontSize: '0.8rem',
      color: '#666'
    },
    socialInput: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    socialIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem'
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem'
    },
    saveBtn: {
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
    infoText: {
      fontSize: '0.85rem',
      color: '#666',
      marginTop: '0.25rem'
    }
  };

  const industries = [
    'Information Technology',
    'Artificial Intelligence',
    'Software Development',
    'Cloud Computing',
    'Data Science',
    'Cybersecurity',
    'E-commerce',
    'Fintech',
    'Healthcare',
    'Education',
    'Consulting',
    'Marketing',
    'Design',
    'Manufacturing',
    'Retail',
    'Other'
  ];

  const employeeRanges = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5000+'
  ];

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Edit Company Profile</h1>
            <p style={styles.subtitle}>Update your company information</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div style={styles.successMessage}>
            <span>✅</span>
            <span>Profile updated successfully! Redirecting to dashboard...</span>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Logo Upload Section */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              <span>🖼️</span> Company Logo
            </h2>

            <div style={styles.logoSection}>
              <div style={styles.logoPreview}>
                {formData.logo ? (
                  <img src={formData.logo} alt="Company logo" style={styles.logoImage} />
                ) : (
                  <div style={styles.logoPlaceholder}>
                    {formData.name ? formData.name.charAt(0).toUpperCase() : '🏢'}
                  </div>
                )}
              </div>
              
              <div style={styles.logoUpload}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={styles.logoInput}
                />
                <div style={styles.logoHint}>
                  Recommended: Square image, at least 200x200px. Max 2MB.
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              <span>📋</span> Basic Information
            </h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Company Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. TechCorp India"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Email <span style={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Website</label>
                <input
                  type="url"
                  name="website"
                  placeholder="https://www.company.com"
                  value={formData.website}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              <span>🏢</span> Company Details
            </h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select Industry</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Bangalore, India"
                  value={formData.location}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Founded Year</label>
                <input
                  type="text"
                  name="founded"
                  placeholder="e.g. 2015"
                  value={formData.founded}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Company Size</label>
                <select
                  name="totalEmployees"
                  value={formData.totalEmployees}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select Size</option>
                  {employeeRanges.map(range => (
                    <option key={range} value={range}>{range} employees</option>
                  ))}
                </select>
              </div>

              <div style={{...styles.formGroup, ...styles.fullWidth}}>
                <label style={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Full address"
                  value={formData.address}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.fullWidth}>
                <label style={styles.label}>About Company</label>
                <textarea
                  name="description"
                  placeholder="Tell us about your company, mission, culture, etc."
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                />
                <div style={styles.infoText}>
                  This will be displayed on your company profile
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              <span>🌐</span> Social Media
            </h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>LinkedIn</label>
                <div style={styles.socialInput}>
                  <span style={styles.socialIcon}>in</span>
                  <input
                    type="url"
                    name="social.linkedin"
                    placeholder="https://linkedin.com/company/..."
                    value={formData.socialMedia.linkedin}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Twitter</label>
                <div style={styles.socialInput}>
                  <span style={styles.socialIcon}>🐦</span>
                  <input
                    type="url"
                    name="social.twitter"
                    placeholder="https://twitter.com/..."
                    value={formData.socialMedia.twitter}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Facebook</label>
                <div style={styles.socialInput}>
                  <span style={styles.socialIcon}>f</span>
                  <input
                    type="url"
                    name="social.facebook"
                    placeholder="https://facebook.com/..."
                    value={formData.socialMedia.facebook}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={styles.actions}>
            <Link to="/company/dashboard" style={styles.cancelBtn}>
              Cancel
            </Link>
            <button 
              type="submit" 
              style={styles.saveBtn}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyProfileEdit;