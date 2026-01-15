/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding per W-04 §6.2-6.3
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 */

import { SchedulingRecordState } from '../types/scheduling-record';
import { HumanRole } from '../types/authority';
import { isSchedulingTerminalState } from '../states/scheduling-states';

/**
 * Type definition for a scheduling state transition.
 */
export interface SchedulingTransition {
  readonly from: SchedulingRecordState;
  readonly to: SchedulingRecordState;
}

/**
 * Authority required for a transition per W-04 §6.2.
 */
export interface SchedulingTransitionAuthority {
  readonly transition: SchedulingTransition;
  readonly requiredAuthority: readonly HumanRole[];
  readonly description: string;
}

/**
 * Allowed Scheduling State Transitions per W-04 §6.2.
 *
 * Any transition not in this map is FORBIDDEN per W-04 §6.3.
 */
export const ALLOWED_SCHEDULING_TRANSITIONS: ReadonlyMap<
  SchedulingRecordState,
  ReadonlySet<SchedulingRecordState>
> = new Map([
  // INTENT → PROPOSAL_PENDING (formal submission)
  [SchedulingRecordState.INTENT, new Set([SchedulingRecordState.PROPOSAL_PENDING])],

  // PROPOSAL_PENDING → PROPOSAL_MODIFIED, PROPOSAL_REJECTED, PROPOSAL_WITHDRAWN, CONFIRMED
  [
    SchedulingRecordState.PROPOSAL_PENDING,
    new Set([
      SchedulingRecordState.PROPOSAL_MODIFIED,
      SchedulingRecordState.PROPOSAL_REJECTED,
      SchedulingRecordState.PROPOSAL_WITHDRAWN,
      SchedulingRecordState.CONFIRMED,
    ]),
  ],

  // PROPOSAL_MODIFIED → PROPOSAL_REJECTED, PROPOSAL_WITHDRAWN, CONFIRMED
  [
    SchedulingRecordState.PROPOSAL_MODIFIED,
    new Set([
      SchedulingRecordState.PROPOSAL_REJECTED,
      SchedulingRecordState.PROPOSAL_WITHDRAWN,
      SchedulingRecordState.CONFIRMED,
    ]),
  ],

  // CONFIRMED → CONFIRMED_MODIFIED, CANCELLED, COMPLETED
  [
    SchedulingRecordState.CONFIRMED,
    new Set([
      SchedulingRecordState.CONFIRMED_MODIFIED,
      SchedulingRecordState.CANCELLED,
      SchedulingRecordState.COMPLETED,
    ]),
  ],

  // CONFIRMED_MODIFIED → CANCELLED, COMPLETED
  [
    SchedulingRecordState.CONFIRMED_MODIFIED,
    new Set([SchedulingRecordState.CANCELLED, SchedulingRecordState.COMPLETED]),
  ],

  // Terminal states have no allowed outgoing transitions
  [SchedulingRecordState.PROPOSAL_REJECTED, new Set()],
  [SchedulingRecordState.PROPOSAL_WITHDRAWN, new Set()],
  [SchedulingRecordState.CANCELLED, new Set()],
  [SchedulingRecordState.COMPLETED, new Set()],
]);

/**
 * Scheduling transition authority requirements per W-04 §6.2.
 */
