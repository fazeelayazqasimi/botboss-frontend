// ==============================================
// MAIN DATA EXPORT - All Modules
// ==============================================

import * as users from './users.json.js';
import * as companies from './companies.json.js';
import * as candidates from './candidates.json.js';
import * as jobs from './jobs.json.js';
import * as applications from './applications.json.js';

// Initialize all storage
export const initializeAllData = () => {
  users.initUsers();
  companies.initCompanies();
  candidates.initCandidates();
  jobs.initJobs();
  applications.initApplications();
  console.log('✅ All JSON data initialized');
};

// Clear all data
export const clearAllData = () => {
  if (window.confirm('Delete ALL data?')) {
    localStorage.clear();
    initializeAllData();
    console.log('🗑️ All data cleared');
    window.location.reload();
  }
};

// Get all stats
export const getAllStats = () => {
  return {
    users: users.getUsers().length,
    companies: companies.getCompanies().length,
    candidates: candidates.getCandidates().length,
    jobs: jobs.getJobs().length,
    applications: applications.getApplications().length,
    eligibleForInterview: applications.getEligibleForInterview().length
  };
};

// Export all modules
export {
  users,
  companies,
  candidates,
  jobs,
  applications
};

export default {
  initializeAllData,
  clearAllData,
  getAllStats,
  users,
  companies,
  candidates,
  jobs,
  applications
};