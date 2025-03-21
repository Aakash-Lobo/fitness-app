import React, { useEffect, useState } from "react";
import "../Css/UserDashboard.css";

const AcceptedTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({
    date: "",
    time: "",
    duration: "",
    notes: "",
  });

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

  // Handle cancel subscription
  const handleCancelClick = (trainer) => {
    setSelectedTrainer(trainer);
    setShowCancelModal(true);
  };

  // Confirm cancel trainer subscription
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

      setShowCancelModal(false);
    } catch (error) {
      console.error("Error cancelling trainer:", error);
    }
  };

  // Handle book session button click
  const handleBookSessionClick = (trainer) => {
    setSelectedTrainer(trainer);
    setShowBookingModal(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setSessionDetails({ ...sessionDetails, [e.target.name]: e.target.value });
  };

  // Confirm booking a session
  const confirmBookSession = async () => {
    try {
      const email = sessionStorage.getItem("email") || localStorage.getItem("email");

      const response = await fetch("http://localhost:5000/user/bookSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          trainerId: selectedTrainer._id,
          ...sessionDetails,
        }),
      });

      if (!response.ok) throw new Error("Failed to book session.");

      alert("Session booked successfully!");
      setShowBookingModal(false);
    } catch (error) {
      console.error("Error booking session:", error);
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
                  <button className="book-btn" onClick={() => handleBookSessionClick(trainer)}>
                    Book Session
                  </button>
                  <button className="delete-btn" onClick={() => handleCancelClick(trainer)}>
                    Cancel Subscription
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to cancel your subscription with {selectedTrainer?.name}?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmCancelTrainer}>Yes, Cancel</button>
              <button className="cancel-btn" onClick={() => setShowCancelModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Book Session Modal */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Book a Session with {selectedTrainer?.name}</h3>
            <label>Date:</label>
            <input type="date" name="date" onChange={handleInputChange} required />

            <label>Time:</label>
            <input type="time" name="time" onChange={handleInputChange} required />

            <label>Duration (in minutes):</label>
            <input type="number" name="duration" onChange={handleInputChange} required />

            <label>Notes:</label>
            <textarea name="notes" onChange={handleInputChange} />

            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmBookSession}>Confirm Booking</button>
              <button className="cancel-btn" onClick={() => setShowBookingModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptedTrainers;
