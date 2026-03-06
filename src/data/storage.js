// ==============================================
// DATA STORAGE LAYER - All data saved here
// ==============================================

// Keys for localStorage
const STORAGE_KEYS = {
  USERS: 'users',
  COMPANIES: 'companies',
  CANDIDATES: 'candidates',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  INTERVIEWS: 'interviews',
  REPORTS: 'reports'
};

// ==============================================
// INITIALIZATION
// ==============================================

export const initializeStorage = () => {
  // Create empty storage if not exists
  Object.values(STORAGE_KEYS).forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  });
  console.log('✅ Storage initialized');
};

export const clearAllData = () => {
  if (window.confirm('Are you sure you want to delete ALL data?')) {
    localStorage.clear();
    initializeStorage();
    console.log('🗑️ All data cleared');
    window.location.reload();
  }
};

// ==============================================
// USERS
// ==============================================

export const getUsers = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

export const saveUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: Date.now(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const findUserByCredentials = (email, password, type) => {
  const users = getUsers();
  return users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password && 
    u.type === type
  );
};

// ==============================================
// COMPANIES
// ==============================================

export const getCompanies = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANIES) || '[]');
};

export const getCompanyById = (id) => {
  const companies = getCompanies();
  return companies.find(c => c.id === id);
};

export const getCompanyByUserId = (userId) => {
  const companies = getCompanies();
  return companies.find(c => c.userId === userId);
};

export const saveCompany = (companyData) => {
  const companies = getCompanies();
  const existingIndex = companies.findIndex(c => c.id === companyData.id);
  
  if (existingIndex >= 0) {
    // Update existing
    companies[existingIndex] = { ...companies[existingIndex], ...companyData };
  } else {
    // Create new
    companies.push({
      id: Date.now(),
      ...companyData,
      createdAt: new Date().toISOString(),
      openPositions: 0,
      activeJobs: []
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  return companyData;
};

// ==============================================
// CANDIDATES
// ==============================================

export const getCandidates = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES) || '[]');
};

export const getCandidateById = (id) => {
  const candidates = getCandidates();
  return candidates.find(c => c.id === id);
};

export const getCandidateByUserId = (userId) => {
  const candidates = getCandidates();
  return candidates.find(c => c.userId === userId);
};

export const saveCandidate = (candidateData) => {
  const candidates = getCandidates();
  const existingIndex = candidates.findIndex(c => c.id === candidateData.id);
  
  if (existingIndex >= 0) {
    candidates[existingIndex] = { ...candidates[existingIndex], ...candidateData };
  } else {
    candidates.push({
      id: Date.now(),
      ...candidateData,
      createdAt: new Date().toISOString(),
      appliedJobs: [],
      interviews: []
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  return candidateData;
};

// ==============================================
// JOBS
// ==============================================

export const getJobs = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS) || '[]');
};

export const getJobById = (id) => {
  const jobs = getJobs();
  return jobs.find(j => j.id === id);
};

export const getJobsByCompany = (companyId) => {
  const jobs = getJobs();
  return jobs.filter(j => j.companyId === companyId);
};

export const saveJob = (jobData) => {
  const jobs = getJobs();
  const newJob = {
    id: Date.now(),
    ...jobData,
    postedDate: new Date().toISOString().split('T')[0],
    applicants: 0,
    active: true,
    status: 'Active'
  };
  
  jobs.push(newJob);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  
  // Update company's open positions
  const company = getCompanyById(jobData.companyId);
  if (company) {
    company.openPositions = (company.openPositions || 0) + 1;
    company.activeJobs = [...(company.activeJobs || []), newJob.id];
    saveCompany(company);
  }
  
  return newJob;
};

export const updateJob = (jobId, updates) => {
  const jobs = getJobs();
  const index = jobs.findIndex(j => j.id === jobId);
  if (index >= 0) {
    jobs[index] = { ...jobs[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    return jobs[index];
  }
  return null;
};

export const deleteJob = (jobId) => {
  const jobs = getJobs();
  const filtered = jobs.filter(j => j.id !== jobId);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(filtered));
  return true;
};

// ==============================================
// APPLICATIONS
// ==============================================

export const getApplications = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
};

export const getApplicationsByCandidate = (candidateId) => {
  const apps = getApplications();
  return apps.filter(a => a.candidateId === candidateId);
};

