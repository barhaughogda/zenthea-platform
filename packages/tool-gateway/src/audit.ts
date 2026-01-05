import { ToolAuditLog, IToolAuditLogger } from './types';

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
