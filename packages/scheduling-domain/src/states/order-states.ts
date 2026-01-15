/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding per W-04 §6.4-6.6
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 */

import { OrderRecordState } from '../types/order-record';

/**
 * Terminal states for order records per W-04 §6.6.
 *
 * Transitions from terminal states (REVOKED, SUPERSEDED) to any
 * non-terminal state are explicitly blocked.
 */
export const ORDER_TERMINAL_STATES: ReadonlySet<OrderRecordState> = new Set([
  OrderRecordState.REVOKED,
  OrderRecordState.SUPERSEDED,
]);

/**
 * Non-terminal states for order records.
 */
export const ORDER_NON_TERMINAL_STATES: ReadonlySet<OrderRecordState> = new Set([
  OrderRecordState.DRAFT,
  OrderRecordState.PENDING_CONFIRMATION,
  OrderRecordState.CONFIRMED,
  OrderRecordState.MODIFIED,
]);

/**
 * States that require clinical authority for modification.
 */
export const ORDER_CLINICIAN_CONTROLLED_STATES: ReadonlySet<OrderRecordState> = new Set([
  OrderRecordState.CONFIRMED,
  OrderRecordState.MODIFIED,
]);

/**
 * Deterministic check for terminal state per W-04 §6.6.
 */
export function isOrderTerminalState(state: OrderRecordState): boolean {
  return ORDER_TERMINAL_STATES.has(state);
}

/**
 * Deterministic check for clinician-controlled state.
 */
export function isOrderClinicianControlledState(state: OrderRecordState): boolean {
  return ORDER_CLINICIAN_CONTROLLED_STATES.has(state);
}
