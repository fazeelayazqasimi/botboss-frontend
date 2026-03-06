import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CompanyCard from '../components/CompanyCard';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', industry: '', location: '' });
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => { loadCompanies(); }, []);
  useEffect(() => { applyFilters(); }, [filters, companies]);

  const loadCompanies = () => {
    const data = JSON.parse(localStorage.getItem('companies') || '[]');
    setCompanies(data);
    setFilteredCompanies(data);
    setIndustries([...new Set(data.map(c => c.industry).filter(Boolean))]);
    setLocations([...new Set(data.map(c => c.location).filter(Boolean))]);
    setLoading(false);
  };

  const applyFilters = () => {
    let f = [...companies];
    if (filters.search) f = f.filter(c => c.name.toLowerCase().includes(filters.search.toLowerCase()) || c.description?.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.industry) f = f.filter(c => c.industry === filters.industry);
    if (filters.location) f = f.filter(c => c.location === filters.location);
    setFilteredCompanies(f);
  };

  const handleFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });
  const clearFilters = () => setFilters({ search: '', industry: '', location: '' });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const totalOpenings = companies.reduce((sum, c) => sum + (c.openPositions || 0), 0);
  const avgRating = companies.length ? (companies.reduce((sum, c) => sum + (c.rating || 0), 0) / companies.length).toFixed(1) : '—';

  if (loading) {
    return (
      <div className="co-root">
        <Navbar />
        <div className="co-loading"><div className="co-spinner" /><p>Loading companies...</p></div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .co-root {
          font-family: 'Poppins', sans-serif;
          background: #f8f7ff;
          min-height: 100vh;
          color: #1c0b4b;
          -webkit-font-smoothing: antialiased;
        }

        /* ── LOADING ── */
        .co-loading {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; padding: 6rem; color: #9ca3af; font-size: 0.9rem;
        }
        .co-spinner {
          width: 36px; height: 36px;
          border: 3px solid #ede9fe; border-top-color: #7c3aed;
          border-radius: 50%; animation: co-spin 0.8s linear infinite;
        }
        @keyframes co-spin { to { transform: rotate(360deg); } }

        /* ── HERO ── */
        .co-hero {
          background: #1c0b4b; padding: 3.5rem 5%;
          position: relative; overflow: hidden;
        }
        .co-hero::before {
          content: ''; position: absolute; top: -150px; right: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%);
          pointer-events: none;
        }
        .co-hero-inner {
          max-width: 1300px; margin: 0 auto;
          position: relative; z-index: 1;
        }
        .co-hero-tag {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #a78bfa; margin-bottom: 0.6rem;
        }
        .co-hero-title {
          font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
          color: white; letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 0.5rem;
        }
        .co-hero-sub { font-size: 0.9rem; color: #9ca3af; }

        /* ── STATS ── */
        .co-stats-row {
          max-width: 1300px; margin: 0 auto;
          padding: 1.5rem 5% 0;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem;
        }
        .co-stat-tile {
          background: white; border: 1.5px solid #f3f4f6;
          border-radius: 14px; padding: 1.25rem 1.5rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .co-stat-icon {
          width: 44px; height: 44px; background: #f5f3ff;
          border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .co-stat-icon svg { width: 20px; height: 20px; stroke: #7c3aed; fill: none; }
        .co-stat-num { font-size: 1.5rem; font-weight: 800; color: #1c0b4b; letter-spacing: -0.03em; line-height: 1; }
        .co-stat-label { font-size: 0.75rem; color: #9ca3af; font-weight: 500; margin-top: 0.2rem; }

        /* ── CONTENT ── */
        .co-content { max-width: 1300px; margin: 0 auto; padding: 1.75rem 5%; }

        /* ── FILTERS ── */
        .co-filters {
          background: white; border: 1.5px solid #f3f4f6;
          border-radius: 16px; padding: 1.25rem 1.5rem;
          margin-bottom: 1.5rem;
        }
        .co-filters-head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.1rem;
        }
        .co-filters-title { font-size: 0.9rem; font-weight: 700; color: #1c0b4b; }
        .co-filter-badge {
          font-size: 0.7rem; font-weight: 700; color: white;
          background: #7c3aed; padding: 0.15rem 0.55rem; border-radius: 100px;
        }
        .co-filters-grid {
          display: grid; grid-template-columns: repeat(3, 1fr) auto;
          gap: 1rem; align-items: end;
        }
        .co-filter-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .co-filter-label {
          font-size: 0.72rem; font-weight: 600; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .co-filter-input, .co-filter-select {
          padding: 0.6rem 0.875rem;
          border: 1.5px solid #f3f4f6; border-radius: 10px;
          font-family: 'Poppins', sans-serif; font-size: 0.84rem;
          color: #1c0b4b; background: #fafafa; outline: none;
          transition: border-color 0.2s; width: 100%;
        }
        .co-filter-input:focus, .co-filter-select:focus { border-color: #7c3aed; background: white; }
        .co-filter-input::placeholder { color: #d1d5db; }
        .co-clear-btn {
          padding: 0.6rem 1.25rem;
          background: #f5f3ff; border: 1.5px solid #ede9fe;
          border-radius: 10px; color: #7c3aed;
          font-family: 'Poppins', sans-serif; font-size: 0.82rem;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
          white-space: nowrap; height: fit-content;
        }
        .co-clear-btn:hover { background: #ede9fe; }

        /* ── RESULTS ── */
        .co-results-bar {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.25rem;
        }
        .co-count { font-size: 0.85rem; color: #6b7280; font-weight: 500; }
        .co-count strong { color: #7c3aed; font-weight: 700; }

        /* ── GRID ── */
        .co-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        /* ── EMPTY ── */
        .co-empty {
          background: white; border: 1.5px solid #f3f4f6;
          border-radius: 16px; padding: 4rem 2rem; text-align: center;
        }
        .co-empty-icon {
          width: 64px; height: 64px; background: #f5f3ff;
          border-radius: 16px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .co-empty-icon svg { width: 28px; height: 28px; stroke: #c4b5fd; fill: none; }
        .co-empty h3 { font-size: 1rem; font-weight: 700; color: #1c0b4b; margin-bottom: 0.4rem; }
        .co-empty p { font-size: 0.84rem; color: #9ca3af; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .co-stats-row { grid-template-columns: repeat(2, 1fr); }
          .co-filters-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .co-stats-row { grid-template-columns: repeat(2, 1fr); }
          .co-filters-grid { grid-template-columns: 1fr; }
          .co-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="co-root">
        <Navbar />

        {/* Hero */}
        <section className="co-hero">
          <div className="co-hero-inner">
            <p className="co-hero-tag">Employers</p>
            <h1 className="co-hero-title">Top Companies Hiring Now</h1>
            <p className="co-hero-sub">Discover amazing companies and find your perfect workplace</p>
          </div>
        </section>

        {/* Stats */}
        <div className="co-stats-row">
          <div className="co-stat-tile">
            <div className="co-stat-icon">
              <svg viewBox="0 0 24 24" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <div className="co-stat-num">{companies.length}</div>
              <div className="co-stat-label">Companies</div>
            </div>
          </div>
          <div className="co-stat-tile">
            <div className="co-stat-icon">
              <svg viewBox="0 0 24 24" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
            </div>
            <div>
              <div className="co-stat-num">{totalOpenings}</div>
              <div className="co-stat-label">Open Positions</div>
            </div>
          </div>
          <div className="co-stat-tile">
            <div className="co-stat-icon">
              <svg viewBox="0 0 24 24" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <div className="co-stat-num">{avgRating}</div>
              <div className="co-stat-label">Avg Rating</div>
            </div>
          </div>
          <div className="co-stat-tile">
            <div className="co-stat-icon">
              <svg viewBox="0 0 24 24" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div className="co-stat-num">{locations.length}</div>
              <div className="co-stat-label">Locations</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="co-content">

          {/* Filters */}
          <div className="co-filters">
            <div className="co-filters-head">
              <span className="co-filters-title">Filter Companies</span>
              {activeFilterCount > 0 && <span className="co-filter-badge">{activeFilterCount} active</span>}
            </div>
            <div className="co-filters-grid">
              <div className="co-filter-group">
                <label className="co-filter-label">Search</label>
                <input
                  type="text" name="search"
                  placeholder="Company name..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="co-filter-input"
                />
              </div>
              <div className="co-filter-group">
                <label className="co-filter-label">Industry</label>
                <select name="industry" value={filters.industry} onChange={handleFilterChange} className="co-filter-select">
                  <option value="">All Industries</option>
                  {industries.map((ind, i) => <option key={i} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div className="co-filter-group">
                <label className="co-filter-label">Location</label>
                <select name="location" value={filters.location} onChange={handleFilterChange} className="co-filter-select">
                  <option value="">All Locations</option>
                  {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
                </select>
              </div>
              <button className="co-clear-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          </div>

          {/* Results */}
          <div className="co-results-bar">
            <span className="co-count">
              Showing <strong>{filteredCompanies.length}</strong> {filteredCompanies.length === 1 ? 'company' : 'companies'}
            </span>
          </div>

          {filteredCompanies.length > 0 ? (
            <div className="co-grid">
              {filteredCompanies.map(company => <CompanyCard key={company.id} company={company} />)}
            </div>
          ) : (
            <div className="co-empty">
              <div className="co-empty-icon">
                <svg viewBox="0 0 24 24" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3>No companies found</h3>
              <p>{activeFilterCount > 0 ? 'Try adjusting your filters.' : 'No companies have registered yet.'}</p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Companies;