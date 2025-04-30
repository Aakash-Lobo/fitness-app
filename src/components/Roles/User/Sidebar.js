import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const Sidebar = () => {
  const [showTrainerSubmenu, setShowTrainerSubmenu] = useState(false);
  const [showSessionsSubmenu, setShowSessionsSubmenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
              <li>
                <a href="/Roles/User/SearchTrainer">Book Trainers</a>
              </li>
              <li>
                <a href="./AcceptedTrainers">Book Session</a>
              </li>
              <li>
                <a href="./SelectGym">Gym</a>
              </li>
            </ul>
          )}
        </li>

        {/* My Sessions Dropdown */}
        <li>
          <button
            className="sessions-btn"
            onClick={() => setShowSessionsSubmenu(!showSessionsSubmenu)}
          >
            My Sessions {showSessionsSubmenu ? "▲" : "▼"}
          </button>
          {showSessionsSubmenu && (
            <ul className="submenu">
              <li>
                <a href="/Roles/User/UpcomingSession">Current</a>
              </li>
              <li>
                <a href="/Roles/User/UserSessionHistory">History</a>
              </li>
              <li>
                <a href="/Roles/User/UserProgress">Progress</a>
              </li>
            </ul>
          )}
        </li>

        <li>
          <a href="/Roles/User/UserNotification">Notification</a>
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

export default Sidebar;
