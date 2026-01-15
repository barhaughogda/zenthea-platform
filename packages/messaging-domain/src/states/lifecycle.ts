/**
 * State classification and lifecycle transitions.
 * Defines terminal vs non-terminal states and BLOCKED transitions.
 */

export enum MessagingState {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED'
}

export enum DocumentationState {
  DRAFT = 'DRAFT',
  COMMITTED = 'COMMITTED',
  AMENDED = 'AMENDED',
  VOIDED = 'VOIDED'
}

/**
 * Terminal states are those from which no further operational transitions are allowed
 * without an explicit amendment or new record.
 */
export const TERMINAL_MESSAGING_STATES: readonly MessagingState[] = [
  MessagingState.SENT,
  MessagingState.ARCHIVED
];

export const TERMINAL_DOCUMENTATION_STATES: readonly DocumentationState[] = [
  DocumentationState.COMMITTED,
  DocumentationState.VOIDED
];

/**
 * Non-terminal states allow for further editing or commitment (when unblocked).
 */
export const NON_TERMINAL_MESSAGING_STATES: readonly MessagingState[] = [
  MessagingState.DRAFT
];

export const NON_TERMINAL_DOCUMENTATION_STATES: readonly DocumentationState[] = [
  DocumentationState.DRAFT
];

/**
 * Transition Guard Result.
 * All operations are BLOCKED in this phase.
 */
export interface TransitionGuardResult {
  readonly allowed: false;
  readonly reason: 'PHASE_Y_03_BLOCKED' | 'INVALID_TRANSITION' | 'AUTHORITY_MISMATCH';
  readonly message: string;
}
