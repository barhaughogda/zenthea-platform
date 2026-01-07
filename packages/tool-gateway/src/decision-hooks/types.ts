import { RiskTier } from '../operator-dtos';

/**
 * Stable taxonomy for decision kinds.
 * Safe to expose in operator surfaces.
 */
export type DecisionKind = 
  | 'HUMAN_REVIEW' 
  | 'SECURITY_REVIEW' 
  | 'COMPLIANCE_REVIEW';

/**
 * Decision severity levels.
 */
export type DecisionSeverity = 'info' | 'warning' | 'critical';

/**
 * Decision requirement states.
 */
export type DecisionRequirement = 'none' | 'required';

/**
 * Decision Reason Codes (stable taxonomy).
 */
export type DecisionReasonCode = 
  | 'HIGH_RISK_REJECTION' 
  | 'POLICY_MISCONFIG_ERROR' 
  | 'ANOMALOUS_OUTCOME' 
  | 'MANUAL_ESCALATION_SIGNAL';

/**
 * Input for evaluating a decision hook.
 * Metadata only. NO PHI/PII.
 */
export interface DecisionHookInput {
  policyId: string;
  viewId?: string;
  action: 'POLICY_EXECUTE' | 'VIEW_EXECUTE';
  outcome: 'ALLOWED' | 'REJECTED' | 'ERROR';
  riskTier: RiskTier;
  category: string;
  reasonCode?: string;
  count: number;
}

/**
 * Result of a decision hook evaluation.
 */
export interface DecisionHookResult {
  requirement: DecisionRequirement;
  decisionKind?: DecisionKind;
  severity?: DecisionSeverity;
  reasonCode?: DecisionReasonCode;
  message?: string;
}

/**
 * Interface for injectable decision hooks.
 */
export interface IDecisionHook {
  evaluate(input: DecisionHookInput): Promise<DecisionHookResult>;
}

/**
 * Default No-Op implementation.
 */
export class NoOpDecisionHook implements IDecisionHook {
  async evaluate(): Promise<DecisionHookResult> {
    return { requirement: 'none' };
  }
}
