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
  briefcase:  'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  users:      'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  star:       'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  video:      'M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
  barChart:   'M18 20V10M12 20V4M6 20v-6',
  building:   'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM9 22V12h6v10',
  check:      'M20 6L9 17l-5-5',
  x:          'M18 6L6 18M6 6l12 12',
  plus:       'M12 5v14M5 12h14',
  refresh:    'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  edit:       'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:      'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  eye:        'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  calendar:   'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  fileText:   'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  loader:     'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  award:      'M12 15a7 7 0 100-14 7 7 0 000 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  zap:        'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  target:     'M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z',
  mapPin:     'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z',
  link:       'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  clock:      'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2',
  info:       'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 16v-4M12 8h.01',
  inbox:      'M22 12h-6l-2 3H10l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z',
  toggleOn:   'M23 12a11 11 0 01-11 11A11 11 0 011 12 11 11 0 0112 1a11 11 0 0111 11zM18 12a6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6 6 6 0 016 6z',
};

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  white:       '#FFFFFF',
  grey50:      '#F8F9FB',
  grey100:     '#F0F2F7',
  grey200:     '#E2E6EF',
  grey300:     '#CBD5E1',
  grey400:     '#9CA3B8',
  grey600:     '#6B7280',
  grey700:     '#374151',
  grey900:     '#111827',
  purple:      '#7C3AED',
  purpleLight: '#EDE9FE',
  purpleMid:   '#A78BFA',
  purpleDark:  '#4C1D95',
  green:       '#059669',
  greenLight:  '#D1FAE5',
  red:         '#DC2626',
  redLight:    '#FEE2E2',
  amber:       '#D97706',
  amberLight:  '#FEF3C7',
  blue:        '#2563EB',
  blueLight:   '#DBEAFE',
};

const font = "'Poppins', sans-serif";

// ─── Micro helpers ────────────────────────────────────────────────────────────
const chip = (bg, color, extra = {}) => ({
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '3px 10px', borderRadius: 999,
  background: bg, color, fontSize: '0.73rem', fontWeight: 600,
  whiteSpace: 'nowrap', ...extra,
});

const scoreColor = (n) => n >= 80 ? C.green : n >= 60 ? C.blue : n >= 40 ? C.amber : C.red;
const scoreBg    = (n) => n >= 80 ? C.greenLight : n >= 60 ? C.blueLight : n >= 40 ? C.amberLight : C.redLight;

const statusStyle = (status) => {
  const map = {
    'Applied':              [C.amberLight,  C.amber],
    'Under Review':         [C.blueLight,   C.blue],
    'Shortlisted':          [C.greenLight,  C.green],
    'Interview Scheduled':  [C.purpleLight, C.purple],
    'Interview Completed':  ['#F3E8FF',     C.purpleDark],
    'Rejected':             [C.redLight,    C.red],
    'Hired':                [C.greenLight,  '#065F46'],
  };
  return map[status] || [C.grey100, C.grey600];
};

const btn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 7, height: 38, padding: '0 16px', borderRadius: 8, border: 'none',
  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: font,
  textDecoration: 'none', transition: 'filter 0.15s', whiteSpace: 'nowrap',
};

const card = {
  background: C.white, borderRadius: 14,
  border: `1px solid ${C.grey200}`,
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
};

const th = {
  padding: '10px 14px', textAlign: 'left',
  fontSize: '0.72rem', fontWeight: 700,
  color: C.grey400, textTransform: 'uppercase',
  letterSpacing: '0.07em', background: C.grey50,
  borderBottom: `1px solid ${C.grey200}`,
};

const td = {
  padding: '11px 14px', fontSize: '0.85rem',
  color: C.grey700, verticalAlign: 'middle',
  borderBottom: `1px solid ${C.grey100}`,
};

