/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding per W-04 §6.4
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 */

/**
 * Order Record States per W-04 §6.4.
 *
 * Order records represent clinical or operational intent expressed
 * by authorised personnel. Orders are records of requested actions
 * that await downstream processes.
 *
 * Note: Order execution is explicitly out of scope per W-04 §4.2.
 * Orders remain records of intent; they do not trigger execution.
 */
export enum OrderRecordState {
  /**
   * DRAFT: Order content prepared, not yet submitted.
   * Draft orders may be modified or discarded.
   */
  DRAFT = 'DRAFT',

  /**
   * PENDING_CONFIRMATION: Order submitted, awaiting clinical confirmation.
   * Order proposals may be created by authorised personnel or prepared
   * by assistants for human review. Proposals are governed artefacts.
   */
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',

  /**
   * CONFIRMED: Order confirmed by authorised clinician.
   * Confirmed orders:
   * - Represent the recorded intent of the confirming clinician
   * - Are attributable to the human who confirmed them
   * - Are subject to modification, cancellation, and revocation workflows
   * - Do NOT execute automatically upon confirmation
   */
  CONFIRMED = 'CONFIRMED',

  /**
   * MODIFIED: Confirmed order modified through governed workflow.
   */
  MODIFIED = 'MODIFIED',

  /**
   * REVOKED: Order revoked by authorised clinician.
   * This is a terminal state per W-04 §6.6.
   */
  REVOKED = 'REVOKED',

  /**
   * SUPERSEDED: Order replaced by a newer order.
   * This is a terminal state per W-04 §6.6.
   */
  SUPERSEDED = 'SUPERSEDED',
}

/**
 * Non-operational order record type anchor.
 * Contains only type definitions; no methods or logic.
 *
 * EXECUTION STATUS: BLOCKED
 */
export interface OrderRecord {
  /** Unique identifier for the order record */
  readonly id: string;

  /** Current state of the order record */
  readonly state: OrderRecordState;

  /** Timestamp when the record was created */
  readonly createdAt: Date;

  /** Timestamp when the record was last modified */
  readonly modifiedAt: Date;

  /** Identity of the creating clinician (required per W-04 §9.1) */
  readonly creatorId: string;

  /** Identity of the confirming clinician, if confirmed */
  readonly confirmerId: string | null;

  /** Correlation identifier for audit trail (per W-04 §9.3) */
  readonly correlationId: string;

  /** Order content */
  readonly content: OrderContent;

  /**
   * Flag indicating if this order was assistant-generated.
   * Per W-04 §11.3: All assistant-generated content must be clearly labelled.
   */
  readonly isAssistantGenerated: boolean;
}

/**
 * Order content type anchor.
 * Non-operational; contains only type definitions.
 */
export interface OrderContent {
  /** Order type classification */
  readonly type: string;

  /** Subject of the order (e.g., patient identifier) */
  readonly subjectId: string;

  /** Order-specific content/parameters */
  readonly parameters: Record<string, unknown>;

  /** Urgency classification */
  readonly urgency: OrderUrgency;

  /** Rationale documented reason for the order (per W-04 §9.1) */
  readonly rationale: string;
}

/**
 * Order urgency classification.
 */
export enum OrderUrgency {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  STAT = 'STAT',
}

/**
 * Order confirmation record (immutable per W-04 §8.2).
 * Records who, when, what was confirmed for audit trail.
 */
export interface OrderConfirmationRecord {
  readonly confirmerId: string;
  readonly confirmedAt: Date;
  readonly confirmedContent: OrderContent;
}

/**
 * Order revocation record (immutable per W-04 §8.2).
 */
export interface OrderRevocationRecord {
  readonly revokerId: string;
  readonly revokedAt: Date;
  readonly revocationReason: string;
}
