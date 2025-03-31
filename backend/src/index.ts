import express from 'express';
import posRoutes from './routes/pos';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/pos', posRoutes);

export default app;