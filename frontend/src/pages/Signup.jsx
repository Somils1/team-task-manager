 import { useState } from "react";
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const nav = useNavigate();

  const signup = async () => {
  if (!name || !email || !password) {
    return alert("Fill all fields");
  }

  try {
    const res = await signupUser({name, email, password});

    console.log("SIGNUP RESPONSE:", res);

    // ✅ FIX: don't check token
    if (res?._id || res?.message) {
      alert("Signup successful");
      nav("/login");
    } else {
      alert(res.message || "Signup failed");
    }

  } catch (err) {
    console.error(err);
    alert("Signup failed");
  }
};

  return (
    <div className="center">
      <div className="card">
        <h2>Create Account</h2>
        <input placeholder="Name" onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        <button onClick={signup}>Signup</button>
      </div>
    </div>
  );
}