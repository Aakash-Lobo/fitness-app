import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../Css/UserDashboard.css";

const UpcomingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      try {
        const email = sessionStorage.getItem("email") || localStorage.getItem("email");
        if (!email) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/user/upcomingSessions?email=${email}`);
        if (!response.ok) throw new Error("Failed to fetch sessions.");

        const data = await response.json();
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingSessions();
  }, []);

  return (
    <div className="user-dashboard">
      <Sidebar />

      <div className="main-content">
        <h1>Upcoming Sessions</h1>

        {loading ? (
          <p>Loading upcoming sessions...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : sessions.length === 0 ? (
          <p>No upcoming sessions scheduled.</p>
        ) : (
          <div className="sessions-list">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Trainer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td>{session.trainerId?.name || "Unknown"}</td> {/* Display trainer name */}
                    <td>{session.date}</td>
                    <td>{session.time}</td>
                    <td>{session.duration} mins</td>
                    <td>{session.notes || "No notes"}</td>
                    <td className={`status-${session.status.toLowerCase()}`}>{session.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingSessions;
