/**
 * E-03 §1.5 OrchestrationAbort
 * The signal emitted when an invariant or fail-closed condition is met.
 */
export interface OrchestrationAbort {
  /** MUST be '1.0.0' */
  version: '1.0.0';
  /** Correlation to the failed attempt (UUID) */
  attempt_id: string;
  /** MUST map to bounded Failure Taxonomy (E-05) */
  reason_code: string;
  /** Bounded metadata for the failure cause */
  metadata: Record<string, string | number | boolean>;
  /** The authority that triggered the abort */
  stop_authority: 'CONTROL_PLANE' | 'OPERATOR' | 'ORCHESTRATOR';
}
