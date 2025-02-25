import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/admin/users", {
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
    try {
      const response = await fetch(`http://localhost:5000/admin/update-status/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to update user status");

      fetchUsers(); // Refresh users list
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mt-4">Pending Approvals</h2>
            {users.filter((user) => user.status === "pending").length === 0 ? (
              <p className="text-center text-gray-600">No pending users.</p>
            ) : (
              users
                .filter((user) => user.status === "pending")
                .map((user) => (
                  <div key={user._id} className="p-4 border rounded-md mb-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                    <div>
                      <button
                        className="bg-green-500 text-white px-3 py-1 mr-2 rounded hover:bg-green-600"
                        onClick={() => updateUserStatus(user._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => updateUserStatus(user._id, "declined")}
                      >
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

export default UserDashboard;
