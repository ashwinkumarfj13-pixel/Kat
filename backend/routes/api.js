const express = require('express');
const router = express.Router();

const recognitionController = require('../controllers/recognitionController');
const { handleUploadSingle, handleUploadMultiple } = require('../middleware/upload');
const { recognitionLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Health check
router.get('/health', apiLimiter, recognitionController.healthCheck);

// Models information
router.get('/models', apiLimiter, recognitionController.getModelsInfo);

// Single image recognition
router.post(
  '/recognize',
  recognitionLimiter,
  handleUploadSingle,
  recognitionController.recognizeSingleImage
);

// Batch image recognition
router.post(
  '/recognize/batch',
  recognitionLimiter,
  handleUploadMultiple,
  recognitionController.recognizeBatch
);

// URL-based recognition (optional)
router.post('/recognize/url', recognitionLimiter, recognitionController.recognizeFromUrl);

// Recognition history
router.get('/history', apiLimiter, recognitionController.getHistory);
router.delete('/history/:id', apiLimiter, recognitionController.deleteHistoryItem);
router.delete('/history', apiLimiter, recognitionController.clearHistory);

// Stats
router.get('/stats', apiLimiter, recognitionController.getStats);

// Error handling for undefined routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

module.exports = router;
