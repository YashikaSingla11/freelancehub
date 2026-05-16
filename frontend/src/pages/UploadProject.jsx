import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./UploadProject.css";

const API = `${import.meta.env.VITE_API_URL}/api`;

const CATEGORIES = [
  { value: "web", label: "🌐 Web Development" },
  { value: "mobile", label: "📱 Mobile App" },
  { value: "design", label: "🎨 Design" },
  { value: "data", label: "📊 Data Analytics" },
  { value: "ml", label: "🤖 ML/AI" },
  { value: "writing", label: "✍️ Writing" },
  { value: "marketing", label: "📣 Marketing" },
  { value: "other", label: "🔧 Other" },
];

export default function UploadProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "web",
    technologies: "",
    image_url: "",
    live_link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData.id || user?.id;

      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API}/users/${userId}/upload_project/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          title: "",
          description: "",
          category: "web",
          technologies: "",
          image_url: "",
          live_link: "",
        });
        setTimeout(() => {
          navigate(`/profile/${userId}`);
        }, 2000);
      } else {
        setError(data.detail || "Failed to upload project. Try again.");
      }
    } catch (err) {
      setError("Network error. Make sure backend is running on port 8000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-header">
          <h1>📤 Upload Your Project</h1>
          <p>Showcase your best work to potential clients</p>
        </div>

        {success ? (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Project Uploaded Successfully!</h2>
            <p>Your portfolio project is now visible on your profile.</p>
            <p>Redirecting to your profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g., E-Commerce Mobile App"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your project, what you built, your role, technologies used, etc."
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies Used *</label>
              <input
                id="technologies"
                type="text"
                name="technologies"
                placeholder="e.g., React, Node.js, MongoDB, Tailwind CSS (comma-separated)"
                value={formData.technologies}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="image_url">Project Image URL *</label>
              <input
                id="image_url"
                type="url"
                name="image_url"
                placeholder="https://example.com/project-screenshot.jpg"
                value={formData.image_url}
                onChange={handleChange}
                required
              />
              <small>Tip: Upload image to ImgBB (imgbb.com) and paste the URL</small>
            </div>

            <div className="form-group">
              <label htmlFor="live_link">Live Link (Optional)</label>
              <input
                id="live_link"
                type="url"
                name="live_link"
                placeholder="https://your-project-live.com"
                value={formData.live_link}
                onChange={handleChange}
              />
            </div> */}

            {error && <div className="error-message">⚠️ {error}</div>}

            <button
              type="submit"
              className="btn-upload"
              disabled={loading}
            >
              {loading ? "⏳ Uploading..." : "🚀 Upload Project"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}