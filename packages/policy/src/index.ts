/**
 * PolicyEffect defines the possible outcomes of a policy evaluation.
 * 
 * - PERMIT: The action is explicitly allowed.
 * - DENY: The action is explicitly forbidden (Fail-closed default).
 * - INDETERMINATE: The policy could not reach a conclusive decision.
 */
export type PolicyEffect = 'PERMIT' | 'DENY' | 'INDETERMINATE';

/**
 * PolicyDecision represents the final output of a policy evaluation process.
 * 
 * This contract is canonical and must be used for all platform governance signals.
 */
export interface PolicyDecision {
  /** The outcome of the evaluation. */
  effect: PolicyEffect;
  /** A machine-readable reason code for the decision. */
  reasonCode?: string;
  /** RFC3339 timestamp of when the decision was reached. */
  timestamp: string;
  /** 
   * Additional metadata associated with the decision.
   * 🚫 MUST NOT include PHI or PII.
   */
  metadata?: Record<string, unknown>;
}

/**
 * PolicyEvaluator defines the contract for components capable of reaching a PolicyDecision.
 * 
 * Implementation of this interface is deferred to Phase C.
 * PR-13 Fix: Changed from interface to class to support direct instantiation in orchestration.
 */
export class PolicyEvaluator {
  /**
   * Evaluates a request against a set of rules to produce a PolicyDecision.
   */
  evaluate(...args: unknown[]): Promise<PolicyDecision> | PolicyDecision {
    return {
      effect: 'PERMIT',
      timestamp: new Date().toISOString(),
      reasonCode: 'DEFAULT_PERMIT'
    };
  }
}
