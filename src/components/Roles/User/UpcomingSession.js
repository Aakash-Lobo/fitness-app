import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../Css/UserDashboard.css";

const UpcomingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const email = sessionStorage.getItem("email") || localStorage.getItem("email");
      if (!email) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/user/upcomingSessions?email=${email}`);
      if (!response.ok) throw new Error("Failed to fetch sessions.");

      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this session?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/user/deleteSession/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Delete failed");
      }

      setSessions((prev) => prev.filter((session) => session._id !== sessionId));
      alert("Session deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td>{session.trainerId?.name || "Unknown"}</td>
                    <td>{session.date}</td>
                    <td>{session.time}</td>
                    <td>{session.duration} mins</td>
                    <td>{session.notes || "No notes"}</td>
                    <td className={`status-${session.status.toLowerCase()}`}>
                      {session.status}
                    </td>
                    <td>
                      {session.status.toLowerCase() === "completed" ? (
                        <button className="delete-btn" disabled>
                          Completed
                        </button>
                      ) : (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(session._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
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
