 import { useState } from "react";
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const nav = useNavigate();

  const signup = async () => {
    const res = await signupUser(name,email,password);
    if(res.token){
      localStorage.setItem("token",res.token);
      nav("/projects");
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