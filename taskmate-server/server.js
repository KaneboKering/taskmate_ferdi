import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// Rute publik
app.use('/auth', authRoutes);

// Rute yang dilindungi
app.use('/tasks', auth, taskRoutes);
app.use('/categories', auth, categoryRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});