import { PolicyEvaluator } from '../../policy/policyEvaluator';
import { PolicyDecision, PolicyEvaluationRequest } from '../../policy/policyTypes';

/**
 * PR-09: FakePolicyEvaluator (Deterministic, Fail-Closed)
 * 
 * Returns ALLOW or DENY based on the provided flag.
 */
export class FakePolicyEvaluator implements PolicyEvaluator {
  private nextOutcome: 'ALLOW' | 'DENY' = 'ALLOW';

  public setNextOutcome(outcome: 'ALLOW' | 'DENY'): void {
    this.nextOutcome = outcome;
  }

  public evaluate(request: PolicyEvaluationRequest): PolicyDecision {
    return {
      outcome: this.nextOutcome,
      decision_id: `decision-${request.context.attempt_id}`
    };
  }
}
