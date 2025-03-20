import React, { useEffect, useState } from "react";
import "../Css/UserDashboard.css";

const AcceptedTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    const fetchAcceptedTrainers = async () => {
      try {
        const email = sessionStorage.getItem("email") || localStorage.getItem("email");
        if (!email) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/user/acceptedTrainers?email=${email}`);
        if (!response.ok) throw new Error("Failed to fetch trainers.");

        const data = await response.json();
        setTrainers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedTrainers();
  }, []);

  // Handle delete button click (opens confirmation modal)
  const handleDeleteClick = (trainer) => {
    setSelectedTrainer(trainer);
    setShowModal(true);
  };

  // Function to cancel trainer
  const confirmCancelTrainer = async () => {
    if (!selectedTrainer || !selectedTrainer._id) {
      console.error("Error: Trainer ID is missing.");
      return;
    }

    try {
      const email = sessionStorage.getItem("email") || localStorage.getItem("email");

      const response = await fetch(
        `http://localhost:5000/user/cancelTrainer/${selectedTrainer._id}?email=${email}`,
        { method: "PUT" }
      );

      if (!response.ok) throw new Error("Failed to cancel trainer.");

      // Update local state
      setTrainers((prev) =>
        prev.map((trainer) =>
          trainer._id === selectedTrainer._id ? { ...trainer, status: "Cancelled" } : trainer
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error cancelling trainer:", error);
    }
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>User Dashboard</h2>
        <ul>
          <li><a href="/Roles/User/UserDashboard">Dashboard</a></li>
          <li><a href="/Roles/User/SearchTrainers">View Trainers</a></li>
          <li><a href="/Roles/User/Settings">Settings</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <h1>Accepted Trainers</h1>

        {loading ? (
          <p>Loading accepted trainers...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : trainers.length === 0 ? (
          <p>No accepted trainers yet.</p>
        ) : (
          <div className="accepted-trainers">
            <h3>Accepted Trainers</h3>
            <ul>
              {trainers.map((trainer) => (
                <li key={trainer._id}>
                  {trainer.name} - {trainer.specialization}
                  <button className="delete-btn" onClick={() => handleDeleteClick(trainer)}>
                    Cancel Subscription
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to cancel your subscription with {selectedTrainer?.name}?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmCancelTrainer}>Yes, Cancel</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptedTrainers;
