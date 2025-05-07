// import React, { useEffect, useState } from "react";
// import Sidebar from "./TrainerSidebar";
// import "../Css/TrainerDashboard.css";
// import styles from "../Css/TrainerProgress.module.css";

// const TrainerProgress = () => {
//   const [progress, setProgress] = useState([]);
//   const [stats, setStats] = useState({
//     visitsThisWeek: 0,
//     visitsPrevMonth: 0,
//     visitsThisMonth: 0,
//     durationPrevMonth: 0,
//     durationThisMonth: 0,
//     yearlySessions: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userFilter, setUserFilter] = useState("all");

//   const trainerId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

//   const [users, setUsers] = useState([]); // Store user details separately

// useEffect(() => {
//   const fetchTrainerProgress = async () => {
//     try {
//       if (!trainerId) {
//         setError("Trainer ID not found. Please log in.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       const response = await fetch(
//         // `https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/progress?trainerId=${trainerId}&user=${userFilter}`
//         `https://brave-smoke-0773e2a1e.6.azurestaticapps.net/trainer/progress?trainerId=${trainerId}&user=${userFilter}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch progress data.");

//       const data = await response.json();
//       setProgress(data.progress || []);
//       setStats(data.stats || {});
//       setUsers(data.users || []); // Store users separately
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchTrainerProgress();
// }, [trainerId, userFilter]);

//   return (
//     <div className="user-dashboard">
//       <Sidebar />

//       <div className={styles.mainContent}>

//    <div className={styles.filterContainer}>
//   <label htmlFor="userFilter">View Progress For:</label>
//   <select id="userFilter" value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
//     <option value="all">All Users</option>
//     {users.map((user) => (
//       <option key={user.email} value={user.email}>
//         {user.name} ({user.email})
//       </option>
//     ))}
//   </select>
// </div>

// {loading && <p>Loading progress data...</p>}
// {error && <p className="error">{error}</p>}

// <div className={styles.section}>
//   <h2>Number of Visits This Week</h2>
//   <div className={styles.statBox}>
//     <h3>{stats.visitsThisWeek}</h3>
//     <p>Visits</p>
//   </div>
// </div>

// <div className={styles.section}>
//   <h2>Visits: Previous Month vs This Month</h2>
//   <div className={styles.comparisonContainer}>
//     <div className={styles.statBox}>
//       <h3>{stats.visitsPrevMonth}</h3>
//       <p>Last Month</p>
//     </div>
//     <div className={styles.statBox}>
//       <h3>{stats.visitsThisMonth}</h3>
//       <p>This Month</p>
//     </div>
//   </div>
// </div>

// <div className={styles.section}>
//   <h2>Exercise Duration: Previous Month vs This Month</h2>
//   <div className={styles.comparisonContainer}>
//     <div className={styles.statBox}>
//       <h3>{stats.durationPrevMonth} mins</h3>
//       <p>Last Month</p>
//     </div>
//     <div className={styles.statBox}>
//       <h3>{stats.durationThisMonth} mins</h3>
//       <p>This Month</p>
//     </div>
//   </div>
// </div>

// <div className={styles.section}>
//   <h2>Yearly Summary</h2>
//   <div className={styles.yearlySummary}>
//     {Array.isArray(stats.yearlySessions) && stats.yearlySessions.length > 0 ? (
//       stats.yearlySessions.map((session) => (
//         <div key={session._id} className={styles.statBox}>
//           <h3>{session.count}</h3>
//           <p>Sessions in Month {session._id}</p>
//         </div>
//       ))
//     ) : (
//       <p>No sessions recorded this year.</p>
//     )}
//   </div>
// </div>
// </div>
// </div>
//   );
// };

// export default TrainerProgress;
