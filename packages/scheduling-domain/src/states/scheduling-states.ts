/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding per W-04 §6.1-6.3
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 */

import { SchedulingRecordState } from '../types/scheduling-record';

/**
 * Terminal states for scheduling records per W-04 §6.3.
 *
 * Transitions from terminal states to any other state are explicitly blocked.
 */
export const SCHEDULING_TERMINAL_STATES: ReadonlySet<SchedulingRecordState> = new Set([
  SchedulingRecordState.PROPOSAL_REJECTED,
  SchedulingRecordState.PROPOSAL_WITHDRAWN,
  SchedulingRecordState.CANCELLED,
  SchedulingRecordState.COMPLETED,
]);

/**
 * Non-terminal states for scheduling records.
 */
export const SCHEDULING_NON_TERMINAL_STATES: ReadonlySet<SchedulingRecordState> = new Set([
  SchedulingRecordState.INTENT,
  SchedulingRecordState.PROPOSAL_PENDING,
  SchedulingRecordState.PROPOSAL_MODIFIED,
  SchedulingRecordState.CONFIRMED,
  SchedulingRecordState.CONFIRMED_MODIFIED,
]);

/**
 * Proposal states for scheduling records.
 * Per W-04 §6.3: Any transition that skips the PROPOSAL_* states for new
 * scheduling requests is explicitly blocked.
 */
export const SCHEDULING_PROPOSAL_STATES: ReadonlySet<SchedulingRecordState> = new Set([
  SchedulingRecordState.PROPOSAL_PENDING,
  SchedulingRecordState.PROPOSAL_MODIFIED,
  SchedulingRecordState.PROPOSAL_REJECTED,
  SchedulingRecordState.PROPOSAL_WITHDRAWN,
]);

/**
 * Confirmed states for scheduling records.
 */
export const SCHEDULING_CONFIRMED_STATES: ReadonlySet<SchedulingRecordState> = new Set([
  SchedulingRecordState.CONFIRMED,
  SchedulingRecordState.CONFIRMED_MODIFIED,
]);

/**
 * Deterministic check for terminal state per W-04 §6.3.
 */
export function isSchedulingTerminalState(state: SchedulingRecordState): boolean {
  return SCHEDULING_TERMINAL_STATES.has(state);
}

/**
 * Deterministic check for proposal state.
 */
export function isSchedulingProposalState(state: SchedulingRecordState): boolean {
  return SCHEDULING_PROPOSAL_STATES.has(state);
}

/**
 * Deterministic check for confirmed state.
 */
export function isSchedulingConfirmedState(state: SchedulingRecordState): boolean {
  return SCHEDULING_CONFIRMED_STATES.has(state);
}
