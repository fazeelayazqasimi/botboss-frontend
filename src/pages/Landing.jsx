import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import JobCard from '../components/JobCard';
import CompanyCard from '../components/CompanyCard';
import { initializeLocalStorage, getStats } from '../data/mockData';

const Landing = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    activeCandidates: 0,
    placements: 0,
  });
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    initializeLocalStorage();
    setStats(getStats());
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setFeaturedJobs(jobs.slice(0, 6));
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    setTopCompanies(companies.slice(0, 4));
  }, []);

  const CategoryIcon = ({ name }) => {
    const icons = {
      Technology: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
      ),
      Marketing: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      Finance: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
      Design: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/>
        </svg>
      ),
      Healthcare: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          <path d="M12 8v8M8 12h8" strokeLinecap="round"/>
        </svg>
      ),
      Education: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
      ),
      Sales: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
      Engineering: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      ),
    };
    return icons[name] || null;
  };

  const categories = [
    { label: 'Technology', count: '1,240+' },
    { label: 'Marketing', count: '860+' },
    { label: 'Finance', count: '540+' },
    { label: 'Design', count: '420+' },
    { label: 'Healthcare', count: '390+' },
    { label: 'Education', count: '310+' },
    { label: 'Sales', count: '670+' },
    { label: 'Engineering', count: '780+' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Sign up and build your professional profile in minutes. Add skills, experience, and preferences.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" width="22" height="22">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Browse & Apply',
      desc: 'Explore thousands of verified job listings. Apply with one click using your saved profile.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" width="22" height="22">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
    {
      num: '03',
      title: 'AI Interview',
      desc: 'Complete an intelligent AI-powered interview that adapts to your role and highlights your strengths.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" width="22" height="22">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Get Hired',
      desc: 'Receive detailed reports and connect directly with hiring managers ready to onboard you.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" width="22" height="22">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      text: 'The AI interview feature saved us 40+ hours a week on initial screening. We now only meet candidates who are genuinely the right fit.',
      name: 'Rajesh Kumar',
      role: 'HR Manager, TechCorp',
      initials: 'RK',
      rating: 5,
    },
    {
      text: 'I landed my dream job within 3 weeks. The platform is seamless and the AI interview felt fair and thorough throughout the process.',
      name: 'Priya Singh',
      role: 'Frontend Developer',
      initials: 'PS',
      rating: 5,
    },
    {
      text: 'As a startup, finding quality talent quickly is critical. This platform delivered exactly that with zero compromise on quality.',
      name: 'Ankit Mehta',
      role: 'Founder, StartupHub',
      initials: 'AM',
      rating: 5,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp {
          font-family: 'Poppins', sans-serif;
          color: #1c0b4b;
          background: #fff;
          -webkit-font-smoothing: antialiased;
        }

        /* ─── HERO ─── */
        .lp-hero {
          background: #f8f7ff;
          padding: 5.5rem 2rem 0;
          position: relative;
          overflow: hidden;
        }
        .lp-hero::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .lp-hero::after {
          content: '';
          position: absolute;
          bottom: 80px; left: -100px;
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%);
          pointer-events: none;
        }
        .lp-hero-inner {
          max-width: 860px;
          margin: 0 auto;
          padding-bottom: 4rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ede9fe;
          color: #6d28d9;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }
        .lp-badge-dot {
          width: 6px; height: 6px;
          background: #7c3aed;
          border-radius: 50%;
          animation: lp-pulse 2s infinite;
        }
        @keyframes lp-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(1.5); }
        }
        .lp-hero-title {
          font-size: clamp(2.1rem, 5vw, 3.3rem);
          font-weight: 800;
          line-height: 1.2;
          color: #1c0b4b;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
        }
        .lp-hero-title span { color: #7c3aed; }
        .lp-hero-sub {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 400;
          line-height: 1.75;
          margin-bottom: 2.5rem;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Search */
        .lp-search {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(28,11,75,0.1);
          padding: 0.5rem;
          display: flex;
          align-items: center;
          max-width: 780px;
          margin: 0 auto 1.75rem;
          border: 1px solid #ede9fe;
        }
        .lp-search-field {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.25rem;
        }
        .lp-search-field svg {
          width: 18px; height: 18px;
          stroke: #9ca3af; fill: none; flex-shrink: 0;
        }
        .lp-search-field input {
          border: none; outline: none;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          color: #1c0b4b;
          width: 100%;
          background: transparent;
        }
        .lp-search-field input::placeholder { color: #9ca3af; }
        .lp-search-sep {
          width: 1px; height: 36px;
          background: #e5e7eb; flex-shrink: 0;
        }
        .lp-search-btn {
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.875rem 2rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
          margin: 0.25rem;
        }
        .lp-search-btn:hover { background: #6d28d9; transform: translateY(-1px); }

        .lp-popular {
          font-size: 0.8rem;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .lp-popular strong { color: #6b7280; font-weight: 500; }
        .lp-ptag {
          background: white;
          border: 1px solid #e5e7eb;
          color: #4b5563;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .lp-ptag:hover { border-color: #7c3aed; color: #7c3aed; background: #f5f3ff; }

        /* Stats Strip */
        .lp-stats-strip {
          background: white;
          border-top: 1px solid #f3f4f6;
          margin-top: 3rem;
        }
        .lp-stats-strip-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 1.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lp-sstat {
          flex: 1;
          text-align: center;
          padding: 0 2rem;
          position: relative;
        }
        .lp-sstat:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0; top: 50%;
          transform: translateY(-50%);
          height: 32px; width: 1px;
          background: #e5e7eb;
        }
        .lp-sstat-num {
          display: block;
          font-size: 1.65rem;
          font-weight: 800;
          color: #1c0b4b;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .lp-sstat-label {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ─── COMMON SECTION STYLES ─── */
        .lp-section { padding: 5rem 2rem; }
        .lp-section-inner { max-width: 1300px; margin: 0 auto; }
        .lp-section-bg { background: #f8f7ff; }

        .lp-sec-head { text-align: center; margin-bottom: 2.75rem; }
        .lp-sec-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.75rem;
        }

        .lp-tag {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7c3aed;
          margin-bottom: 0.5rem;
        }
        .lp-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #1c0b4b;
          letter-spacing: -0.03em;
          line-height: 1.25;
          margin-bottom: 0.4rem;
        }
        .lp-desc { font-size: 0.88rem; color: #9ca3af; }

        .lp-viewall {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.84rem;
          font-weight: 600;
          color: #7c3aed;
          text-decoration: none;
          padding: 0.6rem 1.25rem;
          border: 1.5px solid #ede9fe;
          border-radius: 10px;
          background: white;
          transition: all 0.2s;
          white-space: nowrap;
          font-family: 'Poppins', sans-serif;
        }
        .lp-viewall:hover { background: #f5f3ff; border-color: #7c3aed; }

        /* ─── CATEGORIES ─── */
        .lp-cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .lp-cat-card {
          background: #fff;
          border: 1.5px solid #f3f4f6;
          border-radius: 16px;
          padding: 1.5rem 1.25rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.22s ease;
          text-decoration: none;
          display: block;
        }
        .lp-cat-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 8px 32px rgba(124,58,237,0.1);
          transform: translateY(-3px);
        }
        .lp-cat-icon {
          width: 52px; height: 52px;
          background: #f5f3ff;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
          transition: background 0.22s;
        }
        .lp-cat-card:hover .lp-cat-icon { background: #ede9fe; }
        .lp-cat-icon svg { width: 22px; height: 22px; stroke: #7c3aed; fill: none; }
        .lp-cat-name { font-size: 0.875rem; font-weight: 600; color: #1c0b4b; margin-bottom: 0.3rem; }
        .lp-cat-count { font-size: 0.75rem; color: #7c3aed; font-weight: 500; }

        /* ─── JOBS GRID ─── */
        .lp-jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        /* ─── COMPANIES GRID ─── */
        .lp-comp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        /* ─── HOW IT WORKS ─── */
        .lp-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          position: relative;
        }
        .lp-steps::before {
          content: '';
          position: absolute;
          top: 26px;
          left: calc(12.5% + 12px);
          right: calc(12.5% + 12px);
          height: 1px;
          background: repeating-linear-gradient(
            to right, #ddd6fe 0px, #ddd6fe 6px, transparent 6px, transparent 13px
          );
          z-index: 0;
        }
        .lp-step {
          background: white;
          border: 1.5px solid #f3f4f6;
          border-radius: 20px;
          padding: 2rem 1.5rem 1.75rem;
          position: relative;
          z-index: 1;
          transition: all 0.22s ease;
        }
        .lp-step:hover {
          border-color: #c4b5fd;
          box-shadow: 0 12px 36px rgba(124,58,237,0.1);
          transform: translateY(-4px);
        }
        .lp-step-num {
          width: 44px; height: 44px;
          background: #7c3aed;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.82rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 6px 18px rgba(124,58,237,0.3);
          letter-spacing: 0.02em;
        }
        .lp-step-icon {
          width: 44px; height: 44px;
          background: #f5f3ff;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
          color: #7c3aed;
        }
        .lp-step-title { font-size: 0.975rem; font-weight: 700; color: #1c0b4b; margin-bottom: 0.6rem; }
        .lp-step-desc { font-size: 0.83rem; color: #9ca3af; line-height: 1.65; }

        /* ─── TESTIMONIALS ─── */
        .lp-testimonials {
          padding: 5rem 2rem;
          background: #1c0b4b;
        }
        .lp-test-inner { max-width: 1300px; margin: 0 auto; }
        .lp-test-head { text-align: center; margin-bottom: 3rem; }
        .lp-test-head .lp-tag { color: #a78bfa; }
        .lp-test-head .lp-title { color: white; }
        .lp-test-head .lp-desc { color: #6b7280; }
        .lp-test-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .lp-tcard {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.22s;
        }
        .lp-tcard:hover {
          background: rgba(124,58,237,0.12);
          border-color: rgba(167,139,250,0.25);
          transform: translateY(-3px);
        }
        .lp-tstars { display: flex; gap: 3px; margin-bottom: 1.25rem; }
        .lp-tstar { color: #f59e0b; font-size: 0.85rem; }
        .lp-ttext {
          font-size: 0.875rem;
          color: #d1d5db;
          line-height: 1.75;
          margin-bottom: 1.75rem;
        }
        .lp-tauthor { display: flex; align-items: center; gap: 0.75rem; }
        .lp-tavatar {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem; color: white; flex-shrink: 0;
        }
        .lp-tname { font-size: 0.875rem; font-weight: 700; color: white; margin-bottom: 0.15rem; }
        .lp-trole { font-size: 0.75rem; color: #6b7280; }

        /* ─── CTA ─── */
        .lp-cta { padding: 5rem 2rem; background: white; }
        .lp-cta-box {
          max-width: 1300px;
          margin: 0 auto;
          background: linear-gradient(130deg, #7c3aed 0%, #4c1d95 100%);
          border-radius: 28px;
          padding: 4.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 3rem;
          position: relative;
          overflow: hidden;
        }
        .lp-cta-box::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-cta-box::after {
          content: '';
          position: absolute;
          bottom: -80px; left: 200px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-cta-left { position: relative; z-index: 1; max-width: 580px; }
        .lp-cta-badge {
          display: inline-block;
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #c4b5fd;
          background: rgba(255,255,255,0.1);
          padding: 0.35rem 0.875rem;
          border-radius: 100px;
          margin-bottom: 1.25rem;
        }
        .lp-cta-title {
          font-size: 2.1rem; font-weight: 800;
          color: white; letter-spacing: -0.03em;
          line-height: 1.2; margin-bottom: 0.875rem;
        }
        .lp-cta-sub { font-size: 0.95rem; color: rgba(255,255,255,0.65); line-height: 1.65; }
        .lp-cta-btns {
          display: flex; flex-direction: column;
          gap: 0.875rem; position: relative; z-index: 1; flex-shrink: 0;
        }
        .lp-btn-white {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 0.5rem; padding: 0.9rem 2rem;
          background: white; color: #7c3aed;
          text-decoration: none; border-radius: 12px;
          font-weight: 700; font-size: 0.88rem;
          font-family: 'Poppins', sans-serif;
          transition: all 0.2s; white-space: nowrap;
          border: none; cursor: pointer;
        }
        .lp-btn-white:hover { background: #f5f3ff; transform: translateY(-2px); }
        .lp-btn-ghost {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 0.5rem; padding: 0.9rem 2rem;
          background: transparent; color: white;
          text-decoration: none; border-radius: 12px;
          font-weight: 600; font-size: 0.88rem;
          font-family: 'Poppins', sans-serif;
          transition: all 0.2s; white-space: nowrap;
          border: 1.5px solid rgba(255,255,255,0.3); cursor: pointer;
        }
        .lp-btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.6); }

        /* ─── EMPTY STATE ─── */
        .lp-empty {
          text-align: center; padding: 3rem 1rem;
          color: #9ca3af; font-size: 0.88rem; font-weight: 500;
          grid-column: 1 / -1;
        }
        .lp-empty-icon { margin-bottom: 0.75rem; opacity: 0.6; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .lp-cat-grid { grid-template-columns: repeat(4, 1fr); }
          .lp-jobs-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-comp-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-steps { grid-template-columns: repeat(2, 1fr); }
          .lp-steps::before { display: none; }
          .lp-test-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .lp-hero { padding: 4.5rem 1.25rem 0; }
          .lp-hero-inner { padding-bottom: 3rem; }
          .lp-search { flex-direction: column; padding: 0.75rem; }
          .lp-search-sep { display: none; }
          .lp-search-btn { width: 100%; border-radius: 10px; margin: 0; }
          .lp-stats-strip-inner { flex-wrap: wrap; }
          .lp-sstat { min-width: 50%; padding: 1rem; }
          .lp-sstat:not(:last-child)::after { display: none; }
          .lp-cat-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-jobs-grid { grid-template-columns: 1fr; }
          .lp-comp-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-steps { grid-template-columns: 1fr; }
          .lp-test-grid { grid-template-columns: 1fr; }
          .lp-cta-box { flex-direction: column; padding: 2.5rem 1.75rem; }
          .lp-cta-btns { width: 100%; }
          .lp-sec-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>

      <div className="lp">
        <Navbar />

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-hero-badge">
              <span className="lp-badge-dot" />
              AI-Powered Hiring Platform
            </div>
            <h1 className="lp-hero-title">
              Find Your Next Opportunity<br />
              with <span>Intelligent Interviews</span>
            </h1>
            <p className="lp-hero-sub">
              Connect top talent with the best companies. Our AI-driven platform screens smarter,
              matches faster, and helps everyone find their perfect fit.
            </p>

            <div className="lp-search">
              <div className="lp-search-field">
                <svg viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="lp-search-sep" />
              <div className="lp-search-field">
                <svg viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input
                  type="text"
                  placeholder="City or remote"
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                />
              </div>
              <button className="lp-search-btn">Search Jobs</button>
            </div>

            <div className="lp-popular">
              <strong>Popular:</strong>
              {['React Developer', 'Product Manager', 'UI Designer', 'Data Analyst'].map(tag => (
                <Link key={tag} to="/jobs" className="lp-ptag">{tag}</Link>
              ))}
            </div>
          </div>

          <div className="lp-stats-strip">
            <div className="lp-stats-strip-inner">
              {[
                { num: `${stats.activeJobs || '1,500'}+`, label: 'Active Jobs' },
                { num: `${stats.totalCompanies || '500'}+`, label: 'Companies' },
                { num: `${stats.activeCandidates || '10,000'}+`, label: 'Candidates' },
                { num: `${stats.placements || '94'}%`, label: 'Success Rate' },
              ].map(s => (
                <div key={s.label} className="lp-sstat">
                  <span className="lp-sstat-num">{s.num}</span>
                  <span className="lp-sstat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="lp-section">
          <div className="lp-section-inner">
            <div className="lp-sec-head">
              <p className="lp-tag">Explore</p>
              <h2 className="lp-title">Browse by Category</h2>
              <p className="lp-desc">Thousands of jobs across every industry</p>
            </div>
            <div className="lp-cat-grid">
              {categories.map(cat => (
                <Link to="/jobs" key={cat.label} className="lp-cat-card">
                  <div className="lp-cat-icon"><CategoryIcon name={cat.label} /></div>
                  <div className="lp-cat-name">{cat.label}</div>
                  <div className="lp-cat-count">{cat.count} jobs</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED JOBS ── */}
        <section className="lp-section lp-section-bg">
          <div className="lp-section-inner">
            <div className="lp-sec-row">
              <div>
                <p className="lp-tag">Opportunities</p>
                <h2 className="lp-title">Featured Jobs</h2>
                <p className="lp-desc">Handpicked positions from top employers</p>
              </div>
              <Link to="/jobs" className="lp-viewall">Browse All Jobs →</Link>
            </div>
            <div className="lp-jobs-grid">
              {featuredJobs.length > 0 ? (
                featuredJobs.map(job => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="lp-empty">
                  <div className="lp-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="#c4b5fd" width="40" height="40">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
                    </svg>
                  </div>
                  <div>No jobs posted yet. Be the first to post!</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── TOP COMPANIES ── */}
        <section className="lp-section">
          <div className="lp-section-inner">
            <div className="lp-sec-row">
              <div>
                <p className="lp-tag">Employers</p>
                <h2 className="lp-title">Top Companies Hiring</h2>
                <p className="lp-desc">Join innovative teams building the future</p>
              </div>
              <Link to="/companies" className="lp-viewall">View All Companies →</Link>
            </div>
            <div className="lp-comp-grid">
              {topCompanies.length > 0 ? (
                topCompanies.map(company => <CompanyCard key={company.id} company={company} />)
              ) : (
                <div className="lp-empty">
                  <div className="lp-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="#c4b5fd" width="40" height="40">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <div>Companies will appear here once they sign up.</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-section lp-section-bg">
          <div className="lp-section-inner">
            <div className="lp-sec-head">
              <p className="lp-tag">Process</p>
              <h2 className="lp-title">How It Works</h2>
              <p className="lp-desc">Four simple steps to smarter hiring</p>
            </div>
            <div className="lp-steps">
              {steps.map(step => (
                <div key={step.num} className="lp-step">
                  <div className="lp-step-num">{step.num}</div>
                  <div className="lp-step-icon">{step.icon}</div>
                  <div className="lp-step-title">{step.title}</div>
                  <p className="lp-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="lp-testimonials">
          <div className="lp-test-inner">
            <div className="lp-test-head lp-sec-head">
              <p className="lp-tag">Reviews</p>
              <h2 className="lp-title">Trusted by Thousands</h2>
              <p className="lp-desc">What hiring teams and candidates say about us</p>
            </div>
            <div className="lp-test-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="lp-tcard">
                  <div className="lp-tstars">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="lp-tstar">★</span>
                    ))}
                  </div>
                  <p className="lp-ttext">{t.text}</p>
                  <div className="lp-tauthor">
                    <div className="lp-tavatar">{t.initials}</div>
                    <div>
                      <div className="lp-tname">{t.name}</div>
                      <div className="lp-trole">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta">
          <div className="lp-cta-box">
            <div className="lp-cta-left">
              <span className="lp-cta-badge">Get Started Today</span>
              <h2 className="lp-cta-title">
                Ready to Transform<br />Your Hiring Process?
              </h2>
              <p className="lp-cta-sub">
                Join thousands of companies and candidates using AI-powered interviews
                to find the perfect match — faster, smarter, and more accurately.
              </p>
            </div>
            <div className="lp-cta-btns">
              <Link to="/signup?type=candidate" className="lp-btn-white">
                Find Jobs Now
              </Link>
              <Link to="/signup?type=company" className="lp-btn-ghost">
                Post a Job for Free
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Landing;