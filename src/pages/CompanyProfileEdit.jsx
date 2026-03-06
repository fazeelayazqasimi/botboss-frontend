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
  building:   'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM9 22V12h6v10',
  clipboard:  'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M9 2h6a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z',
  globe:      'M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  image:      'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21',
  upload:     'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  check:      'M20 6L9 17l-5-5',
  alert:      'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  arrowLeft:  'M19 12H5M12 5l-7 7 7 7',
  loader:     'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  save:       'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8',
  linkedin:   'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  twitter:    'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  facebook:   'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  phone:      'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  mail:       'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  link:       'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  users:      'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  calendar:   'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
};

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  white: '#FFFFFF', grey50: '#F8F9FB', grey100: '#F0F2F7', grey200: '#E2E6EF',
  grey400: '#9CA3B8', grey600: '#6B7280', grey700: '#374151', grey900: '#111827',
  purple: '#7C3AED', purpleLight: '#EDE9FE', purpleMid: '#A78BFA', purpleDark: '#4C1D95',
  green: '#059669', greenLight: '#D1FAE5', red: '#DC2626', redLight: '#FEE2E2',
  amber: '#D97706', amberLight: '#FEF3C7',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const iBase = (extra = {}) => ({
  ...inputBase, ...extra,
  onFocus: e => e.target.style.borderColor = C.purple,
  onBlur:  e => e.target.style.borderColor = C.grey200,
});

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

const SocialField = ({ label, icon, iconColor, placeholder, name, value, onChange }) => (
  <Field label={label}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: C.grey100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        border: `1px solid ${C.grey200}` }}>
        <Icon d={icon} size={15} color={iconColor} />
      </div>
      <input {...iBase({ flex: 1 })} type="url" name={name} value={value}
        onChange={onChange} placeholder={placeholder} />
    </div>
  </Field>
);

