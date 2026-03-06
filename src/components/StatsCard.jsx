import React from 'react';

const StatsCard = ({ icon, number, label, bgColor = '#f8f9fa' }) => {
  const styles = {
    card: {
      backgroundColor: bgColor,
      padding: '2rem',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    icon: {
      fontSize: '2.5rem',
      marginBottom: '1rem'
    },
    number: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem'
    },
    label: {
      color: '#666',
      fontSize: '1rem'
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.icon}>{icon}</div>
      <div style={styles.number}>{number}</div>
      <div style={styles.label}>{label}</div>
    </div>
  );
};

export default StatsCard;