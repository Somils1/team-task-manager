 import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("email", email);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-box">
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ FIXED BUTTON */}
        <button
          style={{
            width: "100%",
            marginTop: "15px",
            fontWeight: "500",
            fontSize: "15px"
          }}
          onClick={login}
        >
          Login
        </button>

        {/* OPTIONAL CLEAN LINK */}
        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          New user?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer" }}
            onClick={() => (window.location.href = "/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}