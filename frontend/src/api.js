 const API = import.meta.env.VITE_API_URL;

// AUTH
export const loginUser = async (email, password) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const signupUser = async (name, email, password) => {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};



// PROJECTS
export const getProjects = async (token) => {
  const res = await fetch(`${API}/api/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};



export const deleteProject = async (projectId, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
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
  return res.json();
};

export const addMember = async (id, email, token) => {
  return fetch(`${API}/api/projects/${id}/add-member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
};

export const removeMember = async (id, userId, token) => {
  return fetch(`${API}/api/projects/${id}/remove-member/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProject = async (id, token) => {
  const res = await fetch(`${API}/api/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// TASKS
export const getTasks = async (projectId, token) => {
  const res = await fetch(`${API}/api/tasks/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const createTask = async (data, token) => {
  return fetch(`${API}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const updateTask = async (id, status, token) => {
  return fetch(`${API}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
};