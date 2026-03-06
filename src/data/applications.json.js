// ==============================================
// APPLICATIONS JSON DATA MODULE - With CV Score
// ==============================================

const STORAGE_KEY = 'applications';

// Default empty JSON structure
const DEFAULT_APPLICATIONS = [];

// Initialize applications storage
export const initApplications = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
    console.log('✅ Applications JSON initialized');
  }
};

// Get all applications
export const getApplications = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get application by ID
export const getApplicationById = (id) => {
  const apps = getApplications();
  return apps.find(a => a.id === id) || null;
};

// Get applications by candidate
export const getApplicationsByCandidate = (candidateId) => {
  const apps = getApplications();
  return apps.filter(a => a.candidateId === candidateId);
};

// Get applications by job
export const getApplicationsByJob = (jobId) => {
  const apps = getApplications();
  return apps.filter(a => a.jobId === jobId);
};

// Get applications by company
export const getApplicationsByCompany = (companyId) => {
  const apps = getApplications();
  return apps.filter(a => a.companyId === companyId);
};

// Get applications by status
export const getApplicationsByStatus = (status) => {
  const apps = getApplications();
  return apps.filter(a => a.status === status);
};

// Save application with CV score
export const saveApplication = (applicationData) => {
  const apps = getApplications();
  
  const newApp = {
    id: Date.now(),
    ...applicationData,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    cvScore: applicationData.cvScore || 0,
    canInterview: applicationData.cvScore >= 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  apps.push(newApp);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps, null, 2));
  console.log('✅ New application saved with CV score:', newApp.cvScore);
  
  return newApp;
};

// Update application
export const updateApplication = (id, updates) => {
  const apps = getApplications();
  const index = apps.findIndex(a => a.id === id);
  
  if (index !== -1) {
    apps[index] = {
      ...apps[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps, null, 2));
    console.log('✅ Application updated:', id);
    return apps[index];
  }
  return null;
};

// Update application status
export const updateApplicationStatus = (id, status) => {
  return updateApplication(id, { status });
};

// Delete application
export const deleteApplication = (id) => {
  const apps = getApplications();
  const filtered = apps.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered, null, 2));
  console.log('✅ Application deleted:', id);
  return true;
};

// Get applications by CV score range
export const getApplicationsByCVScore = (minScore = 0, maxScore = 100) => {
  const apps = getApplications();
  return apps.filter(a => a.cvScore >= minScore && a.cvScore <= maxScore);
};

// Get eligible applications for interview (score >= 50)
export const getEligibleForInterview = () => {
  const apps = getApplications();
  return apps.filter(a => a.cvScore >= 50);
};

// Get ineligible applications for interview (score < 50)
export const getIneligibleForInterview = () => {
  const apps = getApplications();
  return apps.filter(a => a.cvScore < 50);
};

// Application JSON schema
export const applicationSchema = {
  id: "number (auto-generated)",
  jobId: "number",
  candidateId: "number",
  candidateName: "string",
  jobTitle: "string",
  company: "string",
  companyId: "number",
  appliedDate: "string (YYYY-MM-DD)",
  status: "string",
  cvScore: "number (0-100)",
  canInterview: "boolean",
  resume: "string (filename)",
  coverLetter: "string (optional)",
  notes: "string (optional)",
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
};

export default {
  initApplications,
  getApplications,
  getApplicationById,
  getApplicationsByCandidate,
  getApplicationsByJob,
  getApplicationsByCompany,
  getApplicationsByStatus,
  saveApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationsByCVScore,
  getEligibleForInterview,
  getIneligibleForInterview,
  applicationSchema
};