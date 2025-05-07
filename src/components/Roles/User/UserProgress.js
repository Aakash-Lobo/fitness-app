import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import styles from "../Css/UserProgress.module.css";


const UserProgress = () => {
  const [progress, setProgress] = useState([]);
  
  const [stats, setStats] = useState({
    visitsThisWeek: 0,
    visitsPrevMonth: 0,
    visitsThisMonth: 0,
    durationPrevMonth: 0,
    durationThisMonth: 0,
    yearlySessions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const userEmail = sessionStorage.getItem("email") || localStorage.getItem("email");
        if (!userEmail) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`https://brave-smoke-0773e2a1e.6.azurestaticapps.net/user/progress?email=${userEmail}`);
        if (!response.ok) throw new Error("Failed to fetch progress data.");

        const data = await response.json();
        setProgress(data.progress);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  return (
    <div className="user-dashboard">
      <Sidebar />

      <div className="main-content">
      <div className={styles.container}>
        <h1>Progress Overview</h1>

        {loading ? (
          <p>Loading progress data...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {/* Visits This Week */}
            <div className={styles.section}>
              <h2>Number of Visits This Week</h2>
              <div className={styles.statBox}>
                <h3>{stats.visitsThisWeek}</h3>
                <p>Visits</p>
              </div>
            </div>

            {/* Visits: Previous Month vs This Month */}
            <div className={styles.section}>
              <h2>Visits: Previous Month vs This Month</h2>
              <div className={styles.comparisonContainer}>
              <div className={styles.statBox}>
                  <h3>{stats.visitsPrevMonth}</h3>
                  <p>Last Month</p>
                </div>
                <div className={styles.statBox}>
                  <h3>{stats.visitsThisMonth}</h3>
                  <p>This Month</p>
                </div>
              </div>
            </div>

            {/* Duration: Previous Month vs This Month */}
            <div className="section">
              <h2>Exercise Duration: Previous Month vs This Month</h2>
              <div className="comparison-container">
                <div className="stat-box">
                  <h3>{stats.durationPrevMonth} mins</h3>
                  <p>Last Month</p>
                </div>
                <div className="stat-box">
                  <h3>{stats.durationThisMonth} mins</h3>
                  <p>This Month</p>
                </div>
              </div>
            </div>

            {/* Yearly Data */}
            <div className={styles.section}>
              <h2>Yearly Summary</h2>
              <div className={styles.comparisonContainer}>
                {stats.yearlySessions.length > 0 ? (
                  stats.yearlySessions.map((session) => (
                    <div key={session._id} className={styles.statBox}>
                      <h3>{session.count}</h3>
                      <p>Sessions in Month {session._id}</p>
                    </div>
                  ))
                ) : (
                  <p>No sessions recorded this year.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default UserProgress;
