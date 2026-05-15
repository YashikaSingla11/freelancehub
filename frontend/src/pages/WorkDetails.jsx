import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./WorkDetails.css";

const API = `${import.meta.env.VITE_API_URL}/api`;

function ApplyModal({ project, onClose }) {
  const [form, setForm] = useState({
    applicant_name: "", applicant_email: "",
    cover_letter: "", proposed_rate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/projects/${project.id}/apply/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { setSuccess(true); }
      else { setError(data.detail || JSON.stringify(data)); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wd-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="wd-modal">
        {success ? (
          <div className="wd-success">
            <div style={{ fontSize: 56 }}>✅</div>
            <h2>Application Sent!</h2>
            <p>The client has been notified by email.</p>
            <button className="wd-btn-done" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="wd-modal-header">
              <h2>Apply for Project</h2>
              <button className="wd-btn-x" onClick={onClose}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="wd-field">
                <label>Your Name *</label>
                <input required value={form.applicant_name} placeholder="Full name"
                  onChange={e => setForm(p => ({ ...p, applicant_name: e.target.value }))} />
              </div>
              <div className="wd-field">
                <label>Your Email *</label>
                <input required type="email" value={form.applicant_email} placeholder="you@example.com"
                  onChange={e => setForm(p => ({ ...p, applicant_email: e.target.value }))} />
              </div>
              <div className="wd-field">
                <label>Proposed Rate (₹) *</label>
                <input required value={form.proposed_rate} placeholder="e.g. ₹800/hr or ₹50,000 fixed"
                  onChange={e => setForm(p => ({ ...p, proposed_rate: e.target.value }))} />
              </div>
              <div className="wd-field">
                <label>Cover Letter *</label>
                <textarea required rows={4} value={form.cover_letter}
                  placeholder="Why are you perfect for this project?"
                  onChange={e => setForm(p => ({ ...p, cover_letter: e.target.value }))} />
              </div>

              {error && <div className="wd-error">⚠️ {error}</div>}

              <button type="submit" className="wd-btn-submit" disabled={submitting}>
                {submitting ? "Sending..." : "📨 Send Application"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function WorkDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showApply, setShowApply] = useState(false);

  if (!state) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h2 style={{ color: "#0f172a", marginBottom: 16 }}>Project not found</h2>
        <button onClick={() => navigate("/findwork")} style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff", padding: "12px 28px", borderRadius: 12,
          border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15
        }}>
          ← Back to Projects
        </button>
      </div>
    );
  }

  // Support both old (skills array) and new (skills_list) format
  const skills = state.skills_list || state.skills || [];

  return (
    <div className="workdetail-page">
      <div className="workdetail-card">
        {/* Header */}
        <div className="wd-header">
          <div>
            <div className="wd-category">{state.category_display || state.category || "Project"}</div>
            <h1>{state.title}</h1>
            <p className="wd-company">{state.company}</p>
          </div>
          <div className="wd-budget-badge">{state.budget}</div>
        </div>

        {/* Info row */}
        <div className="wd-info-row">
          {state.duration && (
            <div className="wd-info-item">
              <span className="wd-info-label">⏱ Duration</span>
              <span className="wd-info-val">{state.duration}</span>
            </div>
          )}
          {state.application_count !== undefined && (
            <div className="wd-info-item">
              <span className="wd-info-label">👥 Applicants</span>
              <span className="wd-info-val">{state.application_count}</span>
            </div>
          )}
          <div className="wd-info-item">
            <span className="wd-info-label">📋 Status</span>
            <span className="wd-info-val" style={{ color: "#16a34a", fontWeight: 700 }}>Open</span>
          </div>
        </div>

        {/* Description */}
        <div className="wd-section">
          <h3>Project Description</h3>
          <p>{state.description || state.desc}</p>
        </div>

        {/* Details */}
        {state.details && (
          <div className="wd-section">
            <h3>Additional Details</h3>
            <p>{state.details}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="wd-section">
            <h3>Skills Required</h3>
            <div className="wd-skills">
              {skills.map((s, i) => (
                <span key={i} className="wd-skill-tag">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="wd-actions">
          <button className="wd-btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className="wd-btn-apply" onClick={() => setShowApply(true)}>
            Apply for Project →
          </button>
        </div>
      </div>

      {showApply && (
        <ApplyModal project={state} onClose={() => setShowApply(false)} />
      )}
    </div>
  );
}