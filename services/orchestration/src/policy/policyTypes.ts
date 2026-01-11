import { OrchestrationContext } from '../contracts/context';
import { OrchestrationTrigger } from '../contracts/trigger';

/**
 * Bounded outcomes for policy evaluation (MIG-06 §2.4).
 */
export type PolicyOutcome = 'ALLOW' | 'DENY';

/**
 * The deterministic result of a policy gate evaluation.
 */
export interface PolicyDecision {
  /** The final ALLOW/DENY decision */
  outcome: PolicyOutcome;
  /** Stable identifier for the decision record in Control Plane */
  decision_id: string;
}

/**
 * Minimal input required for policy evaluation (MIG-06 §3 Step 3).
 * Restricts input to metadata and context only.
 */
export interface PolicyEvaluationRequest {
  /** The full orchestration context */
  context: OrchestrationContext;
  /** Trigger metadata only (no full trigger to ensure metadata-only enforcement) */
  trigger: {
    classification: OrchestrationTrigger['classification'];
    version: OrchestrationTrigger['version'];
  };
}
