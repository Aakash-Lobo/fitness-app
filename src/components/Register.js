import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Roles/Css/Register.css";
import fitnessVideo from "../assets/fitness.mp4";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

const Register = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname !== "/register") return;
    fetch("http://localhost:5001/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        if (data?.status) setStatus(data.status);
        if (data?.role === "admin") navigate("./Roles/Admin/AdminDashboard");
        else if (data?.role === "trainer")
          navigate("./Roles/Trainer/TrainerDashboard");
        else if (data?.role === "user" && data?.status === "approved")
          navigate("./Roles/User/UserDashboard");
      });
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.open("http://localhost:5001/auth/google", "_self");
  };

  const handleLogout = () => {
    window.open("http://localhost:5001/auth/logout", "_self");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful. Your account is pending approval.");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="reg-video">
        <video autoPlay muted loop playsInline>
          <source src={fitnessVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="register-title">
        <h1>Join FitZone Today</h1>
        <p>
          Sign up to unlock fitness tracking, expert trainers, and personalized
          programs.
        </p>

        {user ? (
          <div className="user-info">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <p>Welcome, {user.name}!</p>
            {status === "pending" && (
              <p className="status-pending">
                Your account is pending approval.
              </p>
            )}
            {status === "declined" && (
              <p className="status-declined">Your registration was declined.</p>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleRegister} className="register-form">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="register-btn">
                Register
              </button>
            </form>

            <div className="divider">
            <p className="or-divider">Or Continue With</p>
            </div>

            <div className="social-login-container">
              <div className="social-login-option" onClick={handleGoogleLogin}>
                <FcGoogle className="social-icon" />
                <span>Login with Google</span>
              </div>

              <div className="social-login-option">
                <FaFacebook className="social-icon facebook-icon" />
                <span>Login with Facebook</span>
              </div>
            </div>

            <p className="back-home-text">
              <a href="/" className="back-home-link">
                Back to HomePage
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
