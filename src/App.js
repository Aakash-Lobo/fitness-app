import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import HomePage from "./components/home";
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
import UserSessionHistory from "./components/Roles/User/UserSessionHistory";
import UserProgress from "./components/Roles/User/UserProgress";
import ManageGyms from "./components/Roles/Admin/ManageGym";
import SelectGym from "./components/Roles/User/SelectGym";
import TrainerBookings from "./components/Roles/Trainer/TrainerBookings";
import TrainerProgress from "./components/Roles/Trainer/TrainerProgress";
import UserNotifications from "./components/Roles/User/UserNotification";
import VerifyEmail from "./components/VerifyEmail";

const App = () => {
  return (
    <Router>
      {/* <Navigation /> */}
      <Routes>

        <Route path="/" element={<HomePage />} />
        {/* <Route path="/" element={<h2>Home Page</h2>} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/roles/admin/admindashboard" element={<AdminDashboard />} />
        <Route path="/roles/trainer/trainerdashboard" element={<TrainerDashboard />} />
        <Route path="/roles/user/userdashboard" element={<UserDashboard />} />
        <Route path="/roles/admin/viewtrainers" element={<ManageTrainers />} />
        <Route path="/roles/admin/manageusers" element={<ManageUsers />} />
        <Route path="/roles/admin/managegym" element={<ManageGyms />} />
        <Route path="/roles/user/searchtrainer" element={<SearchTrainer />} />
        <Route path="/roles/trainer/viewrequests" element={<ViewRequests />} />
        <Route path="/roles/user/SelectGym" element={<SelectGym />} />
        <Route path="/roles/user/AcceptedTrainers" element={<AcceptedTrainers />} />
        <Route path="/roles/user/UpcomingSession" element={<UpcomingSessions />} />
        <Route path="/roles/user/UserSessionHistory" element={<UserSessionHistory />} />
        <Route path="/roles/user/UserProgress" element={<UserProgress />} />
        <Route path="/roles/user/UserNotification" element={<UserNotifications />} />
        <Route path="/roles/trainer/trainerupcomingsessions" element={<TrainerUpcomingSessions />} />
        <Route path="/roles/trainer/trainersessionhistory" element={<TrainerSessionHistory />} />
        <Route path="/roles/trainer/trainersessionhistory" element={<TrainerSessionHistory />} />
        <Route path="/roles/trainer/trainerbookings" element={<TrainerBookings />} />
        <Route path="/roles/trainer/trainerprogress" element={<TrainerProgress />} />
        <Route path="/verify/:email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
};

export default App;
