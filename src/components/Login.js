import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Roles/Css/login.css";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineClose } from "react-icons/md";
import { FaFacebook } from "react-icons/fa6";

const Login = ({ closeModal }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error === "pending") {
      alert("Your account is pending approval.");
    } else if (error === "declined") {
      alert("Your account has been declined.");
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://brave-smoke-0773e2a1e.6.azurestaticapps.net/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Full API Response:", data); // Debugging

      // if (response.ok) {
      //   if (!data.user || !data.user._id) {
      //     console.error("Error: `user` object or `_id` is missing in response");
      //     alert("Login failed: Invalid response format");
      //     return;
      //   }

      if (response.ok) {
        if (!data?.user) {
          alert("Login failed: No user data returned.");
          return;
        }

        const { _id, role, status, email } = data.user;

        // if (!verified) {
        //   alert("Please verify your email before logging in.");
        //   return;
        // }
        console.log("Extracted userId:", _id); // Debugging

        sessionStorage.setItem("userId", _id);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("status", status);
        sessionStorage.setItem("email", email);

        localStorage.setItem("userId", _id);
        localStorage.setItem("role", role);
        localStorage.setItem("status", status);
        localStorage.setItem("email", email);

        console.log("Stored userId:", sessionStorage.getItem("userId")); // Debugging

        if (status === "pending") {
          alert("Your account is pending approval.");
        } else if (status === "declined") {
          alert("Your account has been declined.");
        } else {
          if (role === "admin") navigate("/Roles/Admin/AdminDashboard");
          else if (role === "trainer")
            navigate("/Roles/Trainer/TrainerDashboard");
          else navigate("/Roles/User/UserDashboard");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleClose = () => {
    if (closeModal) closeModal(); // Call the home page function to close the login window
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://brave-smoke-0773e2a1e.6.azurestaticapps.net/auth/google";
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal">
        <button className="login-close" onClick={handleClose}>
        <MdOutlineClose />
        </button>
        <h1>Login to Your Account</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="login-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="divider">
            <p className="or-divider">OR</p>
            </div>

        <div className="provider-buttons">
  <button onClick={handleGoogleLogin} className="provider-btn">
    <FcGoogle className="icon" />
    <span>Google</span>
  </button>
  <button className="provider-btn">
    <FaFacebook className="facebook-icon" />
    <span>Facebook</span>
  </button>
</div>


      </div>
    </div>
  );
};

export default Login;
