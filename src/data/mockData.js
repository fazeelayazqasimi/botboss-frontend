// Mock data for localStorage

// Jobs Data
export const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp India",
    companyId: 1,
    location: "Bangalore (Remote)",
    salary: "₹25-35 LPA",
    type: "Full-time",
    description: "We are looking for an experienced React developer with 5+ years of experience. You will be responsible for building responsive web applications and mentoring junior developers.",
    requirements: ["React", "Redux", "JavaScript", "TypeScript", "CSS"],
    postedDate: "2026-02-28",
    deadline: "2026-03-30",
    applicants: 45,
    companyLogo: "https://via.placeholder.com/50",
    active: true,
    category: "Development"
  },
  {
    id: 2,
    title: "Backend Python Developer",
    company: "AI Solutions",
    companyId: 2,
    location: "Mumbai (Hybrid)",
    salary: "₹20-30 LPA",
    type: "Full-time",
    description: "Python developer with FastAPI experience for AI-based projects. You will design and implement scalable APIs and work with machine learning teams.",
    requirements: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    postedDate: "2026-02-27",
    deadline: "2026-03-28",
    applicants: 32,
    companyLogo: "https://via.placeholder.com/50",
    active: true,
    category: "Development"
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartupHub",
    companyId: 3,
    location: "Delhi (On-site)",
    salary: "₹18-25 LPA",
    type: "Full-time",
    description: "MERN stack developer for exciting new project. You will work on both frontend and backend development.",
    requirements: ["MongoDB", "Express", "React", "Node.js", "JavaScript"],
    postedDate: "2026-02-26",
    deadline: "2026-03-25",
    applicants: 28,
    companyLogo: "https://via.placeholder.com/50",
    active: true,
    category: "Development"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech",
    companyId: 4,
    location: "Pune (Remote)",
    salary: "₹22-32 LPA",
    type: "Full-time",
    description: "AWS and Kubernetes expert needed. You will manage cloud infrastructure and CI/CD pipelines.",
    requirements: ["AWS", "Kubernetes", "Docker", "Jenkins", "Terraform"],
    postedDate: "2026-02-25",
    deadline: "2026-03-24",
    applicants: 19,
    companyLogo: "https://via.placeholder.com/50",
    active: true,
    category: "DevOps"
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "DesignStudio",
    companyId: 5,
    location: "Hyderabad",
    salary: "₹15-22 LPA",
    type: "Full-time",
    description: "Creative designer for product design. You will create user flows, wireframes, and prototypes.",
    requirements: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    postedDate: "2026-02-24",
    deadline: "2026-03-23",
    applicants: 37,
    companyLogo: "https://via.placeholder.com/50",
    active: true,
    category: "Design"
  },
  {
    id: 6,
    title: "AI/ML Engineer",
    company: "DataScience Ltd",
    companyId: 6,
    location: "Bangalore",
    salary: "₹30-45 LPA",
    type: "Full-time",
    description: "Machine learning expert for healthcare AI. You will develop and deploy ML models.",
    requirements: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    postedDate: "2026-02-23",
    deadline: "2026-03-22",
    applicants: 23,
    companyLogo: "https://via.placeholder.com/50",
    active: true,
    category: "AI/ML"
  },
  {
    id: 7,
    title: "Product Manager",
    company: "TechCorp India",
    companyId: 1,
    location: "Bangalore",
    salary: "₹30-40 LPA",
    type: "Full-time",
    description: "Experienced product manager to lead our flagship product.",
    requirements: ["Product Strategy", "Agile", "User Stories", "Market Research"],
    postedDate: "2026-02-22",
    deadline: "2026-03-21",
    applicants: 15,
    companyLogo: "https://via.placeholder.com/50",
    active: true,
    category: "Management"
  },
  {
    id: 8,
    title: "Sales Executive",
    company: "AI Solutions",
    companyId: 2,
    location: "Mumbai",
    salary: "₹10-15 LPA + Commission",
    type: "Full-time",
    description: "B2B sales executive for AI solutions.",
    requirements: ["B2B Sales", "Communication", "Negotiation", "CRM"],
    postedDate: "2026-02-21",
    deadline: "2026-03-20",
    applicants: 42,
    companyLogo: "https://via.placeholder.com/50",
    active: true,
    category: "Sales"
  }
];

