import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar component
import "../Css/UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // Retrieve user email from session/local storage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email") || localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("No email found in storage. Redirecting to login.");
      navigate("/Register"); // Redirect to login if no email found
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
      {/* Sidebar Component */}
      <Sidebar handleLogout={handleLogout} />

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
