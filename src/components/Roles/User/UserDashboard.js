import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import Sidebar component
import "../Css/UserDashboard.css";
import ImageCarousel from "./ImageCarousel.js";
import hiitImg from "../../../assets/HIIT Training.jpg";
import yogaImg from "../../../assets/Yoga & Pilates.jpg";
import strenImg from "../../../assets/Strength Training.jpg";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // Retrieve user email from session/local storage
  useEffect(() => {
    const storedEmail =
      sessionStorage.getItem("email") || localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.warn("No email found in storage. Redirecting to login.");
      navigate("/Register"); // Redirect to login if no email found
    }
  }, [navigate]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("https://brave-smoke-0773e2a1e.6.azurestaticapps.net/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        sessionStorage.clear();
        localStorage.clear(); // Clear all stored data
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const courses = [
    {
      title: "HIIT Training",
      description: "Burn fat fast with our intense cardio sessions.",
      image: hiitImg,
    },
    {
      title: "Yoga & Pilates",
      description: "Improve flexibility and reduce stress.",
      image: yogaImg,
    },
    {
      title: "Strength Training",
      description: "Build muscle and boost endurance.",
      image: strenImg,
    },
  ];

  return (
    <div className="user-dashboard">
      {/* Sidebar Component */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-style">
        {/* <h1>Welcome to Your Dashboard!</h1>
        {email && (
          <p>
            Logged in as: <strong>{email}</strong>
          </p>
        )}
        <p>Select an option from the sidebar to get started.</p> */}
       <div className="dashboardCard">
        <h2>Welcome back!</h2>
          {email && (
          <p>
            Logged in as: <strong>{email}</strong>
          </p>
        )}
          <p>Select an option from the sidebar to get started.</p>

              
      </div>

      <ImageCarousel /> 

        {/* recomand sessions */}
        <section className="course-section">
          <h2>🔥 Popular Sessions</h2>
          <p>
            Ready to transform your body and mind? From high-intensity to
            mindful movement, our programs support every fitness ambition.
          </p>
          <div className="course-grid">
            {courses.map((course, index) => (
              <div className="course-card" key={index}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                />
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
              </div>
            ))}
          </div>
          <div className="book-link">
            Ready to start your fitness journey? <br></br>
            <Link to="/Roles/User/SearchTrainer">
              Click here to book a trainer
            </Link>
          </div>
        </section>

        {/* Facility introduction */}
        <section className="facility">
          <h2>🏋️‍♀️ Our Facilities</h2>
          <p className="facility-intro">
            Enjoy a premium training environment with top-notch equipment and
            relaxing spaces designed for your comfort.
          </p>
          <ul className="facility-list">
            <li> Modern equipment with 24/7 access</li>
            <li> Spacious locker rooms and showers</li>
            <li> Free Wi-Fi & lounge area</li>
            <li> Indoor cycling & stretching zones</li>
            <li>
              Bluetooth speakers, curated workout playlists, and TVs for cardio
              zones
            </li>
            <li>
              Biometric entry and CCTV for whole day safety and peace of mind.
            </li>
          </ul>
        </section>
      </div>
      <footer className="footer">
          <div className="footer-top">
            <div className="footer-section">
              <h4>📍 Visit Us</h4>
              <p>📌 123 Fitness St, London</p>
              <p>📞 +44 123 456 789</p>
              <p>📧 contact@FitForgegym.co.uk</p>
            </div>
            <div className="footer-section">
              <h4>🕒 Opening Hours</h4>
              <p>Mon – Fri: 6:00 AM – 10:00 PM</p>
              <p>Sat – Sun: 8:00 AM – 8:00 PM</p>
            </div>
          </div>
          <div className="footer-section">
            <h4>💡 Our Philosophy</h4>
            <p>At FitForge, we believe fitness is for everyone.</p>
            <p>
              Our goal is to empower you through movement, mindset, and
              motivation.
            </p>
          </div>
          <div className="footer-bottom">
            <p>© 2025 FitForge Gym. All rights reserved.</p>
          </div>
        </footer>
    </div>
  );
};

export default UserDashboard;
