import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerSidebar from "./TrainerSidebar";
import "../Css/TrainerDashboard.css";
import styles from "../Css/ViewRequest.module.css";
import { useCallback } from "react";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [suggestedTrainer, setSuggestedTrainer] = useState("");
  const navigate = useNavigate();
  const trainerId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  // useEffect(() => {
  //   if (!trainerId) {
  //     navigate("/Register");
  //   } else {
  //     fetchRequests();
  //     fetchTrainers();
  //   }
  // }, [trainerId, navigate]);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(
        `https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/requests/${trainerId}`
      );
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, [trainerId]);

  const fetchTrainers = useCallback(async () => {
    try {
      const response = await fetch("https://brave-smoke-0773e2a1e.6.azurestaticapps.net/user/trainers");
      if (!response.ok) throw new Error("Failed to fetch trainers");
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  }, []);

  useEffect(() => {
    if (!trainerId) {
      navigate("/Register");
    } else {
      fetchRequests();
      fetchTrainers();
    }
  }, [trainerId, navigate, fetchRequests, fetchTrainers]);

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
      await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/update-request/${requestId}`, {
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
      await fetch(
        `https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/suggest-trainer/${selectedRequest._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newTrainerId: suggestedTrainer }),
        }
      );

      fetchRequests();
      closeModal();
    } catch (error) {
      console.error("Error suggesting trainer:", error);
    }
  };

  return (
    /* Sidebar */
    <div className="trainer-dashboard">
    <TrainerSidebar />

      {/* Main Content */}
      <div className="main-content">
        <div className={styles.mainContent}>
          <h1>View Requests</h1>

          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <table className={styles.requestsTable}>
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
                  .filter((req) => req.status === "pending") // ✅ Only show pending requests
                  .map((req) => (
                    <tr key={req._id}>
                      <td>{req.userEmail}</td>
                      <td>{req.fitnessGoal}</td>
                      <td>{req.experienceLevel}</td>
                      <td>{req.preferredTime}</td>
                      <td>{req.status}</td>
                      <td>
                        <button
                          className={styles.button}
                          onClick={() => openModal(req)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
          <button
                className={styles.cancelBtn}
                onClick={closeModal}
              >
                Close
              </button>
            <h2>Request Details</h2>
            <p>
              <strong>User Email:</strong> {selectedRequest.userEmail}
            </p>
            <p>
              <strong>Fitness Goal:</strong> {selectedRequest.fitnessGoal}
            </p>
            <p>
              <strong>Experience Level:</strong>{" "}
              {selectedRequest.experienceLevel}
            </p>
            <p>
              <strong>Preferred Time:</strong> {selectedRequest.preferredTime}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.button}
                onClick={() => updateStatus(selectedRequest._id, "accepted")}
              >
                Accept
              </button>
              <button
                className={styles.button}
                onClick={() => updateStatus(selectedRequest._id, "declined")}
              >
                Decline
              </button>
            </div>

            <div className={styles.suggestTrainerSection}>
              <h3>Suggest a Different Trainer</h3>
              <div className={styles.suggestTrainerControls}>
                <select
                  value={suggestedTrainer}
                  onChange={(e) => setSuggestedTrainer(e.target.value)}
                  className={styles.selectTrainer}
                >
                  <option value="">Select Trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer._id} value={trainer._id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>

                <button className={styles.button} onClick={suggestTrainer}>
                  Suggest
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRequests;
