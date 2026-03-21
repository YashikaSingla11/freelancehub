import React, { useState, useEffect } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "https://freelancehub-backend-xyuo.onrender.com";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, user } = useAuth();

  // ✅ FIXED useEffect
  useEffect(() => {
    if (user && window.location.pathname === "/") {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? `${API_URL}/api/login/`
      : `${API_URL}/api/register/`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        if (isLogin) {
          // ✅ CLEAN USER DATA
          const userData = {
            username: data.username,
            email: data.email
          };

          login(userData);   // context + localStorage dono handle karega
          navigate("/home"); // redirect
        } else {
          alert("Signup successful! Please login now.");
          setIsLogin(true);
          setFormData({ username: "", email: "", password: "" });
        }
      } else {
        alert(data.detail || "Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="auth-subtitle">
          {isLogin ? "Login to your FreelanceHub account" : "Join FreelanceHub and start your journey"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="auth-footer">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button type="button" className="link-btn" onClick={() => setIsLogin(false)}>
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" className="link-btn" onClick={() => setIsLogin(true)}>
                  Login
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}