import { type PolicyDecision } from '@starter/policy';
export type { PolicyDecision };
import { RequestContext } from './types';

export interface PolicyRequest {
  readonly context: RequestContext;
  readonly subject: string;
  readonly action: string;
  readonly resource: string;
  readonly attributes?: Record<string, unknown>;
}

/**
 * Adapter interface for policy evaluation within the control plane.
 * Semantic authority resides in packages/policy.
 * Implementations must fail-closed.
 */
export interface IPolicyEvaluator {
  evaluate(request: PolicyRequest): Promise<PolicyDecision>;
}
