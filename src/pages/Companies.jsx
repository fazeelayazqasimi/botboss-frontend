import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CompanyCard from '../components/CompanyCard';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    location: ''
  });
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, companies]);

  const loadCompanies = () => {
    const companiesData = JSON.parse(localStorage.getItem('companies') || '[]');
    setCompanies(companiesData);
    setFilteredCompanies(companiesData);
    
    // Extract unique industries and locations
    const uniqueIndustries = [...new Set(companiesData.map(c => c.industry))];
    const uniqueLocations = [...new Set(companiesData.map(c => c.location))];
    setIndustries(uniqueIndustries);
    setLocations(uniqueLocations);
    
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...companies];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        company.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Industry filter
    if (filters.industry) {
      filtered = filtered.filter(company => company.industry === filters.industry);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(company => company.location === filters.location);
    }

    setFilteredCompanies(filtered);
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
      industry: '',
      location: ''
    });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    main: {
      flex: 1,
      background: '#f8f9fa'
    },
    hero: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '3rem 5%',
      textAlign: 'center'
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
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 5%'
    },
    filtersSection: {
      background: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    filtersTitle: {
      fontSize: '1.1rem',
      color: '#333',
      marginBottom: '1rem'
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      alignItems: 'end'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.3rem'
    },
    filterLabel: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#4b5563'
    },
    filterInput: {
      padding: '0.6rem',
      border: '1px solid #e5e7eb',
      borderRadius: '5px',
      fontSize: '0.95rem',
      outline: 'none',
      ':focus': {
        borderColor: '#667eea'
      }
    },
    filterSelect: {
      padding: '0.6rem',
      border: '1px solid #e5e7eb',
      borderRadius: '5px',
      fontSize: '0.95rem',
      outline: 'none',
      background: 'white'
    },
    clearBtn: {
      padding: '0.6rem 1rem',
      background: '#f3f4f6',
      border: 'none',
      borderRadius: '5px',
      color: '#4b5563',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'all 0.3s',
      height: 'fit-content',
      ':hover': {
        background: '#e5e7eb'
      }
    },
    resultsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    resultsCount: {
      color: '#4b5563',
      fontSize: '0.95rem'
    },
    resultsCountStrong: {
      color: '#667eea',
      fontWeight: 600
    },
    companiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem'
    },
    noCompanies: {
      textAlign: 'center',
      padding: '3rem',
      color: '#666',
      background: 'white',
      borderRadius: '10px'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#667eea'
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#666',
      fontSize: '0.95rem'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.loading}>Loading companies...</div>
        <Footer />
      </div>
    );
  }

  // Calculate stats
  const totalOpenings = companies.reduce((sum, c) => sum + c.openPositions, 0);
  const avgRating = (companies.reduce((sum, c) => sum + c.rating, 0) / companies.length).toFixed(1);

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Top Companies Hiring Now</h1>
        <p style={styles.heroText}>Discover amazing companies and find your perfect workplace</p>
      </div>

      <div style={styles.content}>
        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{companies.length}</div>
            <div style={styles.statLabel}>Total Companies</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalOpenings}</div>
            <div style={styles.statLabel}>Open Positions</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{avgRating}</div>
            <div style={styles.statLabel}>Average Rating</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{locations.length}</div>
            <div style={styles.statLabel}>Locations</div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersSection}>
          <h3 style={styles.filtersTitle}>Filter Companies</h3>
          <div style={styles.filtersGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Search</label>
              <input
                type="text"
                name="search"
                placeholder="Company name"
                value={filters.search}
                onChange={handleFilterChange}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Industry</label>
              <select
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
                style={styles.filterSelect}
              >
                <option value="">All Industries</option>
                {industries.map((ind, idx) => (
                  <option key={idx} value={ind}>{ind}</option>
                ))}
              </select>
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

            <button onClick={clearFilters} style={styles.clearBtn}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          <div style={styles.resultsHeader}>
            <div style={styles.resultsCount}>
              Showing <span style={styles.resultsCountStrong}>{filteredCompanies.length}</span> companies
            </div>
          </div>

          {filteredCompanies.length > 0 ? (
            <div style={styles.companiesGrid}>
              {filteredCompanies.map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div style={styles.noCompanies}>
              <h3>No companies found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Companies;