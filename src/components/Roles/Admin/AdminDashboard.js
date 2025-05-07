import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AdminDashboard.css";
import Sidebar from "./AdminSidebar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://brave-smoke-0773e2a1e.6.azurestaticapps.net/admin/users", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    console.log("Updating user ID:", userId); // Debugging
    try {
      const response = await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/admin/update-status/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Update response:", data); // Debugging

      if (response.ok) {
        fetchUsers(); // Refresh the user list
      } else {
        console.error("Failed to update:", data.message);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://brave-smoke-0773e2a1e.6.azurestaticapps.net/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        sessionStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="/Roles/Admin/AdminDashboard">Dashboard</a></li>
          <li><a href="../Admin/ManageUsers">Manage Users</a></li>
          <li><a href="../Admin/ViewTrainers">Manage Trainers</a></li>
          <li><a href="./ManageGym">Manage Gyms</a></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <h1>Admin Dashboard</h1>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <h2>Pending Approvals</h2>
            {users.filter((user) => user.status === "pending").length === 0 ? (
              <p>No pending users.</p>
            ) : (
              users
                .filter((user) => user.status === "pending")
                .map((user) => (
                  <div key={user._id} className="user-card">
                    <div>
                      <p className="user-name">{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="button-group">
                      <button className="approve-btn" onClick={() => updateUserStatus(user._id, "approved")}>
                        Approve
                      </button>
                      <button className="decline-btn" onClick={() => updateUserStatus(user._id, "declined")}>
                        Decline
                      </button>
                    </div>
                  </div>
                ))
            )}
          </>
        )}
      </div>
  
    </div>
  );
};

export default AdminDashboard;
