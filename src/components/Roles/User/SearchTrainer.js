import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineAlert } from "react-icons/ai";
import "../Css/UserDashboard.css";
import Sidebar from "./Sidebar";

const SearchTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [pendingBookings, setPendingBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fitnessGoal: "",
    experienceLevel: "",
    preferredTime: "",
  });

  useEffect(() => {
    fetchTrainers();

    const storedEmail =
      sessionStorage.getItem("email") || localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("No email found in storage. Redirecting to login.");
      navigate("/Register");
    }
  }, [navigate]);

  useEffect(() => {
    if (trainers.length > 0 && email) {
      fetchPendingBookings();
    }
  }, [trainers, email]);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://brave-smoke-0773e2a1e.6.azurestaticapps.net/user/trainers", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch trainers");
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingBookings = async () => {
    try {
      const pendingStatus = {};
      for (const trainer of trainers) {
        const response = await fetch(
          `https://brave-smoke-0773e2a1e.6.azurestaticapps.net/user/check-booking?userEmail=${email}&trainerId=${trainer._id}`
        );
        const data = await response.json();
        pendingStatus[trainer._id] = data.pending;
      }
      setPendingBookings(pendingStatus);
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
    }
  };

  const openModal = (trainer) => {
    setSelectedTrainer(trainer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTrainer(null);
    setFormData({ fitnessGoal: "", experienceLevel: "", preferredTime: "" });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequest = async () => {
    if (!email || !selectedTrainer) {
      alert("Error: Missing user email or trainer. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        "https://brave-smoke-0773e2a1e.6.azurestaticapps.net/user/request-trainer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: email,
            trainerId: selectedTrainer._id,
            fitnessGoal: formData.fitnessGoal,
            experienceLevel: formData.experienceLevel,
            preferredTime: formData.preferredTime,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Request sent successfully!");
        fetchPendingBookings(); // Refresh pending status
        closeModal();
      } else {
        alert(result.message || "Request failed");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const filteredTrainers = trainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [showTrainerSubmenu, setShowTrainerSubmenu] = useState(false);
  return (
    <div className="user-dashboard">
      <Sidebar />
      {/* Main Content */}
      <div className="main-content">
        <h1>Search Trainers</h1>

        <input
          type="text"
          placeholder="Search Trainers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {loading ? (
          <p>Loading trainers...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <h2>Available Trainers</h2>
            {filteredTrainers.length === 0 ? (
              <p>No trainers found.</p>
            ) : (
              <table className="trainer-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainers.map((trainer) => (
                    <tr key={trainer._id}>
                      <td>{trainer.name}</td>
                      <td>{trainer.email}</td>
                      <td><span className="tag">{trainer.specialization}</span></td>
                      <td>
                        <button
                          onClick={() => openModal(trainer)}
                          disabled={pendingBookings[trainer._id]}
                          // className={pendingBookings[trainer._id] ? "disabled-button" : ""}
                          className={
                            pendingBookings[trainer._id]
                              ? "pending-button"
                              : "request-button"
                          }
                        >
                          {pendingBookings[trainer._id]
                            ? "Pending..."
                            : "Request"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <AiOutlineAlert className="modal-icon" />
              <span>
                Please fill in the following details to book your trainer
              </span>
            </div>
            <h2>You have selected Trainer: {selectedTrainer.name}</h2>
            <label>
              Fitness Goal:
              <input
                type="text"
                className="fitnessgoal"
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Experience Level:
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleFormChange}
              >
                <option value="">Select</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </label>
            <label>
              Preferred Training Time:
              {/* <input type="text" name="preferredTime" value={formData.preferredTime} onChange={handleFormChange} /> */}
              <input
                type="datetime-local"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleFormChange}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={handleRequest} className="submit-btn">
                Submit
              </button>
              <button onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchTrainers;
