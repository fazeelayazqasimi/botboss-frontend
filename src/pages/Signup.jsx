import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { saveUser, findUserByEmail, saveCandidate, saveCompany } from '../data/storage';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'candidate'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#16a34a'];
  const pwStrength = passwordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (findUserByEmail(formData.email)) {
      setError('Email already registered. Please login.');
      setLoading(false);
      return;
    }

    try {
      const newUser = saveUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.userType
      });

      if (formData.userType === 'candidate') {
        saveCandidate({
          userId: newUser.id,
          name: formData.name, email: formData.email,
          role: '', experience: '', location: '', skills: [],
          availability: '', expectedSalary: '', profileComplete: false,
          avatar: `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=7c3aed&color=fff&size=100`,
          appliedJobs: []
        });
      } else {
        saveCompany({
          userId: newUser.id,
          name: formData.name, email: formData.email,
          industry: '', location: '', description: '',
          logo: `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=4c1d95&color=fff&size=100`,
          website: '', founded: '', totalEmployees: '',
          openPositions: 0, activeJobs: []
        });
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .su-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          display: flex; flex-direction: column;
          background: #f8f7ff;
          -webkit-font-smoothing: antialiased;
          color: #1c0b4b;
        }
        .su-main {
          flex: 1; display: flex;
          align-items: center; justify-content: center;
          padding: 3rem 1.25rem;
        }

        /* ── CARD ── */
        .su-card {
          background: white;
          border: 1.5px solid #f3f4f6;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(28,11,75,0.08);
          width: 100%; max-width: 500px;
          padding: 2.5rem;
        }

        /* ── HEADER ── */
        .su-logo-mark {
          width: 48px; height: 48px;
          background: #7c3aed; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .su-logo-mark svg { width: 24px; height: 24px; stroke: white; fill: none; }
        .su-title {
          font-size: 1.6rem; font-weight: 800;
          color: #1c0b4b; letter-spacing: -0.03em;
          text-align: center; margin-bottom: 0.4rem;
        }
        .su-subtitle { font-size: 0.875rem; color: #9ca3af; text-align: center; margin-bottom: 2rem; }

        /* ── TOGGLE ── */
        .su-toggle {
          display: flex; background: #f9fafb;
          border: 1.5px solid #f3f4f6; border-radius: 12px;
          padding: 4px; margin-bottom: 1.75rem; gap: 4px;
        }
        .su-toggle-btn {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; padding: 0.65rem 1rem;
          border-radius: 9px; border: none;
          font-family: 'Poppins', sans-serif;
          font-size: 0.84rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          color: #6b7280; background: transparent;
        }
        .su-toggle-btn svg { width: 15px; height: 15px; stroke: currentColor; fill: none; flex-shrink: 0; }
        .su-toggle-btn.active {
          background: white; color: #7c3aed;
          box-shadow: 0 2px 8px rgba(28,11,75,0.08);
        }

        /* ── FORM ── */
        .su-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .su-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .su-label {
          font-size: 0.75rem; font-weight: 600;
          color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em;
        }
        .su-input-wrap { position: relative; display: flex; align-items: center; }
        .su-input-icon {
          position: absolute; left: 0.875rem;
          width: 16px; height: 16px;
          stroke: #9ca3af; fill: none; pointer-events: none; flex-shrink: 0;
        }
        .su-input {
          width: 100%;
          padding: 0.75rem 0.875rem 0.75rem 2.5rem;
          border: 1.5px solid #e5e7eb; border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem; color: #1c0b4b;
          background: white; outline: none;
          transition: border-color 0.2s;
        }
        .su-input:focus { border-color: #7c3aed; }
        .su-input::placeholder { color: #d1d5db; }
        .su-input.has-toggle { padding-right: 2.75rem; }

        .su-eye-btn {
          position: absolute; right: 0.875rem;
          background: none; border: none; cursor: pointer;
          padding: 0; display: flex; align-items: center;
          color: #9ca3af; transition: color 0.2s;
        }
        .su-eye-btn:hover { color: #7c3aed; }
        .su-eye-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; }

        /* ── PASSWORD STRENGTH ── */
        .su-strength { margin-top: 0.4rem; }
        .su-strength-bars {
          display: flex; gap: 4px; margin-bottom: 0.3rem;
        }
        .su-strength-bar {
          flex: 1; height: 3px; border-radius: 2px;
          background: #f3f4f6; transition: background 0.3s;
        }
        .su-strength-label {
          font-size: 0.72rem; font-weight: 600;
        }

        /* ── ALERTS ── */
        .su-error {
          display: flex; align-items: center; gap: 0.5rem;
          background: #fef2f2; border: 1.5px solid #fecaca;
          border-radius: 10px; padding: 0.75rem 0.875rem;
          font-size: 0.82rem; color: #ef4444; font-weight: 500;
        }
        .su-error svg { width: 15px; height: 15px; stroke: currentColor; fill: none; flex-shrink: 0; }

        .su-success {
          display: flex; align-items: center; gap: 0.5rem;
          background: #f0fdf4; border: 1.5px solid #bbf7d0;
          border-radius: 10px; padding: 0.75rem 0.875rem;
          font-size: 0.82rem; color: #16a34a; font-weight: 500;
        }
        .su-success svg { width: 15px; height: 15px; stroke: currentColor; fill: none; flex-shrink: 0; }

        /* ── SUBMIT ── */
        .su-submit {
          width: 100%; padding: 0.875rem;
          background: #7c3aed; color: white;
          border: none; border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          margin-top: 0.25rem;
        }
        .su-submit:hover:not(:disabled) { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(124,58,237,0.3); }
        .su-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .su-submit svg { width: 16px; height: 16px; stroke: currentColor; fill: none; }

        .su-spin {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: su-spin 0.7s linear infinite;
        }
        @keyframes su-spin { to { transform: rotate(360deg); } }

        /* ── FOOTER ── */
        .su-divider {
          display: flex; align-items: center; gap: 0.75rem; margin: 1.25rem 0;
        }
        .su-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .su-divider-text { font-size: 0.75rem; color: #d1d5db; font-weight: 500; }

        .su-footer { text-align: center; font-size: 0.84rem; color: #9ca3af; }
        .su-footer a { color: #7c3aed; text-decoration: none; font-weight: 600; }
        .su-footer a:hover { text-decoration: underline; }

        .su-terms {
          text-align: center; font-size: 0.75rem;
          color: #d1d5db; margin-top: 1rem; line-height: 1.5;
        }
      `}</style>

      <div className="su-root">
        <Navbar />

        <main className="su-main">
          <div className="su-card">

            {/* Logo */}
            <div className="su-logo-mark">
              <svg viewBox="0 0 24 24" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>

            <h1 className="su-title">Create account</h1>
            <p className="su-subtitle">Join our platform and get started today</p>

            {/* User Type Toggle */}
            <div className="su-toggle">
              <button
                type="button"
                className={`su-toggle-btn ${formData.userType === 'candidate' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'candidate' })}
              >
                <svg viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                I'm a Candidate
              </button>
              <button
                type="button"
                className={`su-toggle-btn ${formData.userType === 'company' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'company' })}
              >
                <svg viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                I'm a Company
              </button>
            </div>

            {/* Form */}
            <form className="su-form" onSubmit={handleSubmit}>

              <div className="su-field">
                <label className="su-label">{formData.userType === 'company' ? 'Company Name' : 'Full Name'}</label>
                <div className="su-input-wrap">
                  <svg className="su-input-icon" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text" name="name"
                    className="su-input"
                    placeholder={formData.userType === 'company' ? 'Your company name' : 'Your full name'}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="su-field">
                <label className="su-label">Email</label>
                <div className="su-input-wrap">
                  <svg className="su-input-icon" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email" name="email"
                    className="su-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="su-field">
                <label className="su-label">Password</label>
                <div className="su-input-wrap">
                  <svg className="su-input-icon" viewBox="0 0 24 24" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="su-input has-toggle"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="su-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="su-strength">
                    <div className="su-strength-bars">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className="su-strength-bar"
                          style={{ background: i <= pwStrength ? strengthColor[pwStrength] : '#f3f4f6' }}
                        />
                      ))}
                    </div>
                    <span className="su-strength-label" style={{ color: strengthColor[pwStrength] }}>
                      {strengthLabel[pwStrength]}
                    </span>
                  </div>
                )}
              </div>

              <div className="su-field">
                <label className="su-label">Confirm Password</label>
                <div className="su-input-wrap">
                  <svg className="su-input-icon" viewBox="0 0 24 24" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    className="su-input has-toggle"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="su-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? (
                      <svg viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="su-error">
                  <svg viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="su-success">
                  <svg viewBox="0 0 24 24" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {success}
                </div>
              )}

              <button type="submit" className="su-submit" disabled={loading}>
                {loading ? (
                  <><div className="su-spin" /> Creating Account...</>
                ) : (
                  <>
                    Create Account
                    <svg viewBox="0 0 24 24" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="su-divider">
              <div className="su-divider-line" />
              <span className="su-divider-text">or</span>
              <div className="su-divider-line" />
            </div>

            <div className="su-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>

            <p className="su-terms">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Signup;