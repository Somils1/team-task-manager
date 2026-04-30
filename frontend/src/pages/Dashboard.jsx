 import { useEffect, useState } from "react";
import { getProjects, getTasks } from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const proj = await getProjects(token);
      setProjects(proj || []);

      // 🔥 get all tasks from all projects
      let allTasks = [];

      for (let p of proj) {
        const t = await getTasks(p._id, token);
        allTasks = [...allTasks, ...(t || [])];
      }

      setTasks(allTasks);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DEFINE myTasks PROPERLY
  const myTasks = tasks.filter(
    (t) => t.assignedTo?.email === email
  );

  return (
    <div className="container">
      <h1>Dashboard</h1>

      {/* STATS */}
      <div className="grid">
        <div className="stat-card">
          <h3>Projects</h3>
          <p>{projects.length}</p>
        </div>

        <div className="stat-card">
          <h3>My Tasks</h3>
          <p>{myTasks.length}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>
            {myTasks.filter(t => t.status === "Done").length}
          </p>
        </div>
      </div>

      {/* PROJECT LIST */}
      <div className="card">
        <h3>Your Projects</h3>

        {projects.map((p) => (
          <div className="project-row" key={p._id}>
            <span>{p.name}</span>
            <button onClick={() => nav(`/tasks/${p._id}`)}>
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}