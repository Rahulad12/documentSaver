import winston from "winston";
const { combine, timestamp, json, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
    new winston.transports.File({
      filename: "logs/app-error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/app-info.log",
      level: "info",
    }),
  ],
});

// Add a rotating log file for daily logs
import DailyRotateFile from "winston-daily-rotate-file";
logger.add(
  new DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  })
);

export default logger;
