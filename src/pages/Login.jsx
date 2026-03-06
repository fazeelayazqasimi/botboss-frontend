import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user (case-insensitive email)
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password && 
      u.type === userType
    );
    
    if (user) {
      // Store user in localStorage (without password)
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Redirect based on user type
      if (userType === 'company') {
        navigate('/company/dashboard');
      } else {
        navigate('/jobs');
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
    
    setLoading(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    main: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      width: '100%',
      maxWidth: '450px',
      padding: '2.5rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#666',
      fontSize: '0.95rem'
    },
    userType: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      justifyContent: 'center'
    },
    userTypeLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '30px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: '#f3f4f6'
    },
    userTypeSelected: {
      background: '#667eea',
      color: 'white'
    },
    userTypeInput: {
      display: 'none'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.3rem'
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#4b5563'
    },
    input: {
      padding: '0.75rem 1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'border-color 0.3s',
      outline: 'none',
      ':focus': {
        borderColor: '#667eea'
      }
    },
    error: {
      color: '#f44336',
      fontSize: '0.9rem',
      textAlign: 'center',
      marginTop: '0.5rem',
      padding: '0.5rem',
      background: '#ffebee',
      borderRadius: '5px'
    },
    button: {
      background: '#667eea',
      color: 'white',
      padding: '0.75rem',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background 0.3s',
      marginTop: '0.5rem',
      ':hover': {
        background: '#764ba2'
      },
      ':disabled': {
        opacity: 0.7,
        cursor: 'not-allowed'
      }
    },
    footer: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#666'
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: 600,
      ':hover': {
        textDecoration: 'underline'
      }
    },
    demoNote: {
      marginTop: '2rem',
      padding: '1rem',
      background: '#f3f4f6',
      borderRadius: '10px',
      fontSize: '0.9rem',
      textAlign: 'center',
      color: '#666'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Login to your account</p>
          </div>

          <div style={styles.userType}>
            <label style={{
              ...styles.userTypeLabel,
              ...(userType === 'candidate' ? styles.userTypeSelected : {})
            }}>
              <input
                type="radio"
                name="userType"
                value="candidate"
                checked={userType === 'candidate'}
                onChange={(e) => setUserType(e.target.value)}
                style={styles.userTypeInput}
              />
              🎯 Candidate
            </label>
            <label style={{
              ...styles.userTypeLabel,
              ...(userType === 'company' ? styles.userTypeSelected : {})
            }}>
              <input
                type="radio"
                name="userType"
                value="company"
                checked={userType === 'company'}
                onChange={(e) => setUserType(e.target.value)}
                style={styles.userTypeInput}
              />
              🏢 Company
            </label>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={styles.footer}>
            Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
          </div>

          <div style={styles.demoNote}>
            <strong>📝 Note:</strong> Sign up first, then login with your credentials!
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;