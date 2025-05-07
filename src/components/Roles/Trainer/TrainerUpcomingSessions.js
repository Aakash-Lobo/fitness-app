import React, { useEffect, useState } from "react";
import Sidebar from "./TrainerSidebar";
import "../Css/TrainerDashboard.css";
import styles from "../Css/TrainerSessions.module.css";

const TrainerUpcomingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [updatedSession, setUpdatedSession] = useState({});

  useEffect(() => {
    const fetchScheduledSessions = async () => {
      try {
        const email = sessionStorage.getItem("email") || localStorage.getItem("email");
        if (!email) {
          setError("Trainer not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/scheduledSessions?email=${email}`);
        if (!response.ok) throw new Error("Failed to fetch sessions.");

        const data = await response.json();
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledSessions();
  }, []);

  // Open Edit Modal
  const openEditModal = (session) => {
    setSelectedSession(session);
    setUpdatedSession(session);
    setIsModalOpen(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  // Open Confirm Delete Modal
  const openConfirmModal = (session) => {
    setSelectedSession(session);
    setIsConfirmOpen(true);
  };

  // Close Confirm Delete Modal
  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
    setSelectedSession(null);
  };

  // Handle Change in Edit Modal
  const handleChange = (e) => {
    setUpdatedSession({ ...updatedSession, [e.target.name]: e.target.value });
  };

  // Update Session
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
      closeEditModal();
    } catch (error) {
      alert("Error updating session: " + error.message);
    }
  };

  // Cancel (Delete) Session
  const cancelSession = async () => {
    try {
      const response = await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/cancelSession/${selectedSession._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to cancel session.");

      setSessions(sessions.filter((session) => session._id !== selectedSession._id));
      closeConfirmModal();
    } catch (error) {
      alert("Error canceling session: " + error.message);
    }
  };

  return (
    <div className="user-dashboard">
      <Sidebar />

      {/* <div className="main-content"> */}
      <div className={styles.mainContent}>
        <h1>Scheduled Sessions</h1>

        {loading ? (
          <p>Loading scheduled sessions...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : sessions.length === 0 ? (
          <p>No scheduled sessions found.</p>
        ) : (
          <div className="sessions-list">
            <table className={styles.sessionsTable}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td>{session.userName || "Unknown"}</td>
                    <td>{session.date}</td>
                    <td>{session.time}</td>
                    <td>{session.duration} mins</td>
                    <td>{session.notes || "No notes"}</td>
                    <td className={`status-${session.status.toLowerCase()}`}>{session.status}</td>
                    <td>
                      <button onClick={() => openEditModal(session)} className={styles.editBtn}>Edit</button>
                      <button onClick={() => openConfirmModal(session)} className={styles.cancelBtn}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      
      </div>

      {/* Edit Session Modal */}
      {isModalOpen && selectedSession && (
       <div className={styles.modal}>
  <div className={styles.modalContent}>
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
            <button onClick={closeEditModal} className={styles.closeBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Cancel Modal */}
      {isConfirmOpen && selectedSession && (
        <div className={styles.modal}>
  <div className={styles.modalContent}>
            <h2>Confirm Cancellation</h2>
            <p>Are you sure you want to cancel this session with {selectedSession.userName}?</p>
            <div className={styles.buttonGroup}>
            <button onClick={cancelSession} className={styles.confirmBtn}>Yes, Cancel</button>
            <button onClick={closeConfirmModal} className={styles.closeBtn}>No, Keep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerUpcomingSessions;
