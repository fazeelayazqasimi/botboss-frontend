import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { saveJob, getCompanyByUserId } from '../storage';

// Icons Component
const Icon = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ic = {
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  tool: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  fileText: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  alert: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  arrowLeft: 'M19 12H5M12 5l-7 7 7 7',
  loader: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  building: 'M3 9l9-7 9 7v11a2 2 0 01-2 2h-5v-8H9v8H5a2 2 0 01-2-2z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z',
  clock: 'M12 6v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z',
};

// Color Tokens
const C = {
  white: '#FFFFFF',
  grey50: '#F8F9FB',
  grey100: '#F0F2F7',
  grey200: '#E2E6EF',
  grey400: '#9CA3B8',
  grey600: '#6B7280',
  grey700: '#374151',
  grey900: '#111827',
  purple: '#7C3AED',
  purpleLight: '#EDE9FE',
  purpleMid: '#A78BFA',
  purpleDark: '#4C1D95',
  green: '#059669',
  greenLight: '#D1FAE5',
  red: '#DC2626',
  redLight: '#FEE2E2',
  amber: '#D97706',
  amberLight: '#FEF3C7',
  blue: '#2563EB',
  blueLight: '#DBEAFE',
};

const font = "'Poppins', sans-serif";

const inputBase = {
  width: '100%',
  padding: '12px 14px',
  fontFamily: font,
  border: `1.5px solid ${C.grey200}`,
  borderRadius: 10,
  fontSize: '0.875rem',
  color: C.grey900,
  outline: 'none',
  background: C.white,
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
};

const labelBase = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: C.grey700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
  display: 'block',
};

const sectionCard = {
  background: C.white,
  borderRadius: 16,
  border: `1px solid ${C.grey200}`,
  boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
  marginBottom: 20,
  overflow: 'hidden',
};

const btn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  height: 44,
  padding: '0 22px',
  borderRadius: 10,
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: font,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
};

// Field Component
const Field = ({ label, required, hint, children, fullWidth }) => (
  <div style={{ 
    gridColumn: fullWidth ? '1 / -1' : undefined, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 4,
    marginBottom: 16
  }}>
    {label && (
      <label style={labelBase}>
        {label}
        {required && <span style={{ color: C.red, marginLeft: 4 }}>*</span>}
      </label>
    )}
    {children}
    {hint && <span style={{ fontSize: '0.7rem', color: C.grey400, marginTop: 4 }}>{hint}</span>}
  </div>
);

