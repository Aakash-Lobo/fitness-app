import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Roles/Css/home.css";
import Login from "./Login";

// const HomePage = () => {
//   return (
//     <div className="homepage">
//       <h1>Welcome to the Fitness App</h1>
//       <p className="tagline">Achieve your goals with us!</p>
//       <nav>
//         <Link to="/register" className="nav-link">Go to Registration</Link>
//         <Link to="/login" className="nav-link">Go to Login</Link>
//       </nav>
//     </div>
//   );
// };

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLogin = () => setShowLoginModal(true);
  const closeLogin = () => setShowLoginModal(false);

  return (
    <div className="homepage">
      <div className="overlay">
        <div className="home-content">
          <h1>Create a body That You Love</h1>
          <p>Welcome to your wellness journey. Achieve your goals with us!</p>
          <div className="btn-group">
            <Link to="/register" className="btn primary">
              Get Started
            </Link>
            <button className="btn secondary" onClick={openLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <div>
          <Login closeModal={closeLogin} /> {/* ✅ 传入 closeModal prop */}
        </div>
      )}
    </div>
  );
};
export default HomePage;
