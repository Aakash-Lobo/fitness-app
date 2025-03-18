import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/TrainerDashboard.css";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  // Retrieve userId from storage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
    console.log("Retrieved userId from storage:", storedUserId); // Debugging

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.warn("No userId found in storage. Redirecting to login.");
      navigate("/Register"); // Redirect to login if userId is missing
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
        localStorage.clear();
        navigate("/Register");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="trainer-dashboard">
      <nav className="sidebar">
        <h2>User Dashboard</h2>
        <ul>
          <li><a href="/Roles/Trainer/UserDashboard">Dashboard</a></li>
          <li><a href="../Trainer/ViewRequests">Requests</a></li>
          <li><a href="/Roles/Trainer/Settings">Settings</a></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      <div className="main-content">
        <h1>Welcome to Your Dashboard!</h1>
        {userId ? <p>Logged in as: <strong>{userId}</strong></p> : <p>Loading...</p>}
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default TrainerDashboard;
