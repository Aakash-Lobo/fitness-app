import React, { useEffect, useState } from "react";

const Register = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const handleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  const handleLogout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">Register / Login</h1>

        {user ? (
          <div className="text-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <p>Welcome, {user.name}!</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;
