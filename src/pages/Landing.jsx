import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import JobCard from '../components/JobCard';
import CompanyCard from '../components/CompanyCard';
import { initializeLocalStorage, getStats } from '../data/mockData';

const Landing = () => {
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, activeCandidates: 0, placements: 0 });
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [counted, setCounted] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    initializeLocalStorage();
    setStats(getStats());
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setFeaturedJobs(jobs.slice(0, 6));
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    setTopCompanies(companies.slice(0, 4));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !counted) setCounted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [counted]);

  const faqs = [
    {
      q: 'How does the AI interview process work?',
      a: 'After applying to a job, shortlisted candidates receive an AI-powered interview link. The system asks role-specific questions, evaluates answers in real time, and generates a detailed performance report — covering clarity, confidence, eye contact, and more.',
    },
    {
      q: 'Is BotBoss free to use for job seekers?',
      a: 'Yes, candidates can create profiles, browse jobs, and complete AI interviews completely free. Companies have access to a free tier as well, with premium features available for high-volume hiring needs.',
    },
    {
      q: 'How accurate is the AI scoring system?',
      a: 'Our AI evaluates multiple dimensions of communication including verbal clarity, response relevance, and non-verbal cues. Scores are calibrated against industry benchmarks and reviewed continuously to ensure fairness and accuracy.',
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
    { label: 'Technology', count: '1,240+', emoji: '💻' },
    { label: 'Marketing', count: '860+', emoji: '📣' },
    { label: 'Finance', count: '540+', emoji: '💹' },
    { label: 'Design', count: '420+', emoji: '🎨' },
    { label: 'Healthcare', count: '390+', emoji: '🏥' },
    { label: 'Education', count: '310+', emoji: '📚' },
    { label: 'Sales', count: '670+', emoji: '🤝' },
    { label: 'Engineering', count: '780+', emoji: '⚙️' },
  ];

  const steps = [
    { num: '01', title: 'Create Your Profile', desc: 'Sign up and build your professional profile in minutes. Add skills, experience, and preferences.' },
    { num: '02', title: 'Browse & Apply', desc: 'Explore thousands of verified job listings. Apply with one click using your saved profile.' },
    { num: '03', title: 'AI Interview', desc: 'Complete an intelligent AI-powered interview that adapts to your role and highlights your strengths.' },
    { num: '04', title: 'Get Hired', desc: 'Receive detailed reports and connect directly with hiring managers ready to onboard you.' },
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:    #0A0A0F;
          --ink2:   #1A1A2E;
          --muted:  #6E6E8A;
          --faint:  #F2F2F7;
          --line:   #E4E4EF;
          --accent: #5B4CFF;
          --accent2:#FF4C8B;
          --accentL:#EAE8FF;
          --white:  #FFFFFF;
          --card:   #FFFFFF;
          --r:      16px;
          --ff:     'DM Sans', sans-serif;
          --ffd:    'Syne', sans-serif;
        }

        .bb { font-family: var(--ff); color: var(--ink); background: var(--white); -webkit-font-smoothing: antialiased; }

        /* ── NOISE TEXTURE OVERLAY ── */
        .bb::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 9999;
        }

        /* ── HERO ── */
        .bb-hero {
          min-height: 100svh;
          background: var(--ink2);
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }
        .bb-hero-bg {
          position: absolute; inset: 0; pointer-events: none;
        }
        .bb-hero-orb1 {
          position: absolute;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(91,76,255,0.35) 0%, transparent 70%);
          top: -200px; right: -150px;
          animation: bbFloat 8s ease-in-out infinite;
        }
        .bb-hero-orb2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,76,139,0.2) 0%, transparent 70%);
          bottom: -100px; left: -100px;
          animation: bbFloat 10s ease-in-out infinite reverse;
        }
        .bb-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(91,76,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,76,255,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        @keyframes bbFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .bb-hero-body {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 7rem 2rem 4rem;
          position: relative; z-index: 1; text-align: center;
        }
        .bb-hero-inner { max-width: 820px; }

        .bb-pill {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(91,76,255,0.4);
          background: rgba(91,76,255,0.12);
          color: #A89FFF;
          font-family: var(--ff); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 0.45rem 1.1rem; border-radius: 100px;
          margin-bottom: 1.75rem;
          backdrop-filter: blur(8px);
        }
        .bb-pill-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #A89FFF;
          animation: bbPulse 2s infinite;
        }
        @keyframes bbPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }

        .bb-hero-h1 {
          font-family: var(--ffd);
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 800;
          line-height: 1.1;
          color: var(--white);
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .bb-hero-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #A89FFF 0%, #FF4C8B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .bb-hero-sub {
          font-size: 1.05rem; color: rgba(255,255,255,0.55);
          line-height: 1.75; font-weight: 300;
          max-width: 560px; margin: 0 auto 2.75rem;
        }

        /* Search Bar */
        .bb-search {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(20px);
          border-radius: 18px;
          padding: 6px;
          display: flex; align-items: center;
          max-width: 740px; margin: 0 auto 1.5rem;
          gap: 4px;
        }
        .bb-sf {
          flex: 1; display: flex; align-items: center; gap: 8px;
          padding: 0.7rem 1.1rem;
        }
        .bb-sf svg { width:17px;height:17px;stroke:rgba(255,255,255,0.35);fill:none;flex-shrink:0; }
        .bb-sf input {
          border: none; outline: none; background: transparent;
          font-family: var(--ff); font-size: 0.9rem; font-weight: 400;
          color: var(--white); width: 100%;
        }
        .bb-sf input::placeholder { color: rgba(255,255,255,0.3); }
        .bb-sdiv { width:1px;height:30px;background:rgba(255,255,255,0.1);flex-shrink:0; }
        .bb-sbtn {
          background: linear-gradient(135deg, var(--accent), #8B7FFF);
          color: white; border: none; border-radius: 13px;
          padding: 0.85rem 2rem; font-family: var(--ff);
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          white-space: nowrap; transition: all 0.2s; flex-shrink: 0;
        }
        .bb-sbtn:hover { filter: brightness(1.1); transform: translateY(-1px); }

        .bb-tags {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap; justify-content: center;
          font-size: 0.78rem; color: rgba(255,255,255,0.35);
        }
        .bb-tag {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.55);
          padding: 0.3rem 0.85rem; border-radius: 100px;
          font-size: 0.78rem; font-weight: 500; cursor: pointer;
          transition: all 0.2s; text-decoration: none; display:inline-block;
        }
        .bb-tag:hover { border-color: rgba(168,159,255,0.5); color: #A89FFF; background: rgba(91,76,255,0.1); }

        /* Stats bar */
        .bb-statsbar {
          background: rgba(255,255,255,0.04);
          border-top: 1px solid rgba(255,255,255,0.07);
          position: relative; z-index: 1;
        }
        .bb-statsbar-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 1.75rem 2rem;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        .bb-stat {
          text-align: center; padding: 0 1.5rem; position: relative;
        }
        .bb-stat:not(:last-child)::after {
          content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);
          height:28px;width:1px;background:rgba(255,255,255,0.08);
        }
        .bb-stat-num {
          display:block;font-family:var(--ffd);
          font-size: 1.8rem;font-weight:800;
          color:var(--white);letter-spacing:-0.03em;line-height:1;margin-bottom:4px;
        }
        .bb-stat-lbl { font-size:0.72rem;color:rgba(255,255,255,0.35);font-weight:500;text-transform:uppercase;letter-spacing:0.09em; }

        /* ── SECTION COMMONS ── */
        .bb-sec { padding: 6rem 2rem; }
        .bb-sec-alt { background: var(--faint); }
        .bb-wrap { max-width: 1200px; margin: 0 auto; }

        .bb-sec-label {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 0.6rem;
        }
        .bb-sec-h2 {
          font-family: var(--ffd); font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 800; color: var(--ink); letter-spacing: -0.03em; line-height: 1.2;
          margin-bottom: 0.5rem;
        }
        .bb-sec-sub { font-size: 0.9rem; color: var(--muted); font-weight: 400; }

        .bb-sec-row {
          display: flex; justify-content: space-between; align-items: flex-end;
          flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem;
        }
        .bb-sec-center { text-align: center; margin-bottom: 2.75rem; }

        .bb-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.85rem; font-weight: 600; color: var(--accent);
          text-decoration: none; padding: 0.55rem 1.25rem;
          border: 1.5px solid var(--accentL); border-radius: 10px;
          background: var(--white); transition: all 0.2s; white-space: nowrap;
          font-family: var(--ff);
        }
        .bb-link:hover { background: var(--accentL); border-color: var(--accent); }

        /* ── CATEGORIES ── */
        .bb-cat-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem;
        }
        .bb-cat {
          background: var(--white); border: 1.5px solid var(--line);
          border-radius: var(--r); padding: 1.5rem 1.25rem;
          text-align: center; cursor: pointer;
          transition: all 0.22s ease; text-decoration: none; display: block;
        }
        .bb-cat:hover {
          border-color: var(--accent);
          box-shadow: 0 10px 36px rgba(91,76,255,0.12);
          transform: translateY(-4px);
        }
        .bb-cat-em { font-size: 2rem; display: block; margin-bottom: 0.75rem; line-height:1; }
        .bb-cat-name { font-size: 0.875rem; font-weight: 600; color: var(--ink); margin-bottom: 0.3rem; font-family: var(--ffd); }
        .bb-cat-n { font-size: 0.75rem; color: var(--accent); font-weight: 500; }

        /* ── JOBS / COMPANIES GRID ── */
        .bb-jobs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.1rem; }
        .bb-comp-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.1rem; }

        /* ── HOW IT WORKS ── */
        .bb-steps {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 1.5rem; position: relative;
        }
        .bb-steps::before {
          content:''; position:absolute;
          top: 22px; left: calc(12.5% + 14px); right: calc(12.5% + 14px);
          height: 1px;
          background: repeating-linear-gradient(to right, #c4b5fd 0, #c4b5fd 6px, transparent 6px, transparent 14px);
          z-index: 0;
        }
        .bb-step {
          background: var(--white); border: 1.5px solid var(--line);
          border-radius: 20px; padding: 2rem 1.5rem 1.75rem;
          position: relative; z-index: 1;
          transition: all 0.22s ease;
        }
        .bb-step:hover {
          border-color: var(--accent);
          box-shadow: 0 14px 40px rgba(91,76,255,0.1);
          transform: translateY(-5px);
        }
        .bb-step-badge {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, var(--accent), #8B7FFF);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-family: var(--ffd); font-weight: 800; font-size: 0.8rem;
          color: white; margin-bottom: 1.25rem;
          box-shadow: 0 6px 20px rgba(91,76,255,0.3);
        }
        .bb-step-title { font-family: var(--ffd); font-size: 0.975rem; font-weight: 700; color: var(--ink); margin-bottom: 0.6rem; }
        .bb-step-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.65; }

        /* ── TESTIMONIALS ── */
        .bb-test-sec { background: var(--ink2); padding: 6rem 2rem; }
        .bb-test-h2 { color: var(--white); }
        .bb-test-label { color: #A89FFF; }
        .bb-test-sub { color: rgba(255,255,255,0.35); }
        .bb-test-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .bb-tcard {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 2rem;
          transition: all 0.22s;
        }
        .bb-tcard:hover {
          background: rgba(91,76,255,0.1);
          border-color: rgba(168,159,255,0.2);
          transform: translateY(-3px);
        }
        .bb-tquote {
          font-size: 2.5rem; line-height: 1; color: var(--accent);
          font-family: Georgia, serif; margin-bottom: 0.75rem; opacity: 0.6;
        }
        .bb-ttext { font-size: 0.875rem; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 1.75rem; }
        .bb-tauthor { display: flex; align-items: center; gap: 0.875rem; }
        .bb-tavatar {
          width: 42px; height: 42px; border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), #FF4C8B);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem; color: white; flex-shrink: 0;
          font-family: var(--ffd);
        }
        .bb-tname { font-size: 0.875rem; font-weight: 700; color: white; font-family: var(--ffd); }
        .bb-trole { font-size: 0.75rem; color: rgba(255,255,255,0.35); margin-top: 2px; }

        /* ── FAQ ── */
        .bb-faq-list { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
        .bb-faq-item {
          border: 1.5px solid var(--line);
          border-radius: var(--r); overflow: hidden;
          background: var(--white);
          transition: border-color 0.2s;
        }
        .bb-faq-item.open { border-color: var(--accent); }
        .bb-faq-q {
          width: 100%; text-align: left;
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.2rem 1.5rem; gap: 1rem;
          background: transparent; border: none; cursor: pointer;
          font-family: var(--ff); font-size: 0.95rem; font-weight: 600;
          color: var(--ink); transition: color 0.2s;
        }
        .bb-faq-item.open .bb-faq-q { color: var(--accent); }
        .bb-faq-icon {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          background: var(--faint); display: flex; align-items: center; justify-content: center;
          transition: all 0.25s; font-size: 1.1rem; line-height: 1; color: var(--muted);
        }
        .bb-faq-item.open .bb-faq-icon { background: var(--accentL); color: var(--accent); transform: rotate(45deg); }
        .bb-faq-a {
          padding: 0 1.5rem 1.2rem; font-size: 0.875rem; color: var(--muted);
          line-height: 1.75; border-top: 1px solid var(--line);
          padding-top: 1rem;
        }

        /* ── CTA ── */
        .bb-cta-sec { padding: 6rem 2rem; background: var(--white); }
        .bb-cta-box {
          max-width: 1200px; margin: 0 auto;
          background: linear-gradient(135deg, var(--ink2) 0%, #0D0B2E 100%);
          border-radius: 28px; padding: 4.5rem;
          display: flex; justify-content: space-between; align-items: center;
          gap: 3rem; flex-wrap: wrap; position: relative; overflow: hidden;
        }
        .bb-cta-box::before {
          content:''; position:absolute; top:-150px;right:-100px;
          width:450px;height:450px;border-radius:50%;
          background: radial-gradient(circle, rgba(91,76,255,0.25) 0%, transparent 70%);
          pointer-events:none;
        }
        .bb-cta-box::after {
          content:''; position:absolute; bottom:-80px; left:150px;
          width:300px;height:300px;border-radius:50%;
          background: radial-gradient(circle, rgba(255,76,139,0.12) 0%, transparent 70%);
          pointer-events:none;
        }
        .bb-cta-left { position: relative; z-index: 1; max-width: 560px; }
        .bb-cta-badge {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #A89FFF;
          background: rgba(168,159,255,0.12); border: 1px solid rgba(168,159,255,0.2);
          padding: 0.35rem 0.9rem; border-radius: 100px; margin-bottom: 1.25rem;
        }
        .bb-cta-h2 {
          font-family: var(--ffd); font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800; color: var(--white);
          letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 1rem;
        }
        .bb-cta-sub { font-size: 0.95rem; color: rgba(255,255,255,0.5); line-height: 1.7; }
        .bb-cta-btns { display: flex; flex-direction: column; gap: 0.875rem; position:relative;z-index:1;flex-shrink:0; }
        .bb-btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 0.95rem 2.25rem; border-radius: 12px;
          background: linear-gradient(135deg, var(--accent), #8B7FFF);
          color: white; border: none; cursor: pointer;
          font-family: var(--ff); font-size: 0.9rem; font-weight: 600;
          text-decoration: none; transition: all 0.2s; white-space: nowrap;
          box-shadow: 0 8px 24px rgba(91,76,255,0.35);
        }
        .bb-btn-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .bb-btn-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 0.95rem 2.25rem; border-radius: 12px;
          background: transparent; color: rgba(255,255,255,0.7);
          border: 1.5px solid rgba(255,255,255,0.15); cursor: pointer;
          font-family: var(--ff); font-size: 0.9rem; font-weight: 600;
          text-decoration: none; transition: all 0.2s; white-space: nowrap;
        }
        .bb-btn-ghost:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.4); }

        /* ── EMPTY STATE ── */
        .bb-empty {
          text-align: center; padding: 3rem 1rem;
          color: var(--muted); font-size: 0.88rem; grid-column: 1 / -1;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .bb-cat-grid { grid-template-columns: repeat(4,1fr); }
          .bb-jobs-grid { grid-template-columns: repeat(2,1fr); }
          .bb-comp-grid { grid-template-columns: repeat(2,1fr); }
          .bb-steps { grid-template-columns: repeat(2,1fr); }
          .bb-steps::before { display: none; }
          .bb-test-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 768px) {
          .bb-hero-body { padding: 6rem 1.25rem 3rem; }
          .bb-search { flex-direction: column; }
          .bb-sdiv { display: none; }
          .bb-sbtn { width: 100%; border-radius: 12px; }
          .bb-statsbar-inner { grid-template-columns: repeat(2,1fr); gap: 0; }
          .bb-stat:not(:last-child)::after { display:none; }
          .bb-stat { padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .bb-cat-grid { grid-template-columns: repeat(2,1fr); }
          .bb-jobs-grid { grid-template-columns: 1fr; }
          .bb-comp-grid { grid-template-columns: repeat(2,1fr); }
          .bb-steps { grid-template-columns: 1fr; }
          .bb-test-grid { grid-template-columns: 1fr; }
          .bb-cta-box { flex-direction: column; padding: 2.5rem 1.75rem; align-items: flex-start; }
          .bb-cta-btns { width: 100%; }
          .bb-btn-primary, .bb-btn-ghost { width: 100%; }
          .bb-sec-row { flex-direction: column; align-items: flex-start; }
          .bb-sec { padding: 4rem 1.25rem; }
        }
        @media (max-width: 480px) {
          .bb-cat-grid { grid-template-columns: 1fr 1fr; }
          .bb-comp-grid { grid-template-columns: 1fr; }
          .bb-faq-q { font-size: 0.875rem; }
        }
      `}</style>

      <div className="bb">
        <Navbar />

        {/* ── HERO ── */}
        <section className="bb-hero">
          <div className="bb-hero-bg">
            <div className="bb-hero-orb1" />
            <div className="bb-hero-orb2" />
            <div className="bb-hero-grid" />
          </div>

          <div className="bb-hero-body">
            <div className="bb-hero-inner">
              <div className="bb-pill">
                <span className="bb-pill-dot" />
                AI-Powered Hiring Platform
              </div>
              <h1 className="bb-hero-h1">
                Hire Smarter.<br />
                Get Hired <em>Faster.</em>
              </h1>
              <p className="bb-hero-sub">
                Connect top talent with leading companies through intelligent AI interviews
                — screening smarter, matching faster, and eliminating guesswork.
              </p>

              <div className="bb-search">
                <div className="bb-sf">
                  <svg viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input type="text" placeholder="Job title or keywords"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="bb-sdiv" />
                <div className="bb-sf">
                  <svg viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input type="text" placeholder="City or remote"
                    value={searchLocation} onChange={e => setSearchLocation(e.target.value)} />
                </div>
                <button className="bb-sbtn">Search Jobs</button>
              </div>

              <div className="bb-tags">
                <span>Popular:</span>
                {['React Developer', 'Product Manager', 'UI Designer', 'Data Analyst'].map(tag => (
                  <Link key={tag} to="/jobs" className="bb-tag">{tag}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="bb-statsbar" ref={statsRef}>
            <div className="bb-statsbar-inner">
              {[
                { num: `${stats.totalJobs || '1,500'}+`, label: 'Active Jobs' },
                { num: `${stats.totalCompanies || '500'}+`, label: 'Companies' },
                { num: `${stats.activeCandidates || '10K'}+`, label: 'Candidates' },
                { num: `${stats.placements || '94'}%`, label: 'Success Rate' },
              ].map(s => (
                <div key={s.label} className="bb-stat">
                  <span className="bb-stat-num">{s.num}</span>
                  <span className="bb-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="bb-sec">
          <div className="bb-wrap">
            <div className="bb-sec-center">
              <p className="bb-sec-label">Explore</p>
              <h2 className="bb-sec-h2">Browse by Category</h2>
              <p className="bb-sec-sub">Thousands of jobs across every industry</p>
            </div>
            <div className="bb-cat-grid">
              {categories.map(cat => (
                <Link to="/jobs" key={cat.label} className="bb-cat">
                  <span className="bb-cat-em">{cat.emoji}</span>
                  <div className="bb-cat-name">{cat.label}</div>
                  <div className="bb-cat-n">{cat.count} jobs</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED JOBS ── */}
        <section className="bb-sec bb-sec-alt">
          <div className="bb-wrap">
            <div className="bb-sec-row">
              <div>
                <p className="bb-sec-label">Opportunities</p>
                <h2 className="bb-sec-h2">Featured Jobs</h2>
                <p className="bb-sec-sub">Handpicked positions from top employers</p>
              </div>
              <Link to="/jobs" className="bb-link">Browse All Jobs →</Link>
            </div>
            <div className="bb-jobs-grid">
              {featuredJobs.length > 0
                ? featuredJobs.map(job => <JobCard key={job.id} job={job} />)
                : <div className="bb-empty">No jobs posted yet. Be the first to post!</div>}
            </div>
          </div>
        </section>

        {/* ── TOP COMPANIES ── */}
        <section className="bb-sec">
          <div className="bb-wrap">
            <div className="bb-sec-row">
              <div>
                <p className="bb-sec-label">Employers</p>
                <h2 className="bb-sec-h2">Top Companies Hiring</h2>
                <p className="bb-sec-sub">Join innovative teams building the future</p>
              </div>
              <Link to="/companies" className="bb-link">View All Companies →</Link>
            </div>
            <div className="bb-comp-grid">
              {topCompanies.length > 0
                ? topCompanies.map(company => <CompanyCard key={company.id} company={company} />)
                : <div className="bb-empty">Companies will appear here once they sign up.</div>}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bb-sec bb-sec-alt">
          <div className="bb-wrap">
            <div className="bb-sec-center">
              <p className="bb-sec-label">Process</p>
              <h2 className="bb-sec-h2">How It Works</h2>
              <p className="bb-sec-sub">Four simple steps to smarter hiring</p>
            </div>
            <div className="bb-steps">
              {steps.map(step => (
                <div key={step.num} className="bb-step">
                  <div className="bb-step-badge">{step.num}</div>
                  <div className="bb-step-title">{step.title}</div>
                  <p className="bb-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="bb-test-sec">
          <div className="bb-wrap">
            <div className="bb-sec-center">
              <p className="bb-sec-label bb-test-label">Reviews</p>
              <h2 className="bb-sec-h2 bb-test-h2">Trusted by Thousands</h2>
              <p className="bb-sec-sub bb-test-sub">What hiring teams and candidates say about us</p>
            </div>
            <div className="bb-test-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="bb-tcard">
                  <div className="bb-tquote">"</div>
                  <p className="bb-ttext">{t.text}</p>
                  <div className="bb-tauthor">
                    <div className="bb-tavatar">{t.initials}</div>
                    <div>
                      <div className="bb-tname">{t.name}</div>
                      <div className="bb-trole">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bb-sec">
          <div className="bb-wrap">
            <div className="bb-sec-center">
              <p className="bb-sec-label">FAQ</p>
              <h2 className="bb-sec-h2">Frequently Asked Questions</h2>
              <p className="bb-sec-sub">Everything you need to know about BotBoss</p>
            </div>
            <div className="bb-faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`bb-faq-item${openFaq === i ? ' open' : ''}`}>
                  <button className="bb-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <span className="bb-faq-icon">+</span>
                  </button>
                  {openFaq === i && (
                    <div className="bb-faq-a">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bb-cta-sec">
          <div className="bb-cta-box">
            <div className="bb-cta-left">
              <span className="bb-cta-badge">Get Started Today</span>
              <h2 className="bb-cta-h2">Ready to Transform<br />Your Hiring Process?</h2>
              <p className="bb-cta-sub">
                Join thousands of companies and candidates using AI-powered interviews
                to find the perfect match — faster, smarter, and more accurately.
              </p>
            </div>
            <div className="bb-cta-btns">
              <Link to="/signup?type=candidate" className="bb-btn-primary">
                Find Jobs Now
              </Link>
              <Link to="/signup?type=company" className="bb-btn-ghost">
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
