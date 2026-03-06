import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const styles = {
    navbar: {
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      textDecoration: 'none',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    logoText: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    menuIcon: {
      display: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      '@media (max-width: 768px)': {
        display: 'block'
      }
    },
    navMenu: {
      display: 'flex',
      listStyle: 'none',
      gap: '2rem',
      margin: 0,
      padding: 0,
      '@media (max-width: 768px)': {
        display: menuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        position: 'absolute',
        top: '70px',
        left: 0,
        right: 0,
        background: 'white',
        padding: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        gap: '1rem'
      }
    },
    navItem: {
      margin: 0
    },
    navLink: {
      textDecoration: 'none',
      color: '#333',
      fontWeight: 500,
      transition: 'color 0.3s',
      cursor: 'pointer',
      ':hover': {
        color: '#667eea'
      }
    },
    navAuth: {
      display: 'flex',
      gap: '1rem',
      '@media (max-width: 768px)': {
        display: menuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        position: 'absolute',
        top: '280px',
        left: 0,
        right: 0,
        background: 'white',
        padding: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        gap: '1rem'
      }
    },
    loginBtn: {
      padding: '8px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
      fontWeight: 500,
      color: '#667eea',
      border: '1px solid #667eea',
      background: 'transparent',
      transition: 'all 0.3s',
      cursor: 'pointer',
      display: 'inline-block',
      textAlign: 'center',
      ':hover': {
        background: '#667eea',
        color: 'white'
      }
    },
    signupBtn: {
      padding: '8px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
      fontWeight: 500,
      background: '#667eea',
      color: 'white',
      border: '1px solid #667eea',
      transition: 'all 0.3s',
      cursor: 'pointer',
      display: 'inline-block',
      textAlign: 'center',
      ':hover': {
        background: '#764ba2',
        borderColor: '#764ba2'
      }
    },
    logoutBtn: {
      padding: '8px 20px',
      borderRadius: '5px',
      fontWeight: 500,
      background: '#f44336',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      ':hover': {
        background: '#d32f2f'
      }
    },
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    userName: {
      color: '#333',
      fontWeight: 500
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>AI Interview Platform</span>
        </Link>

        <div style={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </div>

        <ul style={styles.navMenu}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.navLink}>Home</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/jobs" style={styles.navLink}>Jobs</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/companies" style={styles.navLink}>Companies</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/about" style={styles.navLink}>About</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/contact" style={styles.navLink}>Contact</Link>
          </li>
          {user && user.type === 'candidate' && (
            <li style={styles.navItem}>
              <Link to="/my-applications" style={styles.navLink}>My Applications</Link>
            </li>
          )}
          {user && user.type === 'company' && (
            <li style={styles.navItem}>
              <Link to="/my-jobs" style={styles.navLink}>My Jobs</Link>
            </li>
          )}
        </ul>

        <div style={styles.navAuth}>
          {user ? (
            <div style={styles.userMenu}>
              <span style={styles.userName}>Hi, {user.name?.split(' ')[0] || user.email}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;