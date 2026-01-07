import { 
  IDecisionHook, 
  DecisionHookInput, 
  DecisionHookResult 
} from '../decision-hooks/types';

/**
 * Deterministic escalation policy.
 * Maps metadata-only execution states to decision requirements.
 */
export class DefaultEscalationPolicy implements IDecisionHook {
  async evaluate(input: DecisionHookInput): Promise<DecisionHookResult> {
    // 1. High risk rejections or errors trigger security review
    if (input.riskTier === 'high' && (input.outcome === 'REJECTED' || input.outcome === 'ERROR')) {
      return {
        requirement: 'required',
        decisionKind: 'SECURITY_REVIEW',
        severity: 'critical',
        reasonCode: 'HIGH_RISK_REJECTION',
        message: 'High-risk policy execution was rejected and requires security review.',
      };
    }

    // 2. Policy misconfiguration errors trigger compliance review
    if ((input.outcome === 'ERROR' || input.outcome === 'REJECTED') && 
       (input.reasonCode === 'UNKNOWN_POLICY_ID' || input.reasonCode === 'UNSUPPORTED_TARGET')) {
      return {
        requirement: 'required',
        decisionKind: 'COMPLIANCE_REVIEW',
        severity: 'warning',
        reasonCode: 'POLICY_MISCONFIG_ERROR',
        message: 'Execution failed due to potential policy misconfiguration.',
      };
    }

    // 3. Everything else defaults to no decision required
    return {
      requirement: 'none',
    };
  }
}
