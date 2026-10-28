import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getMongoStatus } from './config/db.js';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { ensureAdminAccount } from './controllers/authController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/api/status', (req, res) => {
  res.json({
    status: 'healthy',
    database: getMongoStatus() ? 'MongoDB Connected' : 'In-Memory Cache (MongoDB Offline)',
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'MERN Blog REST API service operational' });
});

connectDB().then(async () => {
  await ensureAdminAccount();
  app.listen(PORT, () => {
    console.log(`[Server] Operational on port ${PORT}`);
    console.log(`[Server] Auth endpoint: http://localhost:${PORT}/api/auth`);
    console.log(`[Server] Posts endpoint: http://localhost:${PORT}/api/posts`);
  });
});
