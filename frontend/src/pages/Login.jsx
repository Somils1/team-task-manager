 import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("Fill all fields");

    try {
      setLoading(true);

      const data = await loginUser({ email, password });

      console.log("LOGIN RESPONSE:", data);

      if (!data?.token || !data?._id) {
        throw new Error("Invalid login response");
      }

      const user = {
        _id: data._id,
        email: data.email,
        name: data.name,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("email", user.email);

  window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="logo">⚡ TaskFlow</h2>
        <h1>Login</h1>

        <div className="input-group">
          <span>📧</span>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <span>🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? <div className="spinner"></div> : "Login"}
        </button>

        <p>
  New user? <Link to="/signup" className="link">Signup</Link>
</p>
      </div>
    </div>
  );
}