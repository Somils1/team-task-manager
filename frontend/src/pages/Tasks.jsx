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

  const load = async () => {
    const data = await getTasks(projectId, token);
    setTasks(data || []);
  };

  const loadMembers = async () => {
    const data = await getProject(projectId, token);
    setMembers(data.members || []);
  };

  useEffect(() => {
    load();
    loadMembers();
  }, []);

  // CREATE TASK
  const handleCreate = async () => {
    if (!title || !assignedTo) return alert("Fill all fields");

    await createTask(
      { title, projectId, assignedTo },
      token
    );

    setTitle("");
    load();
  };

  // UPDATE STATUS
  const handleStatus = async (id, status) => {
    await updateTask(id, status, token);
    load();
  };

  return (
    <div className="container">
      <h1>Tasks</h1>

      {/* CREATE */}
      <div className="card">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">Assign</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.email}
            </option>
          ))}
        </select>

        <button onClick={handleCreate}>Add Task</button>
      </div>

      {/* LIST */}
      {tasks.map((t) => (
        <div className="card" key={t._id}>
          <h3>{t.title}</h3>

          <p>Assigned: {t.assignedTo?.email}</p>

          <select
            value={t.status}
            onChange={(e) =>
              handleStatus(t._id, e.target.value)
            }
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      ))}
    </div>
  );
}