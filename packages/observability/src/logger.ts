import { getContext } from './context';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  correlationId: string;
  tenantId?: string;
  userId?: string;
  event: string;
  message: string;
  context?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

export class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private log(level: LogLevel, event: string, message: string, data?: Record<string, any>, error?: Error) {
    const context = getContext();
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: context?.serviceName || this.serviceName,
      correlationId: context?.correlationId || 'none',
      tenantId: context?.tenantId,
      userId: context?.userId,
      event,
      message,
      context: data,
    };

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack,
      };
    }

    // In production, we always log JSON to stdout
    console.log(JSON.stringify(entry));
  }

  debug(event: string, message: string, data?: Record<string, any>) {
    if (process.env.LOG_LEVEL === 'DEBUG') {
      this.log(LogLevel.DEBUG, event, message, data);
    }
  }

  info(event: string, message: string, data?: Record<string, any>) {
    this.log(LogLevel.INFO, event, message, data);
  }

  warn(event: string, message: string, data?: Record<string, any>) {
    this.log(LogLevel.WARN, event, message, data);
  }

  error(event: string, message: string, data?: Record<string, any>, error?: Error) {
    this.log(LogLevel.ERROR, event, message, data, error);
  }
}

export const createLogger = (serviceName: string) => new Logger(serviceName);
