import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .nb {
          font-family: 'Poppins', sans-serif;
          background: white;
          border-bottom: 1px solid #f3f4f6;
          position: sticky;
          top: 0;
          z-index: 999;
          -webkit-font-smoothing: antialiased;
        }

        .nb-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 5%;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        /* ── LOGO ── */
        .nb-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .nb-logo-mark {
          width: 34px; height: 34px;
          background: #7c3aed;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .nb-logo-mark svg {
          width: 18px; height: 18px;
          stroke: white; fill: none;
        }
        .nb-logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1c0b4b;
          letter-spacing: -0.03em;
        }
        .nb-logo-text span { color: #7c3aed; }

        /* ── NAV LINKS ── */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nb-link {
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          padding: 0.5rem 0.875rem;
          border-radius: 8px;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .nb-link:hover { color: #1c0b4b; background: #f9fafb; }
        .nb-link.active { color: #7c3aed; background: #f5f3ff; font-weight: 600; }

        /* ── AUTH ── */
        .nb-auth {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .nb-login {
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1c0b4b;
          text-decoration: none;
          padding: 0.55rem 1.1rem;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .nb-login:hover { border-color: #7c3aed; color: #7c3aed; background: #f5f3ff; }
        .nb-signup {
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
          text-decoration: none;
          padding: 0.55rem 1.25rem;
          border-radius: 10px;
          background: #7c3aed;
          border: 1.5px solid #7c3aed;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .nb-signup:hover { background: #6d28d9; border-color: #6d28d9; }

        /* ── USER MENU ── */
        .nb-user {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .nb-user-greet {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.84rem;
          font-weight: 500;
          color: #4b5563;
        }
        .nb-user-avatar {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; color: #7c3aed;
          flex-shrink: 0;
        }
        .nb-logout {
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          color: #6b7280;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          display: flex; align-items: center; gap: 0.35rem;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .nb-logout:hover { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }
        .nb-logout svg { width: 14px; height: 14px; stroke: currentColor; fill: none; }

        /* ── HAMBURGER ── */
        .nb-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px; height: 40px;
          background: transparent;
          border: 1.5px solid #f3f4f6;
          border-radius: 10px;
          cursor: pointer;
          padding: 0;
          transition: border-color 0.18s;
          flex-shrink: 0;
        }
        .nb-burger:hover { border-color: #c4b5fd; }
        .nb-burger-line {
          width: 18px; height: 2px;
          background: #1c0b4b;
          border-radius: 2px;
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .nb-burger.open .nb-burger-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nb-burger.open .nb-burger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nb-burger.open .nb-burger-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── MOBILE DRAWER ── */
        .nb-drawer {
          display: none;
          position: absolute;
          top: 68px; left: 0; right: 0;
          background: white;
          border-bottom: 1px solid #f3f4f6;
          box-shadow: 0 16px 40px rgba(28,11,75,0.1);
          padding: 1rem 5% 1.5rem;
          animation: nb-slide-down 0.22s ease;
        }
        @keyframes nb-slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nb-drawer.open { display: block; }

        .nb-drawer-links {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 0.25rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }
        .nb-drawer-link {
          text-decoration: none;
          font-size: 0.9rem; font-weight: 500;
          color: #4b5563;
          padding: 0.65rem 0.875rem;
          border-radius: 10px;
          display: flex; align-items: center; gap: 0.5rem;
          transition: all 0.18s;
        }
        .nb-drawer-link:hover { background: #f9fafb; color: #1c0b4b; }
        .nb-drawer-link.active { background: #f5f3ff; color: #7c3aed; font-weight: 600; }
        .nb-drawer-link svg { width: 16px; height: 16px; stroke: currentColor; fill: none; flex-shrink: 0; }

        .nb-drawer-auth {
          display: flex; flex-direction: column; gap: 0.625rem;
        }
        .nb-drawer-login {
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          color: #1c0b4b; text-decoration: none;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          text-align: center;
          transition: all 0.18s;
        }
        .nb-drawer-login:hover { border-color: #7c3aed; color: #7c3aed; background: #f5f3ff; }
        .nb-drawer-signup {
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          color: white; text-decoration: none;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          background: #7c3aed;
          text-align: center;
          transition: background 0.18s;
        }
        .nb-drawer-signup:hover { background: #6d28d9; }

        .nb-drawer-user {
          display: flex; flex-direction: column; gap: 0.625rem;
        }
        .nb-drawer-greet {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.75rem 0.875rem;
          background: #f9fafb; border-radius: 12px;
        }
        .nb-drawer-avatar {
          width: 36px; height: 36px; border-radius: 9px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; color: #7c3aed; flex-shrink: 0;
        }
        .nb-drawer-name { font-size: 0.875rem; font-weight: 600; color: #1c0b4b; }
        .nb-drawer-role { font-size: 0.72rem; color: #9ca3af; text-transform: capitalize; }
        .nb-drawer-logout {
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; font-weight: 600;
          color: #ef4444; background: #fef2f2;
          border: 1.5px solid #fecaca;
          border-radius: 12px;
          padding: 0.75rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: all 0.18s;
        }
        .nb-drawer-logout:hover { background: #fee2e2; border-color: #fca5a5; }
        .nb-drawer-logout svg { width: 15px; height: 15px; stroke: currentColor; fill: none; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .nb-links { display: none; }
          .nb-auth { display: none; }
          .nb-burger { display: flex; }
          .nb { position: relative; }
        }
      `}</style>

      <nav className="nb">
        <div className="nb-inner">

          {/* Logo */}
          <Link to="/" className="nb-logo">
            <div className="nb-logo-mark">
              <svg viewBox="0 0 24 24" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <span className="nb-logo-text">Bot<span>boss</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nb-links">
            <li><Link to="/" className={`nb-link ${isActive('/') ? 'active' : ''}`}>Home</Link></li>
            <li><Link to="/jobs" className={`nb-link ${isActive('/jobs') ? 'active' : ''}`}>Jobs</Link></li>
            <li><Link to="/companies" className={`nb-link ${isActive('/companies') ? 'active' : ''}`}>Companies</Link></li>
            {user?.type === 'candidate' && (
              <li><Link to="/my-applications" className={`nb-link ${isActive('/my-applications') ? 'active' : ''}`}>My Applications</Link></li>
            )}
            {user?.type === 'company' && (
              <li><Link to="/company/dashboard" className={`nb-link ${isActive('/company/dashboard') ? 'active' : ''}`}>My Jobs</Link></li>
            )}
          </ul>

          {/* Desktop Auth */}
          <div className="nb-auth">
            {user ? (
              <div className="nb-user">
                <div className="nb-user-greet">
                  <div className="nb-user-avatar">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  Hi, {user.name?.split(' ')[0] || user.email}
                </div>
                <button onClick={handleLogout} className="nb-logout">
                  <svg viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nb-login">Login</Link>
                <Link to="/signup" className="nb-signup">Sign Up</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`nb-burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="nb-burger-line" />
            <span className="nb-burger-line" />
            <span className="nb-burger-line" />
          </button>
        </div>

        {/* Mobile Drawer */}
        <div className={`nb-drawer ${menuOpen ? 'open' : ''}`}>
          <ul className="nb-drawer-links">
            <li>
              <Link to="/" className={`nb-drawer-link ${isActive('/') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" className={`nb-drawer-link ${isActive('/jobs') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                Jobs
              </Link>
            </li>
            <li>
              <Link to="/companies" className={`nb-drawer-link ${isActive('/companies') ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Companies
              </Link>
            </li>
            {user?.type === 'candidate' && (
              <li>
                <Link to="/my-applications" className={`nb-drawer-link ${isActive('/my-applications') ? 'active' : ''}`}>
                  <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  My Applications
                </Link>
              </li>
            )}
            {user?.type === 'company' && (
              <li>
                <Link to="/company/dashboard" className={`nb-drawer-link ${isActive('/company/dashboard') ? 'active' : ''}`}>
                  <svg viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                  My Jobs
                </Link>
              </li>
            )}
          </ul>

          <div className="nb-drawer-auth">
            {user ? (
              <div className="nb-drawer-user">
                <div className="nb-drawer-greet">
                  <div className="nb-drawer-avatar">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="nb-drawer-name">{user.name || user.email}</div>
                    <div className="nb-drawer-role">{user.type}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="nb-drawer-logout">
                  <svg viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nb-drawer-login">Login</Link>
                <Link to="/signup" className="nb-drawer-signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;