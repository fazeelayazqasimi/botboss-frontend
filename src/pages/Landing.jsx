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
    placements: 0
  });
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);

  useEffect(() => {
    initializeLocalStorage();
    setStats(getStats());

    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setFeaturedJobs(jobs.slice(0, 6));

    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    setTopCompanies(companies.slice(0, 4));
  }, []);

  const styles = {
    // Hero Section - Modern gradient with your colors
    hero: {
      position: 'relative',
      padding: '6rem 5%',
      background: 'linear-gradient(135deg, #011f4b 0%, #03396c 50%, #005b96 100%)',
      color: 'white',
      overflow: 'hidden'
    },
    heroPattern: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(100, 151, 177, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none'
    },
    heroContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      gap: '4rem',
      '@media (max-width: 968px)': {
        flexDirection: 'column',
        textAlign: 'center',
        gap: '3rem'
      }
    },
    heroContent: {
      flex: 1,
      maxWidth: '600px'
    },
    heroBadge: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      background: 'rgba(100, 151, 177, 0.2)',
      border: '1px solid rgba(100, 151, 177, 0.5)',
      borderRadius: '50px',
      fontSize: '0.875rem',
      marginBottom: '1.5rem',
      color: '#b3cde0'
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: 800,
      marginBottom: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (max-width: 768px)': {
        fontSize: '2.5rem'
      }
    },
    highlight: {
      color: '#b3cde0',
      position: 'relative',
      display: 'inline-block',
      '::after': {
        content: '""',
        position: 'absolute',
        bottom: '5px',
        left: 0,
        width: '100%',
        height: '8px',
        background: 'rgba(179, 205, 224, 0.3)',
        zIndex: -1
      }
    },
    heroText: {
      fontSize: '1.25rem',
      marginBottom: '2.5rem',
      opacity: 0.9,
      lineHeight: 1.6,
      color: '#e0e0e0'
    },
    heroButtons: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '3rem',
      '@media (max-width: 768px)': {
        justifyContent: 'center'
      }
    },
    btnPrimary: {
      padding: '1rem 2.5rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: 600,
      background: '#b3cde0',
      color: '#011f4b',
      fontSize: '1rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      ':hover': {
        background: '#ffffff',
        transform: 'translateY(-2px)',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
      }
    },
    btnSecondary: {
      padding: '1rem 2.5rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: 600,
      background: 'transparent',
      color: 'white',
      border: '2px solid rgba(179, 205, 224, 0.5)',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ':hover': {
        background: 'rgba(179, 205, 224, 0.1)',
        borderColor: '#b3cde0',
        transform: 'translateY(-2px)'
      }
    },
    heroStats: {
      display: 'flex',
      gap: '3rem',
      '@media (max-width: 768px)': {
        justifyContent: 'center'
      }
    },
    heroStat: {
      textAlign: 'left',
      '@media (max-width: 768px)': {
        textAlign: 'center'
      }
    },
    statNumber: {
      display: 'block',
      fontSize: '2rem',
      fontWeight: 800,
      color: '#b3cde0',
      marginBottom: '0.25rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      opacity: 0.8,
      color: '#e0e0e0'
    },
    heroImage: {
      flex: 1,
      position: 'relative'
    },
    heroImg: {
      width: '100%',
      maxWidth: '500px',
      borderRadius: '20px',
      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    heroImageBadge: {
      position: 'absolute',
      bottom: '-20px',
      left: '-20px',
      background: '#005b96',
      padding: '1rem',
      borderRadius: '10px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(179, 205, 224, 0.3)'
    },

    // Stats Section
    statsSection: {
      padding: '4rem 5%',
      background: '#f8fafc'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },

    // Featured Jobs Section
    featuredJobs: {
      padding: '5rem 5%',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '3rem',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'center'
      }
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#011f4b',
      margin: 0,
      position: 'relative',
      display: 'inline-block',
      '::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: 0,
        width: '60px',
        height: '4px',
        background: '#005b96',
        borderRadius: '2px'
      }
    },
    viewAll: {
      color: '#005b96',
      textDecoration: 'none',
      fontWeight: 600,
      padding: '0.75rem 1.5rem',
      border: '2px solid #005b96',
      borderRadius: '50px',
      transition: 'all 0.3s ease',
      ':hover': {
        background: '#005b96',
        color: 'white'
      }
    },
    jobsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem'
    },

    // Top Companies Section
    topCompanies: {
      padding: '5rem 5%',
      background: '#f8fafc'
    },
    companiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },

    // How It Works Section - Redesigned
    howItWorks: {
      padding: '5rem 5%',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginTop: '4rem'
    },
    step: {
      position: 'relative',
      padding: '2.5rem 2rem',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(1, 31, 75, 0.1)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(179, 205, 224, 0.3)',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 40px rgba(1, 31, 75, 0.15)',
        borderColor: '#005b96'
      }
    },
    stepIcon: {
      width: '80px',
      height: '80px',
      background: '#b3cde0',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      fontSize: '2rem',
      color: '#011f4b'
    },
    stepNumber: {
      position: 'absolute',
      top: '-15px',
      right: '-15px',
      width: '40px',
      height: '40px',
      background: '#005b96',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: '1.2rem',
      border: '3px solid white'
    },
    stepTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#011f4b',
      marginBottom: '0.75rem'
    },
    stepDesc: {
      color: '#4a5568',
      lineHeight: 1.6,
      fontSize: '1rem'
    },

    // Testimonials - Redesigned with your colors
    testimonials: {
      padding: '5rem 5%',
      background: 'linear-gradient(135deg, #011f4b 0%, #03396c 100%)',
      color: 'white'
    },
    testimonialsHeader: {
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto 3rem'
    },
    testimonialsTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: 'white'
    },
    testimonialsSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      color: '#b3cde0'
    },
    testimonialsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    testimonial: {
      background: 'rgba(179, 205, 224, 0.1)',
      padding: '2rem',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(179, 205, 224, 0.2)',
      transition: 'all 0.3s ease',
      ':hover': {
        background: 'rgba(179, 205, 224, 0.15)',
        transform: 'translateY(-5px)'
      }
    },
    testimonialQuote: {
      fontSize: '3rem',
      lineHeight: 1,
      marginBottom: '1rem',
      color: '#b3cde0',
      opacity: 0.5
    },
    testimonialText: {
      fontStyle: 'italic',
      marginBottom: '1.5rem',
      lineHeight: 1.6,
      color: '#f0f0f0'
    },
    testimonialAuthor: {
      fontWeight: 700,
      color: '#b3cde0',
      marginBottom: '0.25rem'
    },
    testimonialRole: {
      fontSize: '0.875rem',
      opacity: 0.7
    },

    // CTA Section - Modern redesign
    ctaSection: {
      padding: '5rem 5%',
      background: 'white'
    },
    ctaContent: {
      maxWidth: '1000px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f6 100%)',
      padding: '4rem',
      borderRadius: '40px',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(1, 31, 75, 0.1)',
      border: '1px solid rgba(179, 205, 224, 0.5)'
    },
    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#011f4b',
      marginBottom: '1rem'
    },
    ctaText: {
      fontSize: '1.2rem',
      color: '#03396c',
      marginBottom: '2.5rem',
      maxWidth: '600px',
      margin: '0 auto 2.5rem'
    },
    ctaButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'center'
      }
    },
    btnLarge: {
      padding: '1.2rem 3rem',
      fontSize: '1.1rem'
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <span style={styles.heroBadge}>🚀 AI-POWERED HIRING PLATFORM</span>
            <h1 style={styles.heroTitle}>
              Transform Your Hiring with{' '}
              <span style={styles.highlight}>Intelligent Interviews</span>
            </h1>
            <p style={styles.heroText}>
              Connect with top talent and companies. Let AI handle the initial screening 
              with intelligent interviews and advanced analytics.
            </p>
            
            <div style={styles.heroButtons}>
              <Link to="/signup?type=candidate" style={styles.btnPrimary}>
                Find Jobs
              </Link>
              <Link to="/signup?type=company" style={styles.btnSecondary}>
                Hire Talent
              </Link>
            </div>

            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <span style={styles.statNumber}>10,000+</span>
                <span style={styles.statLabel}>Candidates</span>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.statNumber}>500+</span>
                <span style={styles.statLabel}>Companies</span>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.statNumber}>1,500+</span>
                <span style={styles.statLabel}>Jobs Posted</span>
              </div>
            </div>
          </div>
          
          <div style={styles.heroImage}>
            <img 
              src="https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="AI Interview" 
              style={styles.heroImg}
            />
            <div style={styles.heroImageBadge}>
              <span style={{fontWeight: 700, color: '#b3cde0'}}>94%</span>
              <span style={{color: 'white', fontSize: '0.9rem'}}> Hiring Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <StatsCard 
            icon="💼"
            number={stats.activeJobs || 45}
            label="Active Jobs"
            bgColor="#b3cde0"
            textColor="#011f4b"
          />
          <StatsCard 
            icon="🏢"
            number={stats.totalCompanies || 28}
            label="Companies"
            bgColor="#6497b1"
            textColor="white"
          />
          <StatsCard 
            icon="👥"
            number={stats.activeCandidates || 156}
            label="Active Candidates"
            bgColor="#005b96"
            textColor="white"
          />
          <StatsCard 
            icon="🎯"
            number={stats.placements || 32}
            label="Placements"
            bgColor="#03396c"
            textColor="white"
          />
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={styles.featuredJobs}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Featured Jobs</h2>
            <p style={{color: '#4a5568', marginTop: '0.5rem'}}>Discover opportunities that match your skills</p>
          </div>
          <Link to="/jobs" style={styles.viewAll}>Browse All Jobs →</Link>
        </div>

        <div style={styles.jobsGrid}>
          {featuredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Top Companies Section */}
      <section style={styles.topCompanies}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Top Companies Hiring</h2>
            <p style={{color: '#4a5568', marginTop: '0.5rem'}}>Join industry leaders and innovative startups</p>
          </div>
          <Link to="/companies" style={styles.viewAll}>View All Companies →</Link>
        </div>

        <div style={styles.companiesGrid}>
          {topCompanies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h2 style={{...styles.sectionTitle, textAlign: 'center', '::after': {left: '50%', transform: 'translateX(-50%)'}}}>How AI Interview Works</h2>
          <p style={{color: '#4a5568', marginTop: '1rem', fontSize: '1.1rem'}}>Four simple steps to smarter hiring</p>
        </div>
        
        <div style={styles.stepsGrid}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepIcon}>📋</div>
            <h3 style={styles.stepTitle}>Post a Job</h3>
            <p style={styles.stepDesc}>Companies post detailed job requirements and expectations</p>
          </div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepIcon}>👥</div>
            <h3 style={styles.stepTitle}>Candidates Apply</h3>
            <p style={styles.stepDesc}>Qualified candidates apply for matching positions</p>
          </div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepIcon}>🤖</div>
            <h3 style={styles.stepTitle}>AI Interview</h3>
            <p style={styles.stepDesc}>AI-powered interviews with advanced analytics</p>
          </div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>4</div>
            <div style={styles.stepIcon}>📊</div>
            <h3 style={styles.stepTitle}>Get Reports</h3>
            <p style={styles.stepDesc}>Receive detailed analysis and candidate scores</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.testimonials}>
        <div style={styles.testimonialsHeader}>
          <h2 style={styles.testimonialsTitle}>Trusted by Hiring Teams Worldwide</h2>
          <p style={styles.testimonialsSubtitle}>See what companies and candidates say about our platform</p>
        </div>
        
        <div style={styles.testimonialsGrid}>
          <div style={styles.testimonial}>
            <div style={styles.testimonialQuote}>"</div>
            <p style={styles.testimonialText}>The AI interview feature saved us hours of initial screening. The analytics are incredibly accurate and have helped us find better candidates faster.</p>
            <div>
              <div style={styles.testimonialAuthor}>Rajesh Kumar</div>
              <div style={styles.testimonialRole}>HR Manager, TechCorp</div>
            </div>
          </div>

          <div style={styles.testimonial}>
            <div style={styles.testimonialQuote}>"</div>
            <p style={styles.testimonialText}>I got my dream job through this platform. The AI interview felt natural and the detailed feedback helped me showcase my skills better.</p>
            <div>
              <div style={styles.testimonialAuthor}>Priya Singh</div>
              <div style={styles.testimonialRole}>Frontend Developer</div>
            </div>
          </div>

          <div style={styles.testimonial}>
            <div style={styles.testimonialQuote}>"</div>
            <p style={styles.testimonialText}>As a startup, we found amazing talent quickly. The AI screening ensures we only interview serious candidates who are the right fit.</p>
            <div>
              <div style={styles.testimonialAuthor}>Ankit Mehta</div>
              <div style={styles.testimonialRole}>Founder, StartupHub</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Transform Your Hiring Process?</h2>
          <p style={styles.ctaText}>Join thousands of companies and candidates using AI-powered interviews to find the perfect match</p>
          <div style={styles.ctaButtons}>
            <Link to="/signup?type=candidate" style={{...styles.btnPrimary, ...styles.btnLarge}}>
              Get Started as Candidate
            </Link>
            <Link to="/signup?type=company" style={{...styles.btnSecondary, ...styles.btnLarge, background: '#011f4b', color: 'white', border: 'none'}}>
              Post a Job for Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Landing;