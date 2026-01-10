/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { ControlPlaneContext } from '@starter/service-control-adapter';

/**
 * Validated and approved execution command.
 * This is what the gateway accepts.
 */
export const ToolExecutionCommandSchema = z.object({
  commandId: z.string().uuid(),
  proposalId: z.string().uuid(),
  tenantId: z.string(),
  agentId: z.string(),
  agentVersion: z.string(),
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
  action: 'received' | 'validated' | 'dispatched' | 'completed' | 'failed' | 'command_received' | 'command_rejected' | 'command_dispatched' | 'command_succeeded' | 'command_failed';
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
  agentVersion: string;
  policySnapshotHash: string;
  requestId: string;
  idempotencyKeyHash: string; // SHA-256 hash of the key
  decision: 'allowed' | 'denied' | 'rate_limited' | 'error';
  errorCode?: string;
  latencyMs: number;
  timestamp: string;
}

/**
 * Agent Governance Types
 */
export type AgentType = 'patient-facing' | 'clinical' | 'platform' | 'unknown';

export type AgentLifecycleState = 'active' | 'deprecated' | 'disabled' | 'experimental' | 'retired';

export type AgentVersion = string;

export type GovernanceReasonCode = 
  | 'UNKNOWN_AGENT' 
  | 'UNKNOWN_AGENT_VERSION'
  | 'LIFECYCLE_DENIED'
  | 'DEPRECATED_AGENT'
  | 'UNKNOWN_TOOL' 
  | 'SCOPE_DENIED'
  | 'FEATURE_DISABLED'
  | 'RATE_LIMITED'
  | 'VALIDATION_FAILED'
  | 'IDEMPOTENCY_COLLISION'
  | 'APPROVAL_REQUIRED';

/**
 * Governance control result for tool invocation denies.
 * 🚫 STRICTLY NO PHI, tenantId, actorId, or requestId.
 */
export interface PolicyEvaluation {
  allowed: boolean;
  reasonCode?: GovernanceReasonCode;
  warningCode?: GovernanceReasonCode;
  agentType: AgentType;
}

export interface GovernanceControlResult {
  decision: 'DENIED' | 'WARNING';
  reasonCode: GovernanceReasonCode;
  toolName: string;
  agentType: AgentType;
  agentVersion: string;
  policySnapshotHash: string;
  timestamp: string;
}

/**
 * Interface for the Execution Gateway.
 */
export interface IToolExecutionGateway {
  execute(command: ToolExecutionCommand, ctx: ControlPlaneContext): Promise<ToolExecutionResult>;
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

/**
 * Interface for governance logging.
 */
export interface IGovernanceLogger {
  emit(event: GovernanceControlResult): Promise<void>;
}

/**
 * Deterministic abuse signal event.
 * SIGNALS ONLY. No enforcement.
 * 🚫 STRICTLY NO PHI, actorId, or tenantId.
 */
export interface AbuseSignalEvent {
  ruleId: string;
  severity: 'low' | 'medium' | 'high';
  toolName?: string;
  actorType: ToolGatewayEvent['actorType'];
  windowMs: number;
  observedCount: number;
  threshold: number;
  timestamp: string;
}

/**
 * Interface for abuse signal emission.
 */
export interface IAbuseSignalEmitter {
  emitSignal(event: AbuseSignalEvent): void;
}

/**
 * Immutable, versioned snapshot of governance policy state.
 * 🚫 STRICTLY NO PHI, actorId, tenantId, agentId, or requestId.
 * Metadata only.
 */
export interface GovernancePolicySnapshot {
  snapshotId: string;
  policyVersion: string; // semver or date-based
  policyHash: string; // SHA-256 of normalized policy
  agentCount: number;
  toolCount: number;
  generatedAt: string;
}

/**
 * Interface for policy snapshot emission.
 */
export interface IPolicySnapshotEmitter {
  emit(snapshot: GovernancePolicySnapshot): Promise<void>;
}

/**
 * Metadata-only approval signal derived from governance events.
 * 🚫 STRICTLY NO PHI, tenantId, actorId, or agentId.
 */
export interface ApprovalSignal {
  triggerType: GovernanceReasonCode;
  severity: 'low' | 'medium' | 'high';
  escalationLevel: 1 | 2 | 3;
  agentVersion: string;
  policySnapshotHash: string;
  timestamp: string;
}

/**
 * Interface for approval signal emission.
 */
export interface IApprovalSignalEmitter {
  emitSignal(signal: ApprovalSignal): void;
}

/**
 * Operator Audit Actions (Slice 13)
 */
export type OperatorAuditAction = 'POLICY_EXECUTE' | 'VIEW_EXECUTE';

/**
 * Operator Audit Outcomes (Slice 13)
 */
export type OperatorAuditOutcome = 'ALLOWED' | 'REJECTED';

/**
 * Operator Audit Reason Codes (Error Taxonomy) (Slice 13)
 */
export type OperatorAuditReasonCode = 
  | 'UNKNOWN_POLICY_ID'
  | 'UNKNOWN_VIEW_ID'
  | 'UNSUPPORTED_TARGET'
  | 'VALIDATION_FAILED'
  | 'INTERNAL_ERROR';

/**
 * Operator Audit Event (Metadata-only) (Slice 13)
 * CP-18: Added version tracking.
 * 🚫 MUST NOT include PHI, tenantId, actorId, requestId, cursor, or payloads.
 */
export interface OperatorAuditEvent {
  eventId: string;
  timestamp: string;
  action: OperatorAuditAction;
  outcome: OperatorAuditOutcome;
  reasonCode?: OperatorAuditReasonCode;
  policyId?: string;
  policyVersion?: string; // CP-18: Resolved policy version
  viewId?: string;
  viewVersion?: string; // CP-18: Resolved view version
  target?: 'timeline' | 'agentRegistry';
  policySnapshotHash?: string;
}

/**
 * Interface for Operator Audit Emission (Slice 13)
 */
export interface IOperatorAuditEmitter {
  emit(event: OperatorAuditEvent): Promise<void>;
}
