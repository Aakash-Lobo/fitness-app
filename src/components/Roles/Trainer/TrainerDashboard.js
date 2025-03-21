import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerSidebar from "./TrainerSidebar"; // Adjust path as needed
import "../Css/TrainerDashboard.css";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate("/Register");
    }
  }, [navigate]);

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
      <TrainerSidebar handleLogout={handleLogout} />
      <div className="main-content">
        <h1>Welcome to Your Dashboard!</h1>
        {userId ? <p>Logged in as: <strong>{userId}</strong></p> : <p>Loading...</p>}
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default TrainerDashboard;
