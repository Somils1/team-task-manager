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

  const user = JSON.parse(localStorage.getItem("user"));
  const [project, setProject] = useState(null); // ✅ FIXED

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

  // CREATE TASK
  const handleCreate = async () => {
    if (!title || !assignedTo) return alert("Fill all fields");

    await createTask(
      { title, projectId, assignedTo, dueDate },
      token
    );

    setTitle("");
    setAssignedTo("");
    setDueDate("");
    load();
  };

  // UPDATE STATUS
  const handleStatus = async (id, status) => {
    await updateTask(id, status, token);
    load();
  };

  // ✅ SAFE ROLE CALCULATION
const isAdmin = project && (
  (typeof project.admin === "object" && project.admin._id === user?._id) ||
  (typeof project.admin === "string" && project.admin === user?._id)
);

  // ✅ PREVENT WRONG UI RENDER
  if (!project) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div className="container">
      <h1>Tasks</h1>

      {/* ROLE DISPLAY */}
      <p style={{ marginBottom: "10px" }}>
        Role: <b>{isAdmin ? "Admin 👑" : "Member 👤"}</b>
      </p>

      {/* ADMIN ONLY CREATE TASK */}
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

      {/* MEMBER MESSAGE */}
      {!isAdmin && (
        <p style={{ color: "gray", marginBottom: "10px" }}>
          You can only view tasks assigned to you.
        </p>
      )}

      {/* KANBAN */}
      <div className="kanban">
        {columns.map((col) => (
          <div key={col} className="column">
            <h3>{col}</h3>

            {tasks.filter((t) => t.status === col).length === 0 ? (
              <p style={{ opacity: 0.5 }}>No tasks</p>
            ) : (
              tasks
                .filter((t) => {
                  // ✅ MEMBER CAN ONLY SEE THEIR TASKS
                  if (!isAdmin) {
                    return (
                      t.status === col &&
                      t.assignedTo?._id === user?._id
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

                      {t.dueDate && (
                        <small>
                          Due:{" "}
                          {new Date(t.dueDate).toLocaleDateString()}
                        </small>
                      )}

                      {/* ONLY ADMIN CAN CHANGE STATUS */}
                      {isAdmin ? (
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
                      ) : (
                        <p style={{ fontSize: "12px", opacity: 0.6 }}>
                          Status: {t.status}
                        </p>
                      )}
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