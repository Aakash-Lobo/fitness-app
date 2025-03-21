import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminDashboard from "./components/Roles/Admin/AdminDashboard";
import UserDashboard from "./components/Roles/User/UserDashboard";
import TrainerDashboard from "./components/Roles/Trainer/TrainerDashboard";
import ManageTrainers from "./components/Roles/Admin/ManageTrainers";
import SearchTrainer from "./components/Roles/User/SearchTrainer";
import ViewRequests from "./components/Roles/Trainer/ViewRequests";
import AcceptedTrainers from "./components/Roles/User/AcceptedTrainers";
import UpcomingSessions from "./components/Roles/User/UpcomingSession";
import TrainerUpcomingSessions from "./components/Roles/Trainer/TrainerUpcomingSessions";
import TrainerSessionHistory from "./components/Roles/Trainer/TrainerSessionHistory";
import ManageUsers from "./components/Roles/Admin/ManageUsers";

const Navigation = () => {
  const location = useLocation();

  // Show navigation only on the home page
  if (location.pathname !== "/") return null;

  return (
    <div>
      <h1>Welcome to the Fitness App</h1>
      <nav>
        <Link to="/register">Go to Registration</Link>
        <Link to="/login">Go to Login</Link>
      </nav>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<h2>Home Page</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/roles/admin/admindashboard" element={<AdminDashboard />} />
        <Route path="/roles/trainer/trainerdashboard" element={<TrainerDashboard />} />
        <Route path="/roles/user/userdashboard" element={<UserDashboard />} />
        <Route path="/roles/admin/viewtrainers" element={<ManageTrainers />} />
        <Route path="/roles/admin/manageusers" element={<ManageUsers />} />
        <Route path="/roles/user/searchtrainer" element={<SearchTrainer />} />
        <Route path="/roles/trainer/viewrequests" element={<ViewRequests />} />
        <Route path="/roles/user/AcceptedTrainers" element={<AcceptedTrainers />} />
        <Route path="/roles/user/UpcomingSession" element={<UpcomingSessions />} />
        <Route path="/roles/trainer/trainerupcomingsessions" element={<TrainerUpcomingSessions />} />
        <Route path="/roles/trainer/trainersessionhistory" element={<TrainerSessionHistory />} />
         <Route path="/roles/trainer/trainersessionhistory" element={<TrainerSessionHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
