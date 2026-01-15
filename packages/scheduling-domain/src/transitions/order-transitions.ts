/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding per W-04 §6.5-6.6
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 */

import { OrderRecordState } from '../types/order-record';
import { HumanRole } from '../types/authority';
import { isOrderTerminalState } from '../states/order-states';

/**
 * Type definition for an order state transition.
 */
export interface OrderTransition {
  readonly from: OrderRecordState;
  readonly to: OrderRecordState;
}

/**
 * Authority required for a transition per W-04 §6.5.
 */
export interface OrderTransitionAuthority {
  readonly transition: OrderTransition;
  readonly requiredAuthority: readonly HumanRole[];
  readonly description: string;
}

/**
 * Allowed Order State Transitions per W-04 §6.5.
 *
 * Any transition not in this map is FORBIDDEN per W-04 §6.6.
 */
export const ALLOWED_ORDER_TRANSITIONS: ReadonlyMap<
  OrderRecordState,
  ReadonlySet<OrderRecordState>
> = new Map([
  // DRAFT → PENDING_CONFIRMATION, CONFIRMED (where policy permits)
  [
    OrderRecordState.DRAFT,
    new Set([OrderRecordState.PENDING_CONFIRMATION, OrderRecordState.CONFIRMED]),
  ],

  // PENDING_CONFIRMATION → CONFIRMED, REVOKED
  [
    OrderRecordState.PENDING_CONFIRMATION,
    new Set([OrderRecordState.CONFIRMED, OrderRecordState.REVOKED]),
  ],

  // CONFIRMED → MODIFIED, REVOKED, SUPERSEDED
  [
    OrderRecordState.CONFIRMED,
    new Set([
      OrderRecordState.MODIFIED,
      OrderRecordState.REVOKED,
      OrderRecordState.SUPERSEDED,
    ]),
  ],

  // MODIFIED → REVOKED, SUPERSEDED
  [OrderRecordState.MODIFIED, new Set([OrderRecordState.REVOKED, OrderRecordState.SUPERSEDED])],

  // Terminal states have no allowed outgoing transitions
  [OrderRecordState.REVOKED, new Set()],
  [OrderRecordState.SUPERSEDED, new Set()],
]);

/**
 * Order transition authority requirements per W-04 §6.5.
 * Note: All transitions require clinical authority (PROVIDER role).
 */
export const ORDER_TRANSITION_AUTHORITIES: readonly OrderTransitionAuthority[] = [
  {
    transition: { from: OrderRecordState.DRAFT, to: OrderRecordState.PENDING_CONFIRMATION },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Submission for review by creating clinician or reviewer',
  },
  {
    transition: { from: OrderRecordState.DRAFT, to: OrderRecordState.CONFIRMED },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Direct confirmation (where policy permits) by authorised clinician',
  },
  {
    transition: { from: OrderRecordState.PENDING_CONFIRMATION, to: OrderRecordState.CONFIRMED },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Confirmation decision by authorised clinician',
  },
  {
    transition: { from: OrderRecordState.PENDING_CONFIRMATION, to: OrderRecordState.REVOKED },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Revocation decision by authorised clinician',
  },
  {
    transition: { from: OrderRecordState.CONFIRMED, to: OrderRecordState.MODIFIED },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Modification request by authorised clinician',
  },
  {
    transition: { from: OrderRecordState.CONFIRMED, to: OrderRecordState.REVOKED },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Revocation decision by authorised clinician',
  },
  {
    transition: { from: OrderRecordState.CONFIRMED, to: OrderRecordState.SUPERSEDED },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Replacement order confirmed by authorised clinician',
  },
  {
    transition: { from: OrderRecordState.MODIFIED, to: OrderRecordState.REVOKED },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Revocation decision by authorised clinician',
  },
  {
    transition: { from: OrderRecordState.MODIFIED, to: OrderRecordState.SUPERSEDED },
    requiredAuthority: [HumanRole.PROVIDER],
    description: 'Replacement order confirmed by authorised clinician',
  },
];

/**
 * Explicitly blocked order state transitions per W-04 §6.6.
 *
 * These are enumerated for compile-time validation and documentation.
 */
export enum BlockedOrderTransition {
  /** Any transition from terminal states (REVOKED, SUPERSEDED) to any non-terminal state */
  FROM_TERMINAL_STATE = 'FROM_TERMINAL_STATE',

  /** Any automatic transition without human action */
  AUTOMATIC_WITHOUT_HUMAN = 'AUTOMATIC_WITHOUT_HUMAN',

  /** Any transition from CONFIRMED or MODIFIED to EXECUTED */
  TO_EXECUTED = 'TO_EXECUTED',

  /** Any transition triggered by time delay, timeout, or scheduled automation */
  TIME_TRIGGERED = 'TIME_TRIGGERED',

  /** Any transition triggered by assistant action */
  ASSISTANT_TRIGGERED = 'ASSISTANT_TRIGGERED',

  /** Any bulk transition affecting multiple order records */
  BULK_TRANSITION = 'BULK_TRANSITION',

  /** Any transition that bypasses the required clinical authority */
  BYPASS_CLINICAL_AUTHORITY = 'BYPASS_CLINICAL_AUTHORITY',
}

/**
 * Deterministic transition validation per W-04 §6.5-6.6.
 *
 * Illegal transitions are explicitly rejected.
 * This function implements fail-closed semantics: if the transition is not
 * explicitly allowed, it is denied.
 */
export function isValidOrderTransition(
  from: OrderRecordState,
  to: OrderRecordState
): boolean {
  // Fail-closed: Terminal states cannot transition
  if (isOrderTerminalState(from)) {
    return false;
  }

  // Fail-closed: Only explicitly allowed transitions are valid
  const allowed = ALLOWED_ORDER_TRANSITIONS.get(from);
  return allowed?.has(to) ?? false;
}

/**
 * Get the authority required for a specific transition.
 * Returns null if the transition is not allowed.
 */
export function getOrderTransitionAuthority(
  from: OrderRecordState,
  to: OrderRecordState
): readonly HumanRole[] | null {
  if (!isValidOrderTransition(from, to)) {
    return null;
  }

  const authority = ORDER_TRANSITION_AUTHORITIES.find(
    (a) => a.transition.from === from && a.transition.to === to
  );

  return authority?.requiredAuthority ?? null;
}
