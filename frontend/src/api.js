 const API = import.meta.env.VITE_API_URL;

/* =========================
   Helper: handle response
========================= */
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

/* =========================
   AUTH
========================= */
 export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const signupUser = async ({ name, email, password }) => {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(res);
};

/* =========================
   PROJECTS
========================= */
export const getProjects = async (token) => {
  const res = await fetch(`${API}/api/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
};

export const createProject = async (name, token) => {
  const res = await fetch(`${API}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  return handleResponse(res);
};

export const deleteProject = async (projectId, token) => {
  const res = await fetch(`${API}/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
};

export const getProject = async (id, token) => {
  const res = await fetch(`${API}/api/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
};

export const addMember = async (id, email, token) => {
  const res = await fetch(`${API}/api/projects/${id}/add-member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse(res);
};

export const removeMember = async (id, userId, token) => {
  const res = await fetch(`${API}/api/projects/${id}/remove-member/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
};

/* =========================
   TASKS
========================= */
export const getTasks = async (projectId, token) => {
  const res = await fetch(`${API}/api/tasks/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
};

export const createTask = async (taskData, token) => {
  const res = await fetch(`${API}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  return handleResponse(res);
};

export const updateTask = async (id, status, token) => {
  const res = await fetch(`${API}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(res);
};