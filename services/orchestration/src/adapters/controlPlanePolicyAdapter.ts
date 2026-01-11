import { 
  PolicyDecision as OrchPolicyDecision, 
  PolicyEvaluationRequest 
} from '../policy/policyTypes';
import { PolicyEvaluator } from '../policy/policyEvaluator';
import { 
  IPolicyEvaluator, 
  PolicyRequest 
} from '@starter/control-plane';
import { PolicyDecision as CPPolicyDecision } from '@starter/policy';

/**
 * PR-10: Real Adapter Wiring (Control Plane Policy).
 * 
 * Bridges the orchestration-side PolicyEvaluator interface with the 
 * authoritative ControlPlanePolicyEvaluator implementation.
 * 
 * Constraints:
 * - MUST be synchronous.
 * - MUST fail-closed (POL-001) on any error.
 * - Metadata-only (no PHI/PII).
 */
export class ControlPlanePolicyAdapter implements PolicyEvaluator {
  constructor(
    private readonly evaluator: IPolicyEvaluator,
    private readonly policyId: string
  ) {}

  /**
   * Evaluates policy by bridging to the Control Plane evaluator.
   * 
   * Implementation Note: Although the IPolicyEvaluator interface in 
   * @starter/control-plane returns a Promise, we treat the evaluation 
   * as synchronous here to satisfy the Orchestrator's sync mandate.
   * In production wiring, the injected evaluator must be a synchronous 
   * implementation or the promise must be resolved before use.
   */
  public evaluate(request: PolicyEvaluationRequest): OrchPolicyDecision {
    try {
      const cpRequest: PolicyRequest = {
        context: {
          tenantId: 'SYSTEM', // Metadata-only placeholder
          actorId: 'ORCHESTRATOR', // Metadata-only placeholder
          traceId: request.context.trace_id,
          timestamp: Date.now()
        },
        subject: 'ORCHESTRATOR',
        action: 'EXECUTE',
        resource: request.trigger.classification,
        attributes: {
          attempt_id: request.context.attempt_id,
          trigger_version: request.trigger.version,
          policy_id: this.policyId
        }
      };

      // Bridge async call to sync boundary.
      // We assume the evaluator provided can handle this or is a sync mock in tests.
      const result = (this.evaluator.evaluate(cpRequest) as unknown) as CPPolicyDecision;

      // Handle Promise if returned (though we aim for sync)
      if (result instanceof Promise) {
        // In a strictly synchronous flow, we cannot await.
        // If we get a promise, we must fail-closed as we cannot guarantee outcome.
        return {
          outcome: 'DENY',
          decision_id: 'ERR-ASYNC-POLICY'
        };
      }

      return this.mapDecision(result);
    } catch (error) {
      // Fail-closed: map any error to POL-001
      return {
        outcome: 'DENY',
        decision_id: `POL-001-${Date.now()}`
      };
    }
  }

  private mapDecision(decision: CPPolicyDecision): OrchPolicyDecision {
    return {
      outcome: decision.effect === 'PERMIT' ? 'ALLOW' : 'DENY',
      decision_id: decision.reasonCode || 'CP-DECISION'
    };
  }
}
