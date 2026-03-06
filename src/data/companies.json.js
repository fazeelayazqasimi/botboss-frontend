// ==============================================
// COMPANIES JSON DATA MODULE
// ==============================================

const STORAGE_KEY = 'companies';

// Default empty JSON structure
const DEFAULT_COMPANIES = [];

// Initialize companies storage
export const initCompanies = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPANIES));
    console.log('✅ Companies JSON initialized');
  }
};

// Get all companies
export const getCompanies = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get company by ID
export const getCompanyById = (id) => {
  const companies = getCompanies();
  return companies.find(c => c.id === id) || null;
};

// Get company by user ID
export const getCompanyByUserId = (userId) => {
  const companies = getCompanies();
  return companies.find(c => c.userId === userId) || null;
};

// Save company
export const saveCompany = (companyData) => {
  const companies = getCompanies();
  
  const existingIndex = companies.findIndex(c => c.id === companyData.id);
  
  if (existingIndex !== -1) {
    companies[existingIndex] = {
      ...companies[existingIndex],
      ...companyData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies, null, 2));
    return companies[existingIndex];
  } else {
    const newCompany = {
      id: Date.now(),
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      openPositions: 0,
      activeJobs: [],
      rating: 0
    };
    companies.push(newCompany);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies, null, 2));
    return newCompany;
  }
};

// Update company
export const updateCompany = (id, updates) => {
  const companies = getCompanies();
  const index = companies.findIndex(c => c.id === id);
  
  if (index !== -1) {
    companies[index] = {
      ...companies[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies, null, 2));
    return companies[index];
  }
  return null;
};

// Delete company
export const deleteCompany = (id) => {
  const companies = getCompanies();
  const filtered = companies.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered, null, 2));
  return true;
};

export default {
  initCompanies,
  getCompanies,
  getCompanyById,
  getCompanyByUserId,
  saveCompany,
  updateCompany,
  deleteCompany
};