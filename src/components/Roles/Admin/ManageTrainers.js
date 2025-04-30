import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "../Css/AdminDashboard.css";
import Sidebar from "./AdminSidebar";
import styles from "../Css/ManageUsers.module.css";

const ManageTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ name: "", email: "", password: "" });
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/admin/trainers", {
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

  // const handleEdit = (trainer) => {
  //   navigate("/Roles/Admin/EditTrainer", { state: { trainer } });
  // };

  const openEditPopup = (trainer) => {
    setSelectedUser(trainer);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setSelectedUser(null);
    setIsEditPopupOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/admin/trainers/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(selectedUser),
      });

      if (!response.ok) throw new Error("Failed to update user");

      fetchTrainers();
      closeEditPopup();
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const handleDelete = async (trainerId) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
  
    try {
      const response = await fetch(`http://localhost:5001/admin/trainers/${trainerId}`, {
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
      const response = await fetch("http://localhost:5001/admin/trainers", {
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
      <Sidebar />

      {/* Main Content */}
      <div className={styles.mainContent}>
              <div className={styles.header}>
          <h1>Manage Trainers</h1>
          <button className={styles.addbtn} onClick={() => setShowPopup(true)}>Add Trainer</button>
        </div>
        
        {loading ? (
          <p>Loading trainers...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : trainers.length === 0 ? (
          <p>No trainers found.</p>
        ) : (
          <table className={styles.userTable}>
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
                    <button className={styles.editBtn} onClick={() => openEditPopup(trainer)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(trainer._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
            <h2>Add Trainer</h2>
            <label>Name:</label>
            <input type="text" value={newTrainer.name} onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })} />
            <label>Email:</label>
            <input type="email" value={newTrainer.email} onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })} />
            <label>Password:</label>
            <input type="password" value={newTrainer.password} onChange={(e) => setNewTrainer({ ...newTrainer, password: e.target.value })} />
            <div className={styles.popupButtons}>
            <button className={styles.saveBtn} onClick={handleAddTrainer}>Add</button>
            <button className={styles.cancelBtn} onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}
            {isEditPopupOpen && selectedUser && (
              <div className={styles.popupOverlay}>
                <div className={styles.popupContent}>
                  <h2>Edit Trainer</h2>
                  <form onSubmit={handleEditSubmit}>
                    <label>Name:</label>
                    <input
                      type="text"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      required
                    />
                    <label>Email:</label>
                    <input
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      required
                    />
                    <div className={styles.popupButtons}>
                      <button type="submit" className={styles.saveBtn}>Save</button>
                      <button type="button" className={styles.cancelBtn} onClick={closeEditPopup}>Cancel</button>
                    </div>
                    </form>
               </div>
             </div>
             )}
             </div>
  );
};

export default ManageTrainers;