import { useNavigate } from "react-router-dom";
import "../Css/AdminDashboard.css";


const AdminSidebar = () => {
  const navigate = useNavigate();
    const handleLogout = async () => {
        try {
          const response = await fetch("http://localhost:5001/logout", {
            method: "POST",
            credentials: "include",
          });
    
          if (response.ok) {
            sessionStorage.clear();
            navigate("/");
          }
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };

return (
        <div className="admin-container">
          {/* Sidebar */}
          <nav className="sidebar">
            <h2>Admin Panel</h2>
            <ul>
              <li><a href="/Roles/Admin/AdminDashboard">Dashboard</a></li>
              <li><a href="../Admin/ManageUsers">Manage Users</a></li>
              <li><a href="../Admin/ViewTrainers">Manage Trainers</a></li>
              <li><a href="./ManageGym">Manage Gyms</a></li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </ul>
          </nav>
          </div>
        );
};


export default AdminSidebar;