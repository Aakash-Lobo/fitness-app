import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // Retrieve user email from storage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email") || localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("No email found in storage. Redirecting to login.");
      navigate("/Register"); // Redirect to login if email is missing
    }
  }, [navigate]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        sessionStorage.clear();
        localStorage.clear(); // Clear all stored data
        navigate("/Register");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>User Dashboard</h2>
        <ul>
          <li><a href="/Roles/User/UserDashboard">Dashboard</a></li>
          <li><a href="/Roles/User/SearchTrainer">View Trainers</a></li>
          <li><a href="/Roles/User/Settings">Settings</a></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome to Your Dashboard!</h1>
        {email && <p>Logged in as: <strong>{email}</strong></p>}
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default UserDashboard;
