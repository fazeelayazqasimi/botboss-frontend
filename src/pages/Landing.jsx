import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import CompanyCard from '../components/CompanyCard';

const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

const Landing = () => {
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, activeCandidates: 0, placements: 0 });
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [counted, setCounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !counted) setCounted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [counted]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs from API
      const jobsRes = await fetch(`${API_URL}/jobs/`);
      const jobsData = jobsRes.ok ? await jobsRes.json() : [];
      setFeaturedJobs(jobsData.slice(0, 6));
      
      // Fetch companies from API
      const companiesRes = await fetch(`${API_URL}/companies/`);
      const companiesData = companiesRes.ok ? await companiesRes.json() : [];
      setTopCompanies(companiesData.slice(0, 4));
      
      // Calculate stats
      const activeJobs = jobsData.filter(j => j.status === 'active').length;
      setStats({
        totalJobs: jobsData.length,
        totalCompanies: companiesData.length,
        activeCandidates: 8452,
        placements: 94,
        activeJobs: activeJobs
      });
      
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to empty data
      setFeaturedJobs([]);
      setTopCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery || searchLocation) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}`;
    } else {
      window.location.href = '/jobs';
    }
  };

  const faqs = [
    {
      q: 'How does the AI interview process work?',
      a: 'After applying to a job, shortlisted candidates receive an AI-powered interview link. The system asks role-specific questions, evaluates answers in real time, and generates a detailed performance report — covering clarity, confidence, and overall fit for the role.',
    },
    {
      q: 'Is BotBoss free to use for job seekers?',
      a: 'Yes, candidates can create profiles, browse jobs, and complete AI interviews completely free. Companies have access to a free tier as well, with premium features available for high-volume hiring needs.',
    },
    {
      q: 'How accurate is the AI scoring system?',
      a: 'Our AI evaluates multiple dimensions of communication including verbal clarity, response relevance, and technical accuracy. Scores are calibrated against industry benchmarks and reviewed continuously to ensure fairness and accuracy.',
    },
    {
      q: 'Can companies customize the interview questions?',
      a: 'Absolutely. When posting a job, companies can define custom question sets, set difficulty levels, and choose between text-based or voice interview formats.',
    },
    {
      q: 'How long does it take to get results after an interview?',
      a: 'Reports are generated instantly once the interview session ends. Both companies and candidates can view their respective reports from the dashboard immediately after completion.',
    },
    {
      q: 'Is my interview data kept private?',
      a: 'Yes. All interview recordings and reports are encrypted and only accessible to the candidate and the hiring company. We never share your data with third parties.',
    },
  ];

  const categories = [
    { label: 'Technology', count: '1,240+', emoji: '💻', gradient: 'from-indigo-500 to-purple-500' },
    { label: 'Marketing', count: '860+', emoji: '📣', gradient: 'from-pink-500 to-rose-500' },
    { label: 'Finance', count: '540+', emoji: '💹', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Design', count: '420+', emoji: '🎨', gradient: 'from-cyan-500 to-blue-500' },
    { label: 'Healthcare', count: '390+', emoji: '🏥', gradient: 'from-green-500 to-emerald-500' },
    { label: 'Education', count: '310+', emoji: '📚', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Sales', count: '670+', emoji: '🤝', gradient: 'from-violet-500 to-purple-500' },
    { label: 'Engineering', count: '780+', emoji: '⚙️', gradient: 'from-slate-500 to-gray-500' },
  ];

  const steps = [
    { num: '01', title: 'Create Your Profile', desc: 'Sign up and build your professional profile in minutes. Add skills, experience, and preferences.', icon: '📝' },
    { num: '02', title: 'Browse & Apply', desc: 'Explore thousands of verified job listings. Apply with one click using your saved profile.', icon: '🔍' },
    { num: '03', title: 'AI Interview', desc: 'Complete an intelligent AI-powered interview that adapts to your role and highlights your strengths.', icon: '🤖' },
    { num: '04', title: 'Get Hired', desc: 'Receive detailed reports and connect directly with hiring managers ready to onboard you.', icon: '🎉' },
  ];

  const testimonials = [
    {
      text: 'The AI interview system cut our screening time by over 60%. We only meet candidates who are genuinely the right fit — no more wasted first rounds.',
      name: 'Sarah Mitchell',
      role: 'Head of Talent, NovaTech',
      initials: 'SM',
    },
    {
      text: 'I was nervous about an AI interview, but it felt structured and fair. Got detailed feedback on my performance and landed the role within two weeks.',
      name: 'James Okafor',
      role: 'Product Designer',
      initials: 'JO',
    },
    {
      text: 'As a growing startup, we needed a smarter way to hire fast. BotBoss delivered — shortlisted candidates arrive pre-evaluated and ready to go.',
      name: 'Lena Kaufmann',
      role: 'CEO, BuildFlow',
      initials: 'LK',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #0A0A0F;
          --ink2: #0F0F1A;
          --muted: #6B6B84;
          --muted-light: #8E8EA8;
          --faint: #F8F9FF;
          --line: #E9ECF5;
          --accent: #6366F1;
          --accent-dark: #4F46E5;
          --accent-light: #818CF8;
          --accent-glow: rgba(99, 102, 241, 0.2);
          --accent2: #EC489A;
          --white: #FFFFFF;
          --card: #FFFFFF;
          --r: 20px;
          --ff: 'Inter', sans-serif;
          --ff-mono: 'Space Grotesk', monospace;
        }

        .dark-mode {
          --ink: #FFFFFF;
          --ink2: #0A0A0F;
          --muted: #9CA3AF;
          --faint: #111827;
          --line: #1F2937;
          --card: #1F2937;
          --white: #111827;
        }

        body { background: var(--white); }

        .bb {
          font-family: var(--ff);
          color: var(--ink);
          background: var(--white);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-slide-left { animation: slide-in-left 0.6s ease-out forwards; }

        /* Hero */
        .bb-hero {
          min-height: 90vh;
          background: linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #0F0F1A 100%);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .bb-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bb-hero-orb1 {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
          top: -200px;
          right: -150px;
          animation: float 10s ease-in-out infinite;
        }

        .bb-hero-orb2 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%);
          bottom: -150px;
          left: -100px;
          animation: float-reverse 12s ease-in-out infinite;
        }

        .bb-hero-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* Search */
        .bb-search {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .bb-search:hover,
        .bb-search:focus-within {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
        }

        .bb-sbtn {
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          transition: all 0.3s ease;
        }

        .bb-sbtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }

        /* Category Cards */
        .bb-cat {
          background: var(--card);
          border: 1px solid var(--line);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .bb-cat:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow: 0 20px 35px -12px rgba(99, 102, 241, 0.2);
        }

        .bb-cat-em {
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .bb-cat:hover .bb-cat-em {
          transform: scale(1.1);
        }

        /* Step Cards */
        .bb-step {
          background: var(--card);
          border: 1px solid var(--line);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .bb-step::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .bb-step:hover::before {
          transform: scaleX(1);
        }

        .bb-step:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.15);
        }

        .bb-step-badge {
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
        }

        /* Testimonial Cards */
        .bb-tcard {
          background: rgba(99, 102, 241, 0.03);
          border: 1px solid var(--line);
          transition: all 0.3s ease;
        }

        .bb-tcard:hover {
          transform: translateY(-5px);
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.05);
        }

        .bb-tavatar {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
        }

        /* FAQ */
        .bb-faq-item {
          border: 1px solid var(--line);
          transition: all 0.3s ease;
        }

        .bb-faq-item.open {
          border-color: var(--accent);
          box-shadow: 0 5px 20px rgba(99, 102, 241, 0.1);
        }

        .bb-faq-q {
          transition: color 0.2s ease;
        }

        .bb-faq-q:hover {
          color: var(--accent);
        }

        /* CTA */
        .bb-cta-box {
          background: linear-gradient(135deg, #0F0F1A 0%, #1E1B4B 100%);
          position: relative;
          overflow: hidden;
        }

        .bb-cta-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          animation: pulse-glow 8s ease-in-out infinite;
        }

        .bb-btn-primary {
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          transition: all 0.3s ease;
        }

        .bb-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(99, 102, 241, 0.5);
        }

        .bb-btn-ghost {
          transition: all 0.3s ease;
        }

        .bb-btn-ghost:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Stats */
        .bb-stat-num {
          font-family: var(--ff-mono);
          background: linear-gradient(135deg, #fff, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Loading Spinner */
        .bb-loader {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 3px solid rgba(99, 102, 241, 0.2);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .bb-hero-body {
            padding: 5rem 1rem 3rem;
          }
          .bb-search {
            flex-direction: column;
          }
          .bb-sdiv {
            display: none;
          }
          .bb-sbtn {
            width: 100%;
            border-radius: 14px;
          }
          .bb-statsbar-inner {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .bb-cat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bb-jobs-grid,
          .bb-comp-grid {
            grid-template-columns: 1fr;
          }
          .bb-steps {
            grid-template-columns: 1fr;
          }
          .bb-test-grid {
            grid-template-columns: 1fr;
          }
          .bb-cta-box {
            flex-direction: column;
            text-align: center;
            padding: 2.5rem;
          }
          .bb-cta-btns {
            width: 100%;
          }
          .bb-cta-btns a {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .bb-cat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .bb-cat {
            padding: 1rem;
          }
          .bb-cat-em {
            font-size: 1.5rem;
          }
          .bb-step {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="bb">
        <Navbar />

        {/* Hero Section */}
        <section className="bb-hero">
          <div className="bb-hero-bg">
            <div className="bb-hero-orb1" />
            <div className="bb-hero-orb2" />
            <div className="bb-hero-grid" />
          </div>

          <div className="bb-hero-body" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 3rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.5rem 1.25rem', borderRadius: '100px', marginBottom: '2rem', backdropFilter: 'blur(8px)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A5B4FC', animation: 'pulse-glow 2s infinite' }} />
                AI-POWERED HIRING PLATFORM
              </div>
              <h1 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, color: 'white', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                Hire Smarter.
                <br />
                Get Hired <span style={{ background: 'linear-gradient(135deg, #818CF8, #EC489A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Faster.</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
                Connect top talent with leading companies through intelligent AI interviews — screening smarter, matching faster, and eliminating guesswork.
              </p>

              {/* Search Bar */}
              <div className="bb-search" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px', display: 'flex', alignItems: 'center', maxWidth: '780px', margin: '0 auto 1.5rem', gap: '4px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem 1.1rem' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Job title or keywords" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: 'white', width: '100%' }} />
                </div>
                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem 1.1rem' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <input type="text" placeholder="City or remote" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: 'white', width: '100%' }} />
                </div>
                <button className="bb-sbtn" onClick={handleSearch} style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', border: 'none', borderRadius: '14px', padding: '0.85rem 2rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Search Jobs</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
                <span>Popular:</span>
                {['React Developer', 'Product Manager', 'UI Designer', 'Data Analyst'].map(tag => (
                  <Link key={tag} to="/jobs" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', padding: '0.3rem 0.85rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }}>{tag}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bb-statsbar" ref={statsRef} style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="bb-statsbar-inner">
              {[
                { num: stats.totalJobs.toLocaleString(), label: 'Active Jobs' },
                { num: stats.totalCompanies.toLocaleString(), label: 'Companies' },
                { num: '8,452+', label: 'Candidates' },
                { num: '94%', label: 'Success Rate' },
              ].map(s => (
                <div key={s.label} className="bb-stat" style={{ textAlign: 'center', padding: '0 1.5rem', position: 'relative' }}>
                  <span className="bb-stat-num" style={{ display: 'block', fontFamily: 'Space Grotesk, monospace', fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: '4px' }}>{s.num}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.09em' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section style={{ padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6366F1', marginBottom: '0.75rem' }}>Explore</p>
              <h2 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Browse by Category</h2>
              <p style={{ fontSize: '0.9rem', color: '#6B6B84' }}>Thousands of jobs across every industry</p>
            </div>
            <div className="bb-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
              {categories.map(cat => (
                <Link to="/jobs" key={cat.label} className="bb-cat" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '20px', padding: '1.5rem 1.25rem', textAlign: 'center', textDecoration: 'none', transition: 'all 0.3s' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{cat.emoji}</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.3rem' }}>{cat.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6366F1', fontWeight: 500 }}>{cat.count} jobs</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section style={{ padding: '5rem 2rem', background: '#F8F9FF' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6366F1', marginBottom: '0.5rem' }}>Opportunities</p>
                <h2 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em' }}>Featured Jobs</h2>
                <p style={{ fontSize: '0.9rem', color: '#6B6B84' }}>Handpicked positions from top employers</p>
              </div>
              <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#6366F1', textDecoration: 'none', padding: '0.55rem 1.25rem', border: '1.5px solid #E9ECF5', borderRadius: '10px', background: 'white' }}>Browse All Jobs →</Link>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="bb-loader" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '1rem', color: '#6B6B84' }}>Loading jobs...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.1rem' }}>
                {featuredJobs.length > 0 ? featuredJobs.map(job => <JobCard key={job.id} job={job} />) : <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1/-1', color: '#6B6B84' }}>No jobs posted yet. Be the first to post!</div>}
              </div>
            )}
          </div>
        </section>

        {/* Top Companies */}
        <section style={{ padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6366F1', marginBottom: '0.5rem' }}>Employers</p>
                <h2 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em' }}>Top Companies Hiring</h2>
                <p style={{ fontSize: '0.9rem', color: '#6B6B84' }}>Join innovative teams building the future</p>
              </div>
              <Link to="/companies" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#6366F1', textDecoration: 'none', padding: '0.55rem 1.25rem', border: '1.5px solid #E9ECF5', borderRadius: '10px', background: 'white' }}>View All Companies →</Link>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="bb-loader" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '1rem', color: '#6B6B84' }}>Loading companies...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.1rem' }}>
                {topCompanies.length > 0 ? topCompanies.map(company => <CompanyCard key={company.id} company={company} />) : <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1/-1', color: '#6B6B84' }}>Companies will appear here once they sign up.</div>}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: '5rem 2rem', background: '#F8F9FF' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6366F1', marginBottom: '0.75rem' }}>Process</p>
              <h2 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>How It Works</h2>
              <p style={{ fontSize: '0.9rem', color: '#6B6B84' }}>Four simple steps to smarter hiring</p>
            </div>
            <div className="bb-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem', position: 'relative' }}>
              {steps.map(step => (
                <div key={step.num} className="bb-step" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '20px', padding: '2rem 1.5rem 1.75rem', position: 'relative', transition: 'all 0.3s' }}>
                  <div className="bb-step-badge" style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, monospace', fontWeight: 800, fontSize: '0.9rem', color: 'white', marginBottom: '1.25rem' }}>{step.num}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.6rem' }}>{step.title}</div>
                  <p style={{ fontSize: '0.83rem', color: '#6B6B84', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: '5rem 2rem', background: '#0F0F1A' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A5B4FC', marginBottom: '0.75rem' }}>Reviews</p>
              <h2 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Trusted by Thousands</h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)' }}>What hiring teams and candidates say about us</p>
            </div>
            <div className="bb-test-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
              {testimonials.map((t, i) => (
                <div key={i} className="bb-tcard" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem' }}>
                  <div style={{ fontSize: '2.5rem', lineHeight: 1, color: '#6366F1', marginBottom: '0.75rem', opacity: 0.6 }}>"</div>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '1.75rem' }}>{t.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #EC489A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>{t.initials}</div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6366F1', marginBottom: '0.75rem' }}>FAQ</p>
              <h2 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: '0.9rem', color: '#6B6B84' }}>Everything you need to know about BotBoss</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faqs.map((faq, i) => (
                <div key={i} className={`bb-faq-item${openFaq === i ? ' open' : ''}`} style={{ border: '1px solid var(--line)', borderRadius: '20px', overflow: 'hidden', background: 'var(--card)' }}>
                  <button className="bb-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: openFaq === i ? '#6366F1' : 'var(--ink)' }}>
                    <span>{faq.q}</span>
                    <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 1.5rem 1.2rem', fontSize: '0.875rem', color: '#6B6B84', lineHeight: 1.75, borderTop: '1px solid var(--line)', paddingTop: '1rem' }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '5rem 2rem' }}>
          <div className="bb-cta-box" style={{ maxWidth: '1200px', margin: '0 auto', background: 'linear-gradient(135deg, #0F0F1A 0%, #1E1B4B 100%)', borderRadius: '32px', padding: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px' }}>
              <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A5B4FC', background: 'rgba(165,180,252,0.12)', border: '1px solid rgba(165,180,252,0.2)', padding: '0.35rem 0.9rem', borderRadius: '100px', marginBottom: '1.25rem' }}>Get Started Today</span>
              <h2 style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '1rem' }}>Ready to Transform<br />Your Hiring Process?</h2>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>Join thousands of companies and candidates using AI-powered interviews to find the perfect match — faster, smarter, and more accurately.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', position: 'relative', zIndex: 1 }}>
              <Link to="/signup?type=candidate" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.95rem 2.25rem', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.3s' }}>Find Jobs Now →</Link>
              <Link to="/signup?type=company" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.95rem 2.25rem', borderRadius: '12px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(255,255,255,0.15)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.3s' }}>Post a Job for Free →</Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Landing;
