import { useEffect, useState } from "react";
import { getProjects, getTasks } from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  if (!token) {
  window.location.href = "/login";
  return null;
}

 useEffect(() => {
  if (token) load();
}, [token]);

  const load = async () => {
  try {
    const p = await getProjects(token);
    setProjects(p || []);

    let allTasks = [];
    for (let proj of p || []) {
      const t = await getTasks(proj._id, token);
      allTasks = [...allTasks, ...(t || [])];
    }

    setTasks(allTasks);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  // status breakdown
  const statusCount = {
    Todo: 0,
    "In Progress": 0,
    Done: 0,
  };

  tasks.forEach((t) => {
  if (statusCount[t.status] !== undefined) {
    statusCount[t.status]++;
  }
});

  const chartData = Object.keys(statusCount).map((key) => ({
    name: key,
    value: statusCount[key],
  }));

  // overdue
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done"
  );

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Dashboard</h1>

      {/* stats */}
      <div className="grid">
        <div className="card">Projects: {projects.length}</div>
        <div className="card">Tasks: {tasks.length}</div>
        <div className="card">Overdue: {overdue.length}</div>
      </div>

      {/* chart */}
      <div className="card" style={{ height: 300 }}>
        <h3>Task Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={100}>
              <Cell fill="#3b82f6" />
              <Cell fill="#f59e0b" />
              <Cell fill="#10b981" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* overdue list */}
      <div className="card">
        <h3 style={{ color: "red" }}>Overdue Tasks</h3>
        {overdue.map((t) => (
          <div key={t._id} style={{ color: "red" }}>
            {t.title}
          </div>
        ))}
      </div>
    </div>
  );
}