export const SCHEDULING_TRANSITION_AUTHORITIES: readonly SchedulingTransitionAuthority[] = [
  {
    transition: { from: SchedulingRecordState.INTENT, to: SchedulingRecordState.PROPOSAL_PENDING },
    requiredAuthority: [HumanRole.PATIENT, HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Formal submission by submitting party',
  },
  {
    transition: {
      from: SchedulingRecordState.PROPOSAL_PENDING,
      to: SchedulingRecordState.PROPOSAL_MODIFIED,
    },
    requiredAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Modification during review by reviewing authority',
  },
  {
    transition: {
      from: SchedulingRecordState.PROPOSAL_PENDING,
      to: SchedulingRecordState.PROPOSAL_REJECTED,
    },
    requiredAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Rejection decision by reviewing authority',
  },
  {
    transition: {
      from: SchedulingRecordState.PROPOSAL_PENDING,
      to: SchedulingRecordState.PROPOSAL_WITHDRAWN,
    },
    requiredAuthority: [HumanRole.PATIENT, HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Withdrawal request by submitting party',
  },
  {
    transition: { from: SchedulingRecordState.PROPOSAL_PENDING, to: SchedulingRecordState.CONFIRMED },
    requiredAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Confirmation decision by confirming authority',
  },
  {
    transition: {
      from: SchedulingRecordState.PROPOSAL_MODIFIED,
      to: SchedulingRecordState.PROPOSAL_REJECTED,
    },
    requiredAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Rejection decision by reviewing authority',
  },
  {
    transition: {
      from: SchedulingRecordState.PROPOSAL_MODIFIED,
      to: SchedulingRecordState.PROPOSAL_WITHDRAWN,
    },
    requiredAuthority: [HumanRole.PATIENT, HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Withdrawal request by submitting party',
  },
  {
    transition: { from: SchedulingRecordState.PROPOSAL_MODIFIED, to: SchedulingRecordState.CONFIRMED },
    requiredAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Confirmation decision by confirming authority',
  },
  {
    transition: { from: SchedulingRecordState.CONFIRMED, to: SchedulingRecordState.CONFIRMED_MODIFIED },
    requiredAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    description: 'Modification request by authorised modifier',
  },
  {
    transition: { from: SchedulingRecordState.CONFIRMED, to: SchedulingRecordState.CANCELLED },
    requiredAuthority: [HumanRole.PROVIDER, HumanRole.STAFF, HumanRole.PATIENT],
    description: 'Cancellation request by authorised canceller',
  },
  {
    transition: { from: SchedulingRecordState.CONFIRMED, to: SchedulingRecordState.COMPLETED },
    requiredAuthority: [], // System (audit only) per W-04 §6.2
    description: 'Time passage (record-keeping only, not execution)',
  },
  {
    transition: { from: SchedulingRecordState.CONFIRMED_MODIFIED, to: SchedulingRecordState.CANCELLED },
    requiredAuthority: [HumanRole.PROVIDER, HumanRole.STAFF, HumanRole.PATIENT],
    description: 'Cancellation request by authorised canceller',
  },
  {
    transition: { from: SchedulingRecordState.CONFIRMED_MODIFIED, to: SchedulingRecordState.COMPLETED },
    requiredAuthority: [], // System (audit only) per W-04 §6.2
    description: 'Time passage (record-keeping only, not execution)',
  },
];

/**
 * Explicitly blocked scheduling state transitions per W-04 §6.3.
 *
 * These are enumerated for compile-time validation and documentation.
 */
export enum BlockedSchedulingTransition {
  /** Any transition from terminal states to any other state */
  FROM_TERMINAL_STATE = 'FROM_TERMINAL_STATE',

  /** Any automatic transition without human action (except COMPLETED) */
  AUTOMATIC_WITHOUT_HUMAN = 'AUTOMATIC_WITHOUT_HUMAN',

  /** Any transition that skips PROPOSAL_* states for new requests */
  SKIP_PROPOSAL_STATES = 'SKIP_PROPOSAL_STATES',

  /** Any transition from CONFIRMED to EXECUTED */
  CONFIRMED_TO_EXECUTED = 'CONFIRMED_TO_EXECUTED',

  /** Any transition triggered by time delay, timeout, or scheduled automation */
  TIME_TRIGGERED = 'TIME_TRIGGERED',

  /** Any transition triggered by assistant action */
  ASSISTANT_TRIGGERED = 'ASSISTANT_TRIGGERED',

  /** Any bulk transition affecting multiple scheduling records */
  BULK_TRANSITION = 'BULK_TRANSITION',
}

/**
 * Deterministic transition validation per W-04 §6.2-6.3.
 *
 * Illegal transitions are explicitly rejected.
 * This function implements fail-closed semantics: if the transition is not
 * explicitly allowed, it is denied.
 */
export function isValidSchedulingTransition(
  from: SchedulingRecordState,
  to: SchedulingRecordState
): boolean {
  // Fail-closed: Terminal states cannot transition
  if (isSchedulingTerminalState(from)) {
    return false;
  }

  // Fail-closed: Only explicitly allowed transitions are valid
  const allowed = ALLOWED_SCHEDULING_TRANSITIONS.get(from);
  return allowed?.has(to) ?? false;
}

/**
 * Get the authority required for a specific transition.
 * Returns null if the transition is not allowed.
 */
export function getSchedulingTransitionAuthority(
  from: SchedulingRecordState,
  to: SchedulingRecordState
): readonly HumanRole[] | null {
  if (!isValidSchedulingTransition(from, to)) {
    return null;
  }

  const authority = SCHEDULING_TRANSITION_AUTHORITIES.find(
    (a) => a.transition.from === from && a.transition.to === to
  );

  return authority?.requiredAuthority ?? null;
}
