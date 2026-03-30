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
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(text || "Server error"); }
  if (!res.ok) throw new Error(json.detail || "Error");
  return json;
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
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Patch failed");
  }
  return res.json();
};

const del = async (url) => {
  const res = await fetch(`${API}${url}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
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
// APPLICATIONS - FIXED VERSION
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
  const res = await fetch(`${API}/applications/`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Application failed");
  return res.json();
};

// ✅ FIXED - Backend expects status as query parameter, NOT in request body
export const updateApplicationStatus = async (appId, status) => {
  try {
    console.log(`📤 Updating application ${appId} to status: ${status}`);
    
    // Important: Backend reads status from query parameter ?status=value
    const response = await fetch(`${API}/applications/${appId}/status?status=${status}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json" 
      }
    });
    
    console.log(`📥 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Server error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to update status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Status updated successfully for ${appId}`);
    return data;
    
  } catch (error) {
    console.error(`❌ Failed to update status for ${appId}:`, error.message);
    throw error;
  }
};

// ==============================================
// INTERVIEWS
// ==============================================

export const scheduleInterview = async (interviewData) => {
  return post("/interview/start", interviewData);
};

// ==============================================
// STATS
// ==============================================

export const getStats = async () => {
  const jobs = await getJobs();
  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === "active").length,
    totalApplications: 0,
    placements: 0
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
