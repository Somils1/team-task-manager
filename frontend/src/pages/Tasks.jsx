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

  const [dueDate, setDueDate] = useState("");

  // ✅ NEW: priority
  const [priority, setPriority] = useState("Medium");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  let tokenUser = null;

try {
  tokenUser = token
    ? JSON.parse(atob(token.split(".")[1]))
    : null;
} catch (e) {
  console.error("Invalid token");
}

  const [project, setProject] = useState(null);

  const columns = ["Todo", "In Progress", "Done"];

  const load = async () => {
    const data = await getTasks(projectId, token);
    setTasks(data || []);
  };

  const loadMembers = async () => {
    const data = await getProject(projectId, token);
    setMembers(data.members || []);
    setProject(data);
  };

  useEffect(() => {
    load();
    loadMembers();
  }, []);

  const handleCreate = async () => {
    if (!title || !assignedTo) return alert("Fill all fields");

    await createTask(
      { title, projectId, assignedTo, dueDate, priority }, // ✅ added priority
      token
    );

    setTitle("");
    setAssignedTo("");
    setDueDate("");
    setPriority("Medium"); // reset
    load();
  };

  const handleStatus = async (id, status) => {
    await updateTask(id, status, token);
    load();
  };

  const isAdmin =
    project &&
    String(project.admin?._id || project.admin) ===
      String(tokenUser?.id);

  if (!project) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div className="container">
      <h1>Tasks</h1>

      <p style={{ marginBottom: "10px" }}>
        Role: <b>{isAdmin ? "Admin 👑" : "Member 👤"}</b>
      </p>

      {isAdmin && (
        <div className="card">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* ✅ NEW: priority dropdown */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

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
      )}

      {!isAdmin && (
        <p style={{ color: "gray", marginBottom: "10px" }}>
          You can only view tasks assigned to you.
        </p>
      )}

      <div className="kanban">
        {columns.map((col) => (
          <div key={col} className="column">
            <h3>{col}</h3>

            {tasks.filter((t) => t.status === col).length === 0 ? (
              <p style={{ opacity: 0.5 }}>No tasks</p>
            ) : (
              tasks
                .filter((t) => {
                  if (!isAdmin) {
                    return (
                      t.status === col &&
                      t.assignedTo?._id === tokenUser?.id
                    );
                  }
                  return t.status === col;
                })
                .map((t) => {
                  const isOverdue =
                    t.dueDate &&
                    new Date(t.dueDate).getTime() < Date.now() &&
                    t.status !== "Done";

                  return (
                    <div className="task-card" key={t._id}>
                      <p style={{ color: isOverdue ? "red" : "black" }}>
                        {t.title}
                      </p>

                      <small>
                        {t.assignedTo?.email || "Unassigned"}
                      </small>

                      {/* ✅ SHOW PRIORITY */}
                      {t.priority && (
                        <small>Priority: {t.priority}</small>
                      )}

                      {t.dueDate && (
                        <small>
                          Due:{" "}
                          {new Date(t.dueDate).toLocaleDateString()}
                        </small>
                      )}

                      {/* ✅ FIX: EVERYONE can update THEIR visible tasks */}
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
                  );
                })
            )}
          </div>
        ))}
      </div>
    </div>
  );
}