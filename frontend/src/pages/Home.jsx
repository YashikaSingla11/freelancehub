import { Link } from 'react-router-dom';
import '../styles/Home.css';

const features = [
  { icon: "🤖", title: "AI-Powered Screening", desc: "Our AI instantly evaluates freelancer skills, experience, and profile completeness to ensure only top talent gets listed." },
  { icon: "📨", title: "Instant Notifications", desc: "Freelancers get instant approval or rejection emails. Clients are notified immediately when someone applies to their project." },
  { icon: "💳", title: "Secure Payments", desc: "Milestone-based payment system with support for UPI, Bank Transfer, PayPal, and more." },
  { icon: "📊", title: "Project Tracking", desc: "Track milestones, manage deliverables, and monitor project completion with real-time progress indicators." },
  { icon: "💬", title: "Direct Messaging", desc: "Built-in messaging between clients and freelancers — all conversations tracked within the project." },
  { icon: "🔒", title: "Verified Talent", desc: "Every freelancer is AI-verified before appearing on the platform. Quality guaranteed." },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">🚀 AI-Powered Freelancing Platform</div>
        <h1>
          Find Top Talent or<br />Your Next <span>Project</span>
        </h1>
        <p>
          Connect with AI-vetted freelancers and exciting opportunities.
          Build your dream team or grow your freelance career.
        </p>
        <div className="hero-buttons">
          <Link to="/freelancers" className="btn-primary">👥 Find Talent</Link>
          <Link to="/findwork" className="btn-outline">💼 Find Work</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        {[
          { icon: "👨‍💻", num: "10,000+", label: "Active Freelancers" },
          { icon: "📋", num: "5,000+", label: "Projects Completed" },
          { icon: "🔒", num: "100%", label: "Secure Payments" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <h2>{s.num}</h2>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Everything You Need</h2>
        <p className="section-sub">One platform for clients and freelancers to work seamlessly</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of freelancers and clients already on FreelanceHub</p>
        <div className="cta-buttons">
          <Link to="/freelancers" className="btn-cta-white">Hire Talent →</Link>
          <Link to="/findwork" className="btn-cta-outline">Find Projects →</Link>
        </div>
      </section>
    </div>
  );
}