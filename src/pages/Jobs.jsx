import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    category: '',
    salary: ''
  });
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const loadJobs = () => {
    const jobsData = JSON.parse(localStorage.getItem('jobs') || '[]');
    setJobs(jobsData);
    setFilteredJobs(jobsData);
    
    const uniqueLocations = [...new Set(jobsData.map(job => job.location.split(' ')[0]))];
    const uniqueCategories = [...new Set(jobsData.map(job => job.category))];
    setLocations(uniqueLocations);
    setCategories(uniqueCategories);
    
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.includes(filters.location)
      );
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    if (filters.salary) {
      filtered = filtered.filter(job => {
        const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''));
        switch(filters.salary) {
          case '0-10': return salaryNum < 10;
          case '10-20': return salaryNum >= 10 && salaryNum < 20;
          case '20-30': return salaryNum >= 20 && salaryNum < 30;
          case '30+': return salaryNum >= 30;
          default: return true;
        }
      });
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      category: '',
      salary: ''
    });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8f9fa'
    },
    main: {
      flex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 5%',
      width: '100%'
    },
    hero: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '3rem 5%',
      textAlign: 'center',
      marginBottom: '2rem',
      borderRadius: '10px'
    },
    heroTitle: {
      fontSize: '2.5rem',
      marginBottom: '1rem'
    },
    heroText: {
      fontSize: '1.2rem',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto'
    },
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '2rem'
    },
    sidebar: {
      background: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      height: 'fit-content'
    },
    sidebarTitle: {
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #667eea'
    },
    filterGroup: {
      marginBottom: '1.5rem'
    },
    filterLabel: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#4b5563',
      marginBottom: '0.5rem'
    },
    filterInput: {
      width: '100%',
      padding: '0.6rem',
      border: '1px solid #e5e7eb',
      borderRadius: '5px',
      fontSize: '0.95rem',
      outline: 'none'
    },
    filterSelect: {
      width: '100%',
      padding: '0.6rem',
      border: '1px solid #e5e7eb',
      borderRadius: '5px',
      fontSize: '0.95rem',
      outline: 'none',
      background: 'white'
    },
    clearBtn: {
      width: '100%',
      padding: '0.6rem',
      background: '#f3f4f6',
      border: 'none',
      borderRadius: '5px',
      color: '#4b5563',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      marginTop: '1rem'
    },
    mainContent: {
      background: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    resultsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #e5e7eb'
    },
    resultsCount: {
      color: '#4b5563',
      fontSize: '0.95rem'
    },
    resultsCountStrong: {
      color: '#667eea',
      fontWeight: 600
    },
    sortSelect: {
      padding: '0.4rem',
      border: '1px solid #e5e7eb',
      borderRadius: '5px',
      fontSize: '0.9rem',
      outline: 'none'
    },
    jobsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    noJobs: {
      textAlign: 'center',
      padding: '3rem',
      color: '#666'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.loading}>Loading jobs...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Dream Job</h1>
        <p style={styles.heroText}>Browse through thousands of job opportunities from top companies</p>
      </div>

      <div style={styles.content}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Filters</h3>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Search</label>
            <input
              type="text"
              name="search"
              placeholder="Job title or company"
              value={filters.search}
              onChange={handleFilterChange}
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="">All Locations</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Job Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Salary (LPA)</label>
            <select
              name="salary"
              value={filters.salary}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="">Any Salary</option>
              <option value="0-10">Less than 10 LPA</option>
              <option value="10-20">10 - 20 LPA</option>
              <option value="20-30">20 - 30 LPA</option>
              <option value="30+">30+ LPA</option>
            </select>
          </div>

          <button onClick={clearFilters} style={styles.clearBtn}>
            Clear All Filters
          </button>
        </aside>

        <main style={styles.mainContent}>
          <div style={styles.resultsHeader}>
            <div style={styles.resultsCount}>
              Showing <span style={styles.resultsCountStrong}>{filteredJobs.length}</span> jobs
            </div>
            <select style={styles.sortSelect}>
              <option>Most Relevant</option>
              <option>Newest First</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>

          {filteredJobs.length > 0 ? (
            <div style={styles.jobsGrid}>
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div style={styles.noJobs}>
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;