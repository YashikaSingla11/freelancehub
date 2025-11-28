import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // ✅ goes back to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/home" className="navbar-logo">
          FreelanceHub
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/home" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/findwork" className="nav-link">
            Find Work
          </NavLink>
          <NavLink to="/freelancers" className="nav-link">
            Find Talent
          </NavLink>
        </div>

        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
