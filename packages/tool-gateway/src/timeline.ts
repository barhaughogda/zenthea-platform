import { 
  ToolGatewayEvent, 
  GovernanceControlResult, 
  ApprovalSignal 
} from './types';
import { TransitionEvent } from './lifecycle-telemetry';

/**
 * Explicit allowlist of tool names permitted in the timeline.
 * 🚫 Tools not in this list MUST be mapped to "unknown_tool".
 */
const TIMELINE_TOOL_ALLOWLIST = new Set([
  'createConsent',
  'revokeConsent',
  'updateConsentPreferences',
  'chat.createConversation',
  'chat.sendMessage',
  'chat.getHistory',
  'appointment.requestAppointment',
  'appointment.cancelAppointment',
  'medical_advisor.getAdvice'
]);

/**
 * Event types for the Governance & Approval Timeline.
 * Strictly limited to these four types.
 */
export type GovernanceTimelineEventType = 
  | 'TOOL_GATEWAY' 
  | 'GOVERNANCE_CONTROL' 
  | 'APPROVAL_SIGNAL' 
  | 'LIFECYCLE_TRANSITION';

/**
 * Base structure for all timeline events.
 * 🚫 STRICTLY NO PHI, tenantId, actorId, agentId, or payloads.
 */
export interface BaseTimelineEvent {
  eventId: string;
  type: GovernanceTimelineEventType;
  policySnapshotHash: string;
  agentVersion: string;
  timestamp: string;
}

/**
 * Timeline-specific view of ToolGatewayEvent.
 * Stripped of tenantId, actorId, requestId, and idempotency keys.
 */
export interface ToolGatewayTimelineEvent extends BaseTimelineEvent {
  type: 'TOOL_GATEWAY';
  toolName: string;
  actorType: 'patient' | 'provider' | 'system' | 'unknown';
  decision: 'allowed' | 'denied' | 'rate_limited' | 'error';
  errorCode?: string;
}

/**
 * Timeline-specific view of GovernanceControlResult.
 */
export interface GovernanceControlTimelineEvent extends BaseTimelineEvent {
  type: 'GOVERNANCE_CONTROL';
  decision: 'DENIED' | 'WARNING';
  reasonCode: string;
  toolName: string;
  agentType: string;
}

/**
 * Timeline-specific view of ApprovalSignal.
 */
export interface ApprovalSignalTimelineEvent extends BaseTimelineEvent {
  type: 'APPROVAL_SIGNAL';
  triggerType: string;
  severity: 'low' | 'medium' | 'high';
  escalationLevel: 1 | 2 | 3;
}

/**
 * Timeline-specific view of TransitionEvent.
 */
export interface TransitionTimelineEvent extends BaseTimelineEvent {
  type: 'LIFECYCLE_TRANSITION';
  fromState: string;
  toState: string;
  decision: 'requested' | 'approved' | 'rejected';
}

/**
 * Union type for all events in the governance timeline.
 */
export type GovernanceTimelineEvent = 
  | ToolGatewayTimelineEvent 
  | GovernanceControlTimelineEvent 
  | ApprovalSignalTimelineEvent 
  | TransitionTimelineEvent;

/**
 * Read-only filters for the timeline.
 */
export interface TimelineFilter {
  policySnapshotHash?: string;
  agentVersion?: string;
  toolName?: string;
  startTime?: string;
  endTime?: string;
  type?: GovernanceTimelineEventType;
  cursor?: string;
  limit?: number;
}

/**
 * Aggregation helpers to convert raw events into timeline events.
 * ⚠️ SECURITY: This layer enforces the removal of forbidden fields and tool allowlisting.
 */
export const TimelineAggregator = {
  /**
   * Maps a tool name to an allowlisted value or "unknown_tool".
   */
  sanitizeToolName(toolName: string): string {
    return TIMELINE_TOOL_ALLOWLIST.has(toolName) ? toolName : 'unknown_tool';
  },

  /**
   * Converts a ToolGatewayEvent to a Timeline event.
   * Strips PII/PHI: tenantId, actorId, requestId, idempotencyKeyHash.
   * Hardens toolName via allowlist.
   */
  fromToolGateway(event: ToolGatewayEvent): ToolGatewayTimelineEvent {
    return {
      eventId: event.requestId, // Using requestId as stable eventId for tool gateway events
      type: 'TOOL_GATEWAY',
      policySnapshotHash: event.policySnapshotHash,
      agentVersion: event.agentVersion,
      timestamp: event.timestamp,
      toolName: this.sanitizeToolName(event.toolName),
      actorType: event.actorType,
      decision: event.decision,
      errorCode: event.errorCode,
    };
  },

  /**
   * Converts a GovernanceControlResult to a Timeline event.
   * Hardens toolName via allowlist.
   */
  fromGovernanceControl(event: GovernanceControlResult): GovernanceControlTimelineEvent {
    return {
      eventId: `gov-${event.timestamp}-${event.policySnapshotHash.slice(0, 8)}`,
      type: 'GOVERNANCE_CONTROL',
      policySnapshotHash: event.policySnapshotHash,
      agentVersion: event.agentVersion,
      timestamp: event.timestamp,
      decision: event.decision,
      reasonCode: event.reasonCode,
      toolName: this.sanitizeToolName(event.toolName),
      agentType: event.agentType,
    };
  },

  /**
   * Converts an ApprovalSignal to a Timeline event.
   */
  fromApprovalSignal(event: ApprovalSignal): ApprovalSignalTimelineEvent {
    return {
      eventId: `app-${event.timestamp}-${event.policySnapshotHash.slice(0, 8)}`,
      type: 'APPROVAL_SIGNAL',
      policySnapshotHash: event.policySnapshotHash,
      agentVersion: event.agentVersion,
      timestamp: event.timestamp,
      triggerType: event.triggerType,
      severity: event.severity,
      escalationLevel: event.escalationLevel,
    };
  },

  /**
   * Converts a TransitionEvent to a Timeline event.
   */
  fromTransition(event: TransitionEvent): TransitionTimelineEvent {
    return {
      eventId: `life-${event.timestamp}-${event.agentVersion}`,
      type: 'LIFECYCLE_TRANSITION',
      policySnapshotHash: event.policySnapshotHash,
      agentVersion: event.agentVersion,
      timestamp: event.timestamp,
      fromState: event.fromState,
      toState: event.toState,
      decision: event.decision,
    };
  },

  /**
   * Helper to sort events chronologically.
   * Timeline MUST preserve exact ordering by timestamp.
   */
  sortChronologically(events: GovernanceTimelineEvent[]): GovernanceTimelineEvent[] {
    return [...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
};

/**
 * Read-only interface for querying the Governance & Approval Timeline.
 * Implementation is typically provided by a persistent storage service (e.g., Convex).
 */
export interface IGovernanceTimelineReader {
  /**
   * Retrieves a filtered list of events from the timeline.
   * MUST be read-only and fail-safe.
   */
  query(filter: TimelineFilter): Promise<GovernanceTimelineEvent[]>;

  /**
   * Retrieves a single event by its (hypothetical) ID if available.
   */
  getEvent(eventId: string): Promise<GovernanceTimelineEvent | null>;
}
