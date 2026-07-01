const rateLimit = require('express-rate-limit');
const config = require('../config/config');
const logger = require('../utils/logger');

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health';
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests * 2, // More lenient for API
  standardHeaders: true,
  legacyHeaders: false
});

const recognitionLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: 50, // Stricter for recognition endpoint
  message: 'Too many recognition requests. Please wait before making another request.'
});

module.exports = {
  limiter,
  apiLimiter,
  recognitionLimiter
};
