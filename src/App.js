import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register'; // Import the Register page
import Login from './components/Login';
import AdminDashboard from './components/Roles/Admin/AdminDashboard';
import UserDashboard from './components/Roles/User/UserDashboard';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Welcome to the Fitness App</h1>
        {/* Link to navigate to Register page */}
        <nav>
          <Link to="/register">Go to Registration</Link>
          <Link to="/login">Go to Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h2>Home Page</h2>} /> {/* Home page */}
          <Route path="/register" element={<Register />} /> {/* Registration page */}
          <Route path="/login" element={<Login />} />
          <Route path="/roles/admin/admindashboard" element={<AdminDashboard />} />
          <Route path="/roles/user/userdashboard" element={<UserDashboard />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
