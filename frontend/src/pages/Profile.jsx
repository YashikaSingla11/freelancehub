import './Profile.css';

export default function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src="https://via.placeholder.com/100" alt="User Avatar" />
        <h2>Yashika Singla</h2>
        <p>Email: yashika@example.com</p>
        <p>Role: Frontend Developer</p>
        <button>Edit Profile</button>
      </div>
    </div>
  );
}
