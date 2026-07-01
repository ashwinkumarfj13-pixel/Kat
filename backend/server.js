const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security Middleware
app.use(helmet());
app.use(compression());

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: NODE_ENV
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Kat Image Recognition API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      recognize: '/api/recognize',
      batch: '/api/recognize/batch',
      models: '/api/models',
      history: '/api/history'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`\n${'='.repeat(50)}`);
  logger.info(`Kat Backend Server Started`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`Server running on port: ${PORT}`);
  logger.info(`URL: http://localhost:${PORT}`);
  logger.info(`${'='.repeat(50)}\n`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = app;
