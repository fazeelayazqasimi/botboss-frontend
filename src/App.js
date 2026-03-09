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

// Backend URL
const API_URL = 'https://fazeelayazqasimi-botboss-updated-backend.hf.space';

function App() {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'connected', 'failed'
  const [retryCount, setRetryCount] = useState(0);
  const [message, setMessage] = useState('Waking up backend server...');

  useEffect(() => {
    checkBackendConnection();
  }, [retryCount]);

  const checkBackendConnection = async () => {
    setMessage('Connecting to server...');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec timeout

      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ Backend connected successfully');
        setBackendStatus('connected');
      } else {
        console.log('⚠️ Backend returned error, retrying...');
        setMessage('Backend is waking up... (takes 30-60 seconds)');
        setTimeout(() => setRetryCount(retryCount + 1), 5000);
      }
    } catch (error) {
      console.log('❌ Connection attempt failed:', error.message);
      
      if (error.name === 'AbortError') {
        setMessage('Connection timeout - backend still sleeping...');
      } else {
        setMessage('Cannot reach backend server...');
      }
      
      // Retry with increasing delay
      const delay = Math.min(3000 * (retryCount + 1), 15000);
      setTimeout(() => setRetryCount(retryCount + 1), delay);
    }
  };

  // Loading screen
  if (backendStatus !== 'connected') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center'
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
          {message}
        </h2>
        
        <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '20px' }}>
          Free backend takes 30-60 seconds to wake up
        </p>
        
        <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '30px' }}>
          Attempt {retryCount + 1} • Please wait...
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
            marginTop: '20px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
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
