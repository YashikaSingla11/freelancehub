import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FindWork.css";

export default function FindWork() {
  const navigate = useNavigate();

  const allProjects = [
    {
      id: 1,
      title: "E-Commerce Website Redesign",
      company: "TechNova Pvt Ltd",
      budget: "₹60,000",
      desc: "Redesign an existing e-commerce website with modern UI using React and Tailwind CSS.",
      skills: ["React", "Tailwind", "UI/UX"],
      details:
        "Client needs full redesign with mobile optimization. Duration: 3 weeks.",
    },
    {
      id: 2,
      title: "Food Delivery App Backend",
      company: "ZestEats",
      budget: "₹85,000",
      desc: "Develop backend APIs for a food delivery platform using Node.js and MongoDB.",
      skills: ["Node.js", "MongoDB", "Express"],
      details:
        "Backend with authentication, live tracking, and restaurant management system.",
    },
    {
      id: 3,
      title: "Portfolio Website",
      company: "Freelancer Project",
      budget: "₹15,000",
      desc: "Build a clean, responsive portfolio website for a designer.",
      skills: ["HTML", "CSS", "JavaScript"],
      details:
        "Include animations, project gallery and responsive contact form.",
    },
    {
      id: 4,
      title: "AI Chatbot Development",
      company: "NextGen AI Labs",
      budget: "₹1,20,000",
      desc: "Create an intelligent chatbot using Python and OpenAI API for customer support.",
      skills: ["Python", "AI", "OpenAI API"],
      details:
        "The bot should handle FAQs and integrate with company’s support dashboard.",
    },
    {
      id: 5,
      title: "Mobile Fitness App",
      company: "FitTrack Technologies",
      budget: "₹95,000",
      desc: "Develop a fitness tracking app for Android and iOS with real-time data sync.",
      skills: ["React Native", "Firebase", "APIs"],
      details:
        "Include workout planner, step tracker, and integration with wearable devices.",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = allProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="findwork-page">
      <header className="findwork-header">
        <h1>💼 Find Your Next Project</h1>
        <p>Discover freelance projects that match your skills and goals.</p>

        <div className="search-filters">
          <input
            type="text"
            placeholder="🔍 Search by title, company, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="projects-container">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((p) => (
            <div className="project-card" key={p.id}>
              <div className="project-header">
                <h2>{p.title}</h2>
                <span className="budget">{p.budget}</span>
              </div>
              <h4 className="company">{p.company}</h4>
              <p className="desc">{p.desc}</p>
              <div className="skills">
                {p.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="actions">
                <button className="btn-apply">Apply</button>
                <button
                  className="btn-view"
                  onClick={() => navigate(`/work/${p.id}`, { state: p })}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No matching projects found 😢</p>
        )}
      </div>
    </div>
  );
}
