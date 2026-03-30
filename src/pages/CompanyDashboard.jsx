import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getJobsByCompany, getApplicationsByJob, getCompanyByUserId, updateApplicationStatus as updateAppStatus } from '../data/storage';

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
  mapPin:     'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z',
  clock:      'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2',
  inbox:      'M22 12h-6l-2 3H10l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z',
  toggleOn:   'M23 12a11 11 0 01-11 11A11 11 0 011 12 11 11 0 0112 1a11 11 0 0111 11zM18 12a6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6 6 6 0 016 6z',
};

const C = {
  white:'#FFFFFF', grey50:'#F8F9FB', grey100:'#F0F2F7', grey200:'#E2E6EF',
  grey300:'#CBD5E1', grey400:'#9CA3B8', grey600:'#6B7280', grey700:'#374151', grey900:'#111827',
  purple:'#7C3AED', purpleLight:'#EDE9FE', purpleMid:'#A78BFA', purpleDark:'#4C1D95',
  green:'#059669', greenLight:'#D1FAE5', red:'#DC2626', redLight:'#FEE2E2',
  amber:'#D97706', amberLight:'#FEF3C7', blue:'#2563EB', blueLight:'#DBEAFE',
};

const font = "'Inter', sans-serif";
const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

const chip = (bg, color, extra = {}) => ({
  display:'inline-flex', alignItems:'center', gap:5,
  padding:'3px 10px', borderRadius:999,
  background:bg, color, fontSize:'0.73rem', fontWeight:600,
  whiteSpace:'nowrap', ...extra,
});

const STATUS_MAP = {
  pending: 'Applied', reviewed: 'Under Review', shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled', interview_completed: 'Interview Completed',
  rejected: 'Rejected', hired: 'Hired',
};

const statusStyle = (status) => {
  const map = {
    'pending':             [C.amberLight, C.amber],
    'reviewed':            [C.blueLight, C.blue],
    'shortlisted':         [C.greenLight, C.green],
    'interview_scheduled': [C.purpleLight, C.purple],
    'interview_completed': ['#F3E8FF', C.purpleDark],
    'rejected':            [C.redLight, C.red],
    'hired':               [C.greenLight, '#065F46'],
  };
  return map[status] || [C.grey100, C.grey600];
};

const btn = {
  display:'inline-flex', alignItems:'center', justifyContent:'center',
  gap:7, height:38, padding:'0 16px', borderRadius:8, border:'none',
  fontSize:'0.82rem', fontWeight:600, cursor:'pointer', fontFamily:font,
  textDecoration:'none', transition:'filter 0.15s', whiteSpace:'nowrap',
};

const card = {
  background:C.white, borderRadius:14, border:`1px solid ${C.grey200}`,
  boxShadow:'0 2px 12px rgba(0,0,0,0.05)',
};

const th = {
  padding:'10px 14px', textAlign:'left', fontSize:'0.72rem', fontWeight:700,
  color:C.grey400, textTransform:'uppercase', letterSpacing:'0.07em',
  background:C.grey50, borderBottom:`1px solid ${C.grey200}`,
};

const td = {
  padding:'11px 14px', fontSize:'0.85rem', color:C.grey700,
  verticalAlign:'middle', borderBottom:`1px solid ${C.grey100}`,
};

