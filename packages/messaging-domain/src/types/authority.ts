/**
 * Authority & Control Types for Messaging & Clinical Documentation.
 * Per Phase Y-03: No assistant authority is allowed.
 */

export enum AuthorityRole {
  CLINICIAN = 'CLINICIAN',
  PATIENT = 'PATIENT',
  OPERATOR = 'OPERATOR',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'
}

export interface HumanAuthority {
  readonly role: AuthorityRole;
  readonly userId: string;
}

/**
 * Explicit confirmation points required for terminal state transitions.
 */
export interface ExecutionConfirmation {
  readonly confirmedBy: HumanAuthority;
  readonly confirmedAt: string;
  readonly evidenceHash: string;
}

/**
 * Assistant Authority is explicitly NOT allowed for execution triggers.
 * This type exists to define what is blocked.
 */
export interface AssistantAuthorityBlock {
  readonly assistantId: string;
  readonly isBlocked: true;
}

export type ExecutionTrigger = {
  readonly authority: HumanAuthority;
  readonly confirmation: ExecutionConfirmation;
};
