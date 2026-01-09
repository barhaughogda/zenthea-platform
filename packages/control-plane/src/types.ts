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
 * Standard severity levels for audit and signaling.
 */
export type Severity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
