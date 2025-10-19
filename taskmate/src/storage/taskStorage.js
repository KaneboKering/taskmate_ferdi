import api from '../config/api';

export async function loadTasks() {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
}

export async function getTaskById(id) {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get task ${id}:`, error);
    return null;
  }
}

export async function createTask(task) {
  try {
    const response = await api.post('/tasks', task);
    return response.status === 201;
  } catch (error) {
    console.error('Failed to create task:', error);
    return false;
  }
}

export async function updateTask(id, patch) {
  try {
    const response = await api.put(`/tasks/${id}`, patch);
    return response.status === 200;
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    return false;
  }
}

export async function deleteTask(id) {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    return false;
  }
}