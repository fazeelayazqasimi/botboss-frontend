import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { getJobs } from '../components/data/storage'; // Import API function

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', location: '', type: '', category: '', salary: '' });
  const [sortBy, setSortBy] = useState('salary-high');
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => { 
    loadJobs(); 
  }, []);
  
  useEffect(() => { 
    console.log('Filters or sort changed:', filters, sortBy);
    applyFiltersAndSort(); 
  }, [filters, jobs, sortBy]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // ✅ Call backend API
      const allJobs = await getJobs();
      console.log('All jobs from API:', allJobs);
      
      setJobs(allJobs);
      setFilteredJobs(allJobs);
      setLocations([...new Set(allJobs.map(j => j.location?.split(' ')[0] || ''))].filter(Boolean));
      setCategories([...new Set(allJobs.map(j => j.category || ''))].filter(Boolean));
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    if (!jobs.length) return;
    
    let f = [...jobs];
    
    // Apply filters
    if (filters.search) {
      f = f.filter(j => 
        j.title?.toLowerCase().includes(filters.search.toLowerCase()) || 
        j.company_name?.toLowerCase().includes(filters.search.toLowerCase()) || 
        j.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.location) f = f.filter(j => j.location?.includes(filters.location));
    if (filters.type) f = f.filter(j => j.type === filters.type);
    if (filters.category) f = f.filter(j => j.category === filters.category);
    if (filters.salary) {
      f = f.filter(j => {
        if (!j.salary) return false;
        const n = parseInt(j.salary.replace(/[^0-9]/g, ''));
        if (isNaN(n)) return false;
        switch (filters.salary) {
          case '0-10': return n < 10;
          case '10-20': return n >= 10 && n < 20;
          case '20-30': return n >= 20 && n < 30;
          case '30+': return n >= 30;
          default: return true;
        }
      });
    }
    
    // Apply sorting
    f = sortJobs(f, sortBy);
    
    console.log('Sorted jobs:', f);
    setFilteredJobs(f);
  };

  const sortJobs = (jobsArray, sortType) => {
    const sorted = [...jobsArray];
    
    switch(sortType) {
      case 'salary-high':
        return sorted.sort((a, b) => {
          const salaryA = getSalaryNumber(a.salary);
          const salaryB = getSalaryNumber(b.salary);
          return salaryB - salaryA;
        });
      
      case 'salary-low':
        return sorted.sort((a, b) => {
          const salaryA = getSalaryNumber(a.salary);
          const salaryB = getSalaryNumber(b.salary);
          return salaryA - salaryB;
        });
      
      default:
        return sorted;
    }
  };

  const getSalaryNumber = (salaryString) => {
    if (!salaryString) return 0;
    const numbers = salaryString.match(/\d+/g);
    if (!numbers) return 0;
    if (numbers.length === 1) return parseInt(numbers[0]);
    if (numbers.length >= 2) {
      return (parseInt(numbers[0]) + parseInt(numbers[1])) / 2;
    }
    return parseInt(numbers[0]) || 0;
  };

  const handleFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSortChange = e => setSortBy(e.target.value);
  const clearFilters = () => setFilters({ search: '', location: '', type: '', category: '', salary: '' });
  const refreshJobs = () => { loadJobs(); };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  if (loading) {
    return (
      <div className="jobs-root">
        <Navbar />
        <div className="jobs-loading">
          <div className="jobs-spinner" />
          <p>Loading jobs...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .jobs-root {
          font-family: 'Poppins', sans-serif;
          background: #f8f7ff;
          min-height: 100vh;
          color: #1c0b4b;
          -webkit-font-smoothing: antialiased;
        }

        .jobs-hero {
          background: #1c0b4b;
          padding: 3.5rem 5%;
          position: relative;
          overflow: hidden;
        }
        .jobs-hero::before {
          content: '';
          position: absolute; top: -150px; right: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%);
          pointer-events: none;
        }
        .jobs-hero-inner {
          max-width: 1300px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
          gap: 2rem; position: relative; z-index: 1;
        }
        .jobs-hero-tag {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #a78bfa; margin-bottom: 0.6rem;
        }
        .jobs-hero-title {
          font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
          color: white; letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 0.5rem;
        }
        .jobs-hero-sub { font-size: 0.9rem; color: #9ca3af; font-weight: 400; }
        .jobs-refresh-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600;
          color: #c4b5fd; background: rgba(124,58,237,0.15);
          border: 1.5px solid rgba(124,58,237,0.3);
          padding: 0.65rem 1.25rem; border-radius: 10px; cursor: pointer;
          transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .jobs-refresh-btn:hover { background: rgba(124,58,237,0.25); border-color: rgba(124,58,237,0.5); }
        .jobs-refresh-btn svg { width: 15px; height: 15px; stroke: currentColor; fill: none; }

        .jobs-layout {
          max-width: 1300px; margin: 0 auto;
          padding: 2rem 5%;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.75rem;
          align-items: start;
        }

        .jobs-sidebar {
          background: white;
          border: 1.5px solid #f3f4f6;
          border-radius: 16px;
          padding: 1.5rem;
          position: sticky; top: 1.5rem;
        }
        .jobs-sidebar-head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.5rem; padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }
        .jobs-sidebar-title {
          font-size: 0.95rem; font-weight: 700; color: #1c0b4b;
        }
        .jobs-filter-badge {
          font-size: 0.7rem; font-weight: 700; color: white;
          background: #7c3aed; padding: 0.15rem 0.55rem;
          border-radius: 100px;
        }
        .jobs-filter-group { margin-bottom: 1.25rem; }
        .jobs-filter-label {
          display: block; font-size: 0.75rem; font-weight: 600;
          color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }
        .jobs-filter-input, .jobs-filter-select {
          width: 100%; padding: 0.6rem 0.875rem;
          border: 1.5px solid #f3f4f6; border-radius: 10px;
          font-family: 'Poppins', sans-serif; font-size: 0.84rem;
          color: #1c0b4b; background: #fafafa; outline: none;
          transition: border-color 0.2s;
        }
        .jobs-filter-input:focus, .jobs-filter-select:focus { border-color: #7c3aed; background: white; }
        .jobs-clear-btn {
          width: 100%; padding: 0.65rem;
          background: #f5f3ff; border: 1.5px solid #ede9fe;
          border-radius: 10px; color: #7c3aed;
          font-family: 'Poppins', sans-serif; font-size: 0.82rem;
          font-weight: 600; cursor: pointer; margin-top: 0.5rem;
          transition: all 0.2s;
        }
        .jobs-clear-btn:hover { background: #ede9fe; }

        .jobs-main { display: flex; flex-direction: column; gap: 1.25rem; }
        .jobs-results-bar {
          background: white; border: 1.5px solid #f3f4f6;
          border-radius: 14px; padding: 1rem 1.25rem;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .jobs-count { font-size: 0.85rem; color: #6b7280; font-weight: 500; }
        .jobs-count strong { color: #7c3aed; font-weight: 700; }
        .jobs-sort {
          padding: 0.5rem 0.875rem;
          border: 1.5px solid #f3f4f6; border-radius: 10px;
          font-family: 'Poppins', sans-serif; font-size: 0.82rem;
          color: #4b5563; background: white; outline: none; cursor: pointer;
        }
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .jobs-empty {
          background: white; border: 1.5px solid #f3f4f6;
          border-radius: 16px; padding: 4rem 2rem;
          text-align: center;
        }
        .jobs-empty-icon {
          width: 64px; height: 64px;
          background: #f5f3ff; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .jobs-empty h3 { font-size: 1rem; font-weight: 700; color: #1c0b4b; margin-bottom: 0.4rem; }
        .jobs-empty p { font-size: 0.84rem; color: #9ca3af; line-height: 1.6; }

        .jobs-loading {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; padding: 5rem; color: #9ca3af;
          font-size: 0.9rem;
        }
        .jobs-spinner {
          width: 36px; height: 36px;
          border: 3px solid #ede9fe;
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: jobs-spin 0.8s linear infinite;
        }
        @keyframes jobs-spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .jobs-layout { grid-template-columns: 1fr; }
          .jobs-sidebar { position: static; }
          .jobs-hero-inner { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 600px) {
          .jobs-grid { grid-template-columns: 1fr; }
          .jobs-results-bar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="jobs-root">
        <Navbar />

        <section className="jobs-hero">
          <div className="jobs-hero-inner">
            <div>
              <p className="jobs-hero-tag">Opportunities</p>
              <h1 className="jobs-hero-title">Find Your Dream Job Now !</h1>
              <p className="jobs-hero-sub">Browse verified listings from top companies</p>
            </div>
            <button className="jobs-refresh-btn" onClick={refreshJobs}>
              <svg viewBox="0 0 24 24" strokeWidth="2.2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
              </svg>
              Refresh Jobs
            </button>
          </div>
        </section>

        <div className="jobs-layout">
          <aside className="jobs-sidebar">
            <div className="jobs-sidebar-head">
              <span className="jobs-sidebar-title">Filters</span>
              {activeFilterCount > 0 && (
                <span className="jobs-filter-badge">{activeFilterCount} active</span>
              )}
            </div>

            <div className="jobs-filter-group">
              <label className="jobs-filter-label">Search</label>
              <input
                type="text" name="search"
                placeholder="Job title or company"
                value={filters.search}
                onChange={handleFilterChange}
                className="jobs-filter-input"
              />
            </div>

            <div className="jobs-filter-group">
              <label className="jobs-filter-label">Location</label>
              <select name="location" value={filters.location} onChange={handleFilterChange} className="jobs-filter-select">
                <option value="">All Locations</option>
                {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div className="jobs-filter-group">
              <label className="jobs-filter-label">Job Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange} className="jobs-filter-select">
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="jobs-filter-group">
              <label className="jobs-filter-label">Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="jobs-filter-select">
                <option value="">All Categories</option>
                {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="jobs-filter-group">
              <label className="jobs-filter-label">Salary (LPA)</label>
              <select name="salary" value={filters.salary} onChange={handleFilterChange} className="jobs-filter-select">
                <option value="">Any Salary</option>
                <option value="0-10">Less than 10 LPA</option>
                <option value="10-20">10 – 20 LPA</option>
                <option value="20-30">20 – 30 LPA</option>
                <option value="30+">30+ LPA</option>
              </select>
            </div>

            <button className="jobs-clear-btn" onClick={clearFilters}>Clear All Filters</button>
          </aside>

          <main className="jobs-main">
            <div className="jobs-results-bar">
              <span className="jobs-count">
                Showing <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'job' : 'jobs'}
              </span>
              <select className="jobs-sort" value={sortBy} onChange={handleSortChange}>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
              </select>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="jobs-grid">
                {filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            ) : (
              <div className="jobs-empty">
                <div className="jobs-empty-icon">
                  <svg viewBox="0 0 24 24" strokeWidth="1.5">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                    <line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                </div>
                <h3>No jobs found</h3>
                <p>
                  {activeFilterCount > 0
                    ? 'Try adjusting your filters to see more results.'
                    : 'No jobs have been posted yet. Check back soon.'}
                </p>
              </div>
            )}
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Jobs;
