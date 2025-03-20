import React, { useState } from "react";
import "./Sidebar.css"; // Ensure you have Sidebar styles

const Sidebar = ({ handleLogout }) => {
  const [showTrainerSubmenu, setShowTrainerSubmenu] = useState(false);

  return (
    <nav className="sidebar">
      <h2>User Dashboard</h2>
      <ul>
        <li>
          <a href="/Roles/User/UserDashboard">Dashboard</a>
        </li>

        {/* Trainer Dropdown */}
        <li>
          <button 
            className="trainer-btn" 
            onClick={() => setShowTrainerSubmenu(!showTrainerSubmenu)}
          >
            View Trainers {showTrainerSubmenu ? "▲" : "▼"}
          </button>
          {showTrainerSubmenu && (
            <ul className="submenu">
              <li><a href="/Roles/User/SearchTrainer">Book Trainers</a></li>
              <li><a href="./AcceptedTrainers">Book Session</a></li>
            </ul>
          )}
        </li>

        <li>
          <a href="/Roles/User/Settings">Settings</a>
        </li>
        
        <li>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
