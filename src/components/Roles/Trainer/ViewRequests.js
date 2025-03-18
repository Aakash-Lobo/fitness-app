import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/TrainerDashboard.css";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [suggestedTrainer, setSuggestedTrainer] = useState("");
  const navigate = useNavigate();
  const trainerId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  useEffect(() => {
    if (!trainerId) {
      navigate("/Register");
    } else {
      fetchRequests();
      fetchTrainers();
    }
  }, [trainerId, navigate]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/trainer/requests/${trainerId}`);
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch("http://localhost:5000/user/trainers");
      if (!response.ok) throw new Error("Failed to fetch trainers");
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setSuggestedTrainer("");
  };

  const updateStatus = async (requestId, status) => {
    try {
      await fetch(`http://localhost:5000/trainer/update-request/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchRequests();
      closeModal();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const suggestTrainer = async () => {
    if (!suggestedTrainer) {
      alert("Please select a trainer");
      return;
    }

    try {
      await fetch(`http://localhost:5000/trainer/suggest-trainer/${selectedRequest._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newTrainerId: suggestedTrainer }),
      });

      fetchRequests();
      closeModal();
    } catch (error) {
      console.error("Error suggesting trainer:", error);
    }
  };

  return (
    <div className="trainer-dashboard">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>Trainer Dashboard</h2>
        <ul>
          <li><a href="/Roles/Trainer/TrainerDashboard">Dashboard</a></li>
          <li><button onClick={() => navigate("./ViewRequests")}>View Requests</button></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <h1>View Requests</h1>

        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Fitness Goal</th>
                <th>Experience Level</th>
                <th>Preferred Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {requests
    .filter(req => req.status === "pending") // ✅ Only show pending requests
    .map((req) => (
      <tr key={req._id}>
        <td>{req.userEmail}</td>
        <td>{req.fitnessGoal}</td>
        <td>{req.experienceLevel}</td>
        <td>{req.preferredTime}</td>
        <td>{req.status}</td>
        <td>
          <button onClick={() => openModal(req)}>View</button>
        </td>
      </tr>
    ))}
</tbody>

          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="modal">
          <div className="modal-content">
            <h2>Request Details</h2>
            <p><strong>User Email:</strong> {selectedRequest.userEmail}</p>
            <p><strong>Fitness Goal:</strong> {selectedRequest.fitnessGoal}</p>
            <p><strong>Experience Level:</strong> {selectedRequest.experienceLevel}</p>
            <p><strong>Preferred Time:</strong> {selectedRequest.preferredTime}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>

            <button onClick={() => updateStatus(selectedRequest._id, "accepted")}>Accept</button>
            <button onClick={() => updateStatus(selectedRequest._id, "declined")}>Decline</button>

            <h3>Suggest a Different Trainer</h3>
            <select value={suggestedTrainer} onChange={(e) => setSuggestedTrainer(e.target.value)}>
              <option value="">Select Trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer._id} value={trainer._id}>{trainer.name}</option>
              ))}
            </select>
            <button onClick={suggestTrainer}>Suggest</button>
            <button onClick={closeModal} className="cancel-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRequests;
