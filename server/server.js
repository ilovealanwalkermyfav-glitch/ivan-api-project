/**
 * HalluGuard AI - Express Server
 * Core Orchestrator for Hallucination Detection & Verification
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const analyzeRoutes = require('./routes/analyze.routes');
const generateRoutes = require('./routes/generate.routes');
const verifyRoutes = require('./routes/verify.routes');
const historyRoutes = require('./routes/history.routes');
const healthRoutes = require('./routes/health.routes');
const demoRoutes = require('./routes/demo.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/demo-examples', demoRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'HalluGuard AI - Detecting Hallucinations in Large Language Models',
    version: '1.0.0',
    type: 'College Minor Project (Full-Stack + API Integration)',
    status: 'online',
    endpoints: {
      health: 'GET /api/health',
      analyze: 'POST /api/analyze',
      generate: 'POST /api/generate',
      verify: 'POST /api/verify',
      history: 'GET /api/history, DELETE /api/history/:id',
      demoExamples: 'GET /api/demo-examples'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🤖 HalluGuard AI Server running on http://localhost:${PORT}`);
  console.log(`📡 Provider: ${process.env.LLM_API_PROVIDER || 'mock'}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});

module.exports = app;
