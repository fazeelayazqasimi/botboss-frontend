import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getJobById, saveApplication, getApplicationsByJob } from '../data/storage';

// Icons Component (same as PostJob)
const Icon = ({ d, size = 16, color = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ic = {
  mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  clock: 'M12 6v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z',
  calendar: 'M3 9h18M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6zM8 2v4M16 2v4',
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  alert: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  arrowLeft: 'M19 12H5M12 5l-7 7 7 7',
  building: 'M3 9l9-7 9 7v11a2 2 0 01-2 2h-5v-8H9v8H5a2 2 0 01-2-2z',
  tool: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  fileText: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  loader: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01',
};

// Color Tokens (same as PostJob)
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

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState('');
  const [applicationData, setApplicationData] = useState({ coverLetter: '' });
  const [uploadError, setUploadError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadJobData = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        const jobData = await getJobById(id);
        setJob(jobData);
        if (userData && userData.type === 'candidate') {
          const applications = await getApplicationsByJob(id);
          const applied = applications.some(a => a.user_id === userData.id);
          setHasApplied(applied);
        }
      } catch (error) {
        console.error('Error loading job:', error);
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    loadJobData();
  }, [id, navigate]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const showCustomAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only PDF and Word documents are allowed');
      return false;
    }
    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return false;
    }
    setUploadError('');
    return true;
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateFile(file)) {
      setCvFile(null);
      setCvFileName('');
      return;
    }
    setCvFile(file);
    setCvFileName(file.name);
  };

  const handleApply = () => {
    if (!user) { navigate('/login'); return; }
    if (user.type !== 'candidate') {
      showCustomAlert('Only candidates can apply for jobs', 'warning');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) { showCustomAlert('Please upload your CV', 'warning'); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('job_id', id);
      formData.append('user_id', user.id);
      formData.append('candidate_name', user.name || '');
      formData.append('candidate_email', user.email || '');
      formData.append('cover_letter', applicationData.coverLetter);
      formData.append('resume', cvFile);
      await saveApplication(formData);
      showCustomAlert('Application submitted successfully!', 'success');
      setShowApplyModal(false);
      setHasApplied(true);
      setCvFile(null);
      setCvFileName('');
      setApplicationData({ coverLetter: '' });
    } catch (error) {
      showCustomAlert(error.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (salary.toLowerCase().includes('unpaid')) return 'Unpaid / Internship';
    return salary;
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Last day!';
    return `${days} days left`;
  };

  // ─── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: C.grey50, fontFamily: font }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <div style={{ animation: 'spin 1s linear infinite' }}>
            <Icon d={ic.loader} size={32} color={C.purple} />
          </div>
          <span style={{ color: C.grey600, fontSize: '0.9rem' }}>Loading job details...</span>
        </div>
        <Footer />
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  // ─── Not Found ────────────────────────────────────────────────
  if (!job) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: C.grey50, fontFamily: font }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <Icon d={ic.briefcase} size={48} color={C.grey200} />
          <h2 style={{ color: C.grey700, margin: 0 }}>Job not found</h2>
          <Link to="/jobs" style={{ ...btn, background: C.purple, color: C.white, textDecoration: 'none' }}>
            <Icon d={ic.arrowLeft} size={14} color={C.white} /> Back to Jobs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed(job.deadline);
  const daysLeft = getDaysLeft(job.deadline);
  const jobIsActive = job.status === 'active' && !deadlinePassed;

  // ─── Main Render ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: C.grey50, fontFamily: font }}>

      {/* Toast Alert */}
      {showAlert && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, animation: 'slideIn 0.3s ease' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px',
            background: C.white,
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            borderLeft: `4px solid ${alertType === 'success' ? C.green : alertType === 'error' ? C.red : C.amber}`,
            minWidth: 300,
          }}>
            <Icon
              d={alertType === 'success' ? ic.check : ic.alert}
              size={18}
              color={alertType === 'success' ? C.green : alertType === 'error' ? C.red : C.amber}
              sw={2.5}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: alertType === 'success' ? C.green : alertType === 'error' ? C.red : C.amber }}>
                {alertType === 'success' ? 'Success!' : alertType === 'error' ? 'Error!' : 'Notice'}
              </div>
              <div style={{ fontSize: '0.8rem', color: C.grey600 }}>{alertMessage}</div>
            </div>
            <button onClick={() => setShowAlert(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.grey400, padding: 0 }}>
              <Icon d={ic.x} size={14} color={C.grey400} />
            </button>
          </div>
        </div>
      )}

      <Navbar />

      <main style={{ flex: 1, maxWidth: 1080, margin: '0 auto', width: '100%', padding: '2rem 1.5rem' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem', fontSize: '0.8rem', color: C.grey400 }}>
          <Link to="/" style={{ color: C.purple, textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <span>/</span>
          <Link to="/jobs" style={{ color: C.purple, textDecoration: 'none', fontWeight: 500 }}>Jobs</Link>
          <span>/</span>
          <span style={{ color: C.grey700, fontWeight: 600 }}>{job.title}</span>
        </div>

        {/* ── Job Header Card ── */}
        <div style={{
          background: C.white,
          borderRadius: 16,
          border: `1px solid ${C.grey200}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          padding: '2rem',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Company Logo */}
            <div style={{
              width: 80, height: 80, borderRadius: 14,
              border: `1.5px solid ${C.grey200}`,
              overflow: 'hidden', flexShrink: 0,
              background: C.grey50,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {job.company_logo
                ? <img src={job.company_logo} alt={job.company_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Icon d={ic.building} size={32} color={C.grey300} />
              }
            </div>

            {/* Title + Meta */}
            <div style={{ flex: 1, minWidth: 200 }}>
              {/* Status badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 999,
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: jobIsActive ? C.greenLight : C.redLight,
                  color: jobIsActive ? C.green : C.red,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: jobIsActive ? C.green : C.red, display: 'inline-block' }} />
                  {jobIsActive ? 'Actively Hiring' : 'Closed'}
                </span>

                {job.category && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 999,
                    fontSize: '0.7rem', fontWeight: 600,
                    background: C.purpleLight, color: C.purple,
                  }}>
                    <Icon d={ic.tag} size={10} color={C.purple} />
                    {job.category}
                  </span>
                )}

                {daysLeft && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 999,
                    fontSize: '0.7rem', fontWeight: 600,
                    background: deadlinePassed ? C.redLight : C.amberLight,
                    color: deadlinePassed ? C.red : C.amber,
                  }}>
                    <Icon d={ic.clock} size={10} color={deadlinePassed ? C.red : C.amber} />
                    {daysLeft}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: C.grey900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                {job.title}
              </h1>

              <Link to={`/company/${job.company_id}`} style={{ fontSize: '1rem', fontWeight: 600, color: C.purple, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <Icon d={ic.building} size={14} color={C.purple} />
                {job.company_name}
              </Link>

              {/* Meta chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.82rem', color: C.grey600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d={ic.mapPin} size={13} color={C.grey400} />
                  {job.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d={ic.dollar} size={13} color={C.grey400} />
                  {formatSalary(job.salary)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d={ic.briefcase} size={13} color={C.grey400} />
                  {job.type}
                </span>
                {job.experience && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon d={ic.users} size={13} color={C.grey400} />
                    {job.experience}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d={ic.calendar} size={13} color={C.grey400} />
                  Posted {new Date(job.posted_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Apply Button area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              {user?.type === 'candidate' && !hasApplied && jobIsActive && (
                <button onClick={handleApply} style={{ ...btn, background: C.purple, color: C.white, height: 48, padding: '0 28px', fontSize: '0.9rem' }}>
                  <Icon d={ic.send} size={15} color={C.white} />
                  Apply Now
                </button>
              )}
              {user?.type === 'candidate' && hasApplied && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.greenLight, borderRadius: 10, color: C.green, fontWeight: 600, fontSize: '0.875rem' }}>
                  <Icon d={ic.check} size={15} color={C.green} sw={2.5} />
                  Applied
                </div>
              )}
              {!user && (
                <button onClick={handleApply} style={{ ...btn, background: C.purple, color: C.white, height: 48, padding: '0 28px', fontSize: '0.9rem' }}>
                  Login to Apply
                </button>
              )}
              {job.deadline && (
                <span style={{ fontSize: '0.75rem', color: C.grey400, textAlign: 'right' }}>
                  Deadline: {new Date(job.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

          {/* Left: Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Description */}
            <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.grey200}`, boxShadow: '0 2px 12px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.5rem', borderBottom: `1px solid ${C.grey100}`, background: C.grey50 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={ic.fileText} size={16} color={C.blue} />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.grey900 }}>Job Description</span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ color: C.grey700, lineHeight: 1.9, fontSize: '0.9rem', margin: 0, whiteSpace: 'pre-line' }}>
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.grey200}`, boxShadow: '0 2px 12px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.5rem', borderBottom: `1px solid ${C.grey100}`, background: C.grey50 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: C.amberLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={ic.star} size={16} color={C.amber} />
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.grey900 }}>Requirements</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {job.requirements.map((req, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: C.grey700 }}>
                        <span style={{ marginTop: 3, flexShrink: 0 }}>
                          <Icon d={ic.check} size={14} color={C.green} sw={2.5} />
                        </span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.grey200}`, boxShadow: '0 2px 12px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.5rem', borderBottom: `1px solid ${C.grey100}`, background: C.grey50 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: C.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={ic.tool} size={16} color={C.purple} />
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.grey900 }}>Required Skills</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {job.skills.map((skill, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', background: C.purpleLight,
                        borderRadius: 999, fontSize: '0.8rem', fontWeight: 500, color: C.purple
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Job Summary */}
            <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.grey200}`, boxShadow: '0 2px 12px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${C.grey100}`, background: C.grey50 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.grey900 }}>Job Summary</span>
              </div>
              <div style={{ padding: '1.25rem 1.5rem' }}>
                {[
                  { icon: ic.briefcase, label: 'Position', value: job.title },
                  { icon: ic.tag, label: 'Category', value: job.category || 'Not specified' },
                  { icon: ic.clock, label: 'Job Type', value: job.type },
                  { icon: ic.mapPin, label: 'Location', value: job.location },
                  { icon: ic.users, label: 'Experience', value: job.experience || 'Not specified' },
                  { icon: ic.dollar, label: 'Salary', value: job.salary === 'Unpaid (Volunteer/Internship)' ? 'Unpaid Position' : job.salary },
                  { icon: ic.calendar, label: 'Posted', value: new Date(job.posted_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) },
                  ...(job.deadline ? [{ icon: ic.calendar, label: 'Deadline', value: new Date(job.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) }] : []),
                ].map(({ icon, label, value }, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    paddingBottom: 12, marginBottom: 12,
                    borderBottom: i < 7 ? `1px solid ${C.grey100}` : 'none'
                  }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: C.grey100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Icon d={icon} size={13} color={C.grey600} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: C.grey400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: '0.82rem', color: C.grey900, fontWeight: 500 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply CTA (sidebar) */}
            {user?.type === 'candidate' && !hasApplied && jobIsActive && (
              <button
                onClick={handleApply}
                style={{ ...btn, background: C.purple, color: C.white, width: '100%', height: 50, fontSize: '0.9rem' }}
              >
                <Icon d={ic.send} size={16} color={C.white} />
                Apply for this Job
              </button>
            )}
            {user?.type === 'candidate' && hasApplied && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', background: C.greenLight, borderRadius: 10, color: C.green, fontWeight: 700, fontSize: '0.875rem' }}>
                <Icon d={ic.check} size={16} color={C.green} sw={2.5} />
                You have applied
              </div>
            )}
            {!user && (
              <button onClick={handleApply} style={{ ...btn, background: C.purple, color: C.white, width: '100%', height: 50, fontSize: '0.9rem' }}>
                Login to Apply
              </button>
            )}
          </div>
        </div>
      </main>

      {/* ── Apply Modal ── */}
      {showApplyModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={() => setShowApplyModal(false)}
        >
          <div
            style={{ background: C.white, borderRadius: 16, padding: '2rem', maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Application</div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.grey900, margin: 0 }}>Apply for {job.title}</h2>
              </div>
              <button onClick={() => setShowApplyModal(false)} style={{ background: C.grey100, border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon d={ic.x} size={14} color={C.grey700} />
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit}>

              {/* CV Upload */}
              <div style={{ marginBottom: '1.25rem', padding: '1rem', background: C.grey50, borderRadius: 10, border: `1.5px dashed ${C.grey200}` }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: C.grey700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Upload CV <span style={{ color: C.red }}>*</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: C.grey400, display: 'block', marginBottom: 10 }}>PDF, DOC, DOCX only — max 10MB</span>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 8, cursor: 'pointer',
                  background: C.purpleLight, color: C.purple, fontWeight: 600, fontSize: '0.8rem',
                  fontFamily: font
                }}>
                  <Icon d={ic.upload} size={14} color={C.purple} />
                  Choose File
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} style={{ display: 'none' }} required />
                </label>
                {cvFileName && !uploadError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.8rem', color: C.green, fontWeight: 500 }}>
                    <Icon d={ic.fileText} size={13} color={C.green} /> {cvFileName}
                  </div>
                )}
                {uploadError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.8rem', color: C.red }}>
                    <Icon d={ic.alert} size={13} color={C.red} /> {uploadError}
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: C.grey700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Cover Letter <span style={{ fontSize: '0.7rem', color: C.grey400, textTransform: 'none', fontWeight: 400 }}>(Optional)</span>
                </label>
                <textarea
                  style={{ ...inputBase, minHeight: 120, resize: 'vertical' }}
                  placeholder="Tell the employer why you're the right fit..."
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ coverLetter: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = C.purple}
                  onBlur={(e) => e.target.style.borderColor = C.grey200}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={!cvFile || !!uploadError || submitting}
                  style={{
                    ...btn, flex: 1, height: 48,
                    background: (!cvFile || uploadError || submitting) ? C.grey200 : C.purple,
                    color: (!cvFile || uploadError || submitting) ? C.grey400 : C.white,
                    cursor: (!cvFile || uploadError || submitting) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting
                    ? <><div style={{ animation: 'spin 1s linear infinite' }}><Icon d={ic.loader} size={14} color={C.grey400} /></div> Submitting...</>
                    : <><Icon d={ic.send} size={14} color={!cvFile || uploadError ? C.grey400 : C.white} /> Submit Application</>
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  style={{ ...btn, background: C.white, color: C.grey700, border: `1.5px solid ${C.grey200}` }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slideIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
        * { box-sizing: border-box; }
        button:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(0.95); }
        a:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
};

export default JobDetails;
