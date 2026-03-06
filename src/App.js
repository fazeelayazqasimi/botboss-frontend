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
import Report from './pages/Report';  // Fixed: Changed from PostJob to Report
import CompanyProfileEdit from './pages/CompanyProfileEdit';

function App() {
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
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/interview/:jobId" element={<Interview />} />
        <Route path="/report/:sessionId" element={<Report />} />  {/* Added Report Route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;