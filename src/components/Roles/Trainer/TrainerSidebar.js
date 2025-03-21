import React, { useState } from "react";
import "./Sidebar.css"; // Ensure you have Sidebar styles

const TrainerSidebar = ({ handleLogout }) => {
  const [showSessionsSubmenu, setShowSessionsSubmenu] = useState(false);

  return (
    <nav className="sidebar">
      <h2>Trainer Dashboard</h2>
      <ul>
        <li>
          <a href="/Roles/Trainer/TrainerDashboard">Dashboard</a>
        </li>
        <li>
          <a href="/Roles/Trainer/ViewRequests">Requests</a>
        </li>
        <li>
          <a href="/Roles/Trainer/Subscriptions">Subscriptions</a>
        </li>

        {/* Training Sessions Dropdown */}
        <li>
          <button 
            className="sessions-btn" 
            onClick={() => setShowSessionsSubmenu(!showSessionsSubmenu)}
          >
            Training Sessions {showSessionsSubmenu ? "▲" : "▼"}
          </button>
          {showSessionsSubmenu && (
            <ul className="submenu">
              <li><a href="/Roles/Trainer/TrainerUpcomingSessions">Upcoming</a></li>
              <li><a href="/Roles/Trainer/TrainerSessionHistory">History</a></li>
              <li><a href="/Roles/Trainer/Progress">Progress</a></li>
            </ul>
          )}
        </li>

        <li>
          <a href="/Roles/Trainer/Settings">Settings</a>
        </li>

        <li>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default TrainerSidebar;
