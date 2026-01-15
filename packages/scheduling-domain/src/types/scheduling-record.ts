/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding per W-04 §6.1
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 */

/**
 * Scheduling Record States per W-04 §6.1.
 *
 * Scheduling records represent time-bounded allocations of resources,
 * including appointments, availability blocks, and capacity reservations.
 * Scheduling records progress through defined states from initial request
 * through confirmation.
 */
export enum SchedulingRecordState {
  /**
   * INTENT: Scheduling desire expressed but not formalised.
   * Intents are not binding and do not reserve resources.
   * Intents may be discarded without consequence.
   */
  INTENT = 'INTENT',

  /**
   * PROPOSAL_PENDING: Formal proposal submitted, awaiting review.
   * Proposals are governed artefacts subject to:
   * - Attribution to the submitting party and originating surface
   * - Review by authorised personnel
   * - Acceptance, modification, or rejection through governed workflow
   * - Audit logging of all state changes
   * Proposals do not reserve resources. Proposals have no operational effect until confirmed.
   */
  PROPOSAL_PENDING = 'PROPOSAL_PENDING',

  /**
   * PROPOSAL_MODIFIED: Proposal modified during review process.
   */
  PROPOSAL_MODIFIED = 'PROPOSAL_MODIFIED',

  /**
   * PROPOSAL_REJECTED: Proposal rejected by reviewing authority.
   * This is a terminal state per W-04 §6.3.
   */
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',

  /**
   * PROPOSAL_WITHDRAWN: Proposal withdrawn by submitting party.
   * This is a terminal state per W-04 §6.3.
   */
  PROPOSAL_WITHDRAWN = 'PROPOSAL_WITHDRAWN',

  /**
   * CONFIRMED: Schedule confirmed by authorised human.
   * Confirmations are binding commitments that:
   * - Reserve the specified time slot
   * - Allocate the specified resources
   * - Are visible to all authorised participants
   * - Are attributable to the human who confirmed them
   * - Are subject to modification and cancellation through governed workflows
   */
  CONFIRMED = 'CONFIRMED',

  /**
   * CONFIRMED_MODIFIED: Confirmed schedule modified through governed workflow.
   */
  CONFIRMED_MODIFIED = 'CONFIRMED_MODIFIED',

  /**
   * CANCELLED: Confirmed schedule cancelled through governed workflow.
   * This is a terminal state per W-04 §6.3.
   */
  CANCELLED = 'CANCELLED',

  /**
   * COMPLETED: Schedule time has passed; record retained for audit.
   * This is a terminal state per W-04 §6.3.
   * Note: This is a record-keeping state, not an execution state.
   */
  COMPLETED = 'COMPLETED',
}

/**
 * Non-operational scheduling record type anchor.
 * Contains only type definitions; no methods or logic.
 *
 * EXECUTION STATUS: BLOCKED
 */
export interface SchedulingRecord {
  /** Unique identifier for the scheduling record */
  readonly id: string;

  /** Current state of the scheduling record */
  readonly state: SchedulingRecordState;

  /** Timestamp when the record was created */
  readonly createdAt: Date;

  /** Timestamp when the record was last modified */
  readonly modifiedAt: Date;

  /** Identity of the submitting party (required per W-04 §9.1) */
  readonly submitterId: string;

  /** Identity of the confirming human, if confirmed */
  readonly confirmerId: string | null;

  /** Correlation identifier for audit trail (per W-04 §9.3) */
  readonly correlationId: string;

  /** Scheduling parameters (time, participants, resources, purpose) */
  readonly parameters: SchedulingParameters;
}

/**
 * Scheduling parameters type anchor.
 * Non-operational; contains only type definitions.
 */
export interface SchedulingParameters {
  /** Proposed start time */
  readonly startTime: Date;

  /** Proposed end time */
  readonly endTime: Date;

  /** Participant identifiers */
  readonly participantIds: readonly string[];

  /** Resource identifiers */
  readonly resourceIds: readonly string[];

  /** Purpose/reason for the scheduling */
  readonly purpose: string;
}

/**
 * Scheduling proposal submission record (immutable per W-04 §8.2).
 * Records who, when, what for audit trail.
 */
export interface SchedulingProposalSubmission {
  readonly submitterId: string;
  readonly submittedAt: Date;
  readonly proposedParameters: SchedulingParameters;
  readonly originatingSurface: string;
}

/**
 * Scheduling confirmation record (immutable per W-04 §8.2).
 * Records who, when, what was confirmed for audit trail.
 */
export interface SchedulingConfirmationRecord {
  readonly confirmerId: string;
  readonly confirmedAt: Date;
  readonly confirmedParameters: SchedulingParameters;
}
