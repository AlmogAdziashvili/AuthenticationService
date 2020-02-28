const { createLogger, transports } = require('winston');

const logger = createLogger({
  transports: [
    // - Write to all logs with level `info` and below to `logs-combined.log`.
    // - Write all logs error (and below) to `logs-error.log`.
    new transports.File({ filename: './log/logs-error.log', level: 'error' }),
    new transports.File({ filename: './log/logs-combined.log' }),
  ],
});

// Stream for morgan
logger.stream = {
  write: (message) => logger.info(message),
};

// If we're not in production then **ALSO** log to the `console`
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  logger.add(new transports.Console());
}

module.exports = logger;
