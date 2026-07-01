const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Create logs directory if it doesn't exist
const logsDir = path.dirname(config.logging.file);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const colors = {
  error: '\x1b[31m',   // Red
  warn: '\x1b[33m',    // Yellow
  info: '\x1b[36m',    // Cyan
  debug: '\x1b[35m',   // Magenta
  reset: '\x1b[0m'     // Reset
};

class Logger {
  constructor() {
    this.level = config.logging.level || 'info';
    this.file = config.logging.file;
  }

  formatTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, data = null) {
    const timestamp = this.formatTimestamp();
    let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      formatted += ` ${JSON.stringify(data)}`;
    }
    
    return formatted;
  }

  write(level, message, data = null) {
    if (logLevels[level] > logLevels[this.level]) {
      return;
    }

    const formatted = this.formatMessage(level, message, data);

    // Console output with colors
    const colorCode = colors[level];
    console.log(`${colorCode}${formatted}${colors.reset}`);

    // File output
    try {
      fs.appendFileSync(this.file, formatted + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  error(message, data = null) {
    this.write('error', message, data);
  }

  warn(message, data = null) {
    this.write('warn', message, data);
  }

  info(message, data = null) {
    this.write('info', message, data);
  }

  debug(message, data = null) {
    this.write('debug', message, data);
  }
}

module.exports = new Logger();
