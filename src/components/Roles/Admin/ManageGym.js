import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AdminDashboard.css";

const ManageGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newGym, setNewGym] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    facilities: "",
    trainers: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchGyms();
    fetchTrainers();
  }, []);

  const fetchGyms = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/admin/gyms", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch gyms");

      const data = await response.json();
      setGyms(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/trainers", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch trainers");
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error("Error fetching trainers:", error.message);
    }
  };

  const handleDelete = async (gymId) => {
    if (!window.confirm("Are you sure you want to delete this gym?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/admin/gyms/${gymId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete gym");

      setGyms((prev) => prev.filter((gym) => gym._id !== gymId));
    } catch (error) {
      console.error("Error deleting gym:", error.message);
    }
  };

  const handleAddGym = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/gyms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newGym,
          latitude: parseFloat(newGym.latitude),
          longitude: parseFloat(newGym.longitude),
          facilities: newGym.facilities.split(",").map((f) => f.trim()),
        }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to add gym");
      setNewGym({ name: "", address: "", latitude: "", longitude: "", facilities: "", trainers: [] });
      setShowPopup(false);
      fetchGyms();
    } catch (error) {
      console.error("Error adding gym:", error.message);
    }
  };

  return (
    <div className="admin-container">
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="/Roles/Admin/AdminDashboard">Dashboard</a></li>
          <li><a href="/Roles/Admin/ManageUsers">Manage Users</a></li>
          <li><a href="/Roles/Admin/ManageTrainers">Manage Trainers</a></li>
          <li><a href="/Roles/Admin/ManageGyms">Manage Gyms</a></li>
          <li><a href="/Roles/Admin/Settings">Settings</a></li>
          <li><button className="logout-btn" onClick={() => navigate("/Register")}>Logout</button></li>
        </ul>
      </nav>

      <div className="main-content">
        <div className="header">
          <h1>Manage Gyms</h1>
          <button className="add-btn" onClick={() => setShowPopup(true)}>Add Gym</button>
        </div>

        {loading ? (
          <p>Loading gyms...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : gyms.length === 0 ? (
          <p>No gyms found.</p>
        ) : (
          <table className="gym-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Facilities</th>
                <th>Trainers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gyms.map((gym) => (
                <tr key={gym._id}>
                  <td>{gym.name}</td>
                  <td>{gym.address}</td>
                  <td>{gym.latitude}</td>
                  <td>{gym.longitude}</td>
                  <td>{gym.facilities.join(", ")}</td>
                  <td>{gym.trainers?.map(trainer => trainer.name).join(", ") || "None"}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(gym._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Gym</h2>
            <label>Name:</label>
            <input type="text" value={newGym.name} onChange={(e) => setNewGym({ ...newGym, name: e.target.value })} />
            <label>Address:</label>
            <input type="text" value={newGym.address} onChange={(e) => setNewGym({ ...newGym, address: e.target.value })} />
            <label>Latitude:</label>
            <input type="number" value={newGym.latitude} onChange={(e) => setNewGym({ ...newGym, latitude: e.target.value })} />
            <label>Longitude:</label>
            <input type="number" value={newGym.longitude} onChange={(e) => setNewGym({ ...newGym, longitude: e.target.value })} />
            <label>Facilities (comma-separated):</label>
            <input type="text" value={newGym.facilities} onChange={(e) => setNewGym({ ...newGym, facilities: e.target.value })} />
            <label>Trainers:</label>
            <select multiple value={newGym.trainers} onChange={(e) => setNewGym({ ...newGym, trainers: [...e.target.selectedOptions].map(o => o.value) })}>
              {trainers.map(trainer => (
                <option key={trainer._id} value={trainer._id}>{trainer.name}</option>
              ))}
            </select>
            <button onClick={handleAddGym}>Add</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGyms;
