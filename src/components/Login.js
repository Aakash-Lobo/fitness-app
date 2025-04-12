import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
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
      const response = await fetch("http://localhost:5000/login", {
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
  
        const { _id, role, status, email, verified  } = data.user; 

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
          else if (role === "trainer") navigate("/Roles/Trainer/TrainerDashboard");
          else navigate("/Roles/User/UserDashboard");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };
  
  

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="block w-full p-2 mb-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="block w-full p-2 mb-2 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;