export const getApplicationsByJob = (jobId) => {
  const apps = getApplications();
  return apps.filter(a => a.jobId === jobId);
};

export const getApplicationsByCompany = (companyId) => {
  const jobs = getJobsByCompany(companyId);
  const jobIds = jobs.map(j => j.id);
  const apps = getApplications();
  return apps.filter(a => jobIds.includes(a.jobId));
};

export const saveApplication = (applicationData) => {
  const apps = getApplications();
  const newApp = {
    id: Date.now(),
    ...applicationData,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied'
  };
  
  apps.push(newApp);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  
  // Update job applicants count
  const job = getJobById(applicationData.jobId);
  if (job) {
    job.applicants = (job.applicants || 0) + 1;
    updateJob(job.id, { applicants: job.applicants });
  }
  
  // Update candidate's applied jobs
  const candidate = getCandidateById(applicationData.candidateId);
  if (candidate) {
    candidate.appliedJobs = [...(candidate.appliedJobs || []), applicationData.jobId];
    saveCandidate(candidate);
  }
  
  return newApp;
};

export const updateApplicationStatus = (applicationId, status) => {
  const apps = getApplications();
  const index = apps.findIndex(a => a.id === applicationId);
  if (index >= 0) {
    apps[index].status = status;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return apps[index];
  }
  return null;
};

// ==============================================
// INTERVIEWS
// ==============================================

export const getInterviews = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERVIEWS) || '[]');
};

export const getInterviewsByCandidate = (candidateId) => {
  const interviews = getInterviews();
  return interviews.filter(i => i.candidateId === candidateId);
};

export const getInterviewsByCompany = (companyId) => {
  const jobs = getJobsByCompany(companyId);
  const jobIds = jobs.map(j => j.id);
  const interviews = getInterviews();
  return interviews.filter(i => jobIds.includes(i.jobId));
};

export const scheduleInterview = (interviewData) => {
  const interviews = getInterviews();
  const newInterview = {
    id: Date.now(),
    ...interviewData,
    status: 'Scheduled',
    createdAt: new Date().toISOString()
  };
  
  interviews.push(newInterview);
  localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
  
  // Update application status
  updateApplicationStatus(interviewData.applicationId, 'Interview Scheduled');
  
  return newInterview;
};

export const completeInterview = (interviewId, report) => {
  const interviews = getInterviews();
  const index = interviews.findIndex(i => i.id === interviewId);
  if (index >= 0) {
    interviews[index].status = 'Completed';
    interviews[index].report = report;
    interviews[index].completedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
    
    // Update application status
    updateApplicationStatus(interviews[index].applicationId, 'Interview Completed');
    
    return interviews[index];
  }
  return null;
};

// ==============================================
// REPORTS
// ==============================================

export const saveReport = (interviewId, reportData) => {
  const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
  const newReport = {
    id: Date.now(),
    interviewId,
    ...reportData,
    createdAt: new Date().toISOString()
  };
  reports.push(newReport);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  return newReport;
};

export const getReportByInterviewId = (interviewId) => {
  const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
  return reports.find(r => r.interviewId === interviewId);
};

// ==============================================
// STATS
// ==============================================

export const getStats = () => {
  const jobs = getJobs();
  const companies = getCompanies();
  const candidates = getCandidates();
  const applications = getApplications();
  
  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.active).length,
    totalCompanies: companies.length,
    totalCandidates: candidates.length,
    totalApplications: applications.length,
    placements: applications.filter(a => a.status === 'Hired').length,
    interviews: getInterviews().length
  };
};

// Export all functions
export default {
  initializeStorage,
  clearAllData,
  getUsers,
  saveUser,
  findUserByEmail,
  findUserByCredentials,
  getCompanies,
  getCompanyById,
  getCompanyByUserId,
  saveCompany,
  getCandidates,
  getCandidateById,
  getCandidateByUserId,
  saveCandidate,
  getJobs,
  getJobById,
  getJobsByCompany,
  saveJob,
  updateJob,
  deleteJob,
  getApplications,
  getApplicationsByCandidate,
  getApplicationsByJob,
  getApplicationsByCompany,
  saveApplication,
  updateApplicationStatus,
  getInterviews,
  getInterviewsByCandidate,
  getInterviewsByCompany,
  scheduleInterview,
  completeInterview,
  saveReport,
  getReportByInterviewId,
  getStats
};