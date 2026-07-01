const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Resize image to standard size
 */
exports.resizeImage = async (inputPath, outputPath, width = 640, height = 480) => {
  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(outputPath);

    logger.info(`Image resized: ${outputPath}`);
  } catch (error) {
    logger.error('Error resizing image', error);
    throw error;
  }
};

/**
 * Optimize image (compress)
 */
exports.optimizeImage = async (inputPath, outputPath, quality = 80) => {
  try {
    await sharp(inputPath)
      .jpeg({ quality: quality, progressive: true })
      .toFile(outputPath);

    logger.info(`Image optimized: ${outputPath}`);
  } catch (error) {
    logger.error('Error optimizing image', error);
    throw error;
  }
};

/**
 * Convert image to specific format
 */
exports.convertImage = async (inputPath, outputPath, format = 'png') => {
  try {
    const image = sharp(inputPath);
    
    switch (format.toLowerCase()) {
      case 'png':
        await image.png().toFile(outputPath);
        break;
      case 'jpg':
      case 'jpeg':
        await image.jpeg({ quality: 90 }).toFile(outputPath);
        break;
      case 'webp':
        await image.webp().toFile(outputPath);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    logger.info(`Image converted to ${format}: ${outputPath}`);
  } catch (error) {
    logger.error('Error converting image', error);
    throw error;
  }
};

/**
 * Get image metadata
 */
exports.getImageMetadata = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    logger.info(`Retrieved metadata for: ${imagePath}`);
    return metadata;
  } catch (error) {
    logger.error('Error getting image metadata', error);
    throw error;
  }
};

/**
 * Validate image file
 */
exports.validateImage = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    
    return {
      isValid: true,
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      size: fs.statSync(filePath).size,
      aspectRatio: (metadata.width / metadata.height).toFixed(2)
    };
  } catch (error) {
    logger.error('Error validating image', error);
    return {
      isValid: false,
      error: error.message
    };
  }
};

/**
 * Clean up temporary files
 */
exports.cleanupFiles = (filePaths) => {
  try {
    filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Deleted file: ${filePath}`);
      }
    });
  } catch (error) {
    logger.error('Error cleaning up files', error);
  }
};

/**
 * Generate thumbnail
 */
exports.generateThumbnail = async (inputPath, outputPath, size = 200) => {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);

    logger.info(`Thumbnail generated: ${outputPath}`);
  } catch (error) {
    logger.error('Error generating thumbnail', error);
    throw error;
  }
};
