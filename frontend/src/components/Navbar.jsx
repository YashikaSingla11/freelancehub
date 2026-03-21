import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  const links = [
    { to: "/home",        label: "Home",        icon: "🏠" },
    { to: "/freelancers", label: "Find Talent",  icon: "👥" },
    { to: "/findwork",    label: "Find Work",    icon: "💼" },
    { to: "/dashboard",   label: "Dashboard",   icon: "📊" },
  ];

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <NavLink to="/home" className="navbar-logo">
          <div className="logo-icon">F</div>
          <span className="logo-text">
            Freelance<span>Hub</span>
          </span>
        </NavLink>

        {/* Desktop Links */}
        <ul className="navbar-links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) => isActive ? "active" : ""}
              >
                <span>{l.icon}</span>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right — user + logout */}
        <div className="navbar-right">
          {user && (
            <div className="navbar-user">
              <div className="user-avatar">{initials}</div>
              <span>{user.username}</span>
            </div>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => setMenuOpen(false)}
          >
            {l.icon} {l.label}
          </NavLink>
        ))}
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
    </>
  );
}