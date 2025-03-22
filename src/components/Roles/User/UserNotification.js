import React, { useEffect, useState } from "react";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState("");

  // Fetch logged-in user's ID from session/local storage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Fetch notifications for the current user
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
        try {
          const response = await fetch(`http://localhost:5000/user/notifications?userId=${userId}`);
          if (!response.ok) throw new Error("Failed to fetch notifications");
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      

    fetchNotifications();
  }, [userId]);

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/user/notifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete notification");

      // Remove deleted notification from state
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div>
      <h2>Your Notifications</h2>
      {userId ? (
        notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((notif) => (
              <li key={notif._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>
                  Session Type: {notif.sessionType} | Date: {new Date(notif.date).toLocaleDateString()}
                </span>
                <button onClick={() => deleteNotification(notif._id)}>✅</button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserNotifications;
