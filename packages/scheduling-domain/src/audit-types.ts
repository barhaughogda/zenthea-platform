/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding per W-04 §9
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 */

import { SchedulingRecordState } from './types/scheduling-record';
import { OrderRecordState } from './types/order-record';
import { HumanRole, SchedulingAction, OrderAction } from './types/authority';

/**
 * Required Evidence for Every Proposed Execution per W-04 §9.1.
 *
 * Every proposed execution within the Scheduling & Orders domain must record
 * the following evidence elements.
 */
export interface SchedulingExecutionEvidence {
  /** The specific action being proposed */
  readonly actionType: SchedulingAction | OrderAction;

  /** UTC timestamp of proposal */
  readonly timestamp: Date;

  /** Verified identity of the initiating human */
  readonly initiatorIdentity: InitiatorIdentity;

  /** The scheduling or order record being acted upon */
  readonly subjectRecordId: string;

  /** Complete state before proposed action */
  readonly priorState: SchedulingRecordState | OrderRecordState;

  /** Complete state after proposed action */
  readonly proposedState: SchedulingRecordState | OrderRecordState;

  /** All parties affected by the proposed action */
  readonly affectedParticipantIds: readonly string[];

  /** All resources affected by the proposed action (for scheduling) */
  readonly affectedResourceIds: readonly string[];

  /** Documented reason for the action */
  readonly rationale: string;

  /** Reference to authorising governance provision */
  readonly authorityReference: string;

  /** Reference to applicable consent grants (from W-03) */
  readonly consentReference: string;
}

/**
 * Initiator identity for audit attribution.
 */
export interface InitiatorIdentity {
  /** Unique identifier for the human initiator */
  readonly id: string;

  /** Role of the initiator */
  readonly role: HumanRole;

  /** Session identifier linking to authenticated session */
  readonly sessionId: string;

  /** Whether this was assistant-generated content */
  readonly isAssistantGenerated: false;
}

/**
 * Audit Trail Entry per W-04 §9.2.
 *
 * Audit trail entries must be:
 * - Immutable: Once written, audit entries may not be modified or deleted
 * - Timestamped: All entries must include a timestamp from a trusted time source
 * - Attributable: All entries must be attributable to specific human actors
 * - Complete: All state transitions must be logged without gaps
 * - Retrievable: Audit entries must be retrievable for governance review
 * - Retained: Audit entries must be retained per regulatory requirements
 */
export interface SchedulingAuditTrailEntry {
  /** Unique identifier for this audit entry */
  readonly id: string;

  /** Entry type classification */
  readonly entryType: SchedulingAuditEntryType;

  /** UTC timestamp from trusted time source */
  readonly timestamp: Date;

  /** Attributable to specific human actor */
  readonly actorId: string;

  /** Role of the actor */
  readonly actorRole: HumanRole;

  /** Session in which the action occurred */
  readonly sessionId: string;

  /** Correlation identifier for linking related entries */
  readonly correlationId: string;

  /** The action that was taken */
  readonly action: SchedulingAction | OrderAction;

  /** Prior state before the action */
  readonly priorState: SchedulingRecordState | OrderRecordState | null;

  /** Resulting state after the action */
  readonly resultingState: SchedulingRecordState | OrderRecordState;

  /** The record that was affected */
  readonly affectedRecordId: string;

  /** Evidence payload (immutable once written) */
  readonly evidence: SchedulingExecutionEvidence;
}

/**
 * Audit entry types for the scheduling domain.
 */
export enum SchedulingAuditEntryType {
  /** Scheduling proposal submitted */
  SCHEDULING_PROPOSAL_SUBMITTED = 'SCHEDULING_PROPOSAL_SUBMITTED',

  /** Scheduling proposal modified */
  SCHEDULING_PROPOSAL_MODIFIED = 'SCHEDULING_PROPOSAL_MODIFIED',

  /** Scheduling proposal rejected */
  SCHEDULING_PROPOSAL_REJECTED = 'SCHEDULING_PROPOSAL_REJECTED',

  /** Scheduling proposal withdrawn */
  SCHEDULING_PROPOSAL_WITHDRAWN = 'SCHEDULING_PROPOSAL_WITHDRAWN',

  /** Scheduling confirmed */
  SCHEDULING_CONFIRMED = 'SCHEDULING_CONFIRMED',

  /** Confirmed scheduling modified */
  SCHEDULING_MODIFICATION = 'SCHEDULING_MODIFICATION',

  /** Scheduling cancelled */
  SCHEDULING_CANCELLED = 'SCHEDULING_CANCELLED',