// Companies Data
export const mockCompanies = [
  {
    id: 1,
    name: "TechCorp India",
    industry: "Information Technology",
    openPositions: 5,
    totalEmployees: "500-1000",
    location: "Bangalore",
    rating: 4.5,
    logo: "https://via.placeholder.com/100",
    description: "Leading IT solutions provider with clients worldwide.",
    founded: "2010",
    website: "https://techcorp.in",
    activeJobs: [1, 7]
  },
  {
    id: 2,
    name: "AI Solutions",
    industry: "Artificial Intelligence",
    openPositions: 3,
    totalEmployees: "100-250",
    location: "Mumbai",
    rating: 4.3,
    logo: "https://via.placeholder.com/100",
    description: "Innovative AI startup working on cutting-edge solutions.",
    founded: "2018",
    website: "https://aisolutions.in",
    activeJobs: [2, 8]
  },
  {
    id: 3,
    name: "StartupHub",
    industry: "Technology",
    openPositions: 8,
    totalEmployees: "50-100",
    location: "Delhi",
    rating: 4.0,
    logo: "https://via.placeholder.com/100",
    description: "Fast-growing startup ecosystem builder.",
    founded: "2020",
    website: "https://startuphub.in",
    activeJobs: [3]
  },
  {
    id: 4,
    name: "CloudTech",
    industry: "Cloud Computing",
    openPositions: 4,
    totalEmployees: "200-500",
    location: "Pune",
    rating: 4.2,
    logo: "https://via.placeholder.com/100",
    description: "Cloud infrastructure and DevOps specialists.",
    founded: "2015",
    website: "https://cloudtech.in",
    activeJobs: [4]
  },
  {
    id: 5,
    name: "DesignStudio",
    industry: "Design",
    openPositions: 2,
    totalEmployees: "20-50",
    location: "Hyderabad",
    rating: 4.7,
    logo: "https://via.placeholder.com/100",
    description: "Creative design agency for digital products.",
    founded: "2019",
    website: "https://designstudio.in",
    activeJobs: [5]
  },
  {
    id: 6,
    name: "DataScience Ltd",
    industry: "Data Science",
    openPositions: 6,
    totalEmployees: "150-300",
    location: "Bangalore",
    rating: 4.4,
    logo: "https://via.placeholder.com/100",
    description: "Data science and analytics company.",
    founded: "2017",
    website: "https://datascience.in",
    activeJobs: [6]
  }
];

// Candidates Data
export const mockCandidates = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "Frontend Developer",
    experience: "4 years",
    location: "Bangalore",
    skills: ["React", "JavaScript", "CSS", "Redux"],
    availability: "Immediate",
    expectedSalary: "₹18 LPA",
    profileComplete: true,
    avatar: "https://via.placeholder.com/50",
    appliedJobs: [1, 3],
    interviews: [1]
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    role: "Python Developer",
    experience: "3 years",
    location: "Mumbai",
    skills: ["Python", "Django", "SQL", "FastAPI"],
    availability: "15 days",
    expectedSalary: "₹15 LPA",
    profileComplete: true,
    avatar: "https://via.placeholder.com/50",
    appliedJobs: [2, 6],
    interviews: [2]
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    role: "Full Stack Developer",
    experience: "5 years",
    location: "Delhi",
    skills: ["MERN", "TypeScript", "AWS", "Next.js"],
    availability: "30 days",
    expectedSalary: "₹25 LPA",
    profileComplete: true,
    avatar: "https://via.placeholder.com/50",
    appliedJobs: [3, 4],
    interviews: []
  },
  {
    id: 4,
    name: "Neha Singh",
    email: "neha@example.com",
    role: "UI/UX Designer",
    experience: "2 years",
    location: "Pune",
    skills: ["Figma", "Adobe XD", "Wireframing", "User Research"],
    availability: "Immediate",
    expectedSalary: "₹12 LPA",
    profileComplete: true,
    avatar: "https://via.placeholder.com/50",
    appliedJobs: [5],
    interviews: [3]
  },
  {
    id: 5,
    name: "Vikram Mehta",
    email: "vikram@example.com",
    role: "DevOps Engineer",
    experience: "6 years",
    location: "Hyderabad",
    skills: ["AWS", "Kubernetes", "Terraform", "Jenkins"],
    availability: "45 days",
    expectedSalary: "₹28 LPA",
    profileComplete: true,
    avatar: "https://via.placeholder.com/50",
    appliedJobs: [4, 7],
    interviews: []
  },
  {
    id: 6,
    name: "Sneha Reddy",
    email: "sneha@example.com",
    role: "Data Scientist",
    experience: "3 years",
    location: "Bangalore",
    skills: ["Python", "ML", "SQL", "TensorFlow"],
    availability: "Immediate",
    expectedSalary: "₹20 LPA",
    profileComplete: true,
    avatar: "https://via.placeholder.com/50",
    appliedJobs: [6, 8],
    interviews: [4]
  }
];

