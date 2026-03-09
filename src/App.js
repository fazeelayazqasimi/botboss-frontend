import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { checkBackendHealth } from './services/api';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import CompanyDashboard from './pages/CompanyDashboard';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import Interview from './pages/Interview';
import PostJob from './pages/PostJob';
import Report from './pages/Report';
import CompanyProfileEdit from './pages/CompanyProfileEdit';
import MyJobs from './pages/MyJobs';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [checking, setChecking] = useState(true);
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    const connect = async () => {
      const connected = await checkBackendHealth();
      if (connected) {
        setIsConnected(true);
        setChecking(false);
      } else {
        setAttempt(attempt + 1);
        setChecking(false);
      }
    };
    
    connect();
  }, [attempt]);

  // Loading / Error screen
  if (!isConnected) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1c0b4b',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
          🚀 Botboss
        </h1>
        
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid rgba(255,255,255,0.2)',
          borderTopColor: '#a78bfa',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '30px 0'
        }}></div>
        
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>
          Waking up backend server...
        </h2>
        
        <p style={{ color: '#a78bfa', marginBottom: '5px' }}>
          Attempt {attempt} of 10
        </p>
        
        <p style={{ fontSize: '14px', opacity: 0.8, maxWidth: '400px' }}>
          Free backend takes 30-60 seconds to wake up. Please wait.
        </p>
        
        <button
          onClick={() => setAttempt(attempt + 1)}
          style={{
            marginTop: '30px',
            padding: '12px 30px',
            background: '#a78bfa',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Retry Now
        </button>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Main app
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/post-job" element={<PostJob />} />
        <Route path="/company/profile/edit" element={<CompanyProfileEdit />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/interview/:jobId" element={<Interview />} />
        <Route path="/report/:sessionId" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
