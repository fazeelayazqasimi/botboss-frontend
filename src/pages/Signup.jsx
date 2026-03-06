import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'candidate'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === formData.email);
    if (existingUser) {
      setError('Email already registered. Please login.');
      setLoading(false);
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(), // Unique ID using timestamp
      name: formData.name,
      email: formData.email,
      password: formData.password, // In real app, hash this!
      type: formData.userType,
      createdAt: new Date().toISOString(),
      profileComplete: false
    };

    // Save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // If candidate, create candidate profile
    if (formData.userType === 'candidate') {
      const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      const newCandidate = {
        id: Date.now() + 1,
        userId: newUser.id,
        name: formData.name,
        email: formData.email,
        role: '',
        experience: '',
        location: '',
        skills: [],
        availability: '',
        expectedSalary: '',
        profileComplete: false,
        avatar: `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=667eea&color=fff&size=100`,
        appliedJobs: [],
        createdAt: new Date().toISOString()
      };
      candidates.push(newCandidate);
      localStorage.setItem('candidates', JSON.stringify(candidates));
    }

    // If company, create company profile
    if (formData.userType === 'company') {
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const newCompany = {
        id: Date.now() + 2,
        userId: newUser.id,
        name: formData.name,
        email: formData.email,
        industry: '',
        location: '',
        description: '',
        logo: `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=764ba2&color=fff&size=100`,
        openPositions: 0,
        rating: 0,
        createdAt: new Date().toISOString()
      };
      companies.push(newCompany);
      localStorage.setItem('companies', JSON.stringify(companies));
    }

    setSuccess('Account created successfully! Redirecting to login...');
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);

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
      maxWidth: '500px',
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
    success: {
      color: '#4caf50',
      fontSize: '0.9rem',
      textAlign: 'center',
      marginTop: '0.5rem',
      padding: '0.5rem',
      background: '#e8f5e8',
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
    terms: {
      fontSize: '0.85rem',
      color: '#666',
      textAlign: 'center',
      marginTop: '1rem'
    },
    passwordHint: {
      fontSize: '0.8rem',
      color: '#666',
      marginTop: '0.25rem'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Join our platform today</p>
          </div>

          <div style={styles.userType}>
            <label style={{
              ...styles.userTypeLabel,
              ...(formData.userType === 'candidate' ? styles.userTypeSelected : {})
            }}>
              <input
                type="radio"
                name="userType"
                value="candidate"
                checked={formData.userType === 'candidate'}
                onChange={handleChange}
                style={styles.userTypeInput}
              />
              🎯 I'm a Candidate
            </label>
            <label style={{
              ...styles.userTypeLabel,
              ...(formData.userType === 'company' ? styles.userTypeSelected : {})
            }}>
              <input
                type="radio"
                name="userType"
                value="company"
                checked={formData.userType === 'company'}
                onChange={handleChange}
                style={styles.userTypeInput}
              />
              🏢 I'm a Company
            </label>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <div style={styles.passwordHint}>Must be at least 6 characters</div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div style={styles.footer}>
            Already have an account? <Link to="/login" style={styles.link}>Login</Link>
          </div>

          <div style={styles.terms}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;