// Applications Data
export const mockApplications = [
  {
    id: 1,
    jobId: 1,
    candidateId: 1,
    candidateName: "Rahul Sharma",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp India",
    appliedDate: "2026-03-01",
    status: "Interview Scheduled",
    interviewDate: "2026-03-10",
    resume: "resume1.pdf",
    score: 85
  },
  {
    id: 2,
    jobId: 2,
    candidateId: 2,
    candidateName: "Priya Patel",
    jobTitle: "Backend Python Developer",
    company: "AI Solutions",
    appliedDate: "2026-02-28",
    status: "Under Review",
    interviewDate: null,
    resume: "resume2.pdf",
    score: null
  },
  {
    id: 3,
    jobId: 3,
    candidateId: 1,
    candidateName: "Rahul Sharma",
    jobTitle: "Full Stack Developer",
    company: "StartupHub",
    appliedDate: "2026-02-27",
    status: "Interview Completed",
    interviewDate: "2026-03-05",
    resume: "resume1.pdf",
    score: 78
  },
  {
    id: 4,
    jobId: 4,
    candidateId: 3,
    candidateName: "Amit Kumar",
    jobTitle: "DevOps Engineer",
    company: "CloudTech",
    appliedDate: "2026-02-26",
    status: "Applied",
    interviewDate: null,
    resume: "resume3.pdf",
    score: null
  },
  {
    id: 5,
    jobId: 5,
    candidateId: 4,
    candidateName: "Neha Singh",
    jobTitle: "UI/UX Designer",
    company: "DesignStudio",
    appliedDate: "2026-02-25",
    status: "Interview Scheduled",
    interviewDate: "2026-03-12",
    resume: "resume4.pdf",
    score: 92
  },
  {
    id: 6,
    jobId: 6,
    candidateId: 6,
    candidateName: "Sneha Reddy",
    jobTitle: "AI/ML Engineer",
    company: "DataScience Ltd",
    appliedDate: "2026-02-24",
    status: "Shortlisted",
    interviewDate: "2026-03-15",
    resume: "resume6.pdf",
    score: 88
  }
];

// Interviews Data
export const mockInterviews = [
  {
    id: 1,
    applicationId: 1,
    candidateId: 1,
    jobId: 1,
    scheduledDate: "2026-03-10T10:00:00",
    status: "Scheduled",
    feedback: null,
    score: null,
    report: null
  },
  {
    id: 2,
    applicationId: 3,
    candidateId: 1,
    jobId: 3,
    scheduledDate: "2026-03-05T14:00:00",
    status: "Completed",
    feedback: "Good technical skills, needs improvement in communication",
    score: 78,
    report: {
      overallScore: 78,
      eyeContact: 85,
      confidence: 70,
      clarity: 80,
      questionScores: [
        { question: "Explain React lifecycle", score: 85, feedback: "Good explanation" },
        { question: "What is useState?", score: 90, feedback: "Excellent" },
        { question: "Explain virtual DOM", score: 75, feedback: "Could be more detailed" },
        { question: "How do you handle state management?", score: 70, feedback: "Good but needs more examples" },
        { question: "What are hooks?", score: 70, feedback: "Satisfactory" }
      ]
    }
  }
];

// Users Data
export const mockUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "password123",
    type: "candidate",
    profileId: 1
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    password: "password123",
    type: "candidate",
    profileId: 2
  },
  {
    id: 3,
    name: "TechCorp HR",
    email: "hr@techcorp.in",
    password: "company123",
    type: "company",
    companyId: 1
  },
  {
    id: 4,
    name: "AI Solutions HR",
    email: "hr@aisolutions.in",
    password: "company123",
    type: "company",
    companyId: 2
  }
];

// Initialize localStorage with mock data
export const initializeLocalStorage = () => {
  if (!localStorage.getItem('jobs')) {
    localStorage.setItem('jobs', JSON.stringify(mockJobs));
  }
  if (!localStorage.getItem('companies')) {
    localStorage.setItem('companies', JSON.stringify(mockCompanies));
  }
  if (!localStorage.getItem('candidates')) {
    localStorage.setItem('candidates', JSON.stringify(mockCandidates));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify(mockApplications));
  }
  if (!localStorage.getItem('interviews')) {
    localStorage.setItem('interviews', JSON.stringify(mockInterviews));
  }
};

// Get stats for landing page
export const getStats = () => {
  const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  const companies = JSON.parse(localStorage.getItem('companies') || '[]');
  const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
  
  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.active).length,
    totalCompanies: companies.length,
    activeCandidates: candidates.length,
    placements: Math.floor(jobs.length * 0.7),
    cities: [...new Set(jobs.map(job => job.location.split(' ')[0]))].length
  };
};