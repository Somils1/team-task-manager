import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f9fafb",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        TaskFlow
      </h1>

      <p style={{ fontSize: "18px", color: "#555", marginBottom: "30px" }}>
        Manage projects, assign tasks, and collaborate with your team.
      </p>

      <button
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "8px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => navigate("/login")}
      >
        Get Started
      </button>
    </div>
  );
}