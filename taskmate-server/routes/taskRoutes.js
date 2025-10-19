import { Router } from 'express';
import { pool } from '../db/config.js';

const router = Router();

// GET /tasks
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY updated_at DESC', [req.user.id]);
  res.json(rows);
});

// GET /tasks/:id
router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id=? AND user_id = ?', [req.params.id, req.user.id]);
  if (!rows.length) return res.status(404).json({ message: 'Not found' });
  res.json(rows[0]);
});

// POST /tasks
router.post('/', async (req, res) => {
  const {
    id, title, description, deadline, category = 'Umum',
    priority = 'Low', status = 'pending', progress = 0
  } = req.body;

  if (!id || !title) return res.status(400).json({ message: 'id & title required' });

  await pool.query(
    'INSERT INTO tasks (id, title, description, deadline, category, priority, status, progress, user_id) VALUES (?,?,?,?,?,?,?,?,?)',
    [id, title, description ?? null, deadline ?? null, category, priority, status, progress, req.user.id]
  );
  res.status(201).json({ ok: true });
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  const fields = ['title', 'description', 'deadline', 'category', 'priority', 'status', 'progress'];
  const set = [];
  const vals = [];
  for (const f of fields) {
    if (typeof req.body[f] !== 'undefined') {
      set.push(`${f}=?`);
      vals.push(req.body[f]);
    }
  }
  if (!set.length) return res.status(400).json({ message: 'no changes' });

  vals.push(req.params.id);
  vals.push(req.user.id);
  const [result] = await pool.query(`UPDATE tasks SET ${set.join(',')} WHERE id=? AND user_id = ?`, vals);
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM tasks WHERE id=? AND user_id = ?', [req.params.id, req.user.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

export default router;