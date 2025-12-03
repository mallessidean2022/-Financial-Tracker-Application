const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

/**
 * Create logs directory if it doesn't exist
 */
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

/**
 * Create write stream for access logs
 */
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

/**
 * Morgan logger middleware
 */
const logger = morgan('combined', { stream: accessLogStream });

/**
 * Console logger for development
 */
const consoleLogger = morgan('dev');

/**
 * Custom logger functions
 */
const log = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(error);
    }
  },
  warn: (message) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  }
};

module.exports = {
  logger,
  consoleLogger,
  log
};
