const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Generic fetch with error handling
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ========== USERS API ==========
export const usersAPI = {
  // Signup new user
  signup: (userData) => apiRequest('/api/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  // Login user
  login: (credentials) => apiRequest('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  // Get user by ID
  getUser: (userId) => apiRequest(`/api/users/${userId}`),
  
  // Get user by email
  getUserByEmail: (email) => apiRequest(`/api/users/email/${email}`),
  
  // Get all users
  getAllUsers: () => apiRequest('/api/users')
};

// ========== COMPANIES API ==========
export const companiesAPI = {
  // Create company profile
  create: (companyData) => apiRequest('/api/companies', {
    method: 'POST',
    body: JSON.stringify(companyData)
  }),
  
  // Get all companies
  getAll: () => apiRequest('/api/companies'),
  
  // Get company by ID
  getById: (id) => apiRequest(`/api/companies/${id}`),
  
  // Get company by user ID
  getByUser: (userId) => apiRequest(`/api/companies/user/${userId}`),
  
  // Update company
  update: (id, data) => apiRequest(`/api/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// ========== CANDIDATES API ==========
export const candidatesAPI = {
  // Create candidate profile
  create: (candidateData) => apiRequest('/api/candidates', {
    method: 'POST',
    body: JSON.stringify(candidateData)
  }),
  
  // Get all candidates
  getAll: () => apiRequest('/api/candidates'),
  
  // Get candidate by ID
  getById: (id) => apiRequest(`/api/candidates/${id}`),
  
  // Get candidate by user ID
  getByUser: (userId) => apiRequest(`/api/candidates/user/${userId}`),
  
  // Update candidate
  update: (id, data) => apiRequest(`/api/candidates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // Apply to job
  applyToJob: (candidateId, jobId) => apiRequest(`/api/candidates/${candidateId}/apply/${jobId}`, {
    method: 'POST'
  })
};

// ========== JOBS API ==========
export const jobsAPI = {
  // Create new job
  create: (jobData) => apiRequest('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData)
  }),
  
  // Get all jobs
  getAll: () => apiRequest('/api/jobs'),
  
  // Get active jobs only
  getActive: () => apiRequest('/api/jobs/active'),
  
  // Get job by ID
  getById: (id) => apiRequest(`/api/jobs/${id}`),
  
  // Get jobs by company
  getByCompany: (companyId) => apiRequest(`/api/jobs/company/${companyId}`),
  
  // Update job
  update: (id, data) => apiRequest(`/api/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // Delete job
  delete: (id) => apiRequest(`/api/jobs/${id}`, {
    method: 'DELETE'
  })
};

// ========== INTERVIEW API (Existing) ==========
export const interviewAPI = {
  // Start interview
  start: (jobDescription) => apiRequest('/interview/start', {
    method: 'POST',
    body: JSON.stringify({ job_description: jobDescription })
  }),
  
  // Get next question
  getNextQuestion: (sessionId) => apiRequest(`/interview/next/${sessionId}`),
  
  // Submit voice answer
  submitAnswer: (sessionId, formData) => {
    return fetch(`${API_URL}/interview/voice-answer/${sessionId}`, {
      method: 'POST',
      body: formData
    }).then(res => res.json());
  },
  
  // Get report
  getReport: (sessionId) => apiRequest(`/interview/report/${sessionId}`)
};

export default {
  users: usersAPI,
  companies: companiesAPI,
  candidates: candidatesAPI,
  jobs: jobsAPI,
  interview: interviewAPI
};