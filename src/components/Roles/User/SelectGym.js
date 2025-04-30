import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "./Sidebar";
import L from "leaflet";
import { AiOutlineAlert } from "react-icons/ai";
import blueMarker from "../../../assets/mapmarker.png";

const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:5001/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      sessionStorage.clear();
      localStorage.clear(); // Clear all stored data
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
const SelectGym = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGym, setSelectedGym] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [pendingBookings, setPendingBookings] = useState({});
  const [email, setEmail] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fitnessGoal: "",
    experienceLevel: "",
    preferredTime: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchGyms();
    const storedEmail =
      sessionStorage.getItem("email") || localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("No email found in storage. Redirecting to login.");
      navigate("/Register");
    }
  }, [navigate]);

  const fetchGyms = async () => {
    try {
      const response = await fetch("http://localhost:5001/user/gyms");
      if (!response.ok) throw new Error("Failed to fetch gyms");
      const data = await response.json();
      setGyms(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGym = async (gym) => {
    setSelectedGym(gym);
    setTrainers([]); // Reset trainers while loading
    try {
      const response = await fetch(
        `http://localhost:5001/user/gyms/${gym._id}/trainers`
      );
      if (!response.ok) throw new Error("Failed to fetch trainers");
      const data = await response.json();
      setTrainers(data);
      fetchPendingBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPendingBookings = async (trainersList) => {
    if (!email) return;
    try {
      const pendingStatus = {};
      for (const trainer of trainersList) {
        const response = await fetch(
          `http://localhost:5001/user/check-booking?userEmail=${email}&trainerId=${trainer._id}`
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

  const customIcon = L.icon({
    iconUrl: blueMarker,
    iconSize: [32, 42], // 调整大小
    iconAnchor: [16, 42], // 锚点底部中心
    popupAnchor: [0, -40], // 弹窗偏移
  });

  const handleRequest = async () => {
    if (!email || !selectedTrainer) {
      alert("Error: Missing user email or trainer. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/user/request-trainer",
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
        fetchPendingBookings(trainers);
        closeModal();
      } else {
        alert(result.message || "Request failed");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="select-gym-wrapper">
      <div className="user-dashboard">
        {/* Sidebar Component */}
        <Sidebar handleLogout={handleLogout} />

        <div className="map-instruction">
          {/* <h2>Select a Gym</h2> */}
          <span role="img" aria-label="pin">
            📍
          </span>
          Click on a gym marker to view details and request a trainer!
          {loading ? (
            <p>Loading gyms...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : null}
        </div>
  
        <div className="map-container">
          <MapContainer
            center={[51.5074, -0.1278]}
            zoom={16}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {gyms.map((gym) => (
              <Marker
                key={gym._id}
                position={[gym.latitude, gym.longitude]}
                icon={customIcon}
                // eventHandlers={{
                //   click: () => handleSelectGym(gym),
                // }}
              >
                <Popup>
                  <strong>{gym.name}</strong>
                  <br />
                  {gym.address}
                  <br />
                  <button onClick={() => handleSelectGym(gym)}>Select</button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      {selectedGym && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setSelectedGym(false)}
            >
              ×
            </button>
            <h3>Selected Gym:</h3>
            <p>
              <strong>Name:</strong> {selectedGym.name}
            </p>
            <p>
              <strong>Address:</strong> {selectedGym.address}
            </p>

            <h3>Trainers Available:</h3>
            {trainers.length > 0 ? (
              <table className="trainer-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((trainer) => (
                    <tr key={trainer._id}>
                      <td>{trainer.name}</td>
                      <td>{trainer.email}</td>
                      <td>
                        <button
                          onClick={() => openModal(trainer)}
                          disabled={pendingBookings[trainer._id]}
                          className={
                            pendingBookings[trainer._id]
                              ? "disabled-button"
                              : ""
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
            ) : (
              <p>No trainers available at this gym.</p>
            )}
          </div>
        </div>
      )}

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

export default SelectGym;
