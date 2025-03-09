// Path: utils\logger.ts
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '..', '..', 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const rotateTransport = new DailyRotateFile({
  format: format.combine(format.timestamp(), format.json()),
  filename: path.join(logDir, '/%DATE%-application.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
});

const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.simple(),
  ),
});

const logger = createLogger({
  transports: [consoleTransport, rotateTransport],
});

export default logger;
