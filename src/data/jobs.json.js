// ==============================================
// JOBS JSON DATA MODULE
// ==============================================

const STORAGE_KEY = 'jobs';

// Default empty JSON structure
const DEFAULT_JOBS = [];

// Initialize jobs storage
export const initJobs = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_JOBS));
    console.log('✅ Jobs JSON initialized');
  }
};

// Get all jobs
export const getJobs = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get job by ID
export const getJobById = (id) => {
  const jobs = getJobs();
  return jobs.find(j => j.id === id) || null;
};

// Get jobs by company
export const getJobsByCompany = (companyId) => {
  const jobs = getJobs();
  return jobs.filter(j => j.companyId === companyId);
};

// Get active jobs
export const getActiveJobs = () => {
  const jobs = getJobs();
  return jobs.filter(j => j.active === true);
};

// Get jobs by category
export const getJobsByCategory = (category) => {
  const jobs = getJobs();
  return jobs.filter(j => j.category === category);
};

// Save job
export const saveJob = (jobData) => {
  const jobs = getJobs();
  
  const newJob = {
    id: Date.now(),
    ...jobData,
    postedDate: new Date().toISOString().split('T')[0],
    applicants: 0,
    active: true,
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  jobs.push(newJob);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs, null, 2));
  console.log('✅ New job posted:', newJob.title);
  
  return newJob;
};

// Update job
export const updateJob = (id, updates) => {
  const jobs = getJobs();
  const index = jobs.findIndex(j => j.id === id);
  
  if (index !== -1) {
    jobs[index] = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs, null, 2));
    console.log('✅ Job updated:', id);
    return jobs[index];
  }
  return null;
};

// Delete job
export const deleteJob = (id) => {
  const jobs = getJobs();
  const filtered = jobs.filter(j => j.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered, null, 2));
  console.log('✅ Job deleted:', id);
  return true;
};

// Increment applicants count
export const incrementApplicants = (jobId) => {
  const job = getJobById(jobId);
  if (job) {
    job.applicants = (job.applicants || 0) + 1;
    updateJob(jobId, { applicants: job.applicants });
  }
};

/**
 * Extract keywords from job description
 */
export const extractJobKeywords = (jobDescription) => {
  if (!jobDescription) return [];
  
  const text = jobDescription.toLowerCase();
  const commonKeywords = [
    // Programming Languages
    'javascript', 'python', 'java', 'c#', 'c++', 'php', 'ruby', 'swift', 'kotlin',
    'typescript', 'go', 'rust', 'scala', 'perl', 'r',
    
    // Frameworks & Libraries
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
    'laravel', 'rails', 'asp.net', 'jquery', 'bootstrap', 'tailwind',
    
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'firebase',
    'dynamodb', 'cassandra', 'elasticsearch',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github',
    'gitlab', 'ci/cd', 'terraform', 'ansible', 'prometheus', 'grafana',
    
    // Soft Skills
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'critical thinking', 'time management', 'adaptability', 'creativity',
    'project management', 'agile', 'scrum',
    
    // Design
    'figma', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux', 'wireframing',
    'prototyping', 'user research',
    
    // Data Science
    'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch', 'pandas',
    'numpy', 'scikit-learn', 'nlp', 'computer vision',
    
    // Business
    'marketing', 'sales', 'seo', 'content writing', 'social media', 'analytics',
    'business development', 'customer service'
  ];
  
  return commonKeywords.filter(keyword => text.includes(keyword));
};

/**
 * Extract keywords from CV text
 */
export const extractCVKeywords = (cvText) => {
  if (!cvText) return [];
  
  const text = cvText.toLowerCase();
  const commonKeywords = [
    // Programming Languages
    'javascript', 'python', 'java', 'c#', 'c++', 'php', 'ruby', 'swift', 'kotlin',
    'typescript', 'go', 'rust', 'scala', 'perl', 'r',
    
    // Frameworks & Libraries
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
    'laravel', 'rails', 'asp.net', 'jquery', 'bootstrap', 'tailwind',
    
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'firebase',
    'dynamodb', 'cassandra', 'elasticsearch',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github',
    'gitlab', 'ci/cd', 'terraform', 'ansible', 'prometheus', 'grafana',
    
    // Soft Skills
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'critical thinking', 'time management', 'adaptability', 'creativity',
    'project management', 'agile', 'scrum',
    
    // Design
    'figma', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux', 'wireframing',
    'prototyping', 'user research',
    
    // Data Science
    'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch', 'pandas',
    'numpy', 'scikit-learn', 'nlp', 'computer vision',
    
    // Business
    'marketing', 'sales', 'seo', 'content writing', 'social media', 'analytics',
    'business development', 'customer service'
  ];
  
  return commonKeywords.filter(keyword => text.includes(keyword));
};

/**
 * Calculate match score between CV and job
 */
export const calculateCVJobMatch = (cvText, jobDescription) => {
  if (!cvText || !jobDescription) return 0;
  
  const jobKeywords = extractJobKeywords(jobDescription);
  const cvKeywords = extractCVKeywords(cvText);
  
  if (jobKeywords.length === 0) return 50; // Default score if no keywords found
  
  // Count matching keywords
  const matches = jobKeywords.filter(keyword => 
    cvKeywords.includes(keyword)
  ).length;
  
  // Calculate percentage
  const score = Math.round((matches / jobKeywords.length) * 100);
  
  return Math.min(score, 100); // Cap at 100%
};

/**
 * Parse CV file and extract text (simplified version)
 */
export const parseCVFile = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // This is a simplified version. In production, you'd parse PDF/DOCX properly
      // For now, we'll just return the filename as a placeholder
      resolve(file.name + " " + file.type);
    };
    reader.readAsText(file);
  });
};

// Job JSON schema
export const jobSchema = {
  id: "number (auto-generated)",
  companyId: "number (reference to companies.id)",
  title: "string",
  company: "string",
  location: "string",
  salary: "string",
  type: "string (Full-time/Part-time/Contract)",
  description: "string",
  requirements: "array",
  postedDate: "string (YYYY-MM-DD)",
  deadline: "string (YYYY-MM-DD)",
  applicants: "number",
  companyLogo: "string (URL)",
  active: "boolean",
  category: "string",
  status: "string",
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
};

export default {
  initJobs,
  getJobs,
  getJobById,
  getJobsByCompany,
  getActiveJobs,
  getJobsByCategory,
  saveJob,
  updateJob,
  deleteJob,
  incrementApplicants,
  extractJobKeywords,
  extractCVKeywords,
  calculateCVJobMatch,
  parseCVFile,
  jobSchema
};