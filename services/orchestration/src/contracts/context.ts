/**
 * E-03 §1.3 OrchestrationContext
 * Derived from ControlPlaneContext; contains the minimal state required for decisioning.
 */
export interface OrchestrationContext {
  /** Global correlation ID for the lifecycle (UUID) */
  attempt_id: string;
  /** Explicit policy identifier for gating */
  policy_id: string;
  /** Explicit policy version for gating (SEMVER) */
  policy_version: string;
  /** Distributed trace correlation */
  trace_id: string;
  /** Stable correlation for P3-Audit emission (UUID) */
  audit_id: string;
  /** MUST be 'PHASE_E_RESTRICTED' */
  governance_mode: 'PHASE_E_RESTRICTED';
}
