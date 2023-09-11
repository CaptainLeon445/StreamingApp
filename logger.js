const winston = require('winston');
// Configure Winston logger
exports.logger = winston.createLogger({
    level: 'info', // Log level
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console(), // Log to console
      new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
    ],
  });