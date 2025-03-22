import React, { useEffect, useState, useCallback } from "react";
import "../Css/UserDashboard.css";

const TrainerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]); // NEW: Notifications State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({
    userEmail: "",
    date: "",
    time: "",
    duration: "",
    notes: "",
  });

  const trainerId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!trainerId) {
      setError("Trainer ID not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/trainer/bookings?trainerId=${trainerId}`);
      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      setBookings(data.filter(booking => booking.status === "accepted"));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [trainerId]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/trainer/users");
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch notifications (NEW)
 

  useEffect(() => {
    fetchBookings();
    fetchUsers();
  }, [fetchBookings]);

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch("http://localhost:5000/trainer/cancel-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) throw new Error("Failed to cancel booking");

      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle session booking
  const confirmBookSession = async () => {
    const requestData = {
      trainerId,
      userEmail: sessionDetails.userEmail,
      date: sessionDetails.date,
      time: sessionDetails.time,
      duration: sessionDetails.duration,
      notes: sessionDetails.notes || "",
    };
  
    console.log("Sending request data:", requestData); // Log data being sent
  
    try {
      const response = await fetch("http://localhost:5000/trainer/bookSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with error:", errorData);
        throw new Error("Failed to book session.");
      }
  
      alert("Session booked successfully!");
      setShowBookingModal(false);
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error("Error booking session:", error);
    }
  };
  
  
  

  return (
    <div className="user-dashboard">
      <nav className="sidebar">
        <h2>Trainer Dashboard</h2>
        <ul>
          <li><a href="/Roles/Trainer/TrainerDashboard">Dashboard</a></li>
          <li><a href="/Roles/Trainer/Bookings">Bookings</a></li>
        </ul>
      </nav>

      <div className="main-content">
        <h1>My Bookings</h1>
        <button className="book-btn" onClick={() => setShowBookingModal(true)}>Book New Session</button>

     

        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : bookings.length === 0 ? (
          <p>No accepted bookings found.</p>
        ) : (
          <table className="trainer-table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Fitness Goal</th>
                <th>Experience Level</th>
                <th>Preferred Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.userEmail}</td>
                  <td>{booking.fitnessGoal}</td>
                  <td>{booking.experienceLevel}</td>
                  <td>{booking.preferredTime}</td>
                  <td className="active">{booking.status}</td>
                  <td>
                    <button onClick={() => cancelBooking(booking._id)} className="cancel-btn">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Book Session Modal */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Book a New Session</h3>

            <label>Select User:</label>
            <select name="userEmail" onChange={(e) => setSessionDetails({ ...sessionDetails, userEmail: e.target.value })} required>
              <option value="">Select a User</option>
              {users.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            <label>Date:</label>
            <input type="date" name="date" onChange={(e) => setSessionDetails({ ...sessionDetails, date: e.target.value })} required />

            <label>Time:</label>
            <input type="time" name="time" onChange={(e) => setSessionDetails({ ...sessionDetails, time: e.target.value })} required />

            <label>Duration (in minutes):</label>
            <input type="number" name="duration" onChange={(e) => setSessionDetails({ ...sessionDetails, duration: e.target.value })} required />

            <label>Notes:</label>
            <textarea name="notes" onChange={(e) => setSessionDetails({ ...sessionDetails, notes: e.target.value })} />

            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmBookSession}>Confirm Booking</button>
              <button className="cancel-btn" onClick={() => setShowBookingModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerBookings;
