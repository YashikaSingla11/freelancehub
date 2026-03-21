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

  const navigate = useNavigate(); // ✅ MUST
  const { login, user } = useAuth();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user) {
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
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

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
          const userData = {
            username: data.username,
            email: data.email,
          };

          login(userData);   // ✅ store user
          navigate("/home"); // ✅ redirect
        } else {
          alert("Signup successful! Please login now.");
          setIsLogin(true);
          setFormData({ username: "", email: "", password: "" });
        }
      } else {
        alert(data.detail || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}