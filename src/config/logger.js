const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

const logDir = path.join(__dirname, '../../logs');

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'blogAPI_total_%DATE%.log'),
      datePattern: 'YYYYMMDD',
      maxFiles: '14d', // conserva logs de los últimos 14 días
      level: 'info',
      zippedArchive: false
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'blogAPI_error_%DATE%.log'),
      datePattern: 'YYYYMMDD',
      maxFiles: '14d',
      level: 'error',
      zippedArchive: false
    }),

    new transports.Console({
      format: combine(colorize(), logFormat)
    })
  ]
});

module.exports = logger;