// ─── Component ────────────────────────────────────────────────────────────────
const CompanyDashboard = () => {
  const [user, setUser]               = useState(null);
  const [company, setCompany]         = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews]   = useState([]);
  const [reports, setReports]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalJobs: 0, activeJobs: 0, totalApplications: 0,
    shortlisted: 0, interviews: 0, completed: 0, hired: 0,
  });

  const API_URL  = 'https://Fazeelayazq-botboss-backend.hf.space';
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'company') { navigate('/login'); return; }
    setUser(userData);
    loadCompanyData(userData);
  }, []);

  const loadCompanyData = async (userData) => {
    try {
      const companies      = JSON.parse(localStorage.getItem('companies') || '[]');
      const companyProfile = companies.find(c =>
        c.userId === userData.id || c.email === userData.email || c.name === userData.name);
      setCompany(companyProfile);
      if (!companyProfile) { setLoading(false); return; }

      const jobs    = JSON.parse(localStorage.getItem('jobs') || '[]');
      const cJobs   = jobs.filter(j => j.companyId === companyProfile.id || j.company === companyProfile.name);
      setCompanyJobs(cJobs);

      const allApps  = JSON.parse(localStorage.getItem('applications') || '[]');
      const cApps    = allApps.filter(a => cJobs.some(j => j.id === a.jobId));
      setApplications(cApps);

      const allInts  = JSON.parse(localStorage.getItem('interviews') || '[]');
      const cInts    = allInts.filter(i => cApps.some(a => a.id === i.applicationId));
      setInterviews(cInts);

      await loadReportsFromBackend(cInts);

      const activeCount = cJobs.filter(j => j.active !== false).length;
      setStats({
        totalJobs: cJobs.length, activeJobs: activeCount,
        totalApplications: cApps.length,
        shortlisted: cApps.filter(a => a.status === 'Shortlisted').length,
        interviews:  cInts.length,
        completed:   cInts.filter(i => i.status === 'Completed').length,
        hired:       cApps.filter(a => a.status === 'Hired').length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadReportsFromBackend = async (cInts) => {
    const done = cInts.filter(i => i.status === 'Completed');
    const results = await Promise.all(done.map(async (i) => {
      try {
        const r = await fetch(`${API_URL}/interview/report/${i.id}`);
        if (r.ok) return { interviewId: i.id, report: await r.json() };
      } catch {}
      return null;
    }));
    setReports(results.filter(Boolean));
  };

  const updateApplicationStatus = (appId, newStatus) => {
    const all = JSON.parse(localStorage.getItem('applications') || '[]');
    localStorage.setItem('applications', JSON.stringify(
      all.map(a => a.id === appId ? { ...a, status: newStatus } : a)));
    if (user) loadCompanyData(user);
  };

  const scheduleInterview = (appId) => {
    const date = prompt('Enter interview date (YYYY-MM-DD HH:MM):', '2026-03-15 10:00');
    if (!date) return;
    try {
      const all = JSON.parse(localStorage.getItem('interviews') || '[]');
      all.push({ id: Date.now(), applicationId: appId,
        scheduledDate: new Date(date).toISOString(), status: 'Scheduled' });
      localStorage.setItem('interviews', JSON.stringify(all));
      updateApplicationStatus(appId, 'Interview Scheduled');
    } catch { alert('Invalid date format.'); }
  };

  const completeInterview = (intId, appId) => {
    const all = JSON.parse(localStorage.getItem('interviews') || '[]');
    localStorage.setItem('interviews', JSON.stringify(all.map(i =>
      i.id === intId
        ? { ...i, status: 'Completed', score: Math.floor(Math.random() * 30) + 70,
            report: { overall_score: Math.floor(Math.random() * 30) + 70,
              eye_contact_score: Math.floor(Math.random() * 30) + 60,
              confidence_score:  Math.floor(Math.random() * 30) + 60,
              clarity_score:     Math.floor(Math.random() * 30) + 60 } }
        : i)));
    updateApplicationStatus(appId, 'Interview Completed');
  };

  const toggleJobStatus = (jobId) => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    localStorage.setItem('jobs', JSON.stringify(
      jobs.map(j => j.id === jobId ? { ...j, active: !j.active } : j)));
    if (user) loadCompanyData(user);
  };

  const deleteJob = (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    localStorage.setItem('jobs', JSON.stringify(jobs.filter(j => j.id !== jobId)));
    if (user) loadCompanyData(user);
  };

  const getReportForInterview = (id) => reports.find(r => r.interviewId === id)?.report;

  const filteredApplications = applications.filter(a =>
    statusFilter === 'all' || a.status.toLowerCase().replace(/ /g, '-') === statusFilter);

  // ── Tabs config ───────────────────────────────────────────────────────────
  const TABS = [
    { id: 'overview',      icon: ic.barChart,  label: 'Overview'    },
    { id: 'jobs',          icon: ic.briefcase, label: `Jobs (${stats.totalJobs})` },
    { id: 'applications',  icon: ic.inbox,     label: `Applications (${stats.totalApplications})` },
    { id: 'interviews',    icon: ic.video,     label: `Interviews (${stats.interviews})` },
    { id: 'reports',       icon: ic.fileText,  label: `Reports (${stats.completed})` },
    { id: 'profile',       icon: ic.building,  label: 'Profile'     },
  ];

  // ── Stat cards config ─────────────────────────────────────────────────────
  const STATS = [
    { icon: ic.briefcase, label: 'Total Jobs',     value: stats.totalJobs,
      sub: `${stats.activeJobs} active`, iconBg: C.blueLight,   iconColor: C.blue },
    { icon: ic.users,     label: 'Applications',   value: stats.totalApplications,
      iconBg: C.purpleLight, iconColor: C.purple },
    { icon: ic.star,      label: 'Shortlisted',    value: stats.shortlisted,
      iconBg: C.amberLight,  iconColor: C.amber },
    { icon: ic.video,     label: 'Interviews',     value: stats.interviews,
      iconBg: '#F3E8FF',     iconColor: C.purpleDark },
    { icon: ic.check,     label: 'Completed',      value: stats.completed,
      iconBg: C.greenLight,  iconColor: C.green },
    { icon: ic.award,     label: 'Hired',          value: stats.hired,
      iconBg: C.greenLight,  iconColor: '#065F46' },
  ];

  if (loading) return (
    <PageShell>
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginBottom: '1rem' }}>
          <Icon d={ic.loader} size={36} color={C.purple} />
        </div>
        <div style={{ fontWeight: 600, color: C.grey900 }}>Loading dashboard…</div>
      </div>
    </PageShell>
  );

  if (!company) return (
    <PageShell>
      <div style={{ maxWidth: 440, margin: '4rem auto', textAlign: 'center' }}>
        <div style={{ ...card, padding: '2.5rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.purpleLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Icon d={ic.building} size={26} color={C.purple} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: C.grey900, margin: '0 0 0.5rem' }}>
            Company Profile Not Found
          </h2>
          <p style={{ fontSize: '0.875rem', color: C.grey600, margin: '0 0 1.5rem' }}>
            Complete your company profile to access the dashboard.
          </p>
          <Link to="/company/profile/edit"
            style={{ ...btn, background: C.purple, color: C.white, boxShadow: `0 2px 12px ${C.purple}35` }}>
            Complete Profile
            <Icon d={ic.arrowRight} size={14} color={C.white} />
          </Link>
        </div>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.25rem', fontFamily: font }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.grey400,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Company Dashboard
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: C.grey900,
              margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Company'}
            </h1>
            <div style={{ fontSize: '0.875rem', color: C.purple, fontWeight: 600 }}>
              {company?.name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => loadCompanyData(user)}
              style={{ ...btn, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
              <Icon d={ic.refresh} size={14} color={C.grey700} />
              Refresh
            </button>
            <Link to="/company/post-job"
              style={{ ...btn, background: C.purple, color: C.white, boxShadow: `0 2px 12px ${C.purple}35` }}>
              <Icon d={ic.plus} size={14} color={C.white} />
              Post New Job
            </Link>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 12, marginBottom: '1.75rem' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ ...card, padding: '1.125rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: s.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={s.icon} size={20} color={s.iconColor} />
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: C.grey900, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: C.grey600, marginTop: 2 }}>{s.label}</div>
                {s.sub && <div style={{ fontSize: '0.72rem', color: C.green, fontWeight: 600 }}>{s.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem',
          borderBottom: `1px solid ${C.grey200}`, overflowX: 'auto' }}>
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 16px', border: 'none', background: 'transparent',
                  fontFamily: font, fontWeight: active ? 700 : 500,
                  fontSize: '0.83rem', cursor: 'pointer', whiteSpace: 'nowrap',
                  color: active ? C.purple : C.grey600,
                  borderBottom: `2px solid ${active ? C.purple : 'transparent'}`,
                  marginBottom: -1, transition: 'all 0.15s' }}>
                <Icon d={t.icon} size={14} color={active ? C.purple : C.grey400} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ── */}
        <div style={card}>

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div style={{ padding: '1.5rem' }}>
              <SectionHead title="Recent Applications">
                <Link to="#" onClick={() => setActiveTab('applications')}
                  style={{ ...btn, background: C.purpleLight, color: C.purple, border: 'none' }}>
                  View All
                  <Icon d={ic.arrowRight} size={13} color={C.purple} />
                </Link>
              </SectionHead>
              {applications.length > 0 ? (
                <TableWrap>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                    <thead>
                      <tr>
                        {['Candidate','Job','Applied','Status','Interview','Actions'].map(h => (
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map(app => {
                        const interview = interviews.find(i => i.applicationId === app.id);
                        const report    = interview ? getReportForInterview(interview.id) : null;
                        const [sBg, sCol] = statusStyle(app.status);
                        return (
                          <tr key={app.id} style={{ transition: 'background 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = C.grey50}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={td}><strong>{app.candidateName}</strong></td>
                            <td style={{ ...td, color: C.grey600 }}>{app.jobTitle}</td>
                            <td style={{ ...td, color: C.grey600 }}>
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </td>
                            <td style={td}>
                              <span style={chip(sBg, sCol)}>{app.status}</span>
                            </td>
                            <td style={td}>
                              {interview
                                ? <span style={chip(
                                    interview.status === 'Completed' ? C.greenLight : C.amberLight,
                                    interview.status === 'Completed' ? C.green : C.amber)}>
                                    {interview.status}
                                  </span>
                                : <span style={{ color: C.grey400 }}>—</span>}
                            </td>
                            <td style={td}>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {report && (
                                  <Link to={`/report/${interview.id}`}
                                    style={{ ...btn, height: 32, background: C.purpleLight, color: C.purple, border: 'none' }}>
                                    <Icon d={ic.fileText} size={12} color={C.purple} />
                                    Report
                                  </Link>
                                )}
                                <button onClick={() => setActiveTab('applications')}
                                  style={{ ...btn, height: 32, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <EmptyState icon={ic.inbox} text="No applications yet."
                  cta={{ to: '/company/post-job', label: 'Post a job to get started' }} />
              )}
            </div>
          )}

          {/* ── Jobs ── */}
          {activeTab === 'jobs' && (
            <div style={{ padding: '1.5rem' }}>
              <SectionHead title="My Jobs">
                <Link to="/company/post-job"
                  style={{ ...btn, background: C.purple, color: C.white, boxShadow: `0 2px 12px ${C.purple}30` }}>
                  <Icon d={ic.plus} size={13} color={C.white} />
                  Post New Job
                </Link>
              </SectionHead>
              {companyJobs.length > 0 ? companyJobs.map(job => {
                const appCount = applications.filter(a => a.jobId === job.id).length;
                return (
                  <div key={job.id} style={{ border: `1px solid ${C.grey200}`, borderRadius: 12,
                    padding: '1.125rem 1.25rem', marginBottom: 10,
                    transition: 'box-shadow 0.2s, border-color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = C.purpleMid; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.grey200; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: C.grey900, margin: 0 }}>
                        {job.title}
                      </h3>
                      <span style={chip(job.active ? C.greenLight : C.redLight,
                        job.active ? C.green : C.red)}>
                        {job.active ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                      fontSize: '0.8rem', color: C.grey600, marginBottom: '0.875rem' }}>
                      <Pill icon={ic.mapPin}   text={job.location} />
                      <Pill icon={ic.zap}      text={job.salary} />
                      <Pill icon={ic.clock}    text={job.type} />
                      <Pill icon={ic.calendar} text={`Posted ${new Date(job.postedDate).toLocaleDateString()}`} />
                      <Pill icon={ic.users}    text={`${appCount} applicants`} />
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Link to={`/job/${job.id}`}
                        style={{ ...btn, height: 34, background: C.grey100, color: C.grey700, border: `1px solid ${C.grey200}` }}>
                        <Icon d={ic.eye} size={13} color={C.grey700} />
                        View
                      </Link>
                      <button onClick={() => toggleJobStatus(job.id)}
                        style={{ ...btn, height: 34, background: job.active ? C.amberLight : C.greenLight,
                          color: job.active ? C.amber : C.green, border: 'none' }}>
                        <Icon d={ic.toggleOn} size={13} color={job.active ? C.amber : C.green} />
                        {job.active ? 'Close' : 'Reopen'}
                      </button>
                      <button onClick={() => deleteJob(job.id)}
                        style={{ ...btn, height: 34, background: C.redLight, color: C.red, border: 'none' }}>
                        <Icon d={ic.trash} size={13} color={C.red} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <EmptyState icon={ic.briefcase} text="No jobs posted yet."
                  cta={{ to: '/company/post-job', label: 'Post Your First Job' }} />
              )}
            </div>
          )}

          {/* ── Applications ── */}
          {activeTab === 'applications' && (
            <div style={{ padding: '1.5rem' }}>
              <SectionHead title="All Applications">
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['all','applied','shortlisted','interview-scheduled','interview-completed'].map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      style={{ ...btn, height: 34,
                        background: statusFilter === f ? C.purple : C.grey100,
                        color:      statusFilter === f ? C.white  : C.grey600,
                        border: `1px solid ${statusFilter === f ? C.purple : C.grey200}` }}>
                      {f === 'all' ? 'All' : f.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </SectionHead>
              {filteredApplications.length > 0 ? (
                <TableWrap>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                    <thead>
                      <tr>
                        {['Candidate','Job','Applied','Status','Interview','Score','Actions'].map(h => (
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map(app => {
                        const interview = interviews.find(i => i.applicationId === app.id);
                        const report    = interview ? getReportForInterview(interview.id) : null;
                        const [sBg, sCol] = statusStyle(app.status);
                        return (
                          <tr key={app.id}
                            onMouseEnter={e => e.currentTarget.style.background = C.grey50}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={td}><strong>{app.candidateName}</strong></td>
                            <td style={{ ...td, color: C.grey600 }}>{app.jobTitle}</td>
                            <td style={{ ...td, color: C.grey600 }}>
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </td>
                            <td style={td}>
                              <select
                                value={app.status}
                                onChange={e => updateApplicationStatus(app.id, e.target.value)}
                                style={{ fontFamily: font, fontSize: '0.78rem', fontWeight: 600,
                                  padding: '4px 8px', borderRadius: 6,
                                  background: sBg, color: sCol,
                                  border: `1px solid ${sCol}40`, cursor: 'pointer', outline: 'none' }}>
                                {['Applied','Under Review','Shortlisted','Interview Scheduled',
                                  'Interview Completed','Rejected','Hired'].map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                            <td style={td}>
                              {interview ? (
                                <div>
                                  <span style={chip(
                                    interview.status === 'Completed' ? C.greenLight : C.amberLight,
                                    interview.status === 'Completed' ? C.green : C.amber)}>
                                    {interview.status}
                                  </span>
                                  <div style={{ fontSize: '0.72rem', color: C.grey400, marginTop: 3 }}>
                                    {new Date(interview.scheduledDate).toLocaleDateString()}
                                  </div>
                                </div>
                              ) : <span style={{ color: C.grey400 }}>—</span>}
                            </td>
                            <td style={td}>
                              {report ? (
                                <span style={chip(scoreBg(report.overall_score), scoreColor(report.overall_score))}>
                                  {report.overall_score}%
                                </span>
                              ) : <span style={{ color: C.grey400 }}>—</span>}
                            </td>
                            <td style={td}>
                              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                {app.status === 'Shortlisted' && (
                                  <button onClick={() => scheduleInterview(app.id)}
                                    style={{ ...btn, height: 32, background: C.purpleLight, color: C.purple, border: 'none' }}>
                                    <Icon d={ic.calendar} size={12} color={C.purple} />
                                    Schedule
                                  </button>
                                )}
                                {interview?.status === 'Scheduled' && (
                                  <button onClick={() => completeInterview(interview.id, app.id)}
                                    style={{ ...btn, height: 32, background: C.greenLight, color: C.green, border: 'none' }}>
                                    <Icon d={ic.check} size={12} color={C.green} />
                                    Complete
                                  </button>
                                )}
                                {report && (
                                  <Link to={`/report/${interview.id}`}
                                    style={{ ...btn, height: 32, background: C.purpleLight, color: C.purple, border: 'none' }}>
                                    <Icon d={ic.fileText} size={12} color={C.purple} />
                                    Report
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <EmptyState icon={ic.inbox} text="No applications found for this filter." />
              )}
            </div>
          )}

          {/* ── Interviews ── */}
          {activeTab === 'interviews' && (
            <div style={{ padding: '1.5rem' }}>
              <SectionHead title="All Interviews" />
              {interviews.length > 0 ? (
                <TableWrap>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                    <thead>
                      <tr>
                        {['Candidate','Job','Scheduled','Status','Score','Report','Actions'].map(h => (
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map(interview => {
                        const app    = applications.find(a => a.id === interview.applicationId);
                        const report = getReportForInterview(interview.id);
                        return (
                          <tr key={interview.id}
                            onMouseEnter={e => e.currentTarget.style.background = C.grey50}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={td}><strong>{app?.candidateName}</strong></td>
                            <td style={{ ...td, color: C.grey600 }}>{app?.jobTitle}</td>
                            <td style={{ ...td, color: C.grey600 }}>
                              {new Date(interview.scheduledDate).toLocaleString()}
                            </td>
                            <td style={td}>
                              <span style={chip(
                                interview.status === 'Completed' ? C.greenLight : C.amberLight,
                                interview.status === 'Completed' ? C.green : C.amber)}>
                                {interview.status}
                              </span>
                            </td>
                            <td style={td}>
                              {report
                                ? <span style={chip(scoreBg(report.overall_score), scoreColor(report.overall_score))}>
                                    {report.overall_score}%
                                  </span>
                                : interview.score ? `${interview.score}%`
                                : <span style={{ color: C.grey400 }}>—</span>}
                            </td>
                            <td style={td}>
                              {report
                                ? <Link to={`/report/${interview.id}`}
                                    style={{ color: C.purple, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                                    View
                                  </Link>
                                : <span style={{ color: C.grey400 }}>—</span>}
                            </td>
                            <td style={td}>
                              {interview.status === 'Scheduled' && (
                                <button onClick={() => completeInterview(interview.id, app?.id)}
                                  style={{ ...btn, height: 32, background: C.greenLight, color: C.green, border: 'none' }}>
                                  <Icon d={ic.check} size={12} color={C.green} />
                                  Mark Complete
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <EmptyState icon={ic.video} text="No interviews scheduled yet." />
              )}
            </div>
          )}

          {/* ── Reports ── */}
          {activeTab === 'reports' && (
            <div style={{ padding: '1.5rem' }}>
              <SectionHead title="Interview Reports" />
              {reports.length > 0 ? (
                <TableWrap>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
                    <thead>
                      <tr>
                        {['Candidate','Job','Date','Overall','Eye Contact','Confidence','Clarity',''].map(h => (
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map(({ interviewId, report }) => {
                        const interview = interviews.find(i => i.id === interviewId);
                        const app       = applications.find(a => a.id === interview?.applicationId);
                        return (
                          <tr key={interviewId}
                            onMouseEnter={e => e.currentTarget.style.background = C.grey50}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={td}><strong>{app?.candidateName}</strong></td>
                            <td style={{ ...td, color: C.grey600 }}>{app?.jobTitle}</td>
                            <td style={{ ...td, color: C.grey600 }}>
                              {new Date(report.completion_date || report.interview_date).toLocaleDateString()}
                            </td>
                            {[report.overall_score, report.eye_contact_score,
                              report.confidence_score, report.clarity_score].map((v, i) => (
                              <td key={i} style={td}>
                                <span style={chip(scoreBg(v), scoreColor(v))}>{v}%</span>
                              </td>
                            ))}
                            <td style={td}>
                              <Link to={`/report/${interviewId}`}
                                style={{ ...btn, height: 32, background: C.purpleLight, color: C.purple, border: 'none' }}>
                                <Icon d={ic.eye} size={12} color={C.purple} />
                                Full Report
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <EmptyState icon={ic.barChart} text="No reports yet."
                  sub="Complete interviews to generate AI-powered reports." />
              )}
            </div>
          )}

          {/* ── Profile ── */}
          {activeTab === 'profile' && (
            <div style={{ padding: '1.5rem' }}>
              <SectionHead title="Company Profile">
                <Link to="/company/profile/edit"
                  style={{ ...btn, background: C.purple, color: C.white, boxShadow: `0 2px 12px ${C.purple}30` }}>
                  <Icon d={ic.edit} size={13} color={C.white} />
                  Edit Profile
                </Link>
              </SectionHead>

              {company && (
                <>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.75rem',
                    flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <img
                      src={company.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Co')}&background=7C3AED&color=fff&size=120`}
                      alt={company.name}
                      style={{ width: 100, height: 100, borderRadius: 14, objectFit: 'cover',
                        border: `2px solid ${C.grey200}` }}
                    />
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: C.grey900, margin: '0 0 4px' }}>
                        {company.name}
                      </h2>
                      <div style={{ fontSize: '0.875rem', color: C.purple, fontWeight: 600, marginBottom: 6 }}>
                        {company.industry || 'Industry not specified'}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Pill icon={ic.mapPin}   text={company.location || 'Location N/A'} />
                        <Pill icon={ic.briefcase} text={`${stats.activeJobs} open positions`} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem',
                    background: C.grey50, borderRadius: 10, border: `1px solid ${C.grey100}` }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.grey400,
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      About
                    </div>
                    <p style={{ fontSize: '0.875rem', color: C.grey700, lineHeight: 1.75, margin: 0 }}>
                      {company.description || 'No description added yet.'}
                    </p>
                  </div>

                  <div style={{ display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    {[
                      { label: 'Email',       value: company.email || user?.email },
                      { label: 'Website',     value: company.website || 'Not provided' },
                      { label: 'Founded',     value: company.founded || 'Not provided' },
                      { label: 'Employees',   value: company.totalEmployees || 'Not specified' },
                      { label: 'Open Positions', value: stats.activeJobs },
                      { label: 'Member Since', value: company.createdAt
                          ? new Date(company.createdAt).toLocaleDateString() : '2026' },
                    ].map((f, i) => (
                      <div key={i} style={{ padding: '0.875rem 1rem', background: C.white,
                        border: `1px solid ${C.grey100}`, borderRadius: 10 }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.grey400,
                          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                          {f.label}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: C.grey900 }}>
                          {f.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        button:hover { filter: brightness(0.92) !important; }
        a:hover      { filter: brightness(0.88) !important; }
      `}</style>
    </PageShell>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const PageShell = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
    background: C.grey50, fontFamily: font }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

const SectionHead = ({ title, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: C.grey900, margin: 0 }}>{title}</h2>
    {children && <div style={{ display: 'flex', gap: 8 }}>{children}</div>}
  </div>
);

const TableWrap = ({ children }) => (
  <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${C.grey200}` }}>
    {children}
  </div>
);

const EmptyState = ({ icon, text, sub, cta }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.grey100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
      <Icon d={icon} size={24} color={C.grey400} />
    </div>
    <p style={{ fontSize: '0.9rem', color: C.grey600, margin: '0 0 4px' }}>{text}</p>
    {sub && <p style={{ fontSize: '0.8rem', color: C.grey400, margin: '0 0 1rem' }}>{sub}</p>}
    {cta && (
      <Link to={cta.to} style={{ fontSize: '0.85rem', color: C.purple, fontWeight: 600, textDecoration: 'none' }}>
        {cta.label}
      </Link>
    )}
  </div>
);

const Pill = ({ icon, text }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: '0.78rem', color: C.grey600 }}>
    <Icon d={icon} size={12} color={C.grey400} />
    {text}
  </span>
);

export default CompanyDashboard;