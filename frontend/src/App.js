import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SchoolDashboard from './pages/SchoolDashboard';
import CreateRequest from './pages/CreateRequest';
import CompanyDashboard from './pages/CompanyDashboard';
import CreateDonation from './pages/CreateDonation';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* School Routes */}
        <Route path="/school-dashboard" element={<SchoolDashboard />} />
        <Route path="/create-request" element={<CreateRequest />} />

        {/* Company Routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/create-donation" element={<CreateDonation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;