import { API_BASE } from '../config/api';

// Ambil semua task
export async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Ambil 1 task berdasarkan ID
export async function getTaskById(id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Buat task baru
export async function createTask(task) {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Update task (patch)
export async function updateTask(id, patch) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Hapus task
export async function deleteTask(id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

// Hapus semua task (opsional, jika backend mendukung)
export async function clearTasks() {
    try {
        const items = await loadTasks();
        // Backend tidak memiliki endpoint bulk delete, jadi kita hapus satu per satu
        await Promise.all(items.map(it => deleteTask(it.id)));
        return true;
    } catch {
        return false;
    }
}