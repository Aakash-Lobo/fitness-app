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
    const response = await fetch("http://localhost:5001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("status", data.status);

      if (data.status === "pending") {
        alert("Your account is pending approval.");
      } else if (data.status === "declined") {
        alert("Your account has been declined.");
      } else {
        if (data.role === "admin") navigate("./Roles/Admin/AdminDashboard");
else if (data.role === "trainer") navigate("/trainer-dashboard");
else navigate("./Roles/User/UserDashboard");

      }
    } else {
      alert(data.message || "Login failed");
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