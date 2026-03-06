import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const styles = {
    footer: {
      background: '#2d3748',
      color: 'white',
      padding: '3rem 0 1rem'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem'
    },
    section: {
      marginBottom: '1.5rem'
    },
    heading: {
      fontSize: '1.2rem',
      marginBottom: '1rem',
      color: '#ffd700'
    },
    description: {
      color: '#cbd5e0',
      lineHeight: 1.6
    },
    linkList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    linkItem: {
      marginBottom: '0.5rem'
    },
    link: {
      color: '#cbd5e0',
      textDecoration: 'none',
      transition: 'color 0.3s',
      cursor: 'pointer',
      ':hover': {
        color: '#ffd700'
      }
    },
    bottom: {
      textAlign: 'center',
      padding: '2rem 2rem 0',
      marginTop: '2rem',
      borderTop: '1px solid #4a5568',
      color: '#a0aec0'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>AI Interview Platform</h3>
          <p style={styles.description}>
            Revolutionizing job interviews with AI technology. 
            Connect with top talent and companies through intelligent interviews.
          </p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.linkList}>
            <li style={styles.linkItem}><Link to="/" style={styles.link}>Home</Link></li>
            <li style={styles.linkItem}><Link to="/jobs" style={styles.link}>Jobs</Link></li>
            <li style={styles.linkItem}><Link to="/companies" style={styles.link}>Companies</Link></li>
            <li style={styles.linkItem}><Link to="/about" style={styles.link}>About Us</Link></li>
            <li style={styles.linkItem}><Link to="/contact" style={styles.link}>Contact</Link></li>
          </ul>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>For Candidates</h4>
          <ul style={styles.linkList}>
            <li style={styles.linkItem}><Link to="/signup?type=candidate" style={styles.link}>Create Account</Link></li>
            <li style={styles.linkItem}><Link to="/jobs" style={styles.link}>Browse Jobs</Link></li>
            <li style={styles.linkItem}><Link to="/interview-tips" style={styles.link}>Interview Tips</Link></li>
            <li style={styles.linkItem}><Link to="/faq" style={styles.link}>FAQ</Link></li>
          </ul>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>For Companies</h4>
          <ul style={styles.linkList}>
            <li style={styles.linkItem}><Link to="/signup?type=company" style={styles.link}>Post a Job</Link></li>
            <li style={styles.linkItem}><Link to="/pricing" style={styles.link}>Pricing</Link></li>
            <li style={styles.linkItem}><Link to="/solutions" style={styles.link}>Solutions</Link></li>
            <li style={styles.linkItem}><Link to="/contact" style={styles.link}>Contact Sales</Link></li>
          </ul>
        </div>
      </div>

      <div style={styles.bottom}>
        <p>&copy; 2026 AI Interview Platform. All rights reserved. Made with ❤️ in India</p>
      </div>
    </footer>
  );
};

export default Footer;