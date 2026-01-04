import { z } from 'zod';

/**
 * Validated and approved execution command.
 * This is what the gateway accepts.
 */
export const ToolExecutionCommandSchema = z.object({
  commandId: z.string().uuid(),
  proposalId: z.string().uuid(),
  tenantId: z.string(),
  tool: z.object({
    name: z.string(),
    version: z.string(),
  }),
  parameters: z.record(z.any()),
  approval: z.object({
    approvedBy: z.string(),
    approvedAt: z.string().datetime(),
    approvalType: z.enum(['human', 'automated']),
  }),
  idempotencyKey: z.string(),
  metadata: z.object({
    correlationId: z.string(),
    traceId: z.string().optional(),
  }),
});

export type ToolExecutionCommand = z.infer<typeof ToolExecutionCommandSchema>;

/**
 * Result of a tool execution.
 */
export interface ToolExecutionResult {
  executionId: string;
  commandId: string;
  status: 'success' | 'failure';
  data?: any;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
  timestamp: string;
}

/**
 * Audit event for tool execution.
 */
export interface ToolAuditLog {
  eventId: string;
  tenantId: string;
  commandId: string;
  proposalId: string;
  toolName: string;
  action: 'received' | 'validated' | 'dispatched' | 'completed' | 'failed';
  payload?: any;
  actor: string;
  timestamp: string;
  metadata: Record<string, any>;
}

/**
 * Interface for the Execution Gateway.
 */
export interface IToolExecutionGateway {
  execute(command: ToolExecutionCommand): Promise<ToolExecutionResult>;
}

/**
 * Interface for audit logging.
 */
export interface IToolAuditLogger {
  log(event: ToolAuditLog): Promise<void>;
}
