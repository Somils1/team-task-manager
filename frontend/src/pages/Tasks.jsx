 import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTasks, createTask, updateTask, getProject } from "../api";

export default function Tasks() {
  const { projectId } = useParams();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState([]);

  const columns = ["Todo", "In Progress", "Done"];

  useEffect(() => {
    load();
    loadMembers();
  }, []);

  const load = async () => {
    const data = await getTasks(projectId, token);
    setTasks(data || []);
  };

  const loadMembers = async () => {
    const data = await getProject(projectId, token);
    setMembers(data.members || []);
  };

  // ✅ CREATE TASK
  const handleCreate = async () => {
    if (!title || !assignedTo) {
      alert("Fill all fields");
      return;
    }

    await createTask({ title, projectId, assignedTo }, token);
    setTitle("");
    setAssignedTo("");
    load();
  };

  // ✅ UPDATE STATUS
  const handleStatus = async (id, status) => {
    await updateTask(id, status, token);
    load();
  };

  return (
    <div className="container">
      <h1>Tasks</h1>

      {/* CREATE TASK */}
      <div className="card">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign to</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.email}
            </option>
          ))}
        </select>

        <button onClick={handleCreate}>Add Task</button>
      </div>

      {/* KANBAN */}
      <div className="kanban">
        {columns.map((col) => (
          <div key={col} className="column">
            <h3>{col}</h3>

            {tasks.filter((t) => t.status === col).length === 0 ? (
              <p style={{ opacity: 0.5 }}>No tasks</p>
            ) : (
              tasks
                .filter((t) => t.status === col)
                .map((t) => (
                  <div className="task-card" key={t._id}>
                    <p>{t.title}</p>
                    <small>{t.assignedTo?.email || "Unassigned"}</small>

                    <select
                      value={t.status}
                      onChange={(e) =>
                        handleStatus(t._id, e.target.value)
                      }
                    >
                      {columns.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}