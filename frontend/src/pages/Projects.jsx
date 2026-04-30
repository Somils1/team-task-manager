 import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  addMember,
  removeMember,
  getProject,
  deleteProject
} from "../api";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [members, setMembers] = useState({});
  const [emailInputs, setEmailInputs] = useState({});

  const token = localStorage.getItem("token");
  const nav = useNavigate();

  // LOAD PROJECTS
  const load = async () => {
    const data = await getProjects(token);
    setProjects(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  // CREATE PROJECT
  const handleCreate = async () => {
    if (!name) return alert("Enter project name");

    await createProject(name, token);
    setName("");
    load();
  };

  // LOAD MEMBERS
  const handleLoadMembers = async (projectId) => {
    const data = await getProject(projectId, token);
    setMembers((prev) => ({
      ...prev,
      [projectId]: data.members || [],
    }));
  };

  // ADD MEMBER
  const handleAddMember = async (projectId) => {
    const email = emailInputs[projectId];
    if (!email) return alert("Enter email");

    await addMember(projectId, email, token);

    setEmailInputs((prev) => ({
      ...prev,
      [projectId]: "",
    }));

    handleLoadMembers(projectId);
  };

  // REMOVE MEMBER
  const handleRemoveMember = async (projectId, userId) => {
    await removeMember(projectId, userId, token);
    handleLoadMembers(projectId);
  };

  // DELETE PROJECT
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;

    await deleteProject(projectId, token);
    load();
  };

  return (
   <div className="container">
  <h1>Projects</h1>

  {/* CREATE */}
  <div className="card">
    <input
      placeholder="Project name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <button onClick={handleCreate}>Create Project</button>
  </div>

  {/* LIST */}
  {projects.map((p) => (
    <div className="card" key={p._id}>
      <h3>{p.name}</h3>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => nav(`/tasks/${p._id}`)}>
          Open Tasks
        </button>

        <button onClick={() => handleLoadMembers(p._id)}>
          Members
        </button>

        <button onClick={() => handleDeleteProject(p._id)}>
          Delete
        </button>
      </div>

      {/* ADD MEMBER */}
      <input
        placeholder="Add member email"
        value={emailInputs[p._id] || ""}
        onChange={(e) =>
          setEmailInputs((prev) => ({
            ...prev,
            [p._id]: e.target.value,
          }))
        }
      />

      <button onClick={() => handleAddMember(p._id)}>
        Add Member
      </button>

      {/* MEMBERS */}
      {(members[p._id] || []).map((m) => (
        <div key={m._id}>
          {m.email}
          <button onClick={() => handleRemoveMember(p._id, m._id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  ))}
</div>
  );
}