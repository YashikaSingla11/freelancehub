import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>
          Find Top Talent or Your Next <span>Project</span>
        </h1>
        <p>
          Connect with skilled freelancers and exciting opportunities. 
          Build your dream team or grow your freelance career.
        </p>
        <div className="hero-buttons">
          <Link to="/freelancers" className="btn-primary">Find Talent</Link>
          <Link to="/projects" className="btn-outline">Find Work</Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h2>10,000+</h2>
          <p>Active Freelancers</p>
        </div>
        <div className="stat-card">
          <h2>5,000+</h2>
          <p>Projects Completed</p>
        </div>
        <div className="stat-card">
          <h2>100%</h2>
          <p>Secure Payments</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
