module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'bmp']
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
    maxSize: '20m',
    maxFiles: 5
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Model Configuration
  models: {
    loadTimeout: parseInt(process.env.MODEL_LOAD_TIMEOUT) || 30000,
    batchSize: parseInt(process.env.MODEL_BATCH_SIZE) || 32,
    cocoSsd: {
      name: 'COCO-SSD',
      type: 'object_detection',
      minConfidence: 0.5
    },
    mobilenet: {
      name: 'MobileNet v2',
      type: 'image_classification',
      minConfidence: 0.3
    }
  },

  // API Configuration
  api: {
    timeout: 30000,
    retries: 3
  },

  // Feature Flags
  features: {
    enableBatchProcessing: true,
    enableHistory: true,
    enableCaching: true,
    enableCompression: true
  }
};
