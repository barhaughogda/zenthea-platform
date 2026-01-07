import { 
  ToolAuditLog, 
  IToolAuditLogger, 
  ToolGatewayEvent, 
  IToolTelemetryLogger,
  IOperatorAuditEmitter,
  OperatorAuditEvent
} from './types';

/**
 * Basic audit logger for tool execution.
 * In a real implementation, this would emit events to an observability platform
 * or write to a secure, immutable audit log.
 */
export class ToolAuditLogger implements IToolAuditLogger {
  async log(event: ToolAuditLog): Promise<void> {
    // This is a placeholder for actual observability integration.
    // ⚠️ SECURITY: Payload is NOT logged to console as it may contain PHI.
    console.log(`[ToolAuditLog] [${event.timestamp}] [${event.action}] Command: ${event.commandId}, Tenant: ${event.tenantId}, Tool: ${event.toolName}, Outcome: ${event.outcome || 'N/A'}`);
    
    // Implementation would go here (Audit Store):
    // - Send to secure, HIPAA-compliant storage (e.g., Convex auditLogs table)
    // - Include event.payload here as the audit store MAY contain PHI.
  }
}

/**
 * Metadata-only telemetry logger.
 * 🚫 STRICTLY NO PHI.
 */
export class ToolTelemetryLogger implements IToolTelemetryLogger {
  async emit(event: ToolGatewayEvent): Promise<void> {
    // In a real implementation, this would emit to Datadog, CloudWatch, or similar.
    // Since it's metadata-only, it's safe to log to console in development.
    console.log(`[ToolTelemetry] [${event.timestamp}] ${event.toolName} - ${event.decision} (${event.latencyMs}ms) RequestId: ${event.requestId}`);
  }
}

/**
 * Safe no-op emitter for Operator Audit Events (Slice 13).
 */
export class NoOpOperatorAuditEmitter implements IOperatorAuditEmitter {
  async emit(_event: OperatorAuditEvent): Promise<void> {
    // Non-blocking no-op
  }
}
