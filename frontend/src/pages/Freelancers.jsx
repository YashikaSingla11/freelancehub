import React, { useState, useEffect } from "react";
import "./Freelancers.css";

const API = `${import.meta.env.VITE_API_URL}/api`;

const ROLES = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "UI/UX Designer", "Data Scientist", "ML Engineer",
  "Mobile Developer", "DevOps Engineer", "Content Writer", "Digital Marketer",
];

// ── Result Modal ──────────────────────────────────────────────────────────────
function ResultModal({ result, onClose }) {
  const approved = result.result === "approved";
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">{approved ? "🎉" : "💪"}</div>
        <h2 className={`modal-title ${approved ? "green" : "red"}`}>
          {approved ? "Congratulations! You're Selected!" : "Application Received"}
        </h2>
        <div className={`score-box ${approved ? "score-green" : "score-red"}`}>
          <div className="score-number">AI Score: {result.ai_score}/100</div>
          <p className="score-feedback">{result.feedback}</p>
        </div>
        <p className="modal-note">
          {approved
            ? "✅ Approval email sent! Your profile is now live on FreelanceHub."
            : "📧 Feedback email sent with tips to improve. Reapply after 30 days."}
        </p>
        <button className="btn-close-modal" onClick={onClose}>Got it!</button>
      </div>
    </div>
  );
}

// ── Freelancer Card ───────────────────────────────────────────────────────────
function FreelancerCard({ freelancer }) {
  const initials = freelancer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="freelancer-card">
      <div className="card-top">
        <div className="card-avatar">{initials}</div>
        <div className="card-meta">
          <h3>{freelancer.name}</h3>
          <p className="role">{freelancer.role}</p>
          <p className="exp">
            {freelancer.experience} yr{freelancer.experience !== 1 ? "s" : ""} experience
          </p>
        </div>
      </div>

      <div className="verified-badge">✓ Verified</div>

      {freelancer.bio && (
        <p className="card-bio">{freelancer.bio}</p>
      )}

      <div className="skills">
        {(freelancer.skills_list || []).slice(0, 5).map((s, i) => (
          <span key={i} className="skill-tag">{s}</span>
        ))}
        {(freelancer.skills_list || []).length > 5 && (
          <span className="skill-tag">+{freelancer.skills_list.length - 5}</span>
        )}
      </div>

      <div className="card-footer-row">
        {freelancer.hourly_rate && (
          <span className="rate-badge">₹{freelancer.hourly_rate}/hr</span>
        )}
        {freelancer.portfolio_url && (
          <a href={freelancer.portfolio_url} target="_blank" rel="noopener noreferrer"
            className="portfolio-link">
            🔗 Portfolio →
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", role: "", skills: "",
    experience: 2, bio: "", portfolio_url: "", hourly_rate: "",
    resume: null,
  });

  useEffect(() => {
    fetchFreelancers();
  }, [search]);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${API}/freelancers/${q}`);
      const data = await res.json();
      setFreelancers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(p => ({ ...p, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== "") fd.append(k, v); });

    try {
      const res = await fetch(`${API}/freelancers/apply/`, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setShowForm(false);
        setForm({ name: "", email: "", role: "", skills: "", experience: 2, bio: "", portfolio_url: "", hourly_rate: "", resume: null });
        if (data.result === "approved") fetchFreelancers();
      } else {
        setError(data.detail || JSON.stringify(data));
      }
    } catch (e) {
      setError("Network error. Make sure Django server is running on port 8000.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="freelancers-page">
      {/* Hero */}
      <header className="freelancers-header">
        <h1>Find Top Freelancers 🚀</h1>
        <p>AI-vetted professionals — browse or apply to join the network.</p>
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by name, skill, or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>

      <div className="freelancers-content">
        {/* Section heading */}
        <div className="section-heading">
          Top Freelancers
          <span className="count">({freelancers.length} verified)</span>
        </div>

        {/* Cards */}
        <div className="freelancer-list">
          {loading ? (
            <p className="loading-text">⏳ Loading top talent...</p>
          ) : freelancers.length === 0 ? (
            <p className="empty-text">🔍 No verified freelancers yet.</p>
          ) : (
            freelancers.map(f => <FreelancerCard key={f.id} freelancer={f} />)
          )}
        </div>

        {/* CTA */}
        {!showForm && (
          <div className="register-section">
            <h3>Are you a skilled freelancer?</h3>
            <p>Apply now — AI reviews your profile instantly and notifies you by email.</p>
            <button className="btn-register" onClick={() => setShowForm(true)}>
              Apply Now — It's Free ✨
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="register-form">
            <div className="form-header">
              <h2>Freelancer Application</h2>
              <p className="form-subtitle">🤖 AI evaluates your profile instantly and sends result to your email</p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" required placeholder="Arjun Sharma"
                    value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input name="email" type="email" required placeholder="you@example.com"
                    value={form.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Primary Role *</label>
                <select name="role" required value={form.role} onChange={handleChange}>
                  <option value="">Select your role...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Skills * <span className="label-hint">comma-separated: React, Python, AWS</span></label>
                <input name="skills" required placeholder="React, Python, Django, PostgreSQL"
                  value={form.skills} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Experience *</label>
                  <select name="experience" value={form.experience} onChange={handleChange}>
                    {[0,1,2,3,4,5,7,10].map(y => (
                      <option key={y} value={y}>
                        {y === 0 ? "< 1 year" : y === 10 ? "10+ years" : `${y} year${y > 1 ? "s" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Hourly Rate (₹) <span className="label-hint">optional</span></label>
                  <input name="hourly_rate" type="number" placeholder="800"
                    value={form.hourly_rate} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Portfolio URL <span className="label-hint">optional — boosts score</span></label>
                <input name="portfolio_url" type="url" placeholder="https://yourportfolio.com"
                  value={form.portfolio_url} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Bio <span className="label-hint">optional — boosts score</span></label>
                <textarea name="bio" rows={3}
                  placeholder="Tell us about your expertise and experience..."
                  value={form.bio} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Resume / CV <span className="label-hint">PDF — boosts AI score</span></label>
                <div className="resume-upload-area"
                  onClick={() => document.getElementById("resume-file").click()}>
                  {form.resume ? (
                    <span className="resume-selected">📄 {form.resume.name}</span>
                  ) : (
                    <>
                      <span className="upload-icon">📎</span>
                      <span>Click to upload PDF/DOC</span>
                    </>
                  )}
                  <input id="resume-file" type="file" name="resume"
                    accept=".pdf,.doc,.docx" onChange={handleChange}
                    style={{ display: "none" }} />
                </div>
              </div>

              <div className="ai-info-box">
                <strong>🤖 How AI Screening Works</strong>
                <ul>
                  <li>Skills matched against 50+ in-demand technologies</li>
                  <li>Experience weighted by industry standards</li>
                  <li>Complete profiles score higher (bio + portfolio + resume)</li>
                  <li>Score ≥ 55/100 = auto approved + email sent</li>
                </ul>
              </div>

              {error && <div className="form-error">⚠️ {error}</div>}

              <div className="form-buttons">
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "⏳ AI Screening in progress..." : "Submit Application ✨"}
                </button>
                <button type="button" className="btn-cancel"
                  onClick={() => { setShowForm(false); setError(""); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {result && <ResultModal result={result} onClose={() => setResult(null)} />}
    </div>
  );
}