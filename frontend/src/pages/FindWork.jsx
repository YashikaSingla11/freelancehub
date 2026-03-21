import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindWork.css";

const API = "http://localhost:8000/api";

const CATEGORIES = [
  { value: "", label: "All Projects" },
  { value: "web",       label: "🌐 Web Dev" },
  { value: "mobile",    label: "📱 Mobile" },
  { value: "design",    label: "🎨 Design" },
  { value: "data",      label: "📊 Data" },
  { value: "ml",        label: "🤖 ML/AI" },
  { value: "writing",   label: "✍️ Writing" },
  { value: "marketing", label: "📣 Marketing" },
  { value: "other",     label: "🔧 Other" },
];

// ── Apply Modal ───────────────────────────────────────────────────────────────
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
    } catch (e) {
      setError("Network error. Is Django running on port 8000?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="apply-modal">
        {success ? (
          <div className="success-state">
            <div style={{ fontSize: 60 }}>✅</div>
            <h2>Application Sent!</h2>
            <p>The client has been notified by email.</p>
            <p>A confirmation has been sent to <strong>{form.applicant_email}</strong>.</p>
            <button className="btn-done" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-top">
              <div>
                <h2>Apply for Project</h2>
                <p className="modal-project-name">{project.title}</p>
                <p className="modal-company">{project.company} · {project.budget}</p>
              </div>
              <button className="btn-x" onClick={onClose}>✕</button>
            </div>

            {/* Project summary */}
            <div className="project-summary">
              <div className="sum-item">
                <div className="sum-label">BUDGET</div>
                <div className="sum-val">{project.budget}</div>
              </div>
              {project.duration && (
                <div className="sum-item">
                  <div className="sum-label">DURATION</div>
                  <div className="sum-val">{project.duration}</div>
                </div>
              )}
              <div className="sum-item">
                <div className="sum-label">APPLICANTS</div>
                <div className="sum-val">{project.application_count || 0}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input required value={form.applicant_name} placeholder="Full name"
                    onChange={e => setForm(p => ({ ...p, applicant_name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Your Email *</label>
                  <input required type="email" value={form.applicant_email}
                    placeholder="you@example.com"
                    onChange={e => setForm(p => ({ ...p, applicant_email: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label>Proposed Rate (₹) *</label>
                <input required value={form.proposed_rate}
                  placeholder="e.g. ₹50,000 fixed or ₹800/hr"
                  onChange={e => setForm(p => ({ ...p, proposed_rate: e.target.value }))} />
              </div>

              <div className="form-group">
                <label>Cover Letter *</label>
                <textarea required rows={5} value={form.cover_letter}
                  placeholder="Introduce yourself, explain why you're perfect for this project, mention relevant experience..."
                  onChange={e => setForm(p => ({ ...p, cover_letter: e.target.value }))} />
              </div>

              {error && <div className="form-error">⚠️ {error}</div>}

              <button type="submit" className="btn-submit-apply" disabled={submitting}>
                {submitting ? "Sending..." : "📨 Send Application to Client"}
              </button>
              <p className="apply-note">Client will be notified by email immediately.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onApply }) {
  const navigate = useNavigate();
  const daysAgo = Math.floor((Date.now() - new Date(project.posted_at)) / 86400000);

  return (
    <div className="project-card">
      <div className="project-header">
        <h2>{project.title}</h2>
        <span className="budget">{project.budget}</span>
      </div>
      <p className="company">{project.company}</p>
      <p className="desc">{project.description}</p>
      <div className="skills">
        {(project.skills_list || []).map((s, i) => (
          <span key={i} className="skill-tag">{s}</span>
        ))}
      </div>
      <div className="card-footer">
        <span className="posted-time">
          {daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`}
          {project.duration ? ` · ${project.duration}` : ""}
          {project.application_count > 0 ? ` · ${project.application_count} applied` : ""}
        </span>
        <div className="actions">
          <button className="btn-apply" onClick={() => onApply(project)}>Apply</button>
          <button className="btn-view"
            onClick={() => navigate(`/work/${project.id}`, { state: project })}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FindWork() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => { fetchProjects(); }, [search, category]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await fetch(`${API}/projects/?${params}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="findwork-page">
      <header className="findwork-header">
        <h1>💼 Find Your Next Project</h1>
        <p>Discover freelance projects that match your skills and goals.</p>
        <div className="search-filters">
          <input type="text" placeholder="🔍 Search by title, company, or skill..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </header>

      <div className="findwork-content">
        {/* Category pills */}
        <div className="category-filters">
          {CATEGORIES.map(c => (
            <button key={c.value}
              className={`cat-btn ${category === c.value ? "active" : ""}`}
              onClick={() => setCategory(c.value)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        {!loading && (
          <div className="stats-row">
            <div className="stat-chip">
              <span className="stat-icon">📋</span>
              <div>
                <div className="stat-val">{projects.length}</div>
                <div className="stat-label">Open Projects</div>
              </div>
            </div>
            {projects.length > 0 && (
              <div className="stat-chip">
                <span className="stat-icon">👥</span>
                <div>
                  <div className="stat-val">
                    {projects.reduce((s, p) => s + (p.application_count || 0), 0)}
                  </div>
                  <div className="stat-label">Total Applicants</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Projects */}
        <div className="projects-container">
          {loading ? (
            <p className="loading-text">⏳ Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="no-results">📭 No projects found. Try different filters.</p>
          ) : (
            projects.map(p => (
              <ProjectCard key={p.id} project={p} onApply={setSelectedProject} />
            ))
          )}
        </div>
      </div>

      {selectedProject && (
        <ApplyModal
          project={selectedProject}
          onClose={() => { setSelectedProject(null); fetchProjects(); }}
        />
      )}
    </div>
  );
}