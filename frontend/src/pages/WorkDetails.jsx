import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./WorkDetails.css";

export default function WorkDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2>Project not found ❌</h2>
        <button
          onClick={() => navigate("/find-work")}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="workdetail-page">
      <div className="workdetail-card">
        <h1>{state.title}</h1>
        <h3>{state.company}</h3>
        <p className="budget">Budget: {state.budget}</p>
        <p className="desc">{state.desc}</p>
        <p className="details">{state.details}</p>

        <div className="skills">
          {state.skills.map((skill, i) => (
            <span key={i} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>

        <div className="actions">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className="btn-apply">Apply for Project</button>
        </div>
      </div>
    </div>
  );
}
