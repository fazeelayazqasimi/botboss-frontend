// ==============================================
// DATA STORAGE LAYER - Connected to Backend API
// ==============================================

const API = "https://fazeelayazqasimi-botboss-updated-backend.hf.space";

const post = async (url, data) => {
  const res = await fetch(`${API}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Error");
  return res.json();
};

const get = async (url) => {
  const res = await fetch(`${API}${url}`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

const patch = async (url, data) => {
  const res = await fetch(`${API}${url}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

const del = async (url) => {
  const res = await fetch(`${API}${url}`, { method: "DELETE" });
  return res.json();
};

// ==============================================
// AUTH / USERS
// ==============================================

export const saveUser = async (userData) => {
  const data = await post("/auth/signup", userData);
  return data.user;
};

export const findUserByEmail = async (email) => {
  // Backend signup khud handle karta hai duplicate check
  return null;
};

export const findUserByCredentials = async (email, password, type) => {
  try {
    const data = await post("/auth/login", { email, password, type });
    return data.user;
  } catch {
    return null;
  }
};

export const getUserById = async (user_id) => {
  return get(`/auth/user/${user_id}`);
};

// ==============================================
// COMPANIES
// ==============================================

export const saveCompany = async (companyData) => {
  return post("/companies/", companyData);
};

export const getCompanyByUserId = async (userId) => {
  return get(`/companies/user/${userId}`);
};

export const getCompanyById = async (id) => {
  return get(`/companies/${id}`);
};

export const updateCompany = async (id, data) => {
  return patch(`/companies/${id}`, data);
};

// ==============================================
// CANDIDATES
// ==============================================

export const saveCandidate = async (candidateData) => {
  return post("/candidates/", candidateData);
};

export const getCandidateByUserId = async (userId) => {
  return get(`/candidates/user/${userId}`);
};

export const updateCandidate = async (id, data) => {
  return patch(`/candidates/${id}`, data);
};

// ==============================================
// JOBS
// ==============================================

export const getJobs = async () => {
  return get("/jobs/");
};

export const getJobById = async (id) => {
  return get(`/jobs/${id}`);
};

export const getJobsByCompany = async (companyId) => {
  return get(`/jobs/company/${companyId}`);
};

export const saveJob = async (jobData) => {
  return post("/jobs/", jobData);
};

export const updateJob = async (jobId, updates) => {
  return patch(`/jobs/${jobId}`, updates);
};

export const deleteJob = async (jobId) => {
  return del(`/jobs/${jobId}`);
};

// ==============================================
// APPLICATIONS
// ==============================================

export const getApplicationsByCandidate = async (userId) => {
  return get(`/applications/user/${userId}`);
};

export const getApplicationsByJob = async (jobId) => {
  return get(`/applications/job/${jobId}`);
};

export const getApplicationsByCompany = async (companyId) => {
  return get(`/applications/company/${companyId}`);
};

export const saveApplication = async (formData) => {
  // formData = FormData object (resume upload ke liye)
  const res = await fetch(`${API}/applications/`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Application failed");
  return res.json();
};

export const updateApplicationStatus = async (appId, status) => {
  return patch(`/applications/${appId}/status`, { status });
};

// ==============================================
// INTERVIEWS (Backend se)
// ==============================================

export const scheduleInterview = async (interviewData) => {
  return post("/interview/start", interviewData);
};

// ==============================================
// STATS
// ==============================================

export const getStats = async () => {
  const [jobs, applications] = await Promise.all([
    getJobs(),
    get("/applications/")
  ]);
  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === "active").length,
    totalApplications: applications.length,
    placements: applications.filter(a => a.status === "hired").length
  };
};

export const initializeStorage = () => {
  console.log('✅ API Storage ready');
};

export const clearAllData = () => {
  console.log('Backend data clear nahi hoti frontend se');
};

export default {
  initializeStorage, clearAllData,
  saveUser, findUserByEmail, findUserByCredentials, getUserById,
  saveCompany, getCompanyByUserId, getCompanyById, updateCompany,
  saveCandidate, getCandidateByUserId, updateCandidate,
  getJobs, getJobById, getJobsByCompany, saveJob, updateJob, deleteJob,
  getApplicationsByCandidate, getApplicationsByJob, getApplicationsByCompany,
  saveApplication, updateApplicationStatus,
  scheduleInterview, getStats
};
