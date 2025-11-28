import './ProjectCard.css';

export default function ProjectCard({ project, onViewDetails }) {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p className="desc">{project.description}</p>

      <div className="skills">
        {project.skills_required.slice(0, 4).map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      <div className="info">
        <p>💰 ${project.budget}</p>
        <p>👤 {project.client?.full_name || 'Client'}</p>
      </div>

      <button onClick={() => onViewDetails(project.id)}>View Details</button>
    </div>
  );
}
