 import { useState } from "react";
import { loginUser } from "../api"; // assuming this exists
import { useNavigate } from "react-router-dom";

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

    console.log("LOGIN RESPONSE:", data); // 🔥 DEBUG

    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("email", data.user.email);

    navigate("/dashboard");

  } catch (err) {
    console.error(err);
    alert("Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="card">
        <h2 className="logo">TaskFlow</h2>
        <h1>Login</h1>

        {/* EMAIL */}
        <div className="input-group">
          <span className="icon">📧</span>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? <span className="spinner"></span> : "Login"}
        </button>

        <p>
          New user? <span className="link">Signup</span>
        </p>
      </div>
    </div>
  );
}