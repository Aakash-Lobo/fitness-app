import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AdminDashboard.css";

const ManageTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/admin/trainers", {
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

  const handleEdit = (trainer) => {
    navigate("/Roles/Admin/EditTrainer", { state: { trainer } });
  };

  const handleDelete = async (trainerId) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
  
    try {
      const response = await fetch(`http://localhost:5000/admin/trainers/${trainerId}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete trainer");
      }
  
      // Refresh trainers list after deletion
      setTrainers((prev) => prev.filter((trainer) => trainer._id !== trainerId));
    } catch (error) {
      console.error("Error deleting trainer:", error.message);
    }
  };

  const handleAddTrainer = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/trainers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTrainer),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to add trainer");
      setNewTrainer({ name: "", email: "", password: "" });
      setShowPopup(false);
      fetchTrainers();
    } catch (error) {
      console.error("Error adding trainer:", error.message);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="/Roles/Admin/AdminDashboard">Dashboard</a></li>
          <li><a href="/Roles/Admin/ManageUsers">Manage Users</a></li>
          <li><a href="/Roles/Admin/ViewTrainers">Manage Trainers</a></li>
          <li><a href="/Roles/Admin/Settings">Settings</a></li>
          <li><button className="logout-btn" onClick={() => navigate("/Register")}>Logout</button></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Manage Trainers</h1>
          <button className="add-btn" onClick={() => setShowPopup(true)}>Add Trainer</button>
        </div>
        
        {loading ? (
          <p>Loading trainers...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : trainers.length === 0 ? (
          <p>No trainers found.</p>
        ) : (
          <table className="trainer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr key={trainer._id}>
                  <td>{trainer.name}</td>
                  <td>{trainer.email}</td>
                  <td>{trainer.status}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(trainer)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(trainer._id)}>Delete</button>
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
            <h2>Add Trainer</h2>
            <label>Name:</label>
            <input type="text" value={newTrainer.name} onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })} />
            <label>Email:</label>
            <input type="email" value={newTrainer.email} onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })} />
            <label>Password:</label>
            <input type="password" value={newTrainer.password} onChange={(e) => setNewTrainer({ ...newTrainer, password: e.target.value })} />
            <button onClick={handleAddTrainer}>Add</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrainers;