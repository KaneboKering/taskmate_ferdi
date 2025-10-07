import { API_BASE } from '../config/api';

// Fallback jika API gagal
const FALLBACK_CATEGORIES = [{ key: 'Umum', color: '#334155' }];

// Ambil kategori dari server
export async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) {
      return FALLBACK_CATEGORIES; // fallback agar UI tetap jalan
    }
    return await res.json();
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

// Buat 1 kategori baru
export async function createCategory(cat) {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Kompatibilitas dengan fungsi `saveCategories` lama.
// Fungsi ini akan membuat kategori baru jika belum ada di server.
export async function saveCategories(nextList) {
  try {
    const current = await loadCategories();
    const existing = new Set(current.map(c => c.key.toLowerCase()));
    const toCreate = nextList.filter(c => !existing.has(c.key.toLowerCase()));
    
    if (toCreate.length > 0) {
      await Promise.all(toCreate.map(createCategory));
    }
    return true;
  } catch {
    return false;
  }
}