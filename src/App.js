import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

// Backend URL - update karo apne hisaab se
const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    checkBackendConnection();
  }, [retryCount]);

  const checkBackendConnection = async () => {
    try {
      console.log('Checking backend connection...');
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('✅ Backend connected successfully');
        setBackendReady(true);
        setLoading(false);
      } else {
        console.log('⚠️ Backend not ready, retrying...');
        setTimeout(() => setRetryCount(retryCount + 1), 3000);
      }
    } catch (error) {
      console.log('❌ Backend connection failed, retrying...', error.message);
      setTimeout(() => setRetryCount(retryCount + 1), 3000);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '30px'
        }}></div>
        
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
          {backendReady ? 'Starting Application...' : 'Waking up Backend Server...'}
        </h2>
        
        <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '20px' }}>
          {!backendReady && 'This may take 30-60 seconds on first load'}
        </p>
        
        <button
          onClick={() => setRetryCount(retryCount + 1)}
          style={{
            padding: '12px 30px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Retry Connection
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
