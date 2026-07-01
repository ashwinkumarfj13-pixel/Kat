const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const { AppError } = require('./errorHandler');

// Create upload directory if it doesn't exist
if (!fs.existsSync(config.upload.uploadDir)) {
  fs.mkdirSync(config.upload.uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!config.upload.allowedMimes.includes(file.mimetype)) {
    return cb(new AppError('Invalid file type. Please upload an image (JPG, PNG, WebP, BMP).', 400));
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (!config.upload.allowedExtensions.includes(ext)) {
    return cb(new AppError('Invalid file extension. Please upload an image (JPG, PNG, WebP, BMP).', 400));
  }

  cb(null, true);
};

// Upload middleware for single file
const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize
  }
}).single('image');

// Upload middleware for multiple files
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 10
  }
}).array('images', 10);

// Wrapper to handle multer errors
const handleUploadSingle = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({
          success: false,
          error: `File is too large. Maximum size is ${config.upload.maxFileSize / 1024 / 1024}MB.`
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Too many files uploaded.'
        });
      }
    }
    if (err) {
      return next(err);
    }
    next();
  });
};

const handleUploadMultiple = (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({
          success: false,
          error: `File is too large. Maximum size is ${config.upload.maxFileSize / 1024 / 1024}MB.`
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Too many files uploaded. Maximum is 10 files.'
        });
      }
    }
    if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = {
  handleUploadSingle,
  handleUploadMultiple,
  uploadSingle,
  uploadMultiple
};
