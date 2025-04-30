import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerSidebar from "./TrainerSidebar"; // Adjust path as needed
import "../Css/TrainerDashboard.css";

const TrainerDashboard = () => {
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

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        sessionStorage.clear();
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="trainer-dashboard">
      <TrainerSidebar handleLogout={handleLogout} />
      <div className="main-content">
        <div className="dashboardCard">
        <h2>Welcome back!</h2>
          {email && (
          <p>
            Logged in as: <strong>{email}</strong>
          </p>
        )}
          <p>Select an option from the sidebar to get started.</p>    
      </div>

        {/* introduce module */}
        <div className="feature-wrapper">
          <div className="feature-highlight">
            <div className="feature-image">
              <img
                src="https://educatefitness.co.uk/wp-content/uploads/2023/03/qualified-personal-trainer.png"
                alt="Training Tips"
              />
            </div>
            <div className="feature-text">
              <div className="quote-mark">❝</div>
              <p>
                At FitForge, we believe that every client deserves more than a
                one-size-fits-all program. We inspire coaches to train with{" "}
                <strong>care, responsibility, and a deep commitment</strong> to
                each individual’s journey. When your clients feel seen and
                supported, they stay motivated — and you grow with them.
              </p>
            </div>
          </div>
          <div className="trainer-section">
            <div className="trainer-text">
              <div className="quote-mark"> ❝</div>
              <p>
                At FitForge, we understand that coaching is about more than just
                workouts — it’s about <strong>building trust</strong>. We encourage trainers to
                lead with empathy, consistency, and professional dedication to
                every client’s personal path. When you invest in their progress,
                your impact grows far beyond the gym.
              </p>
            </div>
            <div className="trainer-image">
              <img
                src="https://www.bodyfittraining.au/hubfs/2024%20BFT%20Website%20Images%20Resized/bft-2.webp"
                alt="Trainer supporting client"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