const CompanyDashboard = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [stats, setStats] = useState({
    totalJobs:0, activeJobs:0, totalApplications:0,
    shortlisted:0, interviews:0, hired:0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.type !== 'company') { navigate('/login'); return; }
    setUser(userData);
    loadAll(userData);
  }, []);

  const loadAll = async (userData) => {
    try {
      const comp = await getCompanyByUserId(userData.id);
      setCompany(comp);
      if (!comp) { setLoading(false); return; }

      const jobs = await getJobsByCompany(comp.id);
      setCompanyJobs(jobs);

      const allApps = [];
      await Promise.all(jobs.map(async (job) => {
        try {
          const apps = await getApplicationsByJob(job.id);
          apps.forEach(a => {
            a.jobTitle = job.title;
            a.jobLocation = job.location;
          });
          allApps.push(...apps);
        } catch (_) {}
      }));
      setApplications(allApps);

      setStats({
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'active').length,
        totalApplications: allApps.length,
        shortlisted: allApps.filter(a => a.status === 'shortlisted').length,
        interviews: allApps.filter(a => ['interview_scheduled','interview_completed'].includes(a.status)).length,
        hired: allApps.filter(a => a.status === 'hired').length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateAppStatus(appId, newStatus);
      setApplications(prev => prev.map(a =>
        a.id === appId ? { ...a, status: newStatus } : a
      ));
      const updatedApps = applications.map(a =>
        a.id === appId ? { ...a, status: newStatus } : a
      );
      setStats(prev => ({
        ...prev,
        shortlisted: updatedApps.filter(a => a.status === 'shortlisted').length,
        interviews: updatedApps.filter(a => ['interview_scheduled','interview_completed'].includes(a.status)).length,
        hired: updatedApps.filter(a => a.status === 'hired').length,
      }));
    } catch (e) {
      console.error(e);
      alert('Status update failed. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await fetch(`${API_URL}/jobs/${jobId}`, { method: 'DELETE' });
      if (user) loadAll(user);
    } catch (e) { console.error(e); }
  };

  const filtered = statusFilter === 'all'
    ? applications
    : applications.filter(a => a.status === statusFilter);

  const TABS = [
    { id:'overview',     icon:ic.barChart,  label:'Overview' },
    { id:'jobs',         icon:ic.briefcase, label:`Jobs (${stats.totalJobs})` },
    { id:'applications', icon:ic.inbox,     label:`Applications (${stats.totalApplications})` },
    { id:'profile',      icon:ic.building,  label:'Profile' },
  ];

  const STATS = [
    { icon:ic.briefcase, label:'Total Jobs',       value:stats.totalJobs,         iconBg:C.blueLight,   iconColor:C.blue },
    { icon:ic.users,     label:'Applications',     value:stats.totalApplications, iconBg:C.purpleLight, iconColor:C.purple },
    { icon:ic.star,      label:'Shortlisted',      value:stats.shortlisted,       iconBg:C.greenLight,  iconColor:C.green },
    { icon:ic.video,     label:'Interviews',       value:stats.interviews,        iconBg:'#F3E8FF',     iconColor:C.purpleDark },
    { icon:ic.check,     label:'Hired',            value:stats.hired,             iconBg:C.greenLight,  iconColor:'#065F46' },
  ];

  if (loading) return (
    <PageShell>
      <div style={{ textAlign:'center', padding:'5rem 0' }}>
        <div style={{ fontSize:'0.9rem', color:C.grey600, fontFamily:font }}>Loading dashboard…</div>
      </div>
    </PageShell>
  );

  if (!company) return (
    <PageShell>
      <div style={{ maxWidth:440, margin:'4rem auto', textAlign:'center', padding:'0 1rem' }}>
        <div style={{ ...card, padding:'2.5rem' }}>
          <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:C.grey900, margin:'0 0 0.5rem' }}>
            Company Profile Not Found
          </h2>
          <p style={{ fontSize:'0.875rem', color:C.grey600, margin:'0 0 1.5rem' }}>
            Complete your company profile to access the dashboard.
          </p>
          <Link to="/company/profile/edit"
            style={{ ...btn, background:C.purple, color:C.white }}>
            Complete Profile
          </Link>
        </div>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2rem 1.25rem', fontFamily:font }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
          flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
          <div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:C.grey400,
              textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
              Company Dashboard
            </div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:700, color:C.grey900, margin:'0 0 4px' }}>
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <div style={{ fontSize:'0.875rem', color:C.purple, fontWeight:600 }}>
              {company?.name}
            </div>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button onClick={() => loadAll(user)}
              style={{ ...btn, background:C.grey100, color:C.grey700, border:`1px solid ${C.grey200}` }}>
              <Icon d={ic.refresh} size={14} color={C.grey700} />
              Refresh
            </button>
            <Link to="/company/post-job"
              style={{ ...btn, background:C.purple, color:C.white }}>
              <Icon d={ic.plus} size={14} color={C.white} />
              Post New Job
            </Link>
            <Link to="/company/cv-viewer"
              style={{ ...btn, background:C.grey100, color:C.grey700, border:`1px solid ${C.grey200}` }}>
              <Icon d={ic.fileText} size={14} color={C.grey700} />
              View All CVs
            </Link>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',
          gap:12, marginBottom:'1.75rem' }}>
          {STATS.map((s,i) => (
            <div key={i} style={{ ...card, padding:'1.125rem 1.25rem',
              display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:10, background:s.iconBg,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon d={s.icon} size={20} color={s.iconColor} />
              </div>
              <div>
                <div style={{ fontSize:'1.6rem', fontWeight:800, color:C.grey900, lineHeight:1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize:'0.78rem', color:C.grey600, marginTop:2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:4, marginBottom:'1.25rem',
          borderBottom:`1px solid ${C.grey200}`, overflowX:'auto' }}>
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ display:'inline-flex', alignItems:'center', gap:6,
                  padding:'10px 16px', border:'none', background:'transparent',
                  fontFamily:font, fontWeight:active?700:500, fontSize:'0.83rem',
                  cursor:'pointer', whiteSpace:'nowrap',
                  color:active?C.purple:C.grey600,
                  borderBottom:`2px solid ${active?C.purple:'transparent'}`,
                  marginBottom:-1, transition:'all 0.15s' }}>
                <Icon d={t.icon} size={14} color={active?C.purple:C.grey400} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div style={card}>

          {activeTab === 'overview' && (
            <div style={{ padding:'1.5rem' }}>
              <SectionHead title="Recent Applications">
                <button onClick={() => setActiveTab('applications')}
                  style={{ ...btn, background:C.purpleLight, color:C.purple, border:'none' }}>
                  View All
                  <Icon d={ic.arrowRight} size={13} color={C.purple} />
                </button>
              </SectionHead>
              {applications.length > 0 ? (
                <TableWrap>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
                    <thead>
                      <tr>
                        {['Candidate','Job','Applied','Status','Action'].map(h => (
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0,5).map(app => {
                        const [sBg, sCol] = statusStyle(app.status);
                        return (
                          <tr key={app.id}
                            onMouseEnter={e => e.currentTarget.style.background=C.grey50}
                            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                            <td style={td}><strong>{app.candidate_name}</strong></td>
                            <td style={{ ...td, color:C.grey600 }}>{app.jobTitle}</td>
                            <td style={{ ...td, color:C.grey600 }}>
                              {new Date(app.applied_at).toLocaleDateString()}
                            </td>
                            <td style={td}>
                              <span style={chip(sBg, sCol)}>
                                {STATUS_MAP[app.status] || app.status}
                              </span>
                            </td>
                            <td style={td}>
                              <button onClick={() => setActiveTab('applications')}
                                style={{ ...btn, height:32, background:C.grey100,
                                  color:C.grey700, border:`1px solid ${C.grey200}` }}>
                                Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <EmptyState icon={ic.inbox} text="No applications yet."
                  cta={{ to:'/company/post-job', label:'Post a job to get started' }} />
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div style={{ padding:'1.5rem' }}>
              <SectionHead title="My Jobs">
                <Link to="/company/post-job"
                  style={{ ...btn, background:C.purple, color:C.white }}>
                  <Icon d={ic.plus} size={13} color={C.white} />
                  Post New Job
                </Link>
              </SectionHead>
              {companyJobs.length > 0 ? companyJobs.map(job => {
                const appCount = applications.filter(a => a.job_id === job.id).length;
                return (
                  <div key={job.id} style={{ border:`1px solid ${C.grey200}`, borderRadius:12,
                    padding:'1.125rem 1.25rem', marginBottom:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'flex-start', flexWrap:'wrap', gap:8, marginBottom:8 }}>
                      <h3 style={{ fontSize:'1rem', fontWeight:700, color:C.grey900, margin:0 }}>
                        {job.title}
                      </h3>
                      <span style={chip(job.status==='active'?C.greenLight:C.redLight,
                        job.status==='active'?C.green:C.red)}>
                        {job.status === 'active' ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem',
                      fontSize:'0.8rem', color:C.grey600, marginBottom:'0.875rem' }}>
                      <Pill icon={ic.mapPin} text={job.location} />
                      <Pill icon={ic.zap} text={job.salary} />
                      <Pill icon={ic.clock} text={job.type} />
                      <Pill icon={ic.users} text={`${appCount} applicants`} />
                    </div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      <Link to={`/job/${job.id}`}
                        style={{ ...btn, height:34, background:C.grey100,
                          color:C.grey700, border:`1px solid ${C.grey200}` }}>
                        <Icon d={ic.eye} size={13} color={C.grey700} />
                        View
                      </Link>
                      <button onClick={() => deleteJob(job.id)}
                        style={{ ...btn, height:34, background:C.redLight, color:C.red, border:'none' }}>
                        <Icon d={ic.trash} size={13} color={C.red} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <EmptyState icon={ic.briefcase} text="No jobs posted yet."
                  cta={{ to:'/company/post-job', label:'Post Your First Job' }} />
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div style={{ padding:'1.5rem' }}>
              <SectionHead title="All Applications">
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {[
                    { key:'all', label:'All' },
                    { key:'pending', label:'Applied' },
                    { key:'reviewed', label:'Under Review' },
                    { key:'shortlisted', label:'Shortlisted' },
                    { key:'interview_scheduled', label:'Scheduled' },
                    { key:'interview_completed', label:'Completed' },
                    { key:'rejected', label:'Rejected' },
                    { key:'hired', label:'Hired' },
                  ].map(f => (
                    <button key={f.key} onClick={() => setStatusFilter(f.key)}
                      style={{ ...btn, height:32, fontSize:'0.75rem',
                        background:statusFilter===f.key?C.purple:C.grey100,
                        color:statusFilter===f.key?C.white:C.grey600,
                        border:`1px solid ${statusFilter===f.key?C.purple:C.grey200}` }}>
                      {f.label}
                      <span style={{
                        fontSize:'0.65rem', fontWeight:700,
                        background: statusFilter===f.key ? 'rgba(255,255,255,0.25)' : C.grey200,
                        padding:'1px 6px', borderRadius:999,
                      }}>
                        {f.key==='all' ? applications.length : applications.filter(a=>a.status===f.key).length}
                      </span>
                    </button>
                  ))}
                </div>
              </SectionHead>

              {filtered.length > 0 ? (
                <TableWrap>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:1100 }}>
                    <thead>
                      <tr>
                        {['Candidate','Email','Job','Applied','CV Score','Status','Actions'].map(h => (
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(app => {
                        const [sBg, sCol] = statusStyle(app.status);
                        const isUpdating = updatingId === app.id;
                        return (
                          <tr key={app.id}
                            onMouseEnter={e => e.currentTarget.style.background=C.grey50}
                            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                            <td style={td}><strong>{app.candidate_name}</strong></td>
                            <td style={{ ...td, color:C.grey600 }}>{app.candidate_email}</td>
                            <td style={{ ...td, color:C.grey600 }}>{app.jobTitle}</td>
                            <td style={{ ...td, color:C.grey600 }}>
                              {new Date(app.applied_at).toLocaleDateString()}
                            </td>
                            <td style={td}>
                              {app.cv_score ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ 
                                    width: '60px', 
                                    height: '6px', 
                                    background: '#E2E6EF', 
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                  }}>
                                    <div style={{ 
                                      width: `${app.cv_score}%`, 
                                      height: '100%', 
                                      background: app.cv_score >= 70 ? '#059669' : app.cv_score >= 50 ? '#7C3AED' : '#DC2626',
                                      borderRadius: '3px'
                                    }} />
                                  </div>
                                  <span style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.8rem',
                                    color: app.cv_score >= 70 ? '#059669' : app.cv_score >= 50 ? '#7C3AED' : '#DC2626'
                                  }}>
                                    {app.cv_score}%
                                  </span>
                                </div>
                              ) : (
                                <span style={{ color: '#9CA3B8', fontSize: '0.75rem' }}>—</span>
                              )}
                            </td>
                            <td style={td}>
                              <span style={chip(sBg, sCol)}>
                                {STATUS_MAP[app.status] || app.status}
                              </span>
                            </td>
                            <td style={td}>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                <select
                                  value={app.status}
                                  disabled={isUpdating}
                                  onChange={e => updateStatus(app.id, e.target.value)}
                                  style={{ fontFamily:font, fontSize:'0.78rem', fontWeight:600,
                                    padding:'4px 8px', borderRadius:6,
                                    background:sBg, color:sCol,
                                    border:`1px solid ${sCol}40`,
                                    cursor:isUpdating?'not-allowed':'pointer', outline:'none' }}>
                                  {[
                                    { val:'pending', label:'Applied' },
                                    { val:'reviewed', label:'Under Review' },
                                    { val:'shortlisted', label:'Shortlisted' },
                                    { val:'interview_scheduled', label:'Interview Scheduled' },
                                    { val:'interview_completed', label:'Interview Completed' },
                                    { val:'rejected', label:'Rejected' },
                                    { val:'hired', label:'Hired' },
                                  ].map(s => (
                                    <option key={s.val} value={s.val}>{s.label}</option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <EmptyState icon={ic.inbox} text="No applications found." />
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ padding:'1.5rem' }}>
              <SectionHead title="Company Profile">
                <Link to="/company/profile/edit"
                  style={{ ...btn, background:C.purple, color:C.white }}>
                  <Icon d={ic.edit} size={13} color={C.white} />
                  Edit Profile
                </Link>
              </SectionHead>
              {company && (
                <>
                  <div style={{ display:'flex', gap:'1.5rem', marginBottom:'1.75rem',
                    flexWrap:'wrap', alignItems:'flex-start' }}>
                    <img
                      src={company.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name||'Co')}&background=7C3AED&color=fff&size=120`}
                      alt={company.name}
                      style={{ width:100, height:100, borderRadius:14, objectFit:'cover',
                        border:`2px solid ${C.grey200}` }}
                    />
                    <div>
                      <h2 style={{ fontSize:'1.4rem', fontWeight:700, color:C.grey900, margin:'0 0 4px' }}>
                        {company.name}
                      </h2>
                      <div style={{ fontSize:'0.875rem', color:C.purple, fontWeight:600, marginBottom:6 }}>
                        {company.industry || 'Industry not specified'}
                      </div>
                      <Pill icon={ic.mapPin} text={company.location || 'Location N/A'} />
                    </div>
                  </div>
                  <div style={{ marginBottom:'1.5rem', padding:'1rem 1.25rem',
                    background:C.grey50, borderRadius:10, border:`1px solid ${C.grey100}` }}>
                    <div style={{ fontSize:'0.72rem', fontWeight:700, color:C.grey400,
                      textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>
                      About
                    </div>
                    <p style={{ fontSize:'0.875rem', color:C.grey700, lineHeight:1.75, margin:0 }}>
                      {company.description || 'No description added yet.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button:hover:not(:disabled) { filter: brightness(0.92) !important; }
        a:hover { filter: brightness(0.88) !important; }
      `}</style>
    </PageShell>
  );
};

const PageShell = ({ children }) => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
    background:'#F8F9FB', fontFamily:"'Inter', sans-serif" }}>
    <Navbar />
    <main style={{ flex:1 }}>{children}</main>
    <Footer />
  </div>
);

const SectionHead = ({ title, children }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
    flexWrap:'wrap', gap:'0.75rem', marginBottom:'1.25rem' }}>
    <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#111827', margin:0 }}>{title}</h2>
    {children && <div style={{ display:'flex', gap:8 }}>{children}</div>}
  </div>
);

const TableWrap = ({ children }) => (
  <div style={{ overflowX:'auto', borderRadius:10, border:`1px solid #E2E6EF` }}>
    {children}
  </div>
);

const EmptyState = ({ icon, text, cta }) => (
  <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
    <div style={{ width:56, height:56, borderRadius:'50%', background:'#F0F2F7',
      display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
      <Icon d={icon} size={24} color='#9CA3B8' />
    </div>
    <p style={{ fontSize:'0.9rem', color:'#6B7280', margin:'0 0 4px' }}>{text}</p>
    {cta && (
      <Link to={cta.to} style={{ fontSize:'0.85rem', color:'#7C3AED', fontWeight:600, textDecoration:'none' }}>
        {cta.label}
      </Link>
    )}
  </div>
);

const Pill = ({ icon, text }) => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:4,
    fontSize:'0.78rem', color:'#6B7280' }}>
    <Icon d={icon} size={12} color='#9CA3B8' />
    {text}
  </span>
);

export default CompanyDashboard;
