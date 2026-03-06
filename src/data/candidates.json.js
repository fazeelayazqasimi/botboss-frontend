// ==============================================
// CANDIDATES JSON DATA MODULE
// ==============================================

const STORAGE_KEY = 'candidates';

// Default empty JSON structure
const DEFAULT_CANDIDATES = [];

// Initialize candidates storage
export const initCandidates = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CANDIDATES));
    console.log('✅ Candidates JSON initialized');
  }
};

// Get all candidates
export const getCandidates = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get candidate by ID
export const getCandidateById = (id) => {
  const candidates = getCandidates();
  return candidates.find(c => c.id === id) || null;
};

// Get candidate by user ID
export const getCandidateByUserId = (userId) => {
  const candidates = getCandidates();
  return candidates.find(c => c.userId === userId) || null;
};

// Save candidate
export const saveCandidate = (candidateData) => {
  const candidates = getCandidates();
  
  const existingIndex = candidates.findIndex(c => c.id === candidateData.id);
  
  if (existingIndex !== -1) {
    candidates[existingIndex] = {
      ...candidates[existingIndex],
      ...candidateData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates, null, 2));
    return candidates[existingIndex];
  } else {
    const newCandidate = {
      id: Date.now(),
      ...candidateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      appliedJobs: [],
      interviews: [],
      profileComplete: false,
      avatar: candidateData.avatar || `https://ui-avatars.com/api/?name=${candidateData.name?.replace(' ', '+')}&background=667eea&color=fff&size=100`
    };
    candidates.push(newCandidate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates, null, 2));
    return newCandidate;
  }
};

// Update candidate
export const updateCandidate = (id, updates) => {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === id);
  
  if (index !== -1) {
    candidates[index] = {
      ...candidates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates, null, 2));
    return candidates[index];
  }
  return null;
};

// Delete candidate
export const deleteCandidate = (id) => {
  const candidates = getCandidates();
  const filtered = candidates.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered, null, 2));
  return true;
};

// Add applied job
export const addAppliedJob = (candidateId, jobId) => {
  const candidate = getCandidateById(candidateId);
  if (candidate) {
    if (!candidate.appliedJobs) candidate.appliedJobs = [];
    if (!candidate.appliedJobs.includes(jobId)) {
      candidate.appliedJobs.push(jobId);
      updateCandidate(candidateId, { appliedJobs: candidate.appliedJobs });
    }
  }
};

export default {
  initCandidates,
  getCandidates,
  getCandidateById,
  getCandidateByUserId,
  saveCandidate,
  updateCandidate,
  deleteCandidate,
  addAppliedJob
};