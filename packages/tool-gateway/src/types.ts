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
 * Tool-specific Parameter Schemas
 */

export const CreateConsentParamsSchema = z.object({
  patientId: z.string().uuid(),
  purpose: z.enum(['TREATMENT', 'PAYMENT', 'OPERATIONS', 'RESEARCH', 'MARKETING', 'EMERGENCY']),
  scope: z.array(z.string()),
  jurisdiction: z.enum(['US-HIPAA', 'EU-GDPR', 'GLOBAL']),
  expiresAt: z.string().datetime().optional(),
});

export const RevokeConsentParamsSchema = z.object({
  patientId: z.string().uuid(),
  consentRecordId: z.string().uuid(),
  reason: z.string().optional(),
});

export const UpdateConsentPreferencesParamsSchema = z.object({
  patientId: z.string().uuid(),
  consentRecordId: z.string().uuid(),
  scope: z.array(z.string()),
});

/**
 * Chat Tool Parameter Schemas
 */

export const CreateConversationParamsSchema = z.object({
  patientId: z.string().uuid(),
  recipientId: z.string().uuid(),
  subject: z.string().min(1).max(200),
  initialMessage: z.string().min(1),
});

export const SendMessageParamsSchema = z.object({
  patientId: z.string().uuid(),
  conversationId: z.string().uuid(),
  content: z.string().min(1),
});

/**
 * Appointment Tool Parameter Schemas
 */

export const RequestAppointmentParamsSchema = z.object({
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  startTime: z.string().datetime(),
  type: z.string().min(1),
  reason: z.string().optional(),
});

export const CancelAppointmentParamsSchema = z.object({
  patientId: z.string().uuid(),
  appointmentRequestId: z.string().uuid(),
  reason: z.string().optional(),
});

export type CreateConsentParams = z.infer<typeof CreateConsentParamsSchema>;
export type RevokeConsentParams = z.infer<typeof RevokeConsentParamsSchema>;
export type UpdateConsentPreferencesParams = z.infer<typeof UpdateConsentPreferencesParamsSchema>;
export type CreateConversationParams = z.infer<typeof CreateConversationParamsSchema>;
export type SendMessageParams = z.infer<typeof SendMessageParamsSchema>;
export type RequestAppointmentParams = z.infer<typeof RequestAppointmentParamsSchema>;
export type CancelAppointmentParams = z.infer<typeof CancelAppointmentParamsSchema>;

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
  idempotencyKey?: string;
  outcome?: string;
  metadata: Record<string, any>;
}

/**
 * Structured, metadata-only telemetry event for tool invocation.
 * 🚫 MUST NOT include PHI.
 */
export interface ToolGatewayEvent {
  toolName: string;
  tenantId: string;
  actorId: string;
  actorType: 'patient' | 'provider' | 'system' | 'unknown';
  requestId: string;
  idempotencyKeyHash: string; // SHA-256 hash of the key
  decision: 'allowed' | 'denied' | 'rate_limited' | 'error';
  errorCode?: string;
  latencyMs: number;
  timestamp: string;
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

/**
 * Interface for telemetry logging.
 * Telemetry MUST NEVER contain PHI.
 */
export interface IToolTelemetryLogger {
  emit(event: ToolGatewayEvent): Promise<void>;
}
