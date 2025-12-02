// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import mealRoutes from './routes/meals.js';
import activityRoutes from './routes/activities.js';
import waterRoutes from './routes/water.js';
import weightRoutes from './routes/weight.js';
import customFoodRoutes from './routes/customFoods.js';
import recipeRoutes from './routes/recipes.js';
import fastingRoutes from './routes/fasting.js';

dotenv.config();

const app = express();

// Connect to database (make sure connectDB uses process.env.MONGO_URI)
connectDB();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS: read allowed origin from env (set CLIENT_URL in Render to your frontend URL).
// Fallback to localhost:5173 for local dev.
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Optional: trust proxy if behind a proxy/load balancer (Render/Railway). Uncomment if needed.
// app.set('trust proxy', 1);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/custom-foods', customFoodRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/fasting', fastingRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Test route
app.get('/api/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  // Render (and some hosts) expose a public URL in envs — helpful to log
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(`🔗 Public URL (Render): ${process.env.RENDER_EXTERNAL_URL}`);
    console.log(`🔗 Health check: ${process.env.RENDER_EXTERNAL_URL}/api/health`);
  } else {
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  }
});

// Graceful shutdown (good practice on managed hosts)
const shutdown = (signal) => {
  console.log(`\n⚠️ Received ${signal}. Closing server...`);
  server.close(() => {
    console.log('HTTP server closed.');
    // close DB connection if your connectDB exposes a close method (optional)
    process.exit(0);
  });
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
