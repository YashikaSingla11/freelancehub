import './FreelancerCard.css';

export default function FreelancerCard({ freelancer, onViewProfile }) {
  return (
    <div className="freelancer-card">
      <div className="freelancer-header">
        {freelancer.avatar_url ? (
          <img src={freelancer.avatar_url} alt={freelancer.full_name} />
        ) : (
          <div className="avatar">{freelancer.full_name[0]}</div>
        )}
        <div>
          <h3>{freelancer.full_name}</h3>
          <p>{freelancer.location}</p>
        </div>
      </div>

      <p className="bio">{freelancer.bio || 'No bio available'}</p>

      <div className="skills">
        {freelancer.skills.slice(0, 4).map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      <button onClick={() => onViewProfile(freelancer.id)}>View Profile</button>
    </div>
  );
}
