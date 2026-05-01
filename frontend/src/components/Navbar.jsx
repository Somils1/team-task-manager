 import { Link } from "react-router-dom";

export default function Navbar() {
  let user = null;

  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Invalid user JSON in localStorage");
  }

  const email = user?.email || localStorage.getItem("email");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/dashboard">TaskFlow</Link>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>

        <div
          style={{
            background: "#e7e9ec",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
          }}
        >
          {email}
        </div>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}