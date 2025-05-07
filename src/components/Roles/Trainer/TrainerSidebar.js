import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlignJustify } from "react-icons/fi";

const TrainerSidebar = () => {
  const [showSessionsSubmenu, setShowSessionsSubmenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        sessionStorage.clear();
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
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
          <a href="/Roles/Trainer/TrainerBookings">Subscriptions</a>
        </li>

        {/* Training Sessions Dropdown */}
        {/* <li>
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
              <li><a href="/Roles/Trainer/TrainerProgress">Progress</a></li>
            </ul>
          )}
        </li> */}
        <li
          onMouseEnter={() => setShowSessionsSubmenu(true)}
          onMouseLeave={() => setShowSessionsSubmenu(false)}
          className="sessions-container"
        >
          <button className="sessions-btn">
            Training Sessions <FiAlignJustify size={16} />
          </button>

          {showSessionsSubmenu && (
            <ul className="submenu">
              <li>
                <a href="/Roles/Trainer/TrainerUpcomingSessions">Upcoming</a>
              </li>
              <li>
                <a href="/Roles/Trainer/TrainerSessionHistory">History</a>
              </li>
              {/* <li>
                <a href="/Roles/Trainer/TrainerProgress">Progress</a>
              </li> */}
            </ul>
          )}
        </li>

        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default TrainerSidebar;
