export class Logger {
  constructor(level) {
    this.level = level;
  }

  debug(message) {
    if (this.level <= 0) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      console.log(`${timestamp} | DEBUG | `, message);
    }
  }

  info(message) {
    if (this.level <= 1) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      console.info(`${timestamp} | INFO | `, message);
    }
  }

  warn(message) {
    if (this.level <= 2) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      console.warn(`${timestamp} | WARNING | `, message);
    }
  }

  error(message) {
    if (this.level <= 3) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      console.error(`${timestamp} | ERROR | `, message);
    }
  }
}

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
};

// Create logger
const logLevel =
  process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG;
export const log = new Logger(logLevel);
