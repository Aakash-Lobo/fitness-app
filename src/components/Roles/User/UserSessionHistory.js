import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../Css/UserDashboard.css";

const UserSessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");

  const [stats, setStats] = useState({
    totalHours: 0,
    completedSessions: 0,
    canceledSessions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserSessions = async () => {
      try {
        const userEmail = sessionStorage.getItem("email") || localStorage.getItem("email");
        if (!userEmail) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5001/user/sessions?email=${userEmail}`);
        if (!response.ok) throw new Error("Failed to fetch session history.");

        const data = await response.json();
        setSessions(data.sessions);
        setFilteredSessions(data.sessions);
        setStats(data.stats);

        const trainerList = Array.from(new Set(data.sessions.map((s) => s.trainerName))).filter(Boolean);
        setTrainers(trainerList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSessions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedTrainer, selectedDateFilter]);

  const applyFilters = () => {
    let filtered = [...sessions];

    // Filter by trainer
    if (selectedTrainer !== "all") {
      filtered = filtered.filter((session) => session.trainerName === selectedTrainer);
    }

    // Filter by date
    const now = new Date();
    if (selectedDateFilter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = filtered.filter((session) => new Date(session.date) >= oneWeekAgo);
    } else if (selectedDateFilter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filtered = filtered.filter((session) => new Date(session.date) >= oneMonthAgo);
    }

    // Update filtered sessions
    setFilteredSessions(filtered);

    // Update stats for filtered data
    const totalHours = filtered.reduce((sum, session) => sum + session.duration / 60, 0);
    const completedSessions = filtered.filter((session) => session.status === "Completed").length;
    const canceledSessions = filtered.filter((session) => session.status === "Canceled").length;

    setStats({ totalHours, completedSessions, canceledSessions });
  };

  return (
    <div className="user-dashboard">
      <Sidebar />

      <div className="main-content">
        <h1>Training History</h1>

        {loading ? (
          <p>Loading session history...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {/* Filters */}
            <div className="filters">
              <select onChange={(e) => setSelectedTrainer(e.target.value)} value={selectedTrainer}>
                <option value="all">All Trainers</option>
                {trainers.map((trainer) => (
                  <option key={trainer} value={trainer}>
                    {trainer}
                  </option>
                ))}
              </select>

              <select onChange={(e) => setSelectedDateFilter(e.target.value)} value={selectedDateFilter}>
                <option value="all">All Dates</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>

            {/* Aggregated Stats */}
            <div className="stats-container">
              <div className="stat-box">
              <h3>{Number(stats.totalHours).toFixed(1) || 0} hrs</h3>
                <p>Total Hours Exercised</p>
              </div>
              <div className="stat-box">
                <h3>{stats.completedSessions}</h3>
                <p>Completed Sessions</p>
              </div>
              <div className="stat-box">
                <h3>{stats.canceledSessions}</h3>
                <p>Canceled Sessions</p>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="sessions-list">
              <table className="sessions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Trainer</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <tr key={session._id}>
                        <td>{session.date}</td>
                        <td>{session.time}</td>
                        <td>{session.duration} mins</td>
                        <td>{session.trainerName || "Unknown"}</td>
                        <td className={`status-${session.status.toLowerCase()}`}>{session.status}</td>
                        <td>{session.notes || "No notes"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No sessions found for the selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSessionHistory;
