/**
 * Common metadata for all control plane interactions.
 */
export interface RequestContext {
  readonly tenantId: string;
  readonly actorId: string;
  readonly traceId: string;
  readonly timestamp: number;
}

/**
 * Canonical context for service-to-control-plane interactions.
 * Phase D-4.1: Unified authority established in @starter/control-plane.
 */
export interface ControlPlaneContext {
  readonly traceId: string;
  readonly actorId: string;
  readonly policyVersion: string;
}

/**
 * Standard severity levels for audit and signaling.
 */
export type Severity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
