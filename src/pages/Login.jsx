import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { findUserByCredentials } from '../data/storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleTypeSelect = (type) => {
    setUserType(type);
    setShowForm(true);
    setError('');
  };

  const handleBackToType = () => {
    setUserType(null);
    setShowForm(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const user = await findUserByCredentials(email, password, userType);

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate(userType === 'company' ? '/company/dashboard' : '/jobs');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f7ff;
          -webkit-font-smoothing: antialiased;
          color: #1c0b4b;
        }

        .auth-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.25rem;
        }

        .auth-card {
          background: white;
          border: 1.5px solid #f3f4f6;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(28,11,75,0.08);
          width: 100%;
          max-width: 460px;
          padding: 2.5rem;
          overflow: hidden;
          position: relative;
        }

        .auth-logo-mark {
          width: 48px; height: 48px;
          background: #7c3aed;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .auth-logo-mark svg { width: 24px; height: 24px; stroke: white; fill: none; }

        .auth-title {
          font-size: 1.6rem; font-weight: 800;
          color: #1c0b4b; letter-spacing: -0.03em;
          text-align: center; margin-bottom: 0.4rem;
        }
        .auth-subtitle {
          font-size: 0.875rem; color: #9ca3af;
          text-align: center; margin-bottom: 2rem;
        }

        .type-selection {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 0;
        }

        .type-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .type-card:hover {
          border-color: #7c3aed;
          background: #faf5ff;
          transform: translateX(5px);
        }

        .type-icon {
          width: 48px;
          height: 48px;
          background: #f3f4f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .type-card:hover .type-icon { background: #7c3aed; }
        .type-icon svg { width: 24px; height: 24px; stroke: #6b7280; transition: all 0.3s ease; }
        .type-card:hover .type-icon svg { stroke: white; }

        .type-info { flex: 1; }
        .type-info h3 { font-size: 1.1rem; font-weight: 700; color: #1c0b4b; margin-bottom: 0.25rem; }
        .type-info p { font-size: 0.8rem; color: #9ca3af; margin: 0; }

        .type-arrow { color: #d1d5db; transition: all 0.3s ease; }
        .type-card:hover .type-arrow { color: #7c3aed; transform: translateX(5px); }

        .form-container { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #7c3aed;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          margin-bottom: 1.5rem;
          font-family: 'Poppins', sans-serif;
          transition: all 0.2s;
        }
        .back-btn:hover { gap: 0.75rem; color: #6d28d9; }
        .back-btn svg { width: 16px; height: 16px; stroke: currentColor; }

        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .auth-label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; }
        .auth-input-wrap { position: relative; display: flex; align-items: center; }
        .auth-input-icon { position: absolute; left: 0.875rem; width: 16px; height: 16px; stroke: #9ca3af; fill: none; pointer-events: none; flex-shrink: 0; }
        .auth-input {
          width: 100%;
          padding: 0.75rem 0.875rem 0.75rem 2.5rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          color: #1c0b4b;
          background: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .auth-input:focus { border-color: #7c3aed; }
        .auth-input::placeholder { color: #d1d5db; }
        .auth-input.has-toggle { padding-right: 2.75rem; }

        .auth-eye-btn {
          position: absolute; right: 0.875rem;
          background: none; border: none; cursor: pointer;
          padding: 0; display: flex; align-items: center;
          color: #9ca3af; transition: color 0.2s;
        }
        .auth-eye-btn:hover { color: #7c3aed; }
        .auth-eye-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; }

        .auth-error {
          display: flex; align-items: center; gap: 0.5rem;
          background: #fef2f2; border: 1.5px solid #fecaca;
          border-radius: 10px; padding: 0.75rem 0.875rem;
          font-size: 0.82rem; color: #ef4444; font-weight: 500;
        }
        .auth-error svg { width: 15px; height: 15px; stroke: currentColor; fill: none; flex-shrink: 0; }

        .auth-submit {
          width: 100%;
          padding: 0.875rem;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem; font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          margin-top: 0.25rem;
        }
        .auth-submit:hover:not(:disabled) { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(124,58,237,0.3); }
        .auth-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .auth-submit svg { width: 16px; height: 16px; stroke: currentColor; fill: none; }

        .auth-spin {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: auth-spin 0.7s linear infinite;
        }
        @keyframes auth-spin { to { transform: rotate(360deg); } }

        .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.84rem; color: #9ca3af; }
        .auth-footer a { color: #7c3aed; text-decoration: none; font-weight: 600; }
        .auth-footer a:hover { text-decoration: underline; }

        .auth-divider { display: flex; align-items: center; gap: 0.75rem; margin: 1.25rem 0; }
        .auth-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .auth-divider-text { font-size: 0.75rem; color: #d1d5db; font-weight: 500; }

        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .slide-in { animation: slideIn 0.4s ease forwards; }
      `}</style>

      <div className="auth-root">
        <Navbar />
        <main className="auth-main">
          <div className="auth-card">
            <div className="auth-logo-mark">
              <svg viewBox="0 0 24 24" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>

            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              {!userType ? 'Choose your account type' : `Login as ${userType === 'candidate' ? 'Candidate' : 'Company'}`}
            </p>

            {!userType && (
              <div className="type-selection slide-in">
                <div className="type-card" onClick={() => handleTypeSelect('candidate')}>
                  <div className="type-icon">
                    <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div className="type-info"><h3>Candidate</h3><p>Looking for job opportunities</p></div>
                  <div className="type-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </div>

                <div className="type-card" onClick={() => handleTypeSelect('company')}>
                  <div className="type-icon">
                    <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <div className="type-info"><h3>Company</h3><p>Post jobs and find talent</p></div>
                  <div className="type-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
            )}

            {userType && (
              <div className="form-container slide-in">
                <button className="back-btn" onClick={handleBackToType}>
                  <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back to type selection
                </button>

                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="auth-field">
                    <label className="auth-label">Email</label>
                    <div className="auth-input-wrap">
                      <svg className="auth-input-icon" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrap">
                      <svg className="auth-input-icon" viewBox="0 0 24 24" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <input type={showPassword ? 'text' : 'password'} className="auth-input has-toggle" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="auth-error">
                      <svg viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? (
                      <><div className="auth-spin" /> Logging in...</>
                    ) : (
                      <>Login as {userType === 'candidate' ? 'Candidate' : 'Company'}
                        <svg viewBox="0 0 24 24" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">or</span>
                  <div className="auth-divider-line" />
                </div>

                <div className="auth-footer">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Login;
