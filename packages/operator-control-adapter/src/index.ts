/**
 * Operator UI -> Control Plane Adapter Boundary
 * Phase A: Interfaces only. No implementation.
 */

export interface OperatorContext {
  readonly operatorId: string;
  readonly sessionId: string;
  readonly traceId: string;
}

export interface OperatorResult<T> {
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}

/**
 * Policy Management Surface
 * Mediates inspection and updates of platform policies (CP-18).
 */
export interface PolicyManagementSurface {
  listPolicies(ctx: OperatorContext): Promise<OperatorResult<unknown[]>>;
  getPolicyVersion(ctx: OperatorContext, policyId: string, version: string): Promise<OperatorResult<unknown>>;
  proposePolicyChange(ctx: OperatorContext, change: unknown): Promise<OperatorResult<string>>;
}

/**
 * Audit Inspection Surface
 * Mediates access to governance and audit logs (CP-13).
 */
export interface AuditInspectionSurface {
  queryLogs(ctx: OperatorContext, filter: unknown): Promise<OperatorResult<unknown[]>>;
  getAuditDetail(ctx: OperatorContext, auditId: string): Promise<OperatorResult<unknown>>;
}

/**
 * Decision Desk Surface
 * Mediates manual HITL approvals and escalations (CP-16).
 */
export interface DecisionDeskSurface {
  getPendingDecisions(ctx: OperatorContext): Promise<OperatorResult<unknown[]>>;
  resolveDecision(ctx: OperatorContext, decisionId: string, resolution: unknown): Promise<OperatorResult<void>>;
}
