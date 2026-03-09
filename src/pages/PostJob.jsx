import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ic = {
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  tool:      'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  fileText:  'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  plus:      'M12 5v14M5 12h14',
  x:         'M18 6L6 18M6 6l12 12',
  check:     'M20 6L9 17l-5-5',
  alert:     'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  arrowLeft: 'M19 12H5M12 5l-7 7 7 7',
  loader:    'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  eye:       'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  mapPin:    'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z',
  dollar:    'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  calendar:  'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  send:      'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
};

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  white: '#FFFFFF', grey50: '#F8F9FB', grey100: '#F0F2F7', grey200: '#E2E6EF',
  grey400: '#9CA3B8', grey600: '#6B7280', grey700: '#374151', grey900: '#111827',
  purple: '#7C3AED', purpleLight: '#EDE9FE', purpleMid: '#A78BFA', purpleDark: '#4C1D95',
  green: '#059669', greenLight: '#D1FAE5', red: '#DC2626', redLight: '#FEE2E2', amber: '#D97706',
};
const font = "'Poppins', sans-serif";

const inputBase = {
  width: '100%', padding: '10px 13px', fontFamily: font,
  border: `1.5px solid ${C.grey200}`, borderRadius: 9,
  fontSize: '0.875rem', color: C.grey900, outline: 'none',
  background: C.white, transition: 'border-color 0.2s', boxSizing: 'border-box',
};
const labelBase = {
  fontSize: '0.78rem', fontWeight: 700, color: C.grey700,
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block',
};
const sectionCard = {
  background: C.white, borderRadius: 14, border: `1px solid ${C.grey200}`,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 16, overflow: 'hidden',
};
const btn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 7, height: 42, padding: '0 20px', borderRadius: 9, border: 'none',
  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: font,
  textDecoration: 'none', transition: 'filter 0.15s', whiteSpace: 'nowrap',
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, required, hint, children, fullWidth }) => (
  <div style={{ gridColumn: fullWidth ? '1 / -1' : undefined, display: 'flex', flexDirection: 'column', gap: 4 }}>
    {label && (
      <label style={labelBase}>
        {label}{required && <span style={{ color: C.red, marginLeft: 3 }}>*</span>}
      </label>
    )}
    {children}
    {hint && <span style={{ fontSize: '0.73rem', color: C.grey400, marginTop: 2 }}>{hint}</span>}
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ icon, iconBg = C.purpleLight, iconColor = C.purple, title, children }) => (
  <div style={sectionCard}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10,
      padding: '1rem 1.375rem', borderBottom: `1px solid ${C.grey100}` }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon d={icon} size={15} color={iconColor} />
      </div>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.grey900 }}>{title}</span>
    </div>
    <div style={{ padding: '1.25rem 1.375rem' }}>{children}</div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const PostJob = () => {
  const [user, setUser]       = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const [skillInput, setSkillInput] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', category: 'Development', type: 'Full-time',
    location: '', salary: '', experience: '',
    description: '', requirements: '', deadline: '', skills: [],
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'company') { navigate('/login'); return; }
    setUser(userData);
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    setCompany(companies.find(c => c.userId === userData.id || c.email === userData.email));
  }, [navigate]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData({ ...formData, skills: [...formData.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = s => setFormData({ ...formData, skills: formData.skills.filter(x => x !== s) });

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!formData.title || !formData.description || !formData.location || !formData.salary) {
      setError('Please fill all required fields.'); return;
    }
    if (formData.skills.length === 0) {
      setError('Please add at least one required skill.'); return;
    }
    setLoading(true);
    try {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const newJob = {
        id: Date.now(),
        title: formData.title,
        company: company?.name || user?.name || 'Your Company',
        companyId: company?.id || null,
        companyLogo: company?.logo ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(company?.name || 'Co')}&background=7C3AED&color=fff&size=100`,
        category: formData.category, type: formData.type,
        location: formData.location, salary: formData.salary,
        experience: formData.experience, description: formData.description,
        requirements: formData.skills,
        fullRequirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
        postedDate: new Date().toISOString().split('T')[0],
        deadline: formData.deadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        applicants: 0, active: true, status: 'Active',
      };
      jobs.push(newJob);
      localStorage.setItem('jobs', JSON.stringify(jobs));
      if (company) {
        const companies = JSON.parse(localStorage.getItem('companies') || '[]');
        localStorage.setItem('companies', JSON.stringify(companies.map(c =>
          c.id === company.id
            ? { ...c, openPositions: (c.openPositions || 0) + 1, activeJobs: [...(c.activeJobs || []), newJob.id] }
            : c)));
      }
      setSuccess(true);
      setFormData({ title: '', category: 'Development', type: 'Full-time',
        location: '', salary: '', experience: '', description: '', requirements: '', deadline: '', skills: [] });
      setTimeout(() => navigate('/company/dashboard'), 2000);
    } catch {
      setError('Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const iBase = (extra = {}) => ({
    ...inputBase, ...extra,
    onFocus: e => e.target.style.borderColor = C.purple,
    onBlur:  e => e.target.style.borderColor = C.grey200,
  });

  // Salary options with Unpaid
  const salaryOptions = [
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: C.grey50, fontFamily: font }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 820, margin: '0 auto', width: '100%', padding: '2rem 1.25rem' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.grey400,
              textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 4 }}>
              Company Dashboard
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: C.grey900, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Post a New Job
            </h1>
            <p style={{ fontSize: '0.85rem', color: C.grey600, margin: 0 }}>
              Fill in the details to create a job listing
            </p>
          </div>
          <Link to="/company/dashboard"
            style={{ ...btn, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
            <Icon d={ic.arrowLeft} size={14} color={C.grey700} />
            Back to Dashboard
          </Link>
        </div>

        {/* Alerts */}
        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: C.greenLight, border: `1px solid ${C.green}40`, borderRadius: 10, marginBottom: 14 }}>
            <Icon d={ic.check} size={16} color={C.green} sw={2.5} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: C.green }}>
              Job posted successfully! Redirecting to dashboard…
            </span>
          </div>
        )}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: C.redLight, border: `1px solid ${C.red}40`, borderRadius: 10, marginBottom: 14 }}>
            <Icon d={ic.alert} size={16} color={C.red} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: C.red }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <Section icon={ic.briefcase} title="Basic Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Job Title" required>
                <input {...iBase()} type="text" name="title" value={formData.title}
                  onChange={handleChange} placeholder="e.g. Senior Frontend Developer" required />
              </Field>
              <Field label="Category">
                <select style={inputBase} name="category" value={formData.category} onChange={handleChange}>
                  {['Development','Design','Marketing','Sales','Management','DevOps','AI/ML','Data Science','Other'].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Job Type">
                <select style={inputBase} name="type" value={formData.type} onChange={handleChange}>
                  {['Full-time','Part-time','Contract','Internship','Remote','Hybrid'].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Location" required>
                <input {...iBase()} type="text" name="location" value={formData.location}
                  onChange={handleChange} placeholder="e.g. Karachi (Remote)" required />
              </Field>
              
              {/* 🔥 UPDATED: Salary field with Unpaid option */}
              <Field label="Salary" required>
                <select 
                  style={inputBase} 
                  name="salary" 
                  value={formData.salary} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Salary</option>
                  {salaryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>
              
              <Field label="Experience Required">
                <input {...iBase()} type="text" name="experience" value={formData.experience}
                  onChange={handleChange} placeholder="e.g. 3–5 years" />
              </Field>
            </div>
          </Section>

          {/* Skills */}
          <Section icon={ic.tool} iconBg="#FEF3C7" iconColor={C.amber} title="Required Skills">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                {...iBase({ flex: 1 })}
                type="text"
                placeholder="e.g. React, Python, AWS — press Enter to add"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              />
              <button type="button" onClick={addSkill}
                style={{ ...btn, background: C.purple, color: C.white, boxShadow: `0 2px 10px ${C.purple}30` }}>
                <Icon d={ic.plus} size={14} color={C.white} />
                Add
              </button>
            </div>
            {formData.skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {formData.skills.map((s, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', background: C.purpleLight, borderRadius: 999,
                    fontSize: '0.8rem', fontWeight: 600, color: C.purple }}>
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', padding: 0, color: C.purpleDark }}>
                      <Icon d={ic.x} size={12} color={C.purple} sw={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: C.grey400 }}>No skills added yet — add at least one.</div>
            )}
          </Section>

          {/* Description */}
          <Section icon={ic.fileText} iconBg="#DBEAFE" iconColor="#2563EB" title="Job Description">
            <div style={{ display: 'grid', gap: 14 }}>
              <Field label="Full Description" required
                hint="Include role details, responsibilities, team culture, and benefits.">
                <textarea
                  style={{ ...inputBase, minHeight: 140, resize: 'vertical' }}
                  name="description" value={formData.description} onChange={handleChange}
                  placeholder="Describe the role and what you're looking for…"
                  onFocus={e => e.target.style.borderColor = C.purple}
                  onBlur={e => e.target.style.borderColor = C.grey200}
                  required />
              </Field>
              <Field label="Additional Requirements" hint="One requirement per line (optional).">
                <textarea
                  style={{ ...inputBase, minHeight: 90, resize: 'vertical' }}
                  name="requirements" value={formData.requirements} onChange={handleChange}
                  placeholder="Enter each requirement on a new line…"
                  onFocus={e => e.target.style.borderColor = C.purple}
                  onBlur={e => e.target.style.borderColor = C.grey200} />
              </Field>
              
              {/* 🔥 UPDATED: Changed from "Application Deadline" to "Job Deadline" */}
              <Field label="Job Deadline">
                <input {...iBase({ maxWidth: 240 })} type="date" name="deadline"
                  value={formData.deadline} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} />
              </Field>
            </div>
          </Section>

          {/* Live preview */}
          {formData.title && (
            <div style={{ background: C.purpleLight, border: `1px solid ${C.purpleMid}40`,
              borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.purple,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Preview
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: C.grey900 }}>{formData.title}</div>
              <div style={{ fontSize: '0.82rem', color: C.purple, fontWeight: 600 }}>
                {company?.name || 'Your Company'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8,
                fontSize: '0.78rem', color: C.grey600 }}>
                {formData.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon d={ic.mapPin} size={12} color={C.grey400} />{formData.location}</span>}
                {formData.salary && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon d={ic.dollar} size={12} color={C.grey400} />{formData.salary}</span>}
                {formData.type && <span>{formData.type}</span>}
              </div>
              {formData.skills.length > 0 && (
                <div style={{ marginTop: 8, fontSize: '0.78rem', color: C.grey600 }}>
                  Skills: {formData.skills.join(' · ')}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Link to="/company/dashboard"
              style={{ ...btn, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading}
              style={{ ...btn, background: C.purple, color: C.white,
                boxShadow: `0 2px 12px ${C.purple}35`, opacity: loading ? 0.65 : 1 }}>
              {loading
                ? <><div style={{ animation: 'spin 1s linear infinite' }}>
                    <Icon d={ic.loader} size={15} color={C.white} /></div> Posting…</>
                : <><Icon d={ic.send} size={15} color={C.white} /> Post Job</>}
            </button>
          </div>
        </form>
      </main>
      <Footer />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        button:hover { filter: brightness(0.91) !important; }
        a:hover { filter: brightness(0.88) !important; }
        select { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
};

export default PostJob;
