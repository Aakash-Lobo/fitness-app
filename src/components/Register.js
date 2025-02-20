import React, { useEffect, useState } from "react";

const Register = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  const handleLogout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful. Please log in.");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">Register / Login</h1>

        {user ? (
          <div className="text-center">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
            <p>Welcome, {user.name}!</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleRegister} className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="block w-full p-2 mb-2 border rounded"
                value={formData.name}
                onChange={handleChange}
                required
              />
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
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              >
                Register
              </button>
            </form>

            <p className="text-center mb-2">OR</p>

            <button
              onClick={handleGoogleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
