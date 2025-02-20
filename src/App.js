import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register'; // Import the Register page

const App = () => {
  return (
    <Router>
      <div>
        <h1>Welcome to the Fitness App</h1>
        {/* Link to navigate to Register page */}
        <nav>
          <Link to="/register">Go to Registration</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h2>Home Page</h2>} /> {/* Home page */}
          <Route path="/register" element={<Register />} /> {/* Registration page */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
