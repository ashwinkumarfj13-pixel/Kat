const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log the error
  logger.error(`Error: ${err.message}`, {
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        error: 'File is too large. Maximum size is 10MB.',
        code: 'FILE_TOO_LARGE'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files uploaded.',
        code: 'LIMIT_FILE_COUNT'
      });
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.message
    });
  }

  // File type errors
  if (err.name === 'FileTypeError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type. Please upload an image (JPG, PNG, WebP, BMP).',
      code: 'INVALID_FILE_TYPE'
    });
  }

  // Custom app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode
    });
  }

  // Default error response
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    statusCode: err.statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
module.exports.AppError = AppError;