  /** Scheduling completed (time passed) */
  SCHEDULING_COMPLETED = 'SCHEDULING_COMPLETED',

  /** Order draft created */
  ORDER_DRAFT_CREATED = 'ORDER_DRAFT_CREATED',

  /** Order submitted for confirmation */
  ORDER_SUBMITTED = 'ORDER_SUBMITTED',

  /** Order confirmed */
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',

  /** Order modified */
  ORDER_MODIFIED = 'ORDER_MODIFIED',

  /** Order revoked */
  ORDER_REVOKED = 'ORDER_REVOKED',

  /** Order superseded */
  ORDER_SUPERSEDED = 'ORDER_SUPERSEDED',
}

/**
 * Correlation Identifier Requirements per W-04 §9.3.
 *
 * All related actions must be correlatable through:
 * - Unique scheduling record identifiers
 * - Unique order record identifiers
 * - Correlation identifiers linking proposals to confirmations
 * - Correlation identifiers linking modifications to original records
 * - Correlation identifiers linking cancellations to original records
 * - Session identifiers linking actions to authenticated sessions
 */
export interface CorrelationIdentifiers {
  /** Unique identifier for the scheduling or order record */
  readonly recordId: string;

  /** Correlation identifier linking proposals to confirmations */
  readonly proposalCorrelationId: string | null;

  /** Correlation identifier linking modifications to original records */
  readonly modificationCorrelationId: string | null;

  /** Correlation identifier linking cancellations to original records */
  readonly cancellationCorrelationId: string | null;

  /** Session identifier linking actions to authenticated sessions */
  readonly sessionId: string;

  /** Request identifier for tracing through system layers */
  readonly requestId: string;
}

/**
 * Audit trail integrity verification (design-only).
 *
 * In Phase Y, this is a type definition only.
 * No actual integrity verification is performed.
 */
export interface AuditTrailIntegrityCheck {
  /** Whether the audit trail is complete (no gaps) */
  readonly isComplete: boolean;

  /** Whether all entries are attributable */
  readonly allEntriesAttributable: boolean;

  /** Whether all timestamps are from trusted sources */
  readonly allTimestampsTrusted: boolean;

  /** Whether entries are immutable */
  readonly entriesImmutable: boolean;

  /** Number of entries verified */
  readonly entriesVerified: number;

  /** Verification timestamp */
  readonly verifiedAt: Date;
}

/**
 * Create a placeholder audit trail integrity check.
 * In Phase Y, no actual verification is performed.
 */
export function createPlaceholderIntegrityCheck(): AuditTrailIntegrityCheck {
  return {
    isComplete: false,
    allEntriesAttributable: false,
    allTimestampsTrusted: false,
    entriesImmutable: false,
    entriesVerified: 0,
    verifiedAt: new Date(),
  };
}

/**
 * Data Mutation Rules per W-04 §8.
 *
 * Classification of data elements by mutability.
 */
export enum DataMutabilityClass {
  /**
   * MUTABLE: May be mutated through governed process.
   * Examples: Scheduling proposal content (during review, before confirmation)
   */
  MUTABLE = 'MUTABLE',

  /**
   * IMMUTABLE: Immutable once created.
   * Examples: Scheduling proposal submission record, confirmation record
   */
  IMMUTABLE = 'IMMUTABLE',

  /**
   * APPEND_ONLY: New entries may be added but existing entries cannot be modified.
   * Examples: Scheduling record history, modification history
   */
  APPEND_ONLY = 'APPEND_ONLY',
}

/**
 * Mutable data elements per W-04 §8.1.
 */
export const MUTABLE_DATA_ELEMENTS = [
  'scheduling_proposal_content_before_confirmation',
  'scheduling_proposal_state',
  'confirmed_schedule_attributes_via_modification_workflow',
  'confirmed_schedule_state',
  'order_draft_content_before_confirmation',
  'order_state',
  'order_attributes_via_modification_workflow',
] as const;

/**
 * Immutable data elements per W-04 §8.2.
 */
export const IMMUTABLE_DATA_ELEMENTS = [
  'scheduling_proposal_submission_record',
  'scheduling_confirmation_record',
  'order_confirmation_record',
  'audit_trail_entries',
  'timestamp_records',
  'revocation_records',
  'cancellation_records',
  'evidence_records_for_state_transitions',
] as const;

/**
 * Append-only data structures per W-04 §8.3.
 */
export const APPEND_ONLY_DATA_STRUCTURES = [
  'scheduling_record_history',
  'order_record_history',
  'modification_history',
  'participant_notification_log',
  'access_log_for_scheduling_and_order_records',
] as const;