// Section Component
const Section = ({ icon, iconBg = C.purpleLight, iconColor = C.purple, title, children }) => (
  <div style={sectionCard}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${C.grey100}`,
      background: C.grey50
    }}>
      <div style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon d={icon} size={16} color={iconColor} />
      </div>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.grey900 }}>
        {title}
      </span>
    </div>
    <div style={{ padding: '1.5rem' }}>
      {children}
    </div>
  </div>
);

// Main Component
const PostJob = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Development',
    type: 'Full-time',
    location: '',
    salary: '',
    experience: '',
    description: '',
    requirements: [],
    deadline: '',
    skills: [],
  });

  useEffect(() => {
    const loadUserAndCompany = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || userData.type !== 'company') {
        navigate('/login');
        return;
      }
      setUser(userData);
      
      try {
        // Fetch company from API
        const companyData = await getCompanyByUserId(userData.id);
        if (companyData) {
          setCompany(companyData);
        } else {
          // If no company profile exists, create minimal company object
          setCompany({
            id: null,
            name: userData.name,
            userId: userData.id
          });
        }
      } catch (err) {
        console.error('Error loading company:', err);
        setCompany({
          id: null,
          name: userData.name,
          userId: userData.id
        });
      }
    };
    
    loadUserAndCompany();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData({ ...formData, skills: [...formData.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (s) => {
    setFormData({ ...formData, skills: formData.skills.filter(x => x !== s) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.salary) {
      setError('Please fill all required fields.');
      return;
    }
    
    if (formData.skills.length === 0) {
      setError('Please add at least one required skill.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare job data for API
      const jobData = {
        title: formData.title,
        company_id: company?.id || null,
        company_name: company?.name || user?.name || 'Your Company',
        location: formData.location,
        type: formData.type,
        salary: formData.salary,
        description: formData.description,
        category: formData.category,
        experience: formData.experience,
        requirements: formData.requirements.filter(r => r.trim()),
        skills: formData.skills,
        deadline: formData.deadline || null,
        status: 'active'
      };
      
      // Call API to save job
      const savedJob = await saveJob(jobData);
      console.log('Job saved successfully:', savedJob);
      
      setSuccess(true);
      setFormData({
        title: '',
        category: 'Development',
        type: 'Full-time',
        location: '',
        salary: '',
        experience: '',
        description: '',
        requirements: [],
        deadline: '',
        skills: [],
      });
      
      setTimeout(() => {
        navigate('/company/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Error posting job:', err);
      setError(err.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const salaryOptions = [
    'Select Salary',
    'Unpaid (Volunteer/Internship)',
    'Less than 50k/month',
    '50k–80k/month',
    '80k–120k/month',
    '120k–150k/month',
    '150k–200k/month',
    '200k+ /month',
    'Negotiable',
    'Commission based'
  ];

  const categoryOptions = [
    'Development',
    'Design',
    'Marketing',
    'Sales',
    'Management',
    'DevOps',
    'AI/ML',
    'Data Science',
    'Product Management',
    'Customer Support',
    'Human Resources',
    'Finance',
    'Other'
  ];

  const jobTypeOptions = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote',
    'Hybrid',
    'Freelance'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: C.grey50,
      fontFamily: font
    }}>
      <Navbar />
      
      <main style={{
        flex: 1,
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1.5rem'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: C.purple,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 6
            }}>
              Company Dashboard
            </div>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: C.grey900,
              margin: '0 0 6px',
              letterSpacing: '-0.02em'
            }}>
              Post a New Job
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: C.grey600,
              margin: 0
            }}>
              Fill in the details to create a job listing and find the right candidate
            </p>
          </div>
          
          <Link to="/company/dashboard"
            style={{
              ...btn,
              background: C.white,
              color: C.grey700,
              border: `1.5px solid ${C.grey200}`,
              textDecoration: 'none'
            }}>
            <Icon d={ic.arrowLeft} size={14} color={C.grey700} />
            Back to Dashboard
          </Link>
        </div>

        {/* Success Alert */}
        {success && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            background: C.greenLight,
            border: `1px solid ${C.green}30`,
            borderRadius: 12,
            marginBottom: 20
          }}>
            <Icon d={ic.check} size={18} color={C.green} sw={2.5} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: C.green }}>
              Job posted successfully! Redirecting to dashboard...
            </span>
          </div>
        )}
        
        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            background: C.redLight,
            border: `1px solid ${C.red}30`,
            borderRadius: 12,
            marginBottom: 20
          }}>
            <Icon d={ic.alert} size={18} color={C.red} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: C.red }}>
              {error}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Information Section */}
          <Section icon={ic.briefcase} title="Basic Information">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}>
              <Field label="Job Title" required>
                <input
                  {...inputBase}
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                  onFocus={(e) => e.target.style.borderColor = C.purple}
                  onBlur={(e) => e.target.style.borderColor = C.grey200}
                  required
                />
              </Field>
              
              <Field label="Category">
                <select
                  style={inputBase}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categoryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>
              
              <Field label="Job Type">
                <select
                  style={inputBase}
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {jobTypeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>
              
              <Field label="Location" required>
                <input
                  {...inputBase}
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Karachi, Pakistan (Remote Available)"
                  required
                />
              </Field>
              
              <Field label="Salary / Compensation" required>
                <select
                  style={inputBase}
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                >
                  {salaryOptions.map(opt => (
                    <option key={opt} value={opt} disabled={opt === 'Select Salary'}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              
              <Field label="Experience Required">
                <input
                  {...inputBase}
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 3–5 years or Entry Level"
                />
              </Field>
            </div>
          </Section>

          {/* Skills Section */}
          <Section icon={ic.tool} iconBg={C.amberLight} iconColor={C.amber} title="Required Skills">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  {...inputBase}
                  type="text"
                  placeholder="e.g., React, Python, AWS — press Enter to add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{ ...inputBase, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  style={{
                    ...btn,
                    background: C.purple,
                    color: C.white,
                    height: 42,
                    padding: '0 18px'
                  }}
                >
                  <Icon d={ic.plus} size={14} color={C.white} />
                  Add Skill
                </button>
              </div>
            </div>
            
            {formData.skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {formData.skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 14px',
                      background: C.purpleLight,
                      borderRadius: 999,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: C.purple
                    }}
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0,
                        color: C.purpleDark
                      }}
                    >
                      <Icon d={ic.x} size={12} color={C.purple} sw={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div style={{
                fontSize: '0.8rem',
                color: C.grey400,
                padding: '12px',
                textAlign: 'center',
                background: C.grey50,
                borderRadius: 8
              }}>
                No skills added yet — add at least one required skill
              </div>
            )}
          </Section>

          {/* Job Description Section */}
          <Section icon={ic.fileText} iconBg={C.blueLight} iconColor={C.blue} title="Job Description">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field
                label="Full Description"
                required
                hint="Include role details, responsibilities, team culture, and benefits"
              >
                <textarea
                  style={{ ...inputBase, minHeight: 140, resize: 'vertical' }}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                  onFocus={(e) => e.target.style.borderColor = C.purple}
                  onBlur={(e) => e.target.style.borderColor = C.grey200}
                  required
                />
              </Field>
              
              <Field
                label="Additional Requirements"
                hint="Add any additional requirements or qualifications (optional)"
              >
                <textarea
                  style={{ ...inputBase, minHeight: 100, resize: 'vertical' }}
                  name="requirements"
                  value={formData.requirements.join('\n')}
                  onChange={(e) => setFormData({
                    ...formData,
                    requirements: e.target.value.split('\n').filter(r => r.trim())
                  })}
                  placeholder="Enter each requirement on a new line..."
                  onFocus={(e) => e.target.style.borderColor = C.purple}
                  onBlur={(e) => e.target.style.borderColor = C.grey200}
                />
              </Field>
              
              <Field label="Application Deadline" hint="Leave empty for no deadline">
                <input
                  {...inputBase}
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ ...inputBase, maxWidth: 260 }}
                />
              </Field>
            </div>
          </Section>

          {/* Preview Section */}
          {formData.title && (
            <div style={{
              background: C.grey50,
              border: `1.5px solid ${C.grey200}`,
              borderRadius: 12,
              padding: '1.25rem',
              marginBottom: 24
            }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: C.purple,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 10
              }}>
                Preview
              </div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: C.grey900,
                marginBottom: 4
              }}>
                {formData.title}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: C.purple,
                fontWeight: 600,
                marginBottom: 10
              }}>
                {company?.name || user?.name || 'Your Company'}
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 14,
                marginBottom: 12,
                fontSize: '0.8rem',
                color: C.grey600
              }}>
                {formData.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon d={ic.mapPin} size={12} color={C.grey400} />
                    {formData.location}
                  </span>
                )}
                {formData.salary && formData.salary !== 'Select Salary' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon d={ic.dollar} size={12} color={C.grey400} />
                    {formData.salary}
                  </span>
                )}
                {formData.type && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon d={ic.clock} size={12} color={C.grey400} />
                    {formData.type}
                  </span>
                )}
              </div>
              {formData.skills.length > 0 && (
                <div style={{
                  fontSize: '0.75rem',
                  color: C.grey600,
                  paddingTop: 8,
                  borderTop: `1px solid ${C.grey200}`
                }}>
                  <strong>Skills:</strong> {formData.skills.join(' · ')}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end',
            marginTop: 8
          }}>
            <Link
              to="/company/dashboard"
              style={{
                ...btn,
                background: C.white,
                color: C.grey700,
                border: `1.5px solid ${C.grey200}`,
                textDecoration: 'none'
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...btn,
                background: C.purple,
                color: C.white,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <div style={{ animation: 'spin 1s linear infinite' }}>
                    <Icon d={ic.loader} size={15} color={C.white} />
                  </div>
                  Posting...
                </>
              ) : (
                <>
                  <Icon d={ic.send} size={15} color={C.white} />
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </main>
      
      <Footer />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * {
          box-sizing: border-box;
        }
        button:hover {
          transform: translateY(-1px);
          filter: brightness(0.95);
        }
        a:hover {
          transform: translateY(-1px);
        }
        input:hover, select:hover, textarea:hover {
          border-color: ${C.purpleMid};
        }
      `}</style>
    </div>
  );
};

export default PostJob;
