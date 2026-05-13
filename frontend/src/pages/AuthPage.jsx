import { useState, useEffect } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        // Simulate forgot password (you can connect to real API later)
        await new Promise(r => setTimeout(r, 1000));
        setSuccess("✅ If this email exists, a reset link has been sent!");
        setFormData({ ...formData, email: "" });
        setLoading(false);
        return;
      }

      const endpoint = mode === "login"
        ? `${API_URL}/api/login/`
        : `${API_URL}/api/register/`;

      const payload = mode === "login"
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (mode === "login") {
          login({ username: data.username, email: data.email });
          navigate("/home");
        } else {
          setSuccess("Account created! Please login.");
          setMode("login");
          setFormData({ username: "", email: "", password: "" });
        }
      } else {
        setError(data.detail || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">F</div>
          <span className="auth-brand-name">FreelanceHub</span>
        </div>
        <div className="auth-left-content">
          <h2>The Future of Freelancing is Here</h2>
          <p>AI-powered platform connecting top talent with exciting opportunities.</p>
          <div className="auth-features">
            {[
              { icon: "🤖", text: "AI-powered talent screening" },
              { icon: "📨", text: "Instant email notifications" },
              { icon: "💳", text: "Secure milestone payments" },
              { icon: "📊", text: "Real-time project tracking" },
            ].map((f, i) => (
              <div key={i} className="auth-feature-item">
                <span className="auth-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-left-footer">
          <div className="auth-stat">
            <span className="auth-stat-num">10K+</span>
            <span className="auth-stat-label">Freelancers</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-num">5K+</span>
            <span className="auth-stat-label">Projects</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-num">100%</span>
            <span className="auth-stat-label">Secure</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-card-header">
            <div className="auth-card-icon">
              {mode === "login" ? "👋" : mode === "signup" ? "🚀" : "🔑"}
            </div>
            <h2 className="auth-card-title">
              {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
            </h2>
            <p className="auth-card-subtitle">
              {mode === "login"
                ? "Sign in to your FreelanceHub account"
                : mode === "signup"
                ? "Join thousands of freelancers today"
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="auth-alert auth-alert-error">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="auth-alert auth-alert-success">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <div className="auth-field">
                <label>Username</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="auth-field">
                <div className="auth-field-row">
                  <label>Password</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    className="auth-toggle-pass"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner">⏳ Please wait...</span>
              ) : mode === "login" ? "Sign In →"
                : mode === "signup" ? "Create Account →"
                : "Send Reset Link →"}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card-footer">
            {mode === "login" && (
              <p>
                Don't have an account?{" "}
                <button className="auth-switch-btn" onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}>
                  Sign Up Free
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button className="auth-switch-btn" onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>
                  Sign In
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <p>
                Remember your password?{" "}
                <button className="auth-switch-btn" onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>
                  Back to Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}