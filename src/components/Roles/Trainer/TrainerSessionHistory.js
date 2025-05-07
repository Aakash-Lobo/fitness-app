import React, { useEffect, useState } from "react";
import Sidebar from "./TrainerSidebar";
import "../Css/TrainerDashboard.css";
import styles from "../Css/TrainerSessionHistory.module.css";

const TrainerSessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [updatedSession, setUpdatedSession] = useState({});

  useEffect(() => {
    const fetchCompletedSessions = async () => {
      try {
        const trainerId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
        if (!trainerId) {
          setError("Trainer not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/completedSessions?trainerId=${trainerId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch completed sessions.");
        }

        const data = await response.json();
        setSessions(data);
        setFilteredSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedSessions();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let filtered = sessions;

    if (searchUser) {
      filtered = filtered.filter(session =>
        session.userName?.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    if (searchDate) {
      filtered = filtered.filter(session => session.date === searchDate);
    }

    setFilteredSessions(filtered);
  }, [searchUser, searchDate, sessions]);

  // Open Edit Modal
  const openModal = (session) => {
    setSelectedSession(session);
    setUpdatedSession(session);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  // Handle Form Change
  const handleChange = (e) => {
    setUpdatedSession({ ...updatedSession, [e.target.name]: e.target.value });
  };

  // Handle Update Request
  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/update-session/${selectedSession._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSession),
      });

      if (!response.ok) throw new Error("Failed to update session.");

      const updatedData = await response.json();
      setSessions(sessions.map(session => session._id === updatedData._id ? updatedData : session));
      closeModal();
    } catch (error) {
      alert("Error updating session: " + error.message);
    }
  };

  return (
    <div className="user-dashboard">
      <Sidebar />
      <div className={styles.mainContent}>
        <h1>Session History</h1>

        {/* Search Filters */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by User"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading completed sessions...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredSessions.length === 0 ? (
          <p>No completed sessions found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.sessionsTable}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session) => (
                    <tr key={session._id}>
                      <td>{session.userName || "Unknown"}</td>
                      <td>{new Date(session.date).toLocaleDateString()}</td>
                      <td>{session.time}</td>
                      <td>{session.duration} mins</td>
                      <td>{session.notes || "No notes"}</td>
                      <td>
                        <button onClick={() => openModal(session)} className={styles.editBtn}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedSession && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Session</h2>
            <label>
              Time:
              <input type="text" name="time" value={updatedSession.time} onChange={handleChange} />
            </label>
            <label>
              Duration (mins):
              <input type="number" name="duration" value={updatedSession.duration} onChange={handleChange} />
            </label>
            <label>
              Notes:
              <textarea name="notes" value={updatedSession.notes} onChange={handleChange} />
            </label>
            <label>
              Status:
              <select name="status" value={updatedSession.status} onChange={handleChange}>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
            <div className={styles.buttonGroup}>
            <button onClick={handleUpdate} className={styles.saveBtn}>Save</button>
            <button onClick={closeModal} className={styles.closeBtn}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerSessionHistory;
