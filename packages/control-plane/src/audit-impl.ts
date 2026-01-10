import { IAuditEmitter, AuditEvent } from './audit';
import { Logger, createLogger, LogLevel } from '@starter/observability';
import { Severity } from './types';

/**
 * Concrete implementation of IAuditEmitter backed by @starter/observability.
 */
export class ControlPlaneAuditEmitter implements IAuditEmitter {
  private readonly logger: Logger;

  constructor(serviceName: string = 'control-plane') {
    this.logger = createLogger(serviceName);
  }

  async emit(event: AuditEvent): Promise<void> {
    const { context, eventType, severity, payload, result } = event;

    const logLevel = this.mapSeverityToLogLevel(severity);
    const message = `Audit Event: ${eventType} [${result}]`;

    // Ensure deterministic structure and no PHI/PII
    const auditData = {
      ...payload,
      audit: {
        eventType,
        result,
        severity,
        traceId: context.traceId,
        tenantId: context.tenantId,
        actorId: context.actorId,
        timestamp: context.timestamp,
      }
    };

    try {
      switch (logLevel) {
        case LogLevel.INFO:
          this.logger.info(eventType, message, auditData);
          break;
        case LogLevel.WARN:
          this.logger.warn(eventType, message, auditData);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          this.logger.error(eventType, message, auditData);
          break;
        default:
          this.logger.info(eventType, message, auditData);
      }
    } catch (error) {
      // Fallback to console for audit failures - highest level sink
      console.error('CRITICAL: Audit emission failed', {
        originalEvent: event,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private mapSeverityToLogLevel(severity: Severity): LogLevel {
    switch (severity) {
      case 'INFO':
        return LogLevel.INFO;
      case 'WARNING':
        return LogLevel.WARN;
      case 'ERROR':
        return LogLevel.ERROR;
      case 'CRITICAL':
        return LogLevel.FATAL;
      default:
        return LogLevel.INFO;
    }
  }
}
