import React from 'react';
import { Link } from 'react-router-dom';

const CompanyCard = ({ company }) => {
  const styles = {
    card: {
      background: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s',
      ':hover': {
        transform: 'translateY(-5px)'
      }
    },
    logo: {
      width: '80px',
      height: '80px',
      borderRadius: '10px',
      marginBottom: '1rem',
      objectFit: 'cover'
    },
    name: {
      fontSize: '1.2rem',
      marginBottom: '0.5rem',
      color: '#333'
    },
    industry: {
      color: '#666',
      fontSize: '0.9rem',
      marginBottom: '0.5rem'
    },
    jobs: {
      color: '#667eea',
      fontWeight: 600,
      marginBottom: '0.5rem'
    },
    rating: {
      color: '#ffd700',
      marginBottom: '1rem'
    },
    viewBtn: {
      display: 'inline-block',
      background: 'transparent',
      border: '1px solid #667eea',
      color: '#667eea',
      padding: '0.5rem 1.5rem',
      borderRadius: '5px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'all 0.3s',
      ':hover': {
        background: '#667eea',
        color: 'white'
      }
    }
  };

  return (
    <div style={styles.card}>
      <img src={company.logo} alt={company.name} style={styles.logo} />
      <h3 style={styles.name}>{company.name}</h3>
      <p style={styles.industry}>{company.industry}</p>
      <p style={styles.jobs}>{company.openPositions} open positions</p>
      <div style={styles.rating}>
        {'★'.repeat(Math.floor(company.rating))}
        {'☆'.repeat(5 - Math.floor(company.rating))}
        <span style={{ color: '#666', marginLeft: '0.25rem' }}>{company.rating}</span>
      </div>
      <Link to={`/company/${company.id}`} style={styles.viewBtn}>
        View Profile
      </Link>
    </div>
  );
};

export default CompanyCard;