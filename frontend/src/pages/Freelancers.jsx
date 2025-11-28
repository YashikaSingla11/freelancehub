import React, { useState, useEffect } from "react";
import "./Freelancers.css";

export default function FindTalent() {
  const [freelancers, setFreelancers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFreelancer, setNewFreelancer] = useState({
    name: "",
    role: "",
    skills: "",
    experience: "",
    email: "",
  });

  // Default users
  const defaultFreelancers = [
    {
      id: 1,
      name: "John Doe",
      role: "Frontend Developer",
      skills: ["React", "JavaScript", "CSS"],
      experience: "3 years",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "UI/UX Designer",
      skills: ["Figma", "Adobe XD"],
      experience: "2 years",
      email: "priya@example.com",
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "Backend Engineer",
      skills: ["Node.js", "Django"],
      experience: "4 years",
      email: "rahul@example.com",
    },
  ];

  // Load data from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("freelancers")) || [];
    setFreelancers([...defaultFreelancers, ...stored]);
  }, []);

  // Input handler
  const handleChange = (e) => {
    setNewFreelancer({ ...newFreelancer, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      id: Date.now(),
      name: newFreelancer.name,
      role: newFreelancer.role,
      skills: newFreelancer.skills.split(",").map((s) => s.trim()),
      experience: newFreelancer.experience,
      email: newFreelancer.email,
    };

    const updated = [...freelancers, newEntry];
    setFreelancers(updated);
    localStorage.setItem("freelancers", JSON.stringify(updated));

    alert("✅ Registration successful! Your profile is now visible on the list.");

    setNewFreelancer({
      name: "",
      role: "",
      skills: "",
      experience: "",
      email: "",
    });
    setShowForm(false);
  };

  return (
    <div className="freelancers-page">
      <header className="freelancers-header">
        <h1>Find Top Freelancers</h1>
        <p>
          Browse skilled professionals or register yourself to join the talent list.
        </p>
      </header>

      <div className="freelancer-list">
        {freelancers.map((f) => (
          <div className="freelancer-card" key={f.id}>
            <h3>{f.name}</h3>
            <p className="role">{f.role}</p>
            <p className="exp">Experience: {f.experience}</p>
            <p className="email">{f.email}</p>
            <div className="skills">
              {f.skills.map((skill, i) => (
                <span key={i} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Register Section */}
      {!showForm && (
        <div className="register-section">
          <h3>Want to join as a Freelancer?</h3>
          <button className="btn-register" onClick={() => setShowForm(true)}>
            Register Now
          </button>
        </div>
      )}

      {/* Registration Form */}
      {showForm && (
        <div className="register-form">
          <h2>Freelancer Registration</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={newFreelancer.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="role"
              placeholder="Your Role / Profession"
              value={newFreelancer.role}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={newFreelancer.skills}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="experience"
              placeholder="Experience (e.g. 2 years)"
              value={newFreelancer.experience}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={newFreelancer.email}
              onChange={handleChange}
              required
            />
            <div className="form-buttons">
              <button type="submit" className="btn-submit">
                Submit
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
