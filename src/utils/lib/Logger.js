export class Logger {
  constructor(level) {
    this.level = level;
  }

  debug(message, ...args) {
    if (this.level <= 0) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      if (args.length !== 0) {
        console.log(`${timestamp} | DEBUG | `, message, args);
      } else {
        console.log(`${timestamp} | DEBUG | `, message);
      }
    }
  }

  info(message, ...args) {
    if (this.level <= 1) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      if (args.length !== 0) {
        console.info(`${timestamp} | DEBUG | `, message, args);
      } else {
        console.info(`${timestamp} | DEBUG | `, message);
      }
    }
  }

  warn(message, ...args) {
    if (this.level <= 2) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      if (args.length !== 0) {
        console.warn(`${timestamp} | DEBUG | `, message, args);
      } else {
        console.warn(`${timestamp} | DEBUG | `, message);
      }
    }
  }

  error(message, ...args) {
    if (this.level <= 3) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      if (args.length !== 0) {
        console.error(`${timestamp} | DEBUG | `, message, args);
      } else {
        console.error(`${timestamp} | DEBUG | `, message);
      }
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
