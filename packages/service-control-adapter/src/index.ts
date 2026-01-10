/**
 * Service -> Control Plane Adapter Boundary
 * Phase A: Interfaces only. No implementation.
 */

export interface ControlPlaneContext {
  readonly traceId: string;
  readonly actorId: string;
  readonly policyVersion: string;
}

/**
 * CP-21: Mandatory Gate Enforcement Utility
 */
export const GovernanceGuard = {
  /**
   * Validates that the context is present and has required fields.
   * Throws if validation fails (Fail Closed).
   */
  enforce(ctx: ControlPlaneContext): void {
    if (!ctx) {
      throw new Error('GOVERNANCE_FAILURE: Missing mandatory ControlPlaneContext (CP-21)');
    }
    if (!ctx.traceId || !ctx.actorId || !ctx.policyVersion) {
      throw new Error('GOVERNANCE_FAILURE: Incomplete ControlPlaneContext (CP-21)');
    }
  }
};

export interface PolicyDecision {
  readonly allowed: boolean;
  readonly reason?: string;
  readonly constraints?: unknown;
  readonly auditId: string;
}

export interface AuditEvent {
  readonly type: string;
  readonly metadata: Record<string, unknown>; // MUST NOT contain PHI/PII
  readonly timestamp: string;
}

/**
 * Governance Surface
 * Mediates policy evaluation and decision hooks (CP-16, CP-18).
 */
export interface GovernanceSurface {
  evaluatePolicy(ctx: ControlPlaneContext, action: string, resource: string): Promise<PolicyDecision>;
  signalDecision(ctx: ControlPlaneContext, decisionId: string, signal: unknown): Promise<void>;
}

/**
 * Audit Surface
 * Mediates uniform, metadata-only audit emission (CP-13).
 */
export interface AuditSurface {
  emit(ctx: ControlPlaneContext, event: AuditEvent): Promise<string>;
}

/**
 * Mutation Surface
 * Mediates controlled mutations and idempotency (CP-17).
 */
export interface MutationSurface {
  executeMutation(ctx: ControlPlaneContext, mutation: string, params: unknown): Promise<unknown>;
}

/**
 * Interop Surface
 * Mediates external integrations and interoperability (CP-20).
 */
export interface InteropSurface {
  proxyRequest(ctx: ControlPlaneContext, integration: string, payload: unknown): Promise<unknown>;
}