// ─── Component ────────────────────────────────────────────────────────────────
const CompanyProfileEdit = () => {
  const [user, setUser]       = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', industry: '', location: '', website: '',
    founded: '', totalEmployees: '', description: '', logo: '',
    phone: '', address: '',
    socialMedia: { linkedin: '', twitter: '', facebook: '' },
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'company') { navigate('/login'); return; }
    setUser(userData);
    loadCompanyData(userData);
  }, [navigate]);

  const loadCompanyData = (userData) => {
    try {
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const cp = companies.find(c =>
        c.userId === userData.id || c.email === userData.email || c.name === userData.name);
      if (cp) {
        setCompany(cp);
        setFormData({
          name: cp.name || '', email: cp.email || userData.email || '',
          industry: cp.industry || '', location: cp.location || '',
          website: cp.website || '', founded: cp.founded || '',
          totalEmployees: cp.totalEmployees || '', description: cp.description || '',
          logo: cp.logo || '', phone: cp.phone || '', address: cp.address || '',
          socialMedia: {
            linkedin: cp.socialMedia?.linkedin || '',
            twitter:  cp.socialMedia?.twitter  || '',
            facebook: cp.socialMedia?.facebook || '',
          },
        });
      }
    } catch (e) { console.error(e); }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, socialMedia: { ...formData.socialMedia, [field]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLogoUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, logo: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email) {
      setError('Company name and email are required.'); return;
    }
    setLoading(true);
    try {
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      let updated;
      if (company) {
        updated = companies.map(c =>
          c.id === company.id
            ? { ...c, ...formData, socialMedia: formData.socialMedia, updatedAt: new Date().toISOString() }
            : c);
      } else {
        updated = [...companies, {
          id: Date.now(), userId: user.id, ...formData,
          socialMedia: formData.socialMedia,
          openPositions: 0, rating: 0, activeJobs: [],
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        }];
      }
      localStorage.setItem('companies', JSON.stringify(updated));
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      localStorage.setItem('users', JSON.stringify(
        users.map(u => u.id === user.id ? { ...u, name: formData.name, email: formData.email } : u)));
      const cu = JSON.parse(localStorage.getItem('user'));
      if (cu) localStorage.setItem('user', JSON.stringify({ ...cu, name: formData.name, email: formData.email }));
      setSuccess(true);
      setTimeout(() => navigate('/company/dashboard'), 2000);
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    'Information Technology','Artificial Intelligence','Software Development','Cloud Computing',
    'Data Science','Cybersecurity','E-commerce','Fintech','Healthcare','Education',
    'Consulting','Marketing','Design','Manufacturing','Retail','Other',
  ];
  const employeeRanges = ['1-10','11-50','51-200','201-500','501-1000','1001-5000','5000+'];

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
              {company ? 'Edit Company Profile' : 'Create Company Profile'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: C.grey600, margin: 0 }}>
              {company ? 'Update your company information' : 'Complete your profile to post jobs'}
            </p>
          </div>
          <Link to="/company/dashboard"
            style={{ ...btn, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
            <Icon d={ic.arrowLeft} size={14} color={C.grey700} />
            Back
          </Link>
        </div>

        {/* Alerts */}
        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: C.greenLight, border: `1px solid ${C.green}40`, borderRadius: 10, marginBottom: 14 }}>
            <Icon d={ic.check} size={16} color={C.green} sw={2.5} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: C.green }}>
              Profile saved! Redirecting…
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

          {/* Logo */}
          <Section icon={ic.image} iconBg={C.purpleLight} iconColor={C.purple} title="Company Logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {/* Avatar preview */}
              <div style={{ width: 90, height: 90, borderRadius: 14, overflow: 'hidden',
                border: `2px solid ${C.grey200}`, background: C.grey100, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {formData.logo
                  ? <img src={formData.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '1.8rem', fontWeight: 800, color: C.purple }}>
                      {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                    </span>}
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ ...labelBase, marginBottom: 8 }}>Upload Logo</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  padding: '9px 14px', border: `1.5px dashed ${C.grey300}`, borderRadius: 9,
                  background: C.grey50, fontSize: '0.85rem', color: C.grey600,
                  transition: 'border-color 0.2s' }}>
                  <Icon d={ic.upload} size={16} color={C.grey400} />
                  Click to upload image
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
                <div style={{ fontSize: '0.73rem', color: C.grey400, marginTop: 5 }}>
                  Square image recommended · min 200×200px · max 2MB
                </div>
              </div>
            </div>
          </Section>

          {/* Basic Information */}
          <Section icon={ic.clipboard} title="Basic Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Company Name" required>
                <input {...iBase()} type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="e.g. TechCorp" required />
              </Field>
              <Field label="Email" required>
                <input {...iBase()} type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="contact@company.com" required />
              </Field>
              <Field label="Phone">
                <input {...iBase()} type="tel" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="+92 300 1234567" />
              </Field>
              <Field label="Website">
                <input {...iBase()} type="url" name="website" value={formData.website}
                  onChange={handleChange} placeholder="https://www.company.com" />
              </Field>
            </div>
          </Section>

          {/* Company Details */}
          <Section icon={ic.building} iconBg={C.amberLight} iconColor={C.amber} title="Company Details">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Industry">
                <select style={inputBase} name="industry" value={formData.industry} onChange={handleChange}>
                  <option value="">Select Industry</option>
                  {industries.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Location">
                <input {...iBase()} type="text" name="location" value={formData.location}
                  onChange={handleChange} placeholder="e.g. Karachi, Pakistan" />
              </Field>
              <Field label="Founded Year">
                <input {...iBase()} type="text" name="founded" value={formData.founded}
                  onChange={handleChange} placeholder="e.g. 2015" />
              </Field>
              <Field label="Company Size">
                <select style={inputBase} name="totalEmployees" value={formData.totalEmployees} onChange={handleChange}>
                  <option value="">Select Size</option>
                  {employeeRanges.map(r => <option key={r} value={r}>{r} employees</option>)}
                </select>
              </Field>
              <Field label="Address" fullWidth>
                <input {...iBase()} type="text" name="address" value={formData.address}
                  onChange={handleChange} placeholder="Full office address" />
              </Field>
              <Field label="About Company" hint="Shown on your public company profile." fullWidth>
                <textarea
                  style={{ ...inputBase, minHeight: 110, resize: 'vertical' }}
                  name="description" value={formData.description} onChange={handleChange}
                  placeholder="Describe your company, mission, and culture…"
                  onFocus={e => e.target.style.borderColor = C.purple}
                  onBlur={e => e.target.style.borderColor = C.grey200} />
              </Field>
            </div>
          </Section>

          {/* Social Media */}
          <Section icon={ic.globe} iconBg="#DBEAFE" iconColor="#2563EB" title="Social Media">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <SocialField label="LinkedIn" icon={ic.linkedin} iconColor="#0A66C2"
                placeholder="https://linkedin.com/company/…"
                name="social.linkedin" value={formData.socialMedia.linkedin} onChange={handleChange} />
              <SocialField label="Twitter / X" icon={ic.twitter} iconColor="#1DA1F2"
                placeholder="https://twitter.com/…"
                name="social.twitter" value={formData.socialMedia.twitter} onChange={handleChange} />
              <SocialField label="Facebook" icon={ic.facebook} iconColor="#1877F2"
                placeholder="https://facebook.com/…"
                name="social.facebook" value={formData.socialMedia.facebook} onChange={handleChange} />
            </div>
          </Section>

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
                    <Icon d={ic.loader} size={15} color={C.white} /></div> Saving…</>
                : <><Icon d={ic.save} size={15} color={C.white} /> Save Changes</>}
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

export default CompanyProfileEdit;