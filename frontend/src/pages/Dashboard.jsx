import React from 'react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome Back, Yashika!</h1>
        <p>Here’s an overview of your freelance activity</p>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <h3>Active Projects</h3>
          <p>4</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h3>Earnings</h3>
          <p>$1,250</p>
        </div>
      </section>

      <section className="projects-section">
        <h2>Recent Projects</h2>
        <div className="project-list">
          <div className="project-card">
            <h4>Website Redesign</h4>
            <p>Client: ABC Corp</p>
            <span className="status ongoing">Ongoing</span>
          </div>
          <div className="project-card">
            <h4>Mobile App UI</h4>
            <p>Client: XYZ Ltd</p>
            <span className="status completed">Completed</span>
          </div>
          <div className="project-card">
            <h4>Brand Logo Design</h4>
            <p>Client: Nova Designs</p>
            <span className="status pending">Pending</span>
          </div>
        </div>
      </section>
    </div>
  );
}
