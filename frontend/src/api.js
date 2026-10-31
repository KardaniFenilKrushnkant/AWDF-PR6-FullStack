
const BASE_URL = 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
}

export const getTasks = () => request('/tasks');

export const createTask = (task) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'DELETE',
  });
