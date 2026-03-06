import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const styles = {
    card: {
      background: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, boxShadow 0.3s',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.15)'
      }
    },
    header: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem'
    },
    logo: {
      width: '50px',
      height: '50px',
      borderRadius: '10px',
      objectFit: 'cover'
    },
    titleCompany: {
      flex: 1
    },
    title: {
      fontSize: '1.1rem',
      marginBottom: '0.25rem',
      color: '#333'
    },
    company: {
      color: '#666',
      fontSize: '0.9rem'
    },
    details: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      marginBottom: '1rem',
      fontSize: '0.9rem'
    },
    detail: {
      background: '#f3f4f6',
      padding: '0.25rem 0.75rem',
      borderRadius: '15px',
      color: '#4b5563'
    },
    skills: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    skill: {
      background: '#e5e7eb',
      padding: '0.2rem 0.5rem',
      borderRadius: '3px',
      fontSize: '0.8rem',
      color: '#374151'
    },
    moreSkill: {
      background: '#667eea',
      color: 'white',
      padding: '0.2rem 0.5rem',
      borderRadius: '3px',
      fontSize: '0.8rem'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e5e7eb'
    },
    applicants: {
      color: '#6b7280',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    viewBtn: {
      background: 'transparent',
      border: '1px solid #667eea',
      color: '#667eea',
      padding: '0.4rem 1rem',
      borderRadius: '5px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'all 0.3s',
      cursor: 'pointer',
      ':hover': {
        background: '#667eea',
        color: 'white'
      }
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <img src={job.companyLogo} alt={job.company} style={styles.logo} />
        <div style={styles.titleCompany}>
          <h3 style={styles.title}>{job.title}</h3>
          <p style={styles.company}>{job.company}</p>
        </div>
      </div>
      
      <div style={styles.details}>
        <span style={styles.detail}>📍 {job.location}</span>
        <span style={styles.detail}>💰 {job.salary}</span>
        <span style={styles.detail}>⏰ {job.type}</span>
      </div>

      <div style={styles.skills}>
        {job.requirements.slice(0, 3).map((skill, index) => (
          <span key={index} style={styles.skill}>{skill}</span>
        ))}
        {job.requirements.length > 3 && (
          <span style={styles.moreSkill}>+{job.requirements.length - 3}</span>
        )}
      </div>

      <div style={styles.footer}>
        <span style={styles.applicants}>
          👥 {job.applicants} applicants
        </span>
        <Link to={`/job/${job.id}`} style={styles.viewBtn}>
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;