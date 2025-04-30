import React, { useEffect, useState } from "react";
import "../Css/AdminDashboard.css";
import Sidebar from "./AdminSidebar";
import styles from "../Css/ManageUsers.module.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/admin/users", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.filter(user => user.role === "user"));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditPopup = (user) => {
    setSelectedUser(user);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setSelectedUser(null);
    setIsEditPopupOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/admin/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(selectedUser),
      });

      if (!response.ok) throw new Error("Failed to update user");

      fetchUsers();
      closeEditPopup();
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const openDeletePopup = (user) => {
    setSelectedUser(user);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setSelectedUser(null);
    setIsDeletePopupOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/admin/users/${selectedUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      fetchUsers();
      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Manage Users</h1>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => openEditPopup(user)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => openDeletePopup(user)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Popup */}
      {isEditPopupOpen && selectedUser && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2>Edit User</h2>
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
              <label>Status:</label>
              <select
                value={selectedUser.status}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
              <div className={styles.popupButtons}>
                <button type="submit" className={styles.saveBtn}>Save</button>
                <button type="button" className={styles.cancelBtn} onClick={closeEditPopup}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && selectedUser && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{selectedUser.name}</strong>?</p>
            <div className={styles.popupButtons}>
              <button className={styles.deleteConfirmBtn} onClick={handleDelete}>Yes, Delete</button>
              <button className={styles.cancelBtn} onClick={closeDeletePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
