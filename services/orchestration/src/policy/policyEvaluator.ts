import { PolicyDecision, PolicyEvaluationRequest } from './policyTypes';

/**
 * Pure, injected dependency for policy evaluation (MIG-06 §4.4).
 * 
 * The evaluator is responsible for communicating with the Control Plane
 * to authorize or deny the orchestration attempt.
 */
export interface PolicyEvaluator {
  /**
   * Synchronously evaluates the orchestration request against current policy.
   * MUST be deterministic and fail-closed.
   */
  evaluate(request: PolicyEvaluationRequest): PolicyDecision